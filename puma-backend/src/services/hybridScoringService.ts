import type { Shoe, FootProfile, UserContext } from '../data/shoes';
import { scoreShoe, DEFAULT_WEIGHTS } from './scoringEngine';
import { buildFeatureVector } from './mlDatasetService';
import { predictSuccessProbability, MLPrediction } from './mlClassifierService';

// ─── Hybrid Scoring Config ────────────────────────────────────────────────────

export const HYBRID_WEIGHTS = {
  ruleEngine: 0.6,    // 60% from hand-crafted rule engine
  mlPredictor: 0.4,   // 40% from ML classifier
};

// Minimum ML probability below which we flag low confidence (but still recommend)
export const ML_LOW_CONFIDENCE_THRESHOLD = 0.35;

// ─── Hybrid Score Result ──────────────────────────────────────────────────────

export interface HybridScoredShoe {
  shoe: Shoe;
  rule_score: number;           // 0-100 from rule engine
  ml_probability: number;       // 0-1 from ML classifier
  ml_prediction: MLPrediction;  // full ML prediction (confidence, top_features, model_version)
  hybrid_score: number;         // 0-100 blended score
  score_breakdown: {
    rule_contribution: number;  // rule_score * 0.6
    ml_contribution: number;    // ml_probability * 100 * 0.4
  };
}

export interface HybridRecommendationResult {
  primary: HybridScoredShoe;
  alternate: HybridScoredShoe;
  all_scored: HybridScoredShoe[];
  swapped: boolean;             // true if ML caused primary/alternate to swap
  ml_model_version: string;
}

// ─── Hybrid Scoring Function ──────────────────────────────────────────────────

/**
 * Apply hybrid scoring to a list of shoes for a given foot profile and context.
 *
 * Formula: hybrid_score = (rule_score × 0.6) + (ml_probability × 100 × 0.4)
 *
 * After scoring:
 * - Sort by hybrid_score descending
 * - If rule engine primary would have been swapped by ML (hybrid scores differ > 5), mark swapped=true
 */
export function applyHybridScoring(
  shoes: Shoe[],
  footProfile: FootProfile,
  context: UserContext
): HybridRecommendationResult {
  // Step 1: Get rule scores for all shoes
  const ruleScored = shoes.map(shoe => ({
    shoe,
    rule_score: scoreShoe(shoe, footProfile, context, DEFAULT_WEIGHTS),
  }));

  // Sort by rule score to identify the "pure rule engine" primary (for swap detection)
  ruleScored.sort((a, b) => b.rule_score - a.rule_score);
  const rulePrimaryModel = ruleScored[0].shoe.model;

  // Step 2: Build base feature vector for this foot profile + context
  // (shoe-specific fields are overridden per shoe)
  const baseRow: Record<string, unknown> = {
    width: footProfile.width,
    arch: footProfile.arch,
    pronation: footProfile.pronation,
    use_case: context.useCase,
    priority_score: context.priorityScore,
    hours_per_day: context.hoursPerDay,
    primary_model: '', // overridden per shoe
    primary_score: 0,  // overridden per shoe
  };

  // Step 3: Apply hybrid scoring for each shoe
  const hybridScored: HybridScoredShoe[] = ruleScored.map(({ shoe, rule_score }) => {
    // Build feature vector with this shoe's model + rule score
    const rowForShoe = { ...baseRow, primary_model: shoe.model, primary_score: rule_score };
    const features = buildFeatureVector(rowForShoe);

    // Get ML prediction
    const ml_prediction = predictSuccessProbability(features, shoe.model);
    const ml_probability = ml_prediction.probability;

    // Hybrid formula
    const rule_contribution = rule_score * HYBRID_WEIGHTS.ruleEngine;
    const ml_contribution = ml_probability * 100 * HYBRID_WEIGHTS.mlPredictor;
    const hybrid_score = Math.round(rule_contribution + ml_contribution);

    return {
      shoe,
      rule_score,
      ml_probability,
      ml_prediction,
      hybrid_score,
      score_breakdown: { rule_contribution: Math.round(rule_contribution), ml_contribution: Math.round(ml_contribution) },
    };
  });

  // Step 4: Sort by hybrid score
  hybridScored.sort((a, b) => b.hybrid_score - a.hybrid_score);

  const primary = hybridScored[0];
  const alternate = hybridScored[1];

  // Step 5: Detect if ML caused a swap vs pure rule engine ordering
  const swapped = primary.shoe.model !== rulePrimaryModel;

  return {
    primary,
    alternate,
    all_scored: hybridScored,
    swapped,
    ml_model_version: primary.ml_prediction.model_version,
  };
}
