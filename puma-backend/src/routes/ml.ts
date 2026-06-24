import { Router, Request, Response } from 'express';
import { buildMLDataset, getFeatureSchema } from '../services/mlDatasetService';

const router = Router();

// GET /api/ml/dataset — fetch prepared ML dataset with feature vectors + labels
router.get('/dataset', async (_req: Request, res: Response) => {
  console.log('[ML Route] Building ML dataset...');
  const dataset = await buildMLDataset();
  res.json({ success: true, ...dataset });
});

// GET /api/ml/features — return the feature schema (column definitions)
router.get('/features', (_req: Request, res: Response) => {
  const schema = getFeatureSchema();
  res.json({
    success: true,
    feature_count: schema.length,
    features: schema,
    upgrade_path: 'Replace mlClassifierService.ts predict() with a Python XGBoost API call using these same feature vectors',
  });
});

export { router as mlRouter };
