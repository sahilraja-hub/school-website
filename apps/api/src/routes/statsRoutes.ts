import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/dashboard', authenticate, asyncHandler(getDashboardStats));

export default router;
