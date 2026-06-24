-- 003_weekly_insights.sql
-- Weekly insight report snapshots.
-- Each row stores the full JSON output of one insight report generation run.
-- report_type values: 'model_success' | 'problem_models' | 'foot_type_clusters'

CREATE TABLE IF NOT EXISTS weekly_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,              -- ISO date of the week this report covers (Monday)
  report_type TEXT NOT NULL CHECK (report_type IN (
    'model_success',
    'problem_models',
    'foot_type_clusters'
  )),
  report_data JSONB NOT NULL,            -- full report JSON (ModelSuccessReport | ProblemModelsReport | FootTypeClusterReport)
  sessions_analyzed INTEGER,            -- snapshot of how many rows were in normalized_recommendations
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying by report type and week
CREATE INDEX IF NOT EXISTS idx_weekly_type ON weekly_insights(report_type);
CREATE INDEX IF NOT EXISTS idx_weekly_week ON weekly_insights(week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_type_week ON weekly_insights(report_type, week_start DESC);
