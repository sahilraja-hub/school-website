import { z } from 'zod';

export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']);

export const AccountStatusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'PENDING', 'LOCKED']);

export const GradeLevelSchema = z.enum([
  'KINDERGARTEN',
  'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5',
  'GRADE_6', 'GRADE_7', 'GRADE_8',
  'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12',
]);

export const AdmissionStatusSchema = z.enum([
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'INTERVIEW_SCHEDULED',
  'CORRECTION_REQUESTED',
  'APPROVED',
  'ACCEPTED',
  'WAITLISTED',
  'REJECTED',
  'ENROLLED',
]);

export const AttendanceStatusSchema = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

// Production-grade password policy
export const PasswordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one digit')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character');

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: PasswordSchema,
  role: UserRoleSchema.default('STUDENT'),
  status: AccountStatusSchema.default('ACTIVE'),
  phone: z.string().optional(),
  gradeLevel: GradeLevelSchema.optional(),
  studentId: z.string().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: PasswordSchema,
});

export const AdmissionDocumentSchema = z.object({
  id: z.string().optional(),
  documentType: z.string(),
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string(),
  fileSizeBytes: z.number().max(5 * 1024 * 1024, 'File size cannot exceed 5MB'),
  fileUrl: z.string().min(1, 'File URL or reference is required'),
  uploadedAt: z.string().optional(),
  verified: z.boolean().optional(),
});

export const AdmissionDraftSchema = z.object({
  applicationNumber: z.string().optional(),
  studentFirstName: z.string().trim().optional(),
  studentLastName: z.string().trim().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  gradeApplyingFor: GradeLevelSchema.optional(),
  academicYear: z.string().optional(),
  streamOrTrack: z.string().optional(),
  parentName: z.string().trim().optional(),
  parentRelationship: z.string().optional(),
  parentEmail: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  parentPhone: z.string().trim().optional(),
  parentOccupation: z.string().optional(),
  emergencyContact: z.string().optional(),
  alternatePhone: z.string().optional(),
  address: z.string().trim().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  previousSchool: z.string().trim().optional(),
  previousGrade: z.string().optional(),
  previousGpa: z.string().optional(),
  transferCertificateNumber: z.string().optional(),
  documents: z.array(AdmissionDocumentSchema).optional(),
  notes: z.string().trim().optional(),
});

export const AdmissionApplicationSchema = z.object({
  applicationNumber: z.string().optional(),
  studentFirstName: z.string().trim().min(2, 'Student first name is required'),
  studentLastName: z.string().trim().min(2, 'Student last name is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  gradeApplyingFor: GradeLevelSchema,
  academicYear: z.string().optional().default('2026-2027'),
  streamOrTrack: z.string().optional().default('General'),
  parentName: z.string().trim().min(2, 'Parent/Guardian full name is required'),
  parentRelationship: z.string().optional().default('Parent / Guardian'),
  parentEmail: z.string().trim().email('Valid parent email address is required'),
  parentPhone: z.string().trim().min(7, 'Valid contact number is required'),
  parentOccupation: z.string().optional(),
  emergencyContact: z.string().optional(),
  alternatePhone: z.string().optional(),
  address: z.string().trim().min(5, 'Residential address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  previousSchool: z.string().trim().optional(),
  previousGrade: z.string().optional(),
  previousGpa: z.string().optional(),
  transferCertificateNumber: z.string().optional(),
  documents: z.array(AdmissionDocumentSchema).optional(),
  notes: z.string().trim().optional(),
});

export const AdmissionStatusUpdateSchema = z.object({
  status: AdmissionStatusSchema,
  notes: z.string().optional(),
  correctionReason: z.string().optional(),
  fieldsToCorrect: z.array(z.string()).optional(),
});

export const AdmissionAddNoteSchema = z.object({
  note: z.string().trim().min(1, 'Note content cannot be empty'),
});

export const AdmissionConvertToStudentSchema = z.object({
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
  admissionNumber: z.string().optional(),
});

export const MarkAttendanceItemSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  status: AttendanceStatusSchema,
  notes: z.string().optional(),
});

export const MarkAttendanceBatchSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  sectionId: z.string().optional(),
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

// ==========================================
// REST API QUERY & CRUD SCHEMAS
// ==========================================

export const QueryFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.string().trim().optional(),
});

// Users
export const CreateUserSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: PasswordSchema,
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  phone: z.string().trim().optional(),
  role: UserRoleSchema,
  status: AccountStatusSchema.default('ACTIVE'),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().trim().min(2).optional(),
  lastName: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  avatarUrl: z.string().url().optional(),
  status: AccountStatusSchema.optional(),
  role: UserRoleSchema.optional(),
});

export const UpdateUserStatusSchema = z.object({
  status: AccountStatusSchema,
});

// Students
export const CreateStudentSchema = z.object({
  userId: z.string().min(1).optional(),
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  email: z.string().trim().email('Email is required'),
  password: PasswordSchema.optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  address: z.string().optional(),
  admissionNumber: z.string().min(3, 'Admission number is required'),
  rollNumber: z.string().optional(),
  parentId: z.string().min(1).optional(),
  classId: z.string().min(1).optional(),
  sectionId: z.string().min(1).optional(),
  status: AccountStatusSchema.default('ACTIVE'),
});

export const UpdateStudentSchema = z.object({
  rollNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  parentId: z.string().min(1).nullable().optional(),
  status: AccountStatusSchema.optional(),
});

// Parents
export const CreateParentSchema = z.object({
  userId: z.string().min(1).optional(),
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().optional(),
  occupation: z.string().optional(),
  relationship: z.string().min(2, 'Relationship is required'),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  studentIds: z.array(z.string().min(1)).optional(),
});

export const UpdateParentSchema = z.object({
  occupation: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

// Teachers
export const CreateTeacherSchema = z.object({
  userId: z.string().min(1).optional(),
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().optional(),
  employeeId: z.string().min(2, 'Employee ID is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  specialization: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  status: AccountStatusSchema.default('ACTIVE'),
});

export const UpdateTeacherSchema = z.object({
  qualification: z.string().min(2).optional(),
  specialization: z.string().optional(),
  department: z.string().min(2).optional(),
  status: AccountStatusSchema.optional(),
});

// Classes & Sections
export const CreateClassSchema = z.object({
  name: z.string().trim().min(2, 'Class name is required'),
  gradeLevel: GradeLevelSchema,
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Format must be YYYY-YYYY (e.g. 2026-2027)'),
  description: z.string().optional(),
});

export const UpdateClassSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().optional(),
});

export const CreateSectionSchema = z.object({
  name: z.string().trim().min(1, 'Section name is required'),
  classId: z.string().min(1, 'Class ID is required'),
  roomNumber: z.string().optional(),
  capacity: z.number().int().positive().default(35),
});

export const UpdateSectionSchema = z.object({
  name: z.string().trim().min(1).optional(),
  roomNumber: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

// Subjects
export const CreateSubjectSchema = z.object({
  name: z.string().trim().min(2, 'Subject name is required'),
  code: z.string().trim().min(2, 'Subject code is required'),
  description: z.string().optional(),
  credits: z.number().int().positive().default(3),
  isElective: z.boolean().default(false),
});

export const UpdateSubjectSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  credits: z.number().int().positive().optional(),
  isElective: z.boolean().optional(),
});

// Exams & Results
export const CreateExamSchema = z.object({
  name: z.string().trim().min(3, 'Exam name is required'),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
  term: z.string().min(2, 'Term is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
  description: z.string().optional(),
});

export const UpdateExamSchema = z.object({
  name: z.string().trim().min(3).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().optional(),
});

export const CreateResultSchema = z.object({
  examSubjectId: z.string().min(1),
  studentId: z.string().min(1),
  marksObtained: z.number().min(0).max(100),
  grade: z.string().optional(),
  remarks: z.string().optional(),
});

// Homework & Submissions
export const CreateHomeworkSchema = z.object({
  sectionId: z.string().min(1),
  subjectId: z.string().min(1),
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().trim().min(5, 'Description is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalMarks: z.number().positive().default(20),
  attachmentUrl: z.string().url().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const UpdateHomeworkSchema = CreateHomeworkSchema.partial();

export const SubmitHomeworkSchema = z.object({
  homeworkId: z.string().min(1).optional(),
  studentId: z.string().min(1).optional(),
  content: z.string().min(2, 'Submission content is required'),
  attachmentUrl: z.string().url().optional(),
});

export const GradeSubmissionSchema = z.object({
  marksObtained: z.number().min(0),
  feedback: z.string().optional(),
});

// Timetable
export const CreateTimetableSchema = z.object({
  sectionId: z.string().min(1),
  subjectId: z.string().min(1),
  teacherId: z.string().min(1),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm'),
  roomNumber: z.string().optional(),
});

export const UpdateTimetableSchema = z.object({
  subjectId: z.string().min(1).optional(),
  teacherId: z.string().min(1).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  roomNumber: z.string().optional(),
});

// Notices & Events
export const CreateNoticeSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  content: z.string().trim().min(5, 'Content is required'),
  category: z.enum(['ACADEMIC', 'SPORTS', 'EVENT', 'URGENT', 'GENERAL']).default('GENERAL'),
  targetRole: UserRoleSchema.optional(),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().optional(),
});

export const UpdateNoticeSchema = z.object({
  title: z.string().trim().min(3).optional(),
  content: z.string().trim().min(5).optional(),
  category: z.enum(['ACADEMIC', 'SPORTS', 'EVENT', 'URGENT', 'GENERAL']).optional(),
  targetRole: UserRoleSchema.optional(),
  isPinned: z.boolean().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().trim().min(3, 'Event title is required'),
  description: z.string().trim().min(5, 'Description is required'),
  location: z.string().trim().min(2, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isPublic: z.boolean().default(true),
  bannerUrl: z.string().url().optional(),
});

export const UpdateEventSchema = z.object({
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().min(5).optional(),
  location: z.string().trim().min(2).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isPublic: z.boolean().optional(),
  bannerUrl: z.string().url().optional(),
});

// Gallery & Media
export const CreateGallerySchema = z.object({
  title: z.string().trim().min(3, 'Gallery title is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z.string().optional(),
  coverImage: z.string().url().optional(),
});

export const AddMediaSchema = z.object({
  galleryId: z.string().min(1),
  title: z.string().optional(),
  url: z.string().url('Valid media URL is required'),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).default('IMAGE'),
  fileSize: z.number().int().positive().default(1024),
  mimeType: z.string().default('image/jpeg'),
});

// Documents
export const CreateDocumentSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  fileName: z.string().min(3, 'File name is required'),
  fileUrl: z.string().min(3, 'File URL is required'),
  mimeType: z.string().default('application/pdf'),
  fileSize: z.number().int().positive().default(1024),
  category: z.string().default('GENERAL'),
  isPublic: z.boolean().default(true),
});

// Fees & Payments
export const CreateFeeStructureSchema = z.object({
  classId: z.string().min(1),
  name: z.string().trim().min(3, 'Fee name is required'),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['ANNUAL', 'SEMESTER', 'TERM', 'MONTHLY', 'ONE_TIME']).default('SEMESTER'),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
  description: z.string().optional(),
});

export const CreateInvoiceSchema = z.object({
  studentId: z.string().min(1),
  feeStructureId: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export const RecordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['ONLINE', 'CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHEQUE']).default('ONLINE'),
  transactionRef: z.string().optional(),
  notes: z.string().optional(),
});

// Settings
export const UpdateSettingsSchema = z.object({
  schoolName: z.string().min(2).optional(),
  schoolEmail: z.string().email().optional(),
  schoolPhone: z.string().optional(),
  academicYear: z.string().optional(),
  currentTerm: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
});

// Audit Logs
export const AuditLogQuerySchema = QueryFilterSchema.extend({
  userId: z.string().min(1).optional(),
  entityType: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const FileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(type),
    'File type must be JPEG, PNG, WEBP, or PDF'
  ),
  fileSizeBytes: z.number().max(5 * 1024 * 1024, 'File size cannot exceed 5MB'),
  fileBase64: z.string().min(1, 'File payload is required'),
  documentType: z.string().optional().default('OTHER'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type AdmissionApplicationInput = z.infer<typeof AdmissionApplicationSchema>;
export type AdmissionDraftInput = z.infer<typeof AdmissionDraftSchema>;
export type AdmissionStatusUpdateInput = z.infer<typeof AdmissionStatusUpdateSchema>;
export type AdmissionAddNoteInput = z.infer<typeof AdmissionAddNoteSchema>;
export type AdmissionConvertToStudentInput = z.infer<typeof AdmissionConvertToStudentSchema>;
export type FileUploadInput = z.infer<typeof FileUploadSchema>;
export type MarkAttendanceBatchInput = z.infer<typeof MarkAttendanceBatchSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type SubmitGradeInput = z.infer<typeof SubmitGradeSchema>;
export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;
export type ContactInquiryInput = z.infer<typeof ContactInquirySchema>;
export type CreateHomeworkInput = z.infer<typeof CreateHomeworkSchema>;
export type UpdateHomeworkInput = z.infer<typeof UpdateHomeworkSchema>;
export type QueryFilterInput = z.infer<typeof QueryFilterSchema>;

