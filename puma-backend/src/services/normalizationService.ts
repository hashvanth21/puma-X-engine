import { supabase } from '../db/supabase';

export interface NormalizationResult {
  processed: number;
  skipped: number;
  errors: number;
}

/**
 * Derive the ml_success boolean label from feedback outcome fields.
 * Success = fit is perfect/slightly off (recoverable), use case is fine.
 * Failure = fit is too tight/loose (not recoverable) OR wrong use case.
 * null = no feedback recorded.
 */
function deriveMlSuccess(
  fitOutcome: string | null,
  useCaseOutcome: string | null
): boolean | null {
  if (!fitOutcome && !useCaseOutcome) return null;

  const fitFail = fitOutcome === 'too_tight' || fitOutcome === 'too_loose';
  const useCaseFail = useCaseOutcome === 'not_ideal';

  if (fitFail || useCaseFail) return false;

  // Slightly tight/loose counts as success (still wearable, good recommendation)
  const fitSuccess =
    fitOutcome === 'perfect_fit' ||
    fitOutcome === 'slightly_tight' ||
    fitOutcome === 'slightly_loose';

  return fitSuccess ? true : null;
}

/**
 * Run the normalization ETL job.
 *
 * Queries recommendations JOIN scan_profiles (by session_id) JOIN feedback (by recommendation_id).
 * Transforms each row into a flat normalized_recommendations record.
 * Uses upsert (ON CONFLICT session_id) so re-running is safe.
 *
 * Returns counts of processed, skipped (cannot normalize — missing profile), and error records.
 */
export async function runNormalizationJob(): Promise<NormalizationResult> {
  const result: NormalizationResult = { processed: 0, skipped: 0, errors: 0 };

  // Fetch all recommendations with their scoring data
  const { data: recommendations, error: recError } = await supabase
    .from('recommendations')
    .select(`
      id,
      session_id,
      use_case,
      activity,
      climate,
      priority_score,
      hours_per_day,
      primary_model,
      primary_score,
      alternate_model,
      selected_model,
      confidence_score
    `);

  if (recError) {
    console.error('[Normalization] Failed to fetch recommendations:', recError.message);
    result.errors++;
    return result;
  }

  if (!recommendations || recommendations.length === 0) {
    console.log('[Normalization] No recommendations to normalize.');
    return result;
  }

  // Fetch all scan profiles indexed by session_id
  const { data: profiles, error: profError } = await supabase
    .from('scan_profiles')
    .select('session_id, width, arch, pronation, foot_length');

  if (profError) {
    console.error('[Normalization] Failed to fetch scan profiles:', profError.message);
    result.errors++;
    return result;
  }

  const profileMap = new Map<string, { session_id: string; width: string; arch: string; pronation: string; foot_length: number | null }>();
  for (const p of (profiles ?? [])) {
    profileMap.set(p.session_id, p);
  }

  // Fetch all feedback indexed by recommendation_id
  const { data: feedbacks, error: fbError } = await supabase
    .from('feedback')
    .select('recommendation_id, fit_feedback, use_case_feedback, style_feedback');

  if (fbError) {
    console.error('[Normalization] Failed to fetch feedback:', fbError.message);
    result.errors++;
    return result;
  }

  const feedbackMap = new Map<string, { recommendation_id: string; fit_feedback: string | null; use_case_feedback: string | null; style_feedback: string | null }>();
  for (const f of (feedbacks ?? [])) {
    feedbackMap.set(f.recommendation_id, f);
  }

  // Build normalized rows
  const rows: Record<string, unknown>[] = [];

  for (const rec of recommendations) {
    const profile = profileMap.get(rec.session_id);
    if (!profile) {
      // Cannot normalize without foot profile — skip
      result.skipped++;
      continue;
    }

    const feedback = feedbackMap.get(rec.id) ?? null;
    const fitOutcome = feedback?.fit_feedback ?? null;
    const useCaseOutcome = feedback?.use_case_feedback ?? null;
    const styleOutcome = feedback?.style_feedback ?? null;

    rows.push({
      session_id: rec.session_id,
      width: profile.width,
      arch: profile.arch,
      pronation: profile.pronation,
      foot_length: profile.foot_length ?? null,
      use_case: rec.use_case,
      activity: rec.activity,
      climate: rec.climate,
      priority_score: rec.priority_score ?? null,
      hours_per_day: rec.hours_per_day ?? null,
      primary_model: rec.primary_model,
      primary_score: rec.primary_score,
      alternate_model: rec.alternate_model ?? null,
      selected_model: rec.selected_model ?? null,
      confidence_score: rec.confidence_score ?? null,
      fit_outcome: fitOutcome,
      use_case_outcome: useCaseOutcome,
      style_outcome: styleOutcome,
      ml_success: deriveMlSuccess(fitOutcome, useCaseOutcome),
      recommendation_id: rec.id,
      normalized_at: new Date().toISOString(),
    });
  }

  if (rows.length === 0) {
    console.log('[Normalization] No rows to upsert.');
    return result;
  }

  // Upsert into normalized_recommendations (idempotent on session_id)
  const { error: upsertError } = await supabase
    .from('normalized_recommendations')
    .upsert(rows, { onConflict: 'session_id' });

  if (upsertError) {
    console.error('[Normalization] Upsert failed:', upsertError.message);
    result.errors += rows.length;
  } else {
    result.processed += rows.length;
  }

  console.log(`[Normalization] Done: ${result.processed} processed, ${result.skipped} skipped, ${result.errors} errors`);
  return result;
}
