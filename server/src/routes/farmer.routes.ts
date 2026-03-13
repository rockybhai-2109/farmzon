import { Router } from 'express';
import {
    getFarmerProfile,
    updateMyProfile,
    getAvailableCrops,
    createProduct,
    toggleFollow
} from '../controllers/farmer.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/crops', getAvailableCrops); // Get all available items from Mandi API
router.get('/:slug', getFarmerProfile);

// Protected routes (Specific Roles)
router.patch('/me', protect, updateMyProfile); // Can be Farmer or eventually Buyer updating their own profile
router.post('/products', protect, authorize(Role.FARMER), createProduct);
router.post('/follow', protect, authorize(Role.BUYER), toggleFollow);

export default router;
