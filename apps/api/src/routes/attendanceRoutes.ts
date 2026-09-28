import { Router } from 'express';
import {
  listAttendance,
  recordAttendanceBatch,
  getAttendanceStats,
} from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { MarkAttendanceBatchSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// View attendance history (all authenticated users, with role-based tenancy in controller)
router.get('/', asyncHandler(listAttendance));
router.get('/stats', asyncHandler(getAttendanceStats));

// Faculty and Admins can record registers
router.post('/batch', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(MarkAttendanceBatchSchema), asyncHandler(recordAttendanceBatch));

export default router;
