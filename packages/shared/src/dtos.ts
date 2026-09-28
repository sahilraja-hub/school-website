/**
 * API Data Transfer Objects (DTOs)
 * Standard contracts between frontend and backend.
 */

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentResponseDto {
  id: string;
  userId: string;
  admissionNumber: string;
  rollNumber?: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string | null;
  emergencyContact: string;
  address?: string | null;
  admissionDate: string;
  status: string;
  parent?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    relationship: string;
  } | null;
  currentEnrollment?: {
    className: string;
    sectionName: string;
    academicYear: string;
  } | null;
}

export interface TeacherResponseDto {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  qualification: string;
  specialization?: string | null;
  department: string;
  joiningDate: string;
  status: string;
  assignedSections?: Array<{
    sectionId: string;
    sectionName: string;
    className: string;
    subjectName: string;
    isClassTeacher: boolean;
  }>;
}

export interface ParentResponseDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  occupation?: string | null;
  relationship: string;
  emergencyContact: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  children?: Array<{
    id: string;
    admissionNumber: string;
    name: string;
    rollNumber?: string | null;
    status: string;
  }>;
}

export interface ClassDto {
  id: string;
  name: string;
  gradeLevel: string;
  academicYear: string;
  description?: string | null;
  sectionsCount?: number;
}

export interface SectionDto {
  id: string;
  name: string;
  classId: string;
  className?: string;
  roomNumber?: string | null;
  capacity: number;
  currentStudentCount?: number;
}

export interface SubjectDto {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  credits: number;
  isElective: boolean;
}

export interface AttendanceDto {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string | null;
  sectionId: string;
  date: string;
  status: string;
  remarks?: string | null;
  recordedBy?: string;
}

export interface TimetableDto {
  id: string;
  sectionId: string;
  sectionName?: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber?: string | null;
}

export interface ExamDto {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string | null;
  subjectsCount?: number;
}

export interface ResultDto {
  id: string;
  examSubjectId: string;
  subjectName?: string;
  studentId: string;
  studentName?: string;
  marksObtained: number;
  grade?: string | null;
  remarks?: string | null;
  isPassed: boolean;
  percentage?: number;
}

export interface HomeworkDto {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  teacherName?: string;
  assignedDate: string;
  dueDate: string;
  totalMarks?: number | null;
  attachmentUrl?: string | null;
  submissionsCount?: number;
}

export interface AdmissionDto {
  id: string;
  applicationNumber: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantFullName: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  gradeApplyingFor: string;
  academicYear: string;
  status: string;
  previousSchool?: string | null;
  notes?: string | null;
  submittedAt: string;
}

export interface NoticeDto {
  id: string;
  title: string;
  content: string;
  category: string;
  targetRole?: string | null;
  isPinned: boolean;
  publishedAt: string;
  authorName?: string;
}

export interface EventDto {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  bannerUrl?: string | null;
  organizerName?: string;
}

export interface InvoiceDto {
  id: string;
  studentId: string;
  studentName?: string;
  feeStructureId: string;
  feeStructureName?: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
  dueDate: string;
  notes?: string | null;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  paymentNumber: string;
  amount: number;
  paymentMethod: string;
  transactionRef?: string | null;
  status: string;
  paidAt: string;
  notes?: string | null;
}

export interface FeeStructureDto {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  amount: number;
  category: string;
  description?: string | null;
}

export interface AuditLogDto {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  status: string;
  timestamp: string;
}

export interface SettingDto {
  key: string;
  value: string;
  category: string;
  description?: string | null;
  isPublic: boolean;
  updatedAt: string;
}

export interface DocumentDto {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: string;
  uploadedAt: string;
}

export interface GalleryDto {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  academicYear: string;
  coverImage?: string;
  mediaCount?: number;
  createdAt: string;
}

export interface HomeworkSubmissionDto {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName?: string;
  content: string;
  attachmentUrl?: string | null;
  submittedAt: string;
  marksObtained?: number | null;
  remarks?: string | null;
  status: string;
}

