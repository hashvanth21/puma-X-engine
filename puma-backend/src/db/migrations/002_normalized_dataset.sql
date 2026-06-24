-- 002_normalized_dataset.sql
-- Normalized recommendation dataset: one row per session linking all dimensions
-- This is the "ML-ready" table that Phase 9 will train on.

CREATE TABLE IF NOT EXISTS normalized_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,          -- one row per session, upsert-safe
  -- Foot profile dimensions
  width TEXT NOT NULL CHECK (width IN ('narrow', 'standard', 'wide')),
  arch TEXT NOT NULL CHECK (arch IN ('low', 'medium', 'high')),
  pronation TEXT NOT NULL CHECK (pronation IN ('neutral', 'overpronation', 'supination')),
  foot_length NUMERIC,
  -- Context dimensions
  use_case TEXT NOT NULL,
  activity TEXT NOT NULL,
  climate TEXT NOT NULL,
  priority_score INTEGER,
  hours_per_day INTEGER,
  -- Recommendation output
  primary_model TEXT NOT NULL,
  primary_score INTEGER NOT NULL,
  alternate_model TEXT,
  selected_model TEXT,                      -- what the user actually chose (may be null)
  confidence_score INTEGER,
  -- Outcome labels (from feedback table; null if no feedback yet)
  fit_outcome TEXT CHECK (fit_outcome IN ('perfect_fit', 'slightly_tight', 'too_tight', 'slightly_loose', 'too_loose')),
  use_case_outcome TEXT CHECK (use_case_outcome IN ('good_for_purpose', 'not_ideal')),
  style_outcome TEXT CHECK (style_outcome IN ('liked_style', 'disliked_style')),
  -- Derived success label for ML (Phase 9)
  -- success = true when fit_outcome IN ('perfect_fit','slightly_tight','slightly_loose')
  -- success = false when fit_outcome IN ('too_tight','too_loose') OR use_case_outcome = 'not_ideal'
  -- success = null when no feedback
  ml_success BOOLEAN,
  -- Metadata
  recommendation_id UUID,                   -- back-reference to recommendations table
  normalized_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Phase 9 ML dataset queries and Phase 8 insight reports
CREATE INDEX IF NOT EXISTS idx_norm_width ON normalized_recommendations(width);
CREATE INDEX IF NOT EXISTS idx_norm_arch ON normalized_recommendations(arch);
CREATE INDEX IF NOT EXISTS idx_norm_model ON normalized_recommendations(primary_model);
CREATE INDEX IF NOT EXISTS idx_norm_use_case ON normalized_recommendations(use_case);
CREATE INDEX IF NOT EXISTS idx_norm_ml_success ON normalized_recommendations(ml_success);
CREATE INDEX IF NOT EXISTS idx_norm_created ON normalized_recommendations(created_at);
