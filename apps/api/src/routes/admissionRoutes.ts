import { Router } from 'express';
import {
  createDraft,
  updateDraft,
  submitApplication,
  trackApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  convertToStudentRecord,
  uploadDocument,
  getDocument,
  getApplicationAuditLogs,
} from '../controllers/admissionController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  AdmissionApplicationSchema,
  AdmissionDraftSchema,
  AdmissionStatusUpdateSchema,
  AdmissionAddNoteSchema,
  AdmissionConvertToStudentSchema,
  FileUploadSchema,
} from '@school/shared';

const router = Router();

// ========================================================
// 1. PUBLIC ADMISSION WORKFLOW ROUTES
// ========================================================

// Save and resume application draft
router.post('/draft', validate(AdmissionDraftSchema), asyncHandler(createDraft));
router.put('/draft/:applicationNumber', validate(AdmissionDraftSchema), asyncHandler(updateDraft));

// Submit full admission application
router.post('/', validate(AdmissionApplicationSchema), asyncHandler(submitApplication));
router.post('/apply', validate(AdmissionApplicationSchema), asyncHandler(submitApplication));

// Public application status tracking
router.get('/track/:applicationNumber', optionalAuthenticate, asyncHandler(trackApplication));

// Secure file upload endpoint with strict file type and size restrictions
router.post('/upload', validate(FileUploadSchema), asyncHandler(uploadDocument));

// Confidential document retrieval (protected by admin role or valid applicant tracking token)
router.get('/documents/:docId', optionalAuthenticate, asyncHandler(getDocument));

// ========================================================
// 2. ADMINISTRATIVE REVIEW & ENROLLMENT ROUTES (Admin only)
// ========================================================

// View applications with search and filters
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(getAllApplications)
);

// Review single application details
router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(getApplicationById)
);

// Update status (e.g., UNDER_REVIEW, APPROVED, REJECTED, CORRECTION_REQUESTED)
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  validate(AdmissionStatusUpdateSchema),
  asyncHandler(updateApplicationStatus)
);

// Add administrative review note
router.post(
  '/:id/notes',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  validate(AdmissionAddNoteSchema),
  asyncHandler(addApplicationNote)
);

// Convert approved application into official student & parent records
router.post(
  '/:id/convert-to-student',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  validate(AdmissionConvertToStudentSchema),
  asyncHandler(convertToStudentRecord)
);

// Audit logs for administrative actions on this application
router.get(
  '/:id/audit-logs',
  authenticate,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(getApplicationAuditLogs)
);

export default router;
