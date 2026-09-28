import { Router } from 'express';
import {
  markBatchAttendance,
  getClassAttendanceByDate,
  getStudentAttendanceSummary,
} from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { MarkAttendanceBatchSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Teachers and Admins can record and view class rosters
router.post(
  '/mark',
  authorizeRoles('TEACHER', 'ADMIN'),
  validate(MarkAttendanceBatchSchema),
  asyncHandler(markBatchAttendance)
);
router.get('/class', authorizeRoles('TEACHER', 'ADMIN'), asyncHandler(getClassAttendanceByDate));

// Students, Parents, Teachers, Admins can view individual attendance summaries
router.get('/student/:studentId?', asyncHandler(getStudentAttendanceSummary));

export default router;
