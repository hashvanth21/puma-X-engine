-- Phase 7: Data Moat Schema Migration
-- Run in Supabase SQL Editor

-- 1. scan_profiles
CREATE TABLE scan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  width TEXT NOT NULL CHECK (width IN ('narrow', 'standard', 'wide')),
  arch TEXT NOT NULL CHECK (arch IN ('low', 'medium', 'high')),
  pronation TEXT NOT NULL CHECK (pronation IN ('neutral', 'overpronation', 'supination')),
  foot_length NUMERIC,
  fit_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scan_profiles_session ON scan_profiles(session_id);

-- 2. recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  profile_id UUID REFERENCES scan_profiles(id),
  use_case TEXT NOT NULL,
  activity TEXT NOT NULL,
  climate TEXT NOT NULL,
  priority_score INTEGER,
  hours_per_day INTEGER,
  recommended_top3 JSONB NOT NULL,
  primary_model TEXT NOT NULL,
  primary_score INTEGER NOT NULL,
  alternate_model TEXT,
  alternate_score INTEGER,
  selected_model TEXT,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_recommendations_session ON recommendations(session_id);
CREATE INDEX idx_recommendations_primary ON recommendations(primary_model);

-- 3. interaction_events
CREATE TABLE interaction_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL,
  recommendation_id UUID REFERENCES recommendations(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_interactions_session ON interaction_events(session_id);
CREATE INDEX idx_interactions_type ON interaction_events(event_type);

-- 4. feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id),
  session_id UUID NOT NULL,
  fit_feedback TEXT CHECK (fit_feedback IN ('perfect_fit', 'slightly_tight', 'too_tight', 'slightly_loose', 'too_loose')),
  use_case_feedback TEXT CHECK (use_case_feedback IN ('good_for_purpose', 'not_ideal')),
  style_feedback TEXT CHECK (style_feedback IN ('liked_style', 'disliked_style')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_recommendation ON feedback(recommendation_id);

-- 5. shoe_metadata
CREATE TABLE shoe_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  attributes JSONB NOT NULL,
  tech_features TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
