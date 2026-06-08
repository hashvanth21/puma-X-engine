import { Router, Request, Response } from 'express';
import { logFeedback } from '../services/eventService';
import type { FeedbackRecord } from '../types/events';

const router = Router();

// POST /api/feedback — submit structured recommendation feedback
router.post('/', async (req: Request, res: Response) => {
  const feedback = req.body as FeedbackRecord;

  if (!feedback.recommendation_id || !feedback.session_id) {
    res.status(400).json({ error: 'Missing recommendation_id or session_id' });
    return;
  }

  // At least one feedback field must be provided
  if (!feedback.fit_feedback && !feedback.use_case_feedback && !feedback.style_feedback) {
    res.status(400).json({ error: 'At least one feedback field must be provided' });
    return;
  }

  const id = await logFeedback(feedback);
  if (id) {
    res.json({ success: true, feedbackId: id });
  } else {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

export { router as feedbackRouter };
