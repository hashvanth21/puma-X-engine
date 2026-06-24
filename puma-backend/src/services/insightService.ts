import { supabase } from '../db/supabase';

// ─── Report Type Definitions ──────────────────────────────────────────────────

export interface ModelSuccessEntry {
  model: string;
  total_recommendations: number;
  perfect_fit_count: number;
  success_count: number;       // perfect_fit + slightly_tight + slightly_loose
  failure_count: number;       // too_tight + too_loose + not_ideal use case
  no_feedback_count: number;
  success_rate: number;        // 0–1, rounded to 2 decimal places
}

export interface ModelSuccessReport {
  generated_at: string;
  total_sessions_analyzed: number;
  models: ModelSuccessEntry[];
}

export interface ProblemPatternEntry {
  model: string;
  foot_profile: string;        // e.g. "wide+high" (width+arch combination)
  failure_count: number;
  total_count: number;
  failure_rate: number;        // 0–1
  dominant_failure: string | null;  // most common failure type
}

export interface ProblemModelsReport {
  generated_at: string;
  high_risk_threshold: number; // failure_rate above this is flagged
  patterns: ProblemPatternEntry[];
}

export interface FootTypeClusterEntry {
  foot_profile: string;        // e.g. "narrow+low"
  width: string;
  arch: string;
  preferred_model: string;     // model most frequently recommended to this profile
  recommendation_count: number;
  selection_rate: number;      // how often this model was also selected (not just recommended)
}

export interface FootTypeClusterReport {
  generated_at: string;
  total_profiles_analyzed: number;
  clusters: FootTypeClusterEntry[];
}

// ─── Report A: Model Success Report ──────────────────────────────────────────

/**
 * Report A: Per-shoe perfect-fit rate and success/failure breakdown.
 *
 * Queries normalized_recommendations grouped by primary_model.
 * Returns models sorted by success_rate descending.
 */
export async function generateModelSuccessReport(): Promise<ModelSuccessReport> {
  const { data, error } = await supabase
    .from('normalized_recommendations')
    .select('primary_model, fit_outcome, use_case_outcome, ml_success');

  if (error) {
    console.error('[InsightService] ModelSuccess query failed:', error.message);
    return {
      generated_at: new Date().toISOString(),
      total_sessions_analyzed: 0,
      models: [],
    };
  }

  const rows = data ?? [];
  const modelMap = new Map<string, ModelSuccessEntry>();

  for (const row of rows) {
    const model = row.primary_model as string;
    if (!modelMap.has(model)) {
      modelMap.set(model, {
        model,
        total_recommendations: 0,
        perfect_fit_count: 0,
        success_count: 0,
        failure_count: 0,
        no_feedback_count: 0,
        success_rate: 0,
      });
    }

    const entry = modelMap.get(model)!;
    entry.total_recommendations++;

    if (!row.fit_outcome && !row.use_case_outcome) {
      entry.no_feedback_count++;
      continue;
    }

    if (row.fit_outcome === 'perfect_fit') entry.perfect_fit_count++;

    if (row.ml_success === true) {
      entry.success_count++;
    } else if (row.ml_success === false) {
      entry.failure_count++;
    } else {
      entry.no_feedback_count++;
    }
  }

  // Compute success_rate (excludes no-feedback rows from denominator)
  for (const entry of modelMap.values()) {
    const withFeedback = entry.success_count + entry.failure_count;
    entry.success_rate =
      withFeedback > 0
        ? Math.round((entry.success_count / withFeedback) * 100) / 100
        : 0;
  }

  const models = Array.from(modelMap.values()).sort(
    (a, b) => b.success_rate - a.success_rate
  );

  return {
    generated_at: new Date().toISOString(),
    total_sessions_analyzed: rows.length,
    models,
  };
}

// ─── Report B: Problem Models Report ─────────────────────────────────────────

/**
 * Report B: Failure patterns — which shoe + foot type combination fails most.
 *
 * Groups by (primary_model, width, arch). Computes failure_rate for each combo.
 * Only includes combos that have at least 1 failure or failure_rate >= highRiskThreshold.
 */
export async function generateProblemModelsReport(
  highRiskThreshold = 0.3
): Promise<ProblemModelsReport> {
  const { data, error } = await supabase
    .from('normalized_recommendations')
    .select('primary_model, width, arch, fit_outcome, use_case_outcome, ml_success');

  if (error) {
    console.error('[InsightService] ProblemModels query failed:', error.message);
    return {
      generated_at: new Date().toISOString(),
      high_risk_threshold: highRiskThreshold,
      patterns: [],
    };
  }

  const rows = data ?? [];

  // Group by model + foot profile (width+arch)
  const comboMap = new Map<
    string,
    {
      model: string;
      width: string;
      arch: string;
      failures: string[];
      total: number;
    }
  >();

  for (const row of rows) {
    if (!row.fit_outcome && !row.use_case_outcome) continue; // skip no-feedback rows
    const key = `${row.primary_model as string}|${row.width as string}|${row.arch as string}`;

    if (!comboMap.has(key)) {
      comboMap.set(key, {
        model: row.primary_model as string,
        width: row.width as string,
        arch: row.arch as string,
        failures: [],
        total: 0,
      });
    }

    const combo = comboMap.get(key)!;
    combo.total++;

    if (row.ml_success === false) {
      const reason =
        row.fit_outcome === 'too_tight' || row.fit_outcome === 'too_loose'
          ? (row.fit_outcome as string)
          : row.use_case_outcome === 'not_ideal'
          ? 'not_ideal_use_case'
          : 'unknown';
      combo.failures.push(reason);
    }
  }

  const patterns: ProblemPatternEntry[] = [];

  for (const combo of comboMap.values()) {
    const failure_count = combo.failures.length;
    const failure_rate =
      combo.total > 0
        ? Math.round((failure_count / combo.total) * 100) / 100
        : 0;

    if (failure_count === 0 && failure_rate < highRiskThreshold) continue;

    // Find dominant failure type
    const failureCounts = combo.failures.reduce<Record<string, number>>(
      (acc, f) => ({ ...acc, [f]: (acc[f] ?? 0) + 1 }),
      {}
    );
    const dominant_failure =
      Object.keys(failureCounts).length > 0
        ? Object.entries(failureCounts).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    patterns.push({
      model: combo.model,
      foot_profile: `${combo.width}+${combo.arch}`,
      failure_count,
      total_count: combo.total,
      failure_rate,
      dominant_failure,
    });
  }

  // Sort by failure_rate descending (worst problems first)
  patterns.sort((a, b) => b.failure_rate - a.failure_rate);

  return {
    generated_at: new Date().toISOString(),
    high_risk_threshold: highRiskThreshold,
    patterns,
  };
}

// ─── Report C: Foot-Type Cluster Report ──────────────────────────────────────

/**
 * Report C: Which foot type profiles prefer which shoe model.
 *
 * Groups by (width, arch). For each group, finds the most frequently
 * recommended primary_model and how often it was also selected by the user.
 */
export async function generateFootTypeClusterReport(): Promise<FootTypeClusterReport> {
  const { data, error } = await supabase
    .from('normalized_recommendations')
    .select('width, arch, primary_model, selected_model');

  if (error) {
    console.error('[InsightService] FootTypeCluster query failed:', error.message);
    return {
      generated_at: new Date().toISOString(),
      total_profiles_analyzed: 0,
      clusters: [],
    };
  }

  const rows = data ?? [];

  // Group by (width, arch) → count primary_model occurrences + selections
  const profileMap = new Map<
    string,
    {
      width: string;
      arch: string;
      modelCounts: Map<string, { recommended: number; selected: number }>;
    }
  >();

  for (const row of rows) {
    const key = `${row.width as string}|${row.arch as string}`;
    if (!profileMap.has(key)) {
      profileMap.set(key, {
        width: row.width as string,
        arch: row.arch as string,
        modelCounts: new Map(),
      });
    }
    const profile = profileMap.get(key)!;
    const model = row.primary_model as string;

    if (!profile.modelCounts.has(model)) {
      profile.modelCounts.set(model, { recommended: 0, selected: 0 });
    }
    const counts = profile.modelCounts.get(model)!;
    counts.recommended++;
    if (row.selected_model === model) counts.selected++;
  }

  const clusters: FootTypeClusterEntry[] = [];

  for (const profile of profileMap.values()) {
    // Find the most-recommended model for this foot profile
    let bestModel = '';
    let bestCount = 0;
    let bestSelected = 0;

    for (const [model, counts] of profile.modelCounts) {
      if (counts.recommended > bestCount) {
        bestModel = model;
        bestCount = counts.recommended;
        bestSelected = counts.selected;
      }
    }

    if (!bestModel) continue;

    clusters.push({
      foot_profile: `${profile.width}+${profile.arch}`,
      width: profile.width,
      arch: profile.arch,
      preferred_model: bestModel,
      recommendation_count: bestCount,
      selection_rate:
        bestCount > 0
          ? Math.round((bestSelected / bestCount) * 100) / 100
          : 0,
    });
  }

  // Sort by recommendation_count descending (most common profiles first)
  clusters.sort((a, b) => b.recommendation_count - a.recommendation_count);

  return {
    generated_at: new Date().toISOString(),
    total_profiles_analyzed: rows.length,
    clusters,
  };
}
