import { supabase } from '../db/supabase';
import { buildMLDataset } from './mlDatasetService';
import { FEATURE_WEIGHTS } from './mlClassifierService';
import { SHOES_CATALOG } from '../data/shoes';

// ─── Retraining Result ────────────────────────────────────────────────────────

export interface RetrainingResult {
  success: boolean;
  version_tag: string;
  training_rows: number;
  labeled_rows: number;
  unlabeled_rows: number;
  class_balance: { success: number; failure: number };
  per_shoe_success_rates: Record<string, number>;
  previous_version: string | null;
  error?: string;
}

// ─── Model Version Info ───────────────────────────────────────────────────────

export interface ModelVersionInfo {
  version_tag: string;
  model_type: string;
  trained_at: string;
  training_rows: number;
  labeled_rows: number;
  per_shoe_success_rates: Record<string, number>;
  feature_weights: Record<string, number>;
  is_active: boolean;
  notes: string | null;
}

// ─── Per-shoe success rate computation ───────────────────────────────────────

/**
 * Compute per-shoe empirical success rates from labeled rows.
 * For each shoe model, count how many labeled rows have ml_success=1 vs 0.
 * Returns a map of modelName -> success_rate (0-1).
 * Models with 0 labeled rows get a neutral rate of 0.5.
 */
async function computePerShoeSuccessRates(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('normalized_recommendations')
    .select('primary_model, ml_success')
    .not('ml_success', 'is', null); // only labeled rows

  if (error || !data) {
    console.error('[Retraining] Failed to fetch labeled rows:', error?.message);
    return {};
  }

  // Aggregate per model
  const modelStats: Record<string, { success: number; total: number }> = {};

  for (const row of data as Record<string, unknown>[]) {
    const model = row['primary_model'] as string;
    const success = row['ml_success'] as boolean;
    if (!model) continue;

    if (!modelStats[model]) {
      modelStats[model] = { success: 0, total: 0 };
    }
    modelStats[model].total++;
    if (success) modelStats[model].success++;
  }

  // Compute rates, defaulting to 0.5 for models with no data
  const rates: Record<string, number> = {};
  for (const shoe of SHOES_CATALOG) {
    const stats = modelStats[shoe.model];
    if (stats && stats.total > 0) {
      rates[shoe.model] = Math.round((stats.success / stats.total) * 100) / 100;
    } else {
      rates[shoe.model] = 0.5; // neutral prior for unseen models
    }
  }

  return rates;
}

// ─── Version Tag Generation ───────────────────────────────────────────────────

/**
 * Get the current active model version tag.
 * Returns null if no active version exists.
 */
async function getCurrentVersionTag(): Promise<string | null> {
  const { data } = await supabase
    .from('model_versions')
    .select('version_tag')
    .eq('is_active', true)
    .order('trained_at', { ascending: false })
    .limit(1);

  return (data && data.length > 0) ? (data[0]['version_tag'] as string) : null;
}

/**
 * Generate the next version tag by incrementing the suffix number.
 * 'feature-weight-v1' → 'feature-weight-v2'
 * If no current version, starts at 'feature-weight-v1'.
 */
function generateNextVersionTag(currentTag: string | null): string {
  if (!currentTag) return 'feature-weight-v1';

  const match = currentTag.match(/^(.+)-v(\d+)$/);
  if (match) {
    const prefix = match[1];
    const num = parseInt(match[2], 10);
    return `${prefix}-v${num + 1}`;
  }
  return `${currentTag}-v2`;
}

// ─── Main Retraining Pipeline ─────────────────────────────────────────────────

/**
 * Run the weekly retraining pipeline:
 * 1. Fetch dataset stats (labeled/unlabeled counts, class balance)
 * 2. Compute per-shoe empirical success rates from labeled feedback
 * 3. Deactivate the current model version
 * 4. Insert a new model_versions row with updated rates
 *
 * New outcomes are APPENDED to normalized_recommendations (not replaced).
 * This function only reads from normalized_recommendations; normalization
 * (weeklyPipelineService.runNormalizationJob) appends new rows.
 *
 * UPGRADE_PATH: When Python XGBoost is added, replace steps 2–4 with:
 *   const response = await fetch('http://ml-service/retrain', { method: 'POST', body: JSON.stringify(featureVectors) });
 *   const { model_version, weights } = await response.json();
 *   Then still write to model_versions table with the returned weights.
 */
export async function runRetrainingPipeline(): Promise<RetrainingResult> {
  console.log('[Retraining] Starting weekly retraining pipeline...');

  // Step 1: Fetch dataset stats
  const dataset = await buildMLDataset();
  const { total_rows, labeled_rows, unlabeled_rows, class_balance } = dataset;

  // Step 2: Compute per-shoe success rates
  const per_shoe_success_rates = await computePerShoeSuccessRates();

  // Step 3: Get current version to archive
  const currentVersionTag = await getCurrentVersionTag();
  const nextVersionTag = generateNextVersionTag(currentVersionTag);

  // Step 4: Deactivate all current active versions
  const { error: deactivateError } = await supabase
    .from('model_versions')
    .update({ is_active: false })
    .eq('is_active', true);

  if (deactivateError) {
    console.error('[Retraining] Failed to deactivate current versions:', deactivateError.message);
    return {
      success: false,
      version_tag: nextVersionTag,
      training_rows: total_rows,
      labeled_rows,
      unlabeled_rows,
      class_balance,
      per_shoe_success_rates,
      previous_version: currentVersionTag,
      error: `Deactivation failed: ${deactivateError.message}`,
    };
  }

  // Step 5: Insert new model version row
  const { error: insertError } = await supabase
    .from('model_versions')
    .insert({
      version_tag: nextVersionTag,
      model_type: 'feature-weight',
      training_rows: total_rows,
      labeled_rows,
      unlabeled_rows,
      class_balance,
      per_shoe_success_rates,
      feature_weights: FEATURE_WEIGHTS as unknown as Record<string, unknown>,
      is_active: true,
      notes: `Weekly retrain — ${labeled_rows} labeled rows, ${Object.keys(per_shoe_success_rates).length} shoe models`,
    });

  if (insertError) {
    console.error('[Retraining] Failed to insert new model version:', insertError.message);
    return {
      success: false,
      version_tag: nextVersionTag,
      training_rows: total_rows,
      labeled_rows,
      unlabeled_rows,
      class_balance,
      per_shoe_success_rates,
      previous_version: currentVersionTag,
      error: `Insert failed: ${insertError.message}`,
    };
  }

  console.log(`[Retraining] Retraining complete. New version: ${nextVersionTag} (was: ${currentVersionTag ?? 'none'})`);

  return {
    success: true,
    version_tag: nextVersionTag,
    training_rows: total_rows,
    labeled_rows,
    unlabeled_rows,
    class_balance,
    per_shoe_success_rates,
    previous_version: currentVersionTag,
  };
}

// ─── Current Model Version Query ──────────────────────────────────────────────

/**
 * Fetch metadata about the currently active model version.
 * Returns null if no version has ever been trained.
 */
export async function getModelVersion(): Promise<ModelVersionInfo | null> {
  const { data, error } = await supabase
    .from('model_versions')
    .select('*')
    .eq('is_active', true)
    .order('trained_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('[Retraining] Failed to fetch model version:', error?.message);
    return null;
  }

  const row = data[0] as Record<string, unknown>;
  return {
    version_tag: row['version_tag'] as string,
    model_type: row['model_type'] as string,
    trained_at: row['trained_at'] as string,
    training_rows: row['training_rows'] as number,
    labeled_rows: row['labeled_rows'] as number,
    per_shoe_success_rates: row['per_shoe_success_rates'] as Record<string, number>,
    feature_weights: row['feature_weights'] as Record<string, number>,
    is_active: row['is_active'] as boolean,
    notes: row['notes'] as string | null,
  };
}

/**
 * Fetch all historical model versions in descending order (newest first).
 */
export async function getModelVersionHistory(limit = 10): Promise<ModelVersionInfo[]> {
  const { data, error } = await supabase
    .from('model_versions')
    .select('*')
    .order('trained_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('[Retraining] Failed to fetch version history:', error?.message);
    return [];
  }

  return (data as Record<string, unknown>[]).map(row => ({
    version_tag: row['version_tag'] as string,
    model_type: row['model_type'] as string,
    trained_at: row['trained_at'] as string,
    training_rows: row['training_rows'] as number,
    labeled_rows: row['labeled_rows'] as number,
    per_shoe_success_rates: row['per_shoe_success_rates'] as Record<string, number>,
    feature_weights: row['feature_weights'] as Record<string, number>,
    is_active: row['is_active'] as boolean,
    notes: row['notes'] as string | null,
  }));
}
