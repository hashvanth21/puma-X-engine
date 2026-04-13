import { Router, Request, Response } from 'express';
import { SHOES_CATALOG } from '../data/shoes';

const router = Router();

// GET /api/shoes — return full catalog
router.get('/', (_req: Request, res: Response) => {
  res.json({ shoes: SHOES_CATALOG, count: SHOES_CATALOG.length });
});

// GET /api/shoes/:id — return single shoe or 404
router.get('/:id', (req: Request, res: Response) => {
  const shoe = SHOES_CATALOG.find((s) => s.id === req.params.id);
  if (!shoe) {
    res.status(404).json({ error: `Shoe not found: ${req.params.id}` });
    return;
  }
  res.json(shoe);
});

export { router as shoesRouter };
