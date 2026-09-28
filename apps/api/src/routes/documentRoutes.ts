import { Router } from 'express';
import {
  listDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateRequest } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateDocumentSchema } from '@school/shared';
import { fileMetadataSchema } from '../validators';

const router = Router();

// Public download and metadata
router.get('/', asyncHandler(listDocuments));
router.get('/:id', asyncHandler(getDocumentById));

// File metadata validation endpoint
router.post('/validate-file', authenticate, validateRequest({ file: fileMetadataSchema }), (req, res) => {
  const fileData = (req as any).file || (req.body && req.body.fileMetadata) || req.body;
  res.json({
    success: true,
    message: 'File metadata is valid and approved for upload',
    data: fileData,
  });
});

// Admin management
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateDocumentSchema), asyncHandler(createDocument));
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteDocument));

export default router;
