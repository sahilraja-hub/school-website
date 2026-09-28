export {
  LoginSchema,
  RegisterSchema,
  ChangePasswordSchema,
  AdmissionApplicationSchema,
  AdmissionStatusUpdateSchema,
  MarkAttendanceBatchSchema,
  MarkAttendanceItemSchema,
  CreateAssignmentSchema,
  SubmitGradeSchema,
  CreateAnnouncementSchema,
  ContactInquirySchema,
} from '@school/shared';

import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const IdParamSchema = z.object({
  id: z.string().min(1, 'ID parameter is required'),
});
