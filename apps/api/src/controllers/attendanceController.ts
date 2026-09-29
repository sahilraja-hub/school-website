import { Request, Response } from 'express';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { dtos } from '../types/dtos';
import { AuthorizationError } from '../errors';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';
import { academicRepository } from '../repositories/academicRepository';

export const listAttendance = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, sectionId, studentId, date, status } = req.query as any;

  let targetStudentId = studentId;

  // IDOR & Tenancy Protection: Students can only view their own attendance
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (!student) {
      throw new AuthorizationError('Student profile not found');
    }
    // Block IDOR attempt if querying another student's record
    if (studentId && studentId !== student.id) {
      throw new AuthorizationError('Forbidden: You can only access your own attendance records');
    }
    targetStudentId = student.id;
  }

  const result = await attendanceRepository.listAttendance({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    sectionId: req.user?.role === 'STUDENT' ? undefined : sectionId,
    studentId: targetStudentId,
    date,
    status,
  });

  res.json({
    success: true,
    data: result.items.map((a) => dtos.toAttendanceDto(a)),
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
};

export const recordAttendanceBatch = async (req: Request, res: Response): Promise<void> => {
  const { classId, sectionId, date, records } = req.body;
  const targetSectionOrClass = sectionId || classId;

  // Authorization check: If user is TEACHER, verify they are assigned to this section/class
  if (req.user?.role === 'TEACHER') {
    if (!req.user?.id) {
      throw new AuthorizationError('Authentication required');
    }
    const teacher = await schoolActorsRepository.getTeacherByUserId(req.user.id);
    if (!teacher) {
      throw new AuthorizationError('Teacher profile not found for current user');
    }
    const isAssigned = academicRepository.isTeacherAssignedToSection(teacher.id, targetSectionOrClass);
    if (!isAssigned) {
      throw new AuthorizationError('You are not authorized to record attendance for this class or section');
    }
  }

  const recorded = await attendanceRepository.recordBatch({
    sectionId: targetSectionOrClass,
    date,
    recordedById: req.user?.id,
    records,
  });

  res.status(201).json({
    success: true,
    message: `Recorded attendance for ${recorded.length} students`,
    data: recorded.map((a) => dtos.toAttendanceDto(a)),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getAttendanceStats = async (req: Request, res: Response): Promise<void> => {
  let { sectionId, studentId, startDate, endDate } = req.query as any;

  // IDOR Protection: Students can only view their own statistics
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (!student) {
      throw new AuthorizationError('Student profile not found');
    }
    if (studentId && studentId !== student.id) {
      throw new AuthorizationError('Forbidden: You can only access your own attendance statistics');
    }
    studentId = student.id;
    sectionId = undefined;
  }

  const stats = await attendanceRepository.getStats({ sectionId, studentId, startDate, endDate });

  res.json({
    success: true,
    data: stats,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
