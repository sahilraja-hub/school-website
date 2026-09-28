import { Router } from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/systemController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { UpdateSettingsSchema } from '@school/shared';

const router = Router();

// Public / Authenticated read settings
router.get('/', asyncHandler(getSettings));

// Admin management
router.patch('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateSettingsSchema), asyncHandler(updateSettings));

export default router;
