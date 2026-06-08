import { Router, Request, Response } from 'express';
import { logInteractionEvents } from '../services/eventService';
import type { InteractionEvent } from '../types/events';

const router = Router();

// POST /api/events — batch insert interaction events
router.post('/', async (req: Request, res: Response) => {
  const { events } = req.body as { events: InteractionEvent[] };

  if (!events || !Array.isArray(events) || events.length === 0) {
    res.status(400).json({ error: 'Missing or empty events array' });
    return;
  }

  // Validate each event has session_id and event_type
  const valid = events.every(e => e.session_id && e.event_type);
  if (!valid) {
    res.status(400).json({ error: 'Each event must have session_id and event_type' });
    return;
  }

  await logInteractionEvents(events);
  res.json({ success: true, count: events.length });
});

export { router as eventsRouter };
