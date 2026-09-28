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

export type AdmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';

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
  gradeApplyingFor: GradeLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool?: string;
  status: AdmissionStatus;
  notes?: string;
  submittedAt: string;
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
