import { Router } from 'express';
import { getPriceInsights, getPriceHistory } from '../controllers/price.controller';

const router = Router();

router.get('/insights', getPriceInsights);
router.get('/history', getPriceHistory);

export default router;
