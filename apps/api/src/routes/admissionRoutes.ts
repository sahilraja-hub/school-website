import { Router } from 'express';
import {
  submitApplication,
  trackApplication,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/admissionController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { AdmissionApplicationSchema, AdmissionStatusUpdateSchema } from '@school/shared';

const router = Router();

// Public routes
router.post('/apply', validate(AdmissionApplicationSchema), asyncHandler(submitApplication));
router.get('/track/:applicationNumber', asyncHandler(trackApplication));

// Admin-only routes
router.get('/', authenticate, authorizeRoles('ADMIN'), asyncHandler(getAllApplications));
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(AdmissionStatusUpdateSchema),
  asyncHandler(updateApplicationStatus)
);

export default router;
