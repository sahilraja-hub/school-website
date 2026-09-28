import { Request, Response } from 'express';
import { examRepository } from '../repositories/examRepository';
import { NotFoundError } from '../errors';

// ==========================================
// EXAMS
// ==========================================
export const listExams = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, academicYear, status, search } = req.query as any;
  const result = await examRepository.listExams({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    academicYear,
    status,
    search,
  });

  res.json({
    success: true,
    data: result.items,
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

export const getExamById = async (req: Request, res: Response): Promise<void> => {
  const exam = await examRepository.getExamById(req.params.id);
  if (!exam) throw new NotFoundError('Exam not found');

  res.json({
    success: true,
    data: exam,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  const created = await examRepository.createExam(req.body);
  res.status(201).json({
    success: true,
    message: 'Examination created',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateExam = async (req: Request, res: Response): Promise<void> => {
  const updated = await examRepository.updateExam(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Exam not found');

  res.json({
    success: true,
    message: 'Examination updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  const deleted = await examRepository.deleteExam(req.params.id);
  if (!deleted) throw new NotFoundError('Exam not found');

  res.json({
    success: true,
    message: 'Examination removed',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// RESULTS
// ==========================================
export const listResults = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, examSubjectId, studentId } = req.query as any;

  // Students can only query their own results
  let targetStudentId = studentId;
  if (req.user?.role === 'STUDENT' && req.user.studentId) {
    targetStudentId = req.user.studentId;
  }

  const result = await examRepository.listResults({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    examSubjectId,
    studentId: targetStudentId,
  });

  res.json({
    success: true,
    data: result.items,
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

export const recordResult = async (req: Request, res: Response): Promise<void> => {
  const result = await examRepository.recordResult(req.body);
  res.status(201).json({
    success: true,
    message: 'Exam grade recorded',
    data: result,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
