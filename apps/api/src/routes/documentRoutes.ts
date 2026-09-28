import { Router } from 'express';
import {
  listDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateDocumentSchema } from '@school/shared';

const router = Router();

// Public download and metadata
router.get('/', asyncHandler(listDocuments));
router.get('/:id', asyncHandler(getDocumentById));

// Admin management
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateDocumentSchema), asyncHandler(createDocument));
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteDocument));

export default router;
