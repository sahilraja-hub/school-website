import { Request, Response } from 'express';
import { attendanceRepository } from '../repositories/attendanceRepository';
import { dtos } from '../types/dtos';

export const listAttendance = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, sectionId, studentId, date, status } = req.query as any;

  // Role constraint: Students and Parents can only access their own student records
  let targetStudentId = studentId;
  if (req.user?.role === 'STUDENT' && req.user.studentId) {
    targetStudentId = req.user.studentId;
  }

  const result = await attendanceRepository.listAttendance({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    sectionId,
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
  const recorded = await attendanceRepository.recordBatch({
    sectionId: sectionId || classId,
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
  const { sectionId, studentId, startDate, endDate } = req.query as any;
  const stats = await attendanceRepository.getStats({ sectionId, studentId, startDate, endDate });

  res.json({
    success: true,
    data: stats,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
