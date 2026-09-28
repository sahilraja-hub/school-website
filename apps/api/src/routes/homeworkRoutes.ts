import { Router } from 'express';
import {
  listHomework,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework,
  submitHomework,
  gradeSubmission,
} from '../controllers/homeworkController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  CreateHomeworkSchema,
  UpdateHomeworkSchema,
  SubmitHomeworkSchema,
  GradeSubmissionSchema,
} from '@school/shared';

const router = Router();

router.use(authenticate);

// View coursework
router.get('/', asyncHandler(listHomework));
router.get('/:id', asyncHandler(getHomeworkById));

// Teachers and admins manage assignments
router.post('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(CreateHomeworkSchema), asyncHandler(createHomework));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(UpdateHomeworkSchema), asyncHandler(updateHomework));
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), asyncHandler(deleteHomework));

// Students submit homework
router.post('/:id/submit', authorize('STUDENT'), validate(SubmitHomeworkSchema), asyncHandler(submitHomework));

// Teachers grade submissions
router.patch('/submissions/:submissionId/grade', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(GradeSubmissionSchema), asyncHandler(gradeSubmission));

export default router;
