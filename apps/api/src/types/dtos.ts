/**
 * Data Transfer Objects (DTOs) and Mappers
 * Ensures internal database models and sensitive fields (e.g. passwordHash)
 * are NEVER exposed directly to API consumers.
 */

// ==========================================
// 1. AUTH & USER DTOs
// ==========================================

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

export interface RoleDto {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
}

export interface PermissionDto {
  id: string;
  name: string;
  description?: string | null;
  module: string;
}

// ==========================================
// 2. ACTORS DTOs (STUDENT, TEACHER, PARENT)
// ==========================================

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

// ==========================================
// 3. ACADEMIC STRUCTURE DTOs
// ==========================================

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

export interface TeacherAssignmentDto {
  id: string;
  teacherId: string;
  teacherName?: string;
  sectionId: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  academicYear: string;
  isClassTeacher: boolean;
}

export interface StudentEnrollmentDto {
  id: string;
  studentId: string;
  studentName?: string;
  sectionId: string;
  sectionName?: string;
  className?: string;
  academicYear: string;
  rollNumber?: string | null;
  status: string;
  enrolledAt: string;
}

// ==========================================
// 4. ATTENDANCE & TIMETABLE DTOs
// ==========================================

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

// ==========================================
// 5. EXAM, RESULT & HOMEWORK DTOs
// ==========================================

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

export interface ExamSubjectDto {
  id: string;
  examId: string;
  examName?: string;
  subjectId: string;
  subjectName: string;
  sectionId: string;
  sectionName?: string;
  examDate: string;
  maxMarks: number;
  passMarks: number;
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

export interface HomeworkSubmissionDto {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName?: string;
  submittedAt: string;
  status: string;
  content?: string | null;
  attachmentUrl?: string | null;
  marksObtained?: number | null;
  feedback?: string | null;
}

// ==========================================
// 6. ADMISSIONS & COMMUNICATION DTOs
// ==========================================

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

// ==========================================
// 7. MEDIA, GALLERY & DOCUMENTS DTOs
// ==========================================

export interface MediaDto {
  id: string;
  galleryId: string;
  title?: string | null;
  url: string;
  type: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface GalleryDto {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  mediaCount?: number;
  media?: MediaDto[];
  createdAt: string;
}

export interface DocumentDto {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category: string;
  isPublic: boolean;
  uploadedAt: string;
  uploadedBy?: string;
}

// ==========================================
// 8. FINANCE & AUDIT DTOs
// ==========================================

export interface FeeStructureDto {
  id: string;
  classId: string;
  className?: string;
  name: string;
  amount: number;
  frequency: string;
  academicYear: string;
  description?: string | null;
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
  payments?: PaymentDto[];
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

export interface AuditLogDto {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: string;
}

// ==========================================
// DTO MAPPER FUNCTIONS
// Convert Prisma models / entities to sanitized DTOs
// ==========================================

export const dtos = {
  toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role?.name ?? user.role ?? 'STUDENT',
      status: user.status ?? 'ACTIVE',
      emailVerified: user.emailVerified ?? false,
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
    };
  },

  toStudentResponseDto(student: any): StudentResponseDto {
    const user = student.user || {};
    const parent = student.parent;
    const parentUser = parent?.user || {};
    const enrollment = student.enrollments?.[0];

    return {
      id: student.id,
      userId: student.userId,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber ?? null,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      gender: student.gender,
      bloodGroup: student.bloodGroup ?? null,
      emergencyContact: student.emergencyContact,
      address: student.address ?? null,
      admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : '',
      status: student.status,
      parent: parent
        ? {
            id: parent.id,
            name: `${parentUser.firstName || ''} ${parentUser.lastName || ''}`.trim(),
            email: parentUser.email || '',
            phone: parentUser.phone || null,
            relationship: parent.relationship,
          }
        : null,
      currentEnrollment: enrollment
        ? {
            className: enrollment.section?.class?.name || '',
            sectionName: enrollment.section?.name || '',
            academicYear: enrollment.academicYear,
          }
        : null,
    };
  },

  toTeacherResponseDto(teacher: any): TeacherResponseDto {
    const user = teacher.user || {};
    return {
      id: teacher.id,
      userId: teacher.userId,
      employeeId: teacher.employeeId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      qualification: teacher.qualification,
      specialization: teacher.specialization ?? null,
      department: teacher.department,
      joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : '',
      status: teacher.status,
      assignedSections: teacher.assignments?.map((a: any) => ({
        sectionId: a.sectionId,
        sectionName: a.section?.name || '',
        className: a.section?.class?.name || '',
        subjectName: a.subject?.name || '',
        isClassTeacher: a.isClassTeacher,
      })),
    };
  },

  toParentResponseDto(parent: any): ParentResponseDto {
    const user = parent.user || {};
    return {
      id: parent.id,
      userId: parent.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      phone: user.phone ?? null,
      occupation: parent.occupation ?? null,
      relationship: parent.relationship,
      emergencyContact: parent.emergencyContact,
      address: parent.address ?? null,
      city: parent.city ?? null,
      state: parent.state ?? null,
      postalCode: parent.postalCode ?? null,
      children: parent.children || [],
    };
  },

  toClassDto(cls: any): ClassDto {
    return {
      id: cls.id,
      name: cls.name,
      gradeLevel: cls.gradeLevel,
      academicYear: cls.academicYear,
      description: cls.description ?? null,
      sectionsCount: cls._count?.sections ?? cls.sections?.length,
    };
  },

  toAttendanceDto(att: any): AttendanceDto {
    const studentUser = att.student?.user || {};
    return {
      id: att.id,
      studentId: att.studentId,
      studentName: studentUser.firstName ? `${studentUser.firstName} ${studentUser.lastName}`.trim() : undefined,
      rollNumber: att.student?.rollNumber ?? null,
      sectionId: att.sectionId,
      date: new Date(att.date).toISOString().split('T')[0],
      status: att.status,
      remarks: att.remarks ?? null,
      recordedBy: att.recordedBy ? `${att.recordedBy.firstName} ${att.recordedBy.lastName}`.trim() : undefined,
    };
  },

  toNoticeDto(notice: any): NoticeDto {
    return {
      id: notice.id,
      title: notice.title,
      content: notice.content,
      category: notice.category,
      targetRole: notice.targetRole ?? null,
      isPinned: notice.isPinned,
      publishedAt: new Date(notice.publishedAt).toISOString(),
      authorName: notice.author ? `${notice.author.firstName} ${notice.author.lastName}`.trim() : undefined,
    };
  },

  toInvoiceDto(inv: any): InvoiceDto {
    const studentUser = inv.student?.user || {};
    return {
      id: inv.id,
      studentId: inv.studentId,
      studentName: studentUser.firstName ? `${studentUser.firstName} ${studentUser.lastName}`.trim() : undefined,
      feeStructureId: inv.feeStructureId,
      feeStructureName: inv.feeStructure?.name,
      invoiceNumber: inv.invoiceNumber,
      amount: Number(inv.amount),
      paidAmount: Number(inv.paidAmount),
      balance: Number(inv.balance),
      status: inv.status,
      dueDate: new Date(inv.dueDate).toISOString().split('T')[0],
      notes: inv.notes ?? null,
      createdAt: new Date(inv.createdAt).toISOString(),
      payments: inv.payments?.map((p: any) => ({
        id: p.id,
        invoiceId: p.invoiceId,
        paymentNumber: p.paymentNumber,
        amount: Number(p.amount),
        paymentMethod: p.paymentMethod,
        transactionRef: p.transactionRef ?? null,
        status: p.status,
        paidAt: new Date(p.paidAt).toISOString(),
        notes: p.notes ?? null,
      })),
    };
  },
};
