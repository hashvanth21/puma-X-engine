import { Router, Request, Response } from 'express';
import { buildMLDataset, getFeatureSchema } from '../services/mlDatasetService';
import { runRetrainingPipeline, getModelVersion, getModelVersionHistory } from '../services/retrainingService';
import { generateConfidenceExplanation, generateArchExplanation } from '../services/explanationConfidenceService';

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

// POST /api/ml/retrain — trigger weekly retraining pipeline
// Reads labeled rows from normalized_recommendations, computes per-shoe success rates,
// and persists a new model_versions row. New outcomes are appended, not replaced.
router.post('/retrain', async (_req: Request, res: Response) => {
  console.log('[ML Route] Triggering retraining pipeline...');
  const result = await runRetrainingPipeline();
  const statusCode = result.success ? 200 : 500;
  res.status(statusCode).json({ ...result });
});

// GET /api/ml/model-version — current active model version metadata
router.get('/model-version', async (_req: Request, res: Response) => {
  const version = await getModelVersion();
  if (!version) {
    res.json({
      success: true,
      version: null,
      message: 'No trained model version found. Run POST /api/ml/retrain to create the first version.',
    });
    return;
  }
  res.json({ success: true, version });
});

// GET /api/ml/model-history — all historical model versions (newest first)
router.get('/model-history', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt((req.query['limit'] as string) ?? '10', 10), 50);
  const history = await getModelVersionHistory(limit);
  res.json({ success: true, count: history.length, versions: history });
});

// GET /api/ml/explain — generate "users like you" explanation for a recommendation
// Query params: width (narrow|standard|wide), arch (low|medium|high), use_case, model
router.get('/explain', async (req: Request, res: Response) => {
  const { width, arch, use_case, model } = req.query as Record<string, string>;

  if (!width || !use_case || !model) {
    res.status(400).json({ error: 'Missing required query params: width, use_case, model' });
    return;
  }

  const [explanation, archExplanation] = await Promise.all([
    generateConfidenceExplanation(width, arch ?? 'medium', use_case, model),
    generateArchExplanation(arch ?? 'medium', model),
  ]);

  res.json({
    success: true,
    model,
    profile: { width, arch: arch ?? 'medium', use_case },
    ...explanation,
    arch_explanation: archExplanation,
  });
});

export { router as mlRouter };
