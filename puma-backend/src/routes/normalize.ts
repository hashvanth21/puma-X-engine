import { Router, Request, Response } from 'express';
import { runNormalizationJob } from '../services/normalizationService';

const router = Router();

// POST /api/normalize/run — trigger the ETL normalization job
router.post('/run', async (_req: Request, res: Response) => {
  console.log('[Normalize Route] Starting normalization job...');
  const result = await runNormalizationJob();
  res.json({
    success: result.errors === 0,
    ...result,
    message: `Normalized ${result.processed} records. ${result.skipped} skipped. ${result.errors} errors.`,
  });
});

export { router as normalizeRouter };
