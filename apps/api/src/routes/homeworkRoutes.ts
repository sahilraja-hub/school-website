import { Router } from 'express';
import {
  listHomework,
  getHomeworkById,
  createHomework,
  submitHomework,
  gradeSubmission,
} from '../controllers/homeworkController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  CreateHomeworkSchema,
  SubmitHomeworkSchema,
  GradeSubmissionSchema,
} from '@school/shared';

const router = Router();

router.use(authenticate);

// View coursework
router.get('/', asyncHandler(listHomework));
router.get('/:id', asyncHandler(getHomeworkById));

// Teachers create assignments
router.post('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(CreateHomeworkSchema), asyncHandler(createHomework));

// Students submit homework
router.post('/:id/submit', authorize('STUDENT'), validate(SubmitHomeworkSchema), asyncHandler(submitHomework));

// Teachers grade submissions
router.patch('/submissions/:submissionId/grade', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(GradeSubmissionSchema), asyncHandler(gradeSubmission));

export default router;
