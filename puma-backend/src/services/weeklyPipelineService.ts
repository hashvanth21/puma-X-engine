import { supabase } from '../db/supabase';
import { runNormalizationJob, NormalizationResult } from './normalizationService';
import {
  generateModelSuccessReport,
  generateProblemModelsReport,
  generateFootTypeClusterReport,
  ModelSuccessReport,
  ProblemModelsReport,
  FootTypeClusterReport,
} from './insightService';

export interface WeeklyPipelineResult {
  week_start: string;
  normalization: NormalizationResult;
  reports: {
    model_success: ModelSuccessReport;
    problem_models: ProblemModelsReport;
    foot_type_clusters: FootTypeClusterReport;
  };
  persisted: boolean;
  errors: string[];
}

/**
 * Get the ISO date string of the most recent Monday (week start).
 * Used as the week_start key for weekly_insights records.
 */
function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Run the full weekly pipeline:
 * 1. Normalize raw events into normalized_recommendations
 * 2. Generate all three insight reports
 * 3. Persist report snapshots to weekly_insights table
 *
 * Safe to run multiple times — each run inserts a new snapshot row.
 */
export async function runWeeklyPipeline(): Promise<WeeklyPipelineResult> {
  const week_start = getWeekStart();
  const errors: string[] = [];

  console.log(`[WeeklyPipeline] Starting pipeline for week: ${week_start}`);

  // Step 1: Normalize raw data
  const normalization = await runNormalizationJob();
  if (normalization.errors > 0) {
    errors.push(`Normalization had ${normalization.errors} error(s)`);
  }

  // Step 2: Generate all three insight reports in parallel
  const [modelSuccess, problemModels, footTypeClusters] = await Promise.all([
    generateModelSuccessReport(),
    generateProblemModelsReport(),
    generateFootTypeClusterReport(),
  ]);

  const reports = {
    model_success: modelSuccess,
    problem_models: problemModels,
    foot_type_clusters: footTypeClusters,
  };

  // Step 3: Persist all 3 reports to weekly_insights
  const insightRows = [
    {
      week_start,
      report_type: 'model_success' as const,
      report_data: modelSuccess as unknown as Record<string, unknown>,
      sessions_analyzed: modelSuccess.total_sessions_analyzed,
    },
    {
      week_start,
      report_type: 'problem_models' as const,
      report_data: problemModels as unknown as Record<string, unknown>,
      sessions_analyzed: normalization.processed,
    },
    {
      week_start,
      report_type: 'foot_type_clusters' as const,
      report_data: footTypeClusters as unknown as Record<string, unknown>,
      sessions_analyzed: footTypeClusters.total_profiles_analyzed,
    },
  ];

  const { error: persistError } = await supabase
    .from('weekly_insights')
    .insert(insightRows);

  let persisted = true;
  if (persistError) {
    console.error('[WeeklyPipeline] Failed to persist insights:', persistError.message);
    errors.push(`Persist failed: ${persistError.message}`);
    persisted = false;
  } else {
    console.log(`[WeeklyPipeline] Persisted 3 insight reports for week ${week_start}`);
  }

  return { week_start, normalization, reports, persisted, errors };
}

/**
 * Fetch the most recent insight report snapshot for each of the 3 report types.
 */
export async function getLatestInsights(): Promise<{
  model_success: ModelSuccessReport | null;
  problem_models: ProblemModelsReport | null;
  foot_type_clusters: FootTypeClusterReport | null;
  as_of: string | null;
}> {
  const { data, error } = await supabase
    .from('weekly_insights')
    .select('report_type, report_data, week_start, created_at')
    .order('created_at', { ascending: false })
    .limit(30); // enough to find the latest of each of the 3 types

  if (error) {
    console.error('[WeeklyPipeline] Failed to fetch insights:', error.message);
    return { model_success: null, problem_models: null, foot_type_clusters: null, as_of: null };
  }

  const rows = data ?? [];
  const latest: Record<string, { data: unknown; created_at: string }> = {};

  for (const row of rows) {
    if (!latest[row.report_type as string]) {
      latest[row.report_type as string] = {
        data: row.report_data,
        created_at: row.created_at as string,
      };
    }
  }

  const asOf =
    (latest['model_success']?.created_at) ??
    (latest['problem_models']?.created_at) ??
    (latest['foot_type_clusters']?.created_at) ??
    null;

  return {
    model_success: (latest['model_success']?.data as ModelSuccessReport) ?? null,
    problem_models: (latest['problem_models']?.data as ProblemModelsReport) ?? null,
    foot_type_clusters: (latest['foot_type_clusters']?.data as FootTypeClusterReport) ?? null,
    as_of: asOf,
  };
}

/**
 * Fetch historical snapshots for a specific report type.
 * Returns rows in descending order (newest first), limited to 12 weeks by default.
 */
export async function getInsightHistory(
  reportType: 'model_success' | 'problem_models' | 'foot_type_clusters',
  limit = 12
): Promise<Array<{ week_start: string; created_at: string; report_data: unknown }>> {
  const { data, error } = await supabase
    .from('weekly_insights')
    .select('week_start, created_at, report_data')
    .eq('report_type', reportType)
    .order('week_start', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[WeeklyPipeline] Failed to fetch insight history:', error.message);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    week_start: row['week_start'] as string,
    created_at: row['created_at'] as string,
    report_data: row['report_data'],
  }));
}
