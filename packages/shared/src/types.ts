export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export const USER_ROLES: { [K in UserRole]: K } = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
};

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'LOCKED';

export const ACCOUNT_STATUSES: { [K in AccountStatus]: K } = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
  LOCKED: 'LOCKED',
};

export type AdmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'CORRECTION_REQUESTED'
  | 'APPROVED'
  | 'ACCEPTED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'ENROLLED';

export type AdmissionDocumentType =
  | 'BIRTH_CERTIFICATE'
  | 'PREVIOUS_REPORT_CARD'
  | 'TRANSFER_CERTIFICATE'
  | 'STUDENT_PHOTO'
  | 'ID_PROOF'
  | 'OTHER';

export interface AdmissionDocument {
  id: string;
  documentType: AdmissionDocumentType | string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileUrl: string;
  uploadedAt: string;
  verified?: boolean;
}

export interface AdmissionReviewNote {
  id: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
  action?: string;
}

export interface AdmissionCorrectionRequest {
  reason: string;
  fieldsToCorrect: string[];
  requestedAt: string;
  resolvedAt?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type GradeLevel = 
  | 'KINDERGARTEN' 
  | 'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'GRADE_4' | 'GRADE_5'
  | 'GRADE_6' | 'GRADE_7' | 'GRADE_8'
  | 'GRADE_9' | 'GRADE_10' | 'GRADE_11' | 'GRADE_12';

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  studentId?: string;
  gradeLevel?: GradeLevel;
  phone?: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUserResponse {
  user: UserSummary;
  accessToken: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  gradeApplyingFor: GradeLevel;
  academicYear?: string;
  streamOrTrack?: string;
  parentName: string;
  parentRelationship?: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation?: string;
  emergencyContact?: string;
  alternatePhone?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  previousSchool?: string;
  previousGrade?: string;
  previousGpa?: string;
  transferCertificateNumber?: string;
  status: AdmissionStatus;
  documents?: AdmissionDocument[];
  notes?: string;
  reviewNotes?: AdmissionReviewNote[];
  correctionRequest?: AdmissionCorrectionRequest;
  enrolledStudentId?: string;
  enrolledAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  code: string;
  gradeLevel: GradeLevel;
  teacherId: string;
  teacherName?: string;
  roomNumber: string;
  academicYear: string;
  studentCount?: number;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName?: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className?: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  weight?: number;
}

export interface GradeEntry {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  pointsEarned: number;
  maxPoints: number;
  letterGrade?: string;
  feedback?: string;
  submittedAt?: string;
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Notice {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  publishDate: string;
  publishedAt?: string;
  expiryDate?: string;
  expiresAt?: string;
  attachment?: string;
  status: ContentStatus;
  isPinned?: boolean;
  targetRole?: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  startDate?: string;
  endDate?: string;
  location: string;
  image?: string;
  bannerUrl?: string;
  status: ContentStatus;
  isPublic?: boolean;
  organizerId?: string;
  organizerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'ACADEMIC' | 'SPORTS' | 'EVENT' | 'URGENT' | 'GENERAL';
  isPinned: boolean;
  authorId: string;
  authorName: string;
  targetRoles: UserRole[];
  publishDate: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
