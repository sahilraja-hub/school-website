import { Router } from 'express';
import {
  createAssignment,
  getAssignmentsByClass,
  submitGrade,
  getStudentGrades,
} from '../controllers/gradeController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateAssignmentSchema, SubmitGradeSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Assignments creation and grading (Teacher / Admin)
router.post(
  '/assignments',
  authorizeRoles('TEACHER', 'ADMIN'),
  validate(CreateAssignmentSchema),
  asyncHandler(createAssignment)
);
router.get('/assignments/class/:classId', asyncHandler(getAssignmentsByClass));
router.post(
  '/grades/submit',
  authorizeRoles('TEACHER', 'ADMIN'),
  validate(SubmitGradeSchema),
  asyncHandler(submitGrade)
);

// Grade reports (Student / Parent / Teacher / Admin)
router.get('/student/:studentId?', asyncHandler(getStudentGrades));

export default router;
