export * from '@school/shared';
export * from './fileValidators';
export * from './authValidators';

import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.string().trim().optional(),
});

export const IdParamSchema = z.object({
  id: z.string().trim().min(1, 'ID parameter is required'),
});

export const AttendanceFilterSchema = PaginationQuerySchema.extend({
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  studentId: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
});

export const GradeFilterSchema = PaginationQuerySchema.extend({
  studentId: z.string().optional(),
  assignmentId: z.string().optional(),
  examId: z.string().optional(),
  classId: z.string().optional(),
});
