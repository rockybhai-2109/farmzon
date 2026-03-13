import { Router } from 'express';
import { requestOTP, verifyOTP, register, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.get('/me', protect, getMe);

export default router;
