import { Router, Request, Response } from 'express';
import {
  runWeeklyPipeline,
  getLatestInsights,
  getInsightHistory,
} from '../services/weeklyPipelineService';

const router = Router();

// GET /api/insights/latest — fetch most recent snapshot of all 3 report types
router.get('/latest', async (_req: Request, res: Response) => {
  const insights = await getLatestInsights();
  const hasData =
    insights.model_success !== null ||
    insights.problem_models !== null ||
    insights.foot_type_clusters !== null;

  if (!hasData) {
    res.status(404).json({
      error: 'No insight reports found. Run POST /api/insights/generate first.',
    });
    return;
  }

  res.json({ success: true, ...insights });
});

// POST /api/insights/generate — trigger the full weekly pipeline
router.post('/generate', async (_req: Request, res: Response) => {
  console.log('[Insights Route] Triggering weekly pipeline...');
  const result = await runWeeklyPipeline();
  res.json({
    success: result.persisted,
    week_start: result.week_start,
    normalization: result.normalization,
    report_summary: {
      model_success_models: result.reports.model_success.models.length,
      problem_patterns: result.reports.problem_models.patterns.length,
      foot_type_clusters: result.reports.foot_type_clusters.clusters.length,
    },
    errors: result.errors,
  });
});

// GET /api/insights/history?type=model_success — historical snapshots for a report type
router.get('/history', async (req: Request, res: Response) => {
  const type = req.query['type'] as string;

  const validTypes = ['model_success', 'problem_models', 'foot_type_clusters'];
  if (!type || !validTypes.includes(type)) {
    res.status(400).json({
      error: `Query param 'type' is required. Valid values: ${validTypes.join(', ')}`,
    });
    return;
  }

  const history = await getInsightHistory(
    type as 'model_success' | 'problem_models' | 'foot_type_clusters'
  );

  res.json({ success: true, report_type: type, count: history.length, history });
});

export { router as insightsRouter };
