import { Router } from 'express';
const router = Router();
router.post('/', (_req, res) => {
  res.json({ message: 'Recommendation engine — Phase 4' });
});
export { router as recommendRouter };
