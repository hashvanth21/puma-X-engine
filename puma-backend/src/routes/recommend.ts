import { Router, Request, Response } from 'express';
import { SHOES_CATALOG } from '../data/shoes';
import { generateRecommendation } from '../services/scoringEngine';
import { applyHybridScoring } from '../services/hybridScoringService';
import { logRecommendationEvent, logScanProfile, updateSelectedModel } from '../services/eventService';
import { generateConfidenceExplanation, generateArchExplanation } from '../services/explanationConfidenceService';
import type { RecommendRequest } from '../services/scoringEngine';

const router = Router();

// POST /api/recommend — accept foot profile + context, return hybrid recommendation
router.post('/', async (req: Request, res: Response) => {
  const { footProfile, context, session_id } = req.body as RecommendRequest & { session_id?: string };

  if (!footProfile || !context) {
    res.status(400).json({ error: 'Missing footProfile or context in request body' });
    return;
  }

  if (!footProfile.width || !footProfile.arch || !footProfile.pronation) {
    res.status(400).json({ error: 'footProfile must include width, arch, and pronation' });
    return;
  }

  if (!context.useCase || !context.activity || !context.climate || context.priorityScore === undefined) {
    res.status(400).json({ error: 'context must include useCase, activity, climate, and priorityScore' });
    return;
  }

  // ── Step 1: Hybrid scoring ──────────────────────────────────────────────────
  const hybridResult = applyHybridScoring(SHOES_CATALOG, footProfile, context);

  // ── Step 2: Generate explanation text (using rule engine explanation generator)
  // We pass the full catalog; generateRecommendation will rank by rule score.
  // We then override primary/alternate with hybrid winners.
  const baseRecommendation = generateRecommendation(footProfile, context, SHOES_CATALOG);

  // Override primary/alternate with hybrid winners (explanation reasons stay from base)
  const recommendation = {
    ...baseRecommendation,
    primary: hybridResult.primary.shoe,
    primaryMatchScore: hybridResult.primary.hybrid_score,
    alternate: hybridResult.alternate.shoe,
    alternateMatchScore: hybridResult.alternate.hybrid_score,
    // Expose eliminated shoes from hybrid ordering (positions 3-5)
    eliminatedShoes: hybridResult.all_scored.slice(2, 5).map(entry => ({
      shoe: entry.shoe,
      reason: baseRecommendation.eliminatedShoes.find(e => e.shoe.model === entry.shoe.model)?.reason
        ?? `${entry.shoe.model}: Lower hybrid match score (rule: ${entry.rule_score}, ml: ${Math.round(entry.ml_probability * 100)}%)`,
    })),
  };

  // ML confidence for the primary recommendation
  const ml_confidence = {
    probability: hybridResult.primary.ml_probability,
    confidence: hybridResult.primary.ml_prediction.confidence,
    top_features: hybridResult.primary.ml_prediction.top_features,
    model_version: hybridResult.ml_model_version,
    hybrid_weights: { rule_engine: '60%', ml_predictor: '40%' },
    score_breakdown: hybridResult.primary.score_breakdown,
    swapped_by_ml: hybridResult.swapped,
  };

  // ── Step 3: Fire-and-forget event logging ───────────────────────────────────
  let recommendationId: string | null = null;
  if (session_id) {
    const profileId = await logScanProfile({
      session_id,
      width: footProfile.width,
      arch: footProfile.arch,
      pronation: footProfile.pronation,
      foot_length: footProfile.estimatedSize,
      fit_preference: undefined,
    }).catch(() => null);

    const top3 = hybridResult.all_scored.slice(0, 3).map(e => ({
      model: e.shoe.model,
      score: e.hybrid_score,
    }));

    recommendationId = await logRecommendationEvent({
      session_id,
      profile_id: profileId ?? undefined,
      use_case: context.useCase,
      activity: context.activity,
      climate: context.climate,
      priority_score: context.priorityScore,
      hours_per_day: context.hoursPerDay,
      recommended_top3: top3,
      primary_model: hybridResult.primary.shoe.model,
      primary_score: hybridResult.primary.hybrid_score,
      alternate_model: hybridResult.alternate.shoe.model,
      alternate_score: hybridResult.alternate.hybrid_score,
      confidence_score: Math.round(hybridResult.primary.ml_probability * 100),
    }).catch(() => null);
  }

  // ── Step 4: Generate "users like you" explanation ──────────────────────────
  const [ml_explanation_base, ml_arch_explanation] = await Promise.all([
    generateConfidenceExplanation(
      footProfile.width,
      footProfile.arch,
      context.useCase,
      hybridResult.primary.shoe.model
    ),
    generateArchExplanation(footProfile.arch, hybridResult.primary.shoe.model),
  ]);

  const ml_explanation = {
    ...ml_explanation_base,
    arch_explanation: ml_arch_explanation,
  };

  res.json({ recommendation, recommendationId, ml_confidence, ml_explanation });
});

// PATCH /api/recommend/:id/select — record which shoe the user selected (unchanged)
router.patch('/:id/select', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { selected_model } = req.body as { selected_model: string };

  if (!selected_model) {
    res.status(400).json({ error: 'Missing selected_model' });
    return;
  }

  const success = await updateSelectedModel(id as string, selected_model);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to update selection' });
  }
});

export { router as recommendRouter };
