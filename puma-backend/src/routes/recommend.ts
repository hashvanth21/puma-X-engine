import { Router, Request, Response } from 'express';
import { SHOES_CATALOG } from '../data/shoes';
import { generateRecommendation } from '../services/scoringEngine';
import { logRecommendationEvent, logScanProfile, updateSelectedModel } from '../services/eventService';
import type { RecommendRequest } from '../services/scoringEngine';

const router = Router();

// POST /api/recommend — accept foot profile + context, return recommendation
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

  const recommendation = generateRecommendation(footProfile, context, SHOES_CATALOG);

  // Fire-and-forget: log scan profile and recommendation event
  let recommendationId: string | null = null;
  if (session_id) {
    const profileId = await logScanProfile({
      session_id,
      width: footProfile.width,
      arch: footProfile.arch,
      pronation: footProfile.pronation,
      foot_length: footProfile.size,
      fit_preference: footProfile.fitPreference,
    }).catch(() => null);

    // Build scored top-3 list
    const top3 = [
      { model: recommendation.primary.model, score: recommendation.primaryMatchScore },
      { model: recommendation.alternate.model, score: recommendation.alternateMatchScore },
      ...(recommendation.eliminatedShoes?.[0]
        ? [{ model: recommendation.eliminatedShoes[0].shoe.model, score: 0 }]
        : []),
    ];

    recommendationId = await logRecommendationEvent({
      session_id,
      profile_id: profileId ?? undefined,
      use_case: context.useCase,
      activity: context.activity,
      climate: context.climate,
      priority_score: context.priorityScore,
      hours_per_day: context.hoursPerDay,
      recommended_top3: top3,
      primary_model: recommendation.primary.model,
      primary_score: recommendation.primaryMatchScore,
      alternate_model: recommendation.alternate.model,
      alternate_score: recommendation.alternateMatchScore,
      confidence_score: recommendation.primaryMatchScore,
    }).catch(() => null);
  }

  res.json({ recommendation, recommendationId });
});

// PATCH /api/recommend/:id/select — record which shoe the user selected
router.patch('/:id/select', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { selected_model } = req.body as { selected_model: string };

  if (!selected_model) {
    res.status(400).json({ error: 'Missing selected_model' });
    return;
  }

  const success = await updateSelectedModel(id, selected_model);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to update selection' });
  }
});

export { router as recommendRouter };
