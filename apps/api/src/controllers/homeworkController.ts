import { Request, Response } from 'express';
import { homeworkRepository } from '../repositories/homeworkRepository';
import { NotFoundError } from '../errors';

export const listHomework = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, sectionId, subjectId, search } = req.query as any;
  const result = await homeworkRepository.listHomework({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    sectionId,
    subjectId,
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

export const getHomeworkById = async (req: Request, res: Response): Promise<void> => {
  const hw = await homeworkRepository.getHomeworkById(req.params.id);
  if (!hw) throw new NotFoundError('Homework not found');

  res.json({
    success: true,
    data: hw,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createHomework = async (req: Request, res: Response): Promise<void> => {
  const created = await homeworkRepository.createHomework({
    ...req.body,
    teacherId: req.user?.id,
  });

  res.status(201).json({
    success: true,
    message: 'Homework assigned',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const submitHomework = async (req: Request, res: Response): Promise<void> => {
  const studentId = req.user?.studentId || req.body.studentId;
  const submission = await homeworkRepository.submitHomework({
    homeworkId: req.params.id,
    studentId,
    content: req.body.content,
    attachmentUrl: req.body.attachmentUrl,
  });

  res.status(201).json({
    success: true,
    message: 'Homework submitted successfully',
    data: submission,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const gradeSubmission = async (req: Request, res: Response): Promise<void> => {
  const graded = await homeworkRepository.gradeSubmission(req.params.submissionId, req.body);
  if (!graded) throw new NotFoundError('Submission not found');

  res.json({
    success: true,
    message: 'Submission graded',
    data: graded,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
