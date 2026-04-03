import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => {
  res.json({ message: 'Shoe catalog — Phase 4' });
});
export { router as shoesRouter };
