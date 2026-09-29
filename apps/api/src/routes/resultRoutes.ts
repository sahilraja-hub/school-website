import { Router } from 'express';
import {
  listResults,
  getResultById,
  recordResult,
} from '../controllers/examController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateResultSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// List results (students can only see their own)
router.get('/', asyncHandler(listResults));
router.get('/:id', asyncHandler(getResultById));

// Faculty and Admins can record exam results
router.post('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(CreateResultSchema), asyncHandler(recordResult));

export default router;
