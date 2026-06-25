-- Phase 10: Model Version Tracking Migration
-- Run in Supabase SQL Editor

-- Model Version Tracking
-- Each row represents one trained model snapshot.
-- Never delete rows — preserves full training history.

CREATE TABLE IF NOT EXISTS model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_tag TEXT NOT NULL,                  -- e.g. 'feature-weight-v1', 'feature-weight-v2'
  model_type TEXT NOT NULL DEFAULT 'feature-weight',  -- 'feature-weight' | 'xgboost'
  trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  training_rows INTEGER NOT NULL DEFAULT 0,   -- number of total rows in normalized_recommendations
  labeled_rows INTEGER NOT NULL DEFAULT 0,    -- rows with ml_success != null
  unlabeled_rows INTEGER NOT NULL DEFAULT 0,  -- rows without label
  class_balance JSONB NOT NULL DEFAULT '{}',  -- { "success": N, "failure": M }
  per_shoe_success_rates JSONB NOT NULL DEFAULT '{}', -- { "Velocity NITRO 3": 0.87, ... }
  feature_weights JSONB NOT NULL DEFAULT '{}',         -- weight config used for this version
  is_active BOOLEAN NOT NULL DEFAULT TRUE,    -- only one version is "active" at a time
  notes TEXT                                  -- optional human notes about this version
);

-- Only one version should be active at a time
-- We enforce this in application code (set is_active=false on all before inserting new)

CREATE INDEX IF NOT EXISTS idx_model_versions_trained_at ON model_versions (trained_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_versions_active ON model_versions (is_active) WHERE is_active = TRUE;
