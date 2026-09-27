import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']);

export const GradeLevelSchema = z.enum([
  'KINDERGARTEN',
  'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5',
  'GRADE_6', 'GRADE_7', 'GRADE_8',
  'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12',
]);

export const AdmissionStatusSchema = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'INTERVIEW_SCHEDULED',
  'ACCEPTED',
  'WAITLISTED',
  'REJECTED',
]);

export const AttendanceStatusSchema = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters with letters & numbers'),
  role: UserRoleSchema.default('STUDENT'),
  phone: z.string().optional(),
  gradeLevel: GradeLevelSchema.optional(),
  studentId: z.string().optional(),
});

export const AdmissionApplicationSchema = z.object({
  studentFirstName: z.string().trim().min(2, 'Student first name is required'),
  studentLastName: z.string().trim().min(2, 'Student last name is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gradeApplyingFor: GradeLevelSchema,
  parentName: z.string().trim().min(2, 'Parent/Guardian full name is required'),
  parentEmail: z.string().trim().email('Valid parent email address is required'),
  parentPhone: z.string().trim().min(7, 'Valid contact number is required'),
  address: z.string().trim().min(5, 'Residential address is required'),
  previousSchool: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const AdmissionStatusUpdateSchema = z.object({
  status: AdmissionStatusSchema,
  notes: z.string().optional(),
});

export const MarkAttendanceItemSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  status: AttendanceStatusSchema,
  notes: z.string().optional(),
});

export const MarkAttendanceBatchSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  records: z.array(MarkAttendanceItemSchema).min(1, 'At least one student record is required'),
});

export const CreateAssignmentSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  title: z.string().trim().min(3, 'Assignment title must be at least 3 characters'),
  description: z.string().trim().min(5, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxPoints: z.number().positive('Max points must be greater than 0').default(100),
  weight: z.number().min(0).max(100).optional(),
});

export const SubmitGradeSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  pointsEarned: z.number().min(0, 'Points earned cannot be negative'),
  feedback: z.string().optional(),
});

export const CreateAnnouncementSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  content: z.string().trim().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['ACADEMIC', 'SPORTS', 'EVENT', 'URGENT', 'GENERAL']).default('GENERAL'),
  isPinned: z.boolean().default(false),
  targetRoles: z.array(UserRoleSchema).min(1, 'Select at least one target audience role'),
});

export const ContactInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3, 'Subject is required'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type AdmissionApplicationInput = z.infer<typeof AdmissionApplicationSchema>;
export type AdmissionStatusUpdateInput = z.infer<typeof AdmissionStatusUpdateSchema>;
export type MarkAttendanceBatchInput = z.infer<typeof MarkAttendanceBatchSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type SubmitGradeInput = z.infer<typeof SubmitGradeSchema>;
export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;
export type ContactInquiryInput = z.infer<typeof ContactInquirySchema>;
