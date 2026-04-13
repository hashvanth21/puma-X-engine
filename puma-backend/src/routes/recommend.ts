import { Router, Request, Response } from 'express';
import { SHOES_CATALOG } from '../data/shoes';
import { generateRecommendation } from '../services/scoringEngine';
import type { RecommendRequest } from '../services/scoringEngine';

const router = Router();

// POST /api/recommend — accept foot profile + context, return recommendation
router.post('/', (req: Request, res: Response) => {
  const { footProfile, context } = req.body as RecommendRequest;

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
  res.json({ recommendation });
});

export { router as recommendRouter };
