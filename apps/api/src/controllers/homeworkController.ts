import { Request, Response } from 'express';
import { homeworkRepository } from '../repositories/homeworkRepository';
import { NotFoundError, AuthorizationError } from '../errors';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';
import { academicRepository } from '../repositories/academicRepository';

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

  let sanitized: any = { ...hw };

  // IDOR & Privacy Protection: Students must NOT see other students' submissions or marks
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    const mySubmissions = (hw.submissions || []).filter((s: any) => s.studentId === student?.id);
    sanitized.submissions = mySubmissions;
    sanitized.mySubmission = mySubmissions[0] || null;
  }

  // IDOR & Privacy Protection: Parents must NOT see unrelated students' submissions
  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const linkedIds = parent?.studentIds || [];
    sanitized.submissions = (hw.submissions || []).filter((s: any) => linkedIds.includes(s.studentId));
  }

  res.json({
    success: true,
    data: sanitized,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createHomework = async (req: Request, res: Response): Promise<void> => {
  let teacherId = req.user?.id;
  if (req.user?.role === 'TEACHER') {
    if (!req.user?.id) {
      throw new AuthorizationError('Authentication required');
    }
    const teacher = await schoolActorsRepository.getTeacherByUserId(req.user.id);
    if (teacher) {
      teacherId = teacher.id;
      // Verify teacher is assigned to section or subject
      const isAssigned = academicRepository.isTeacherAssignedToSection(teacher.id, req.body.sectionId);
      if (!isAssigned) {
        throw new AuthorizationError('You are not authorized to assign homework for this section');
      }
    }
  }

  const created = await homeworkRepository.createHomework({
    ...req.body,
    teacherId,
  });

  res.status(201).json({
    success: true,
    message: 'Homework assigned',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateHomework = async (req: Request, res: Response): Promise<void> => {
  const existing = await homeworkRepository.getHomeworkById(req.params.id);
  if (!existing) throw new NotFoundError('Homework not found');

  if (req.user?.role === 'TEACHER') {
    if (!req.user?.id) {
      throw new AuthorizationError('Authentication required');
    }
    const teacher = await schoolActorsRepository.getTeacherByUserId(req.user.id);
    if (!teacher) {
      throw new AuthorizationError('Teacher profile not found for current user');
    }
    const isOwner = existing.teacherId === teacher.id || existing.teacherId === req.user.id;
    const isAssigned = academicRepository.isTeacherAssignedToSection(teacher.id, existing.sectionId);
    if (!isOwner && !isAssigned) {
      throw new AuthorizationError('You are not authorized to modify homework for this section');
    }
  }

  const updated = await homeworkRepository.updateHomework(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Homework assignment updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteHomework = async (req: Request, res: Response): Promise<void> => {
  const existing = await homeworkRepository.getHomeworkById(req.params.id);
  if (!existing) throw new NotFoundError('Homework not found');

  if (req.user?.role === 'TEACHER') {
    if (!req.user?.id) {
      throw new AuthorizationError('Authentication required');
    }
    const teacher = await schoolActorsRepository.getTeacherByUserId(req.user.id);
    if (!teacher) {
      throw new AuthorizationError('Teacher profile not found for current user');
    }
    const isOwner = existing.teacherId === teacher.id || existing.teacherId === req.user.id;
    const isAssigned = academicRepository.isTeacherAssignedToSection(teacher.id, existing.sectionId);
    if (!isOwner && !isAssigned) {
      throw new AuthorizationError('You are not authorized to delete homework for this section');
    }
  }

  const deleted = await homeworkRepository.deleteHomework(req.params.id);
  if (!deleted) throw new NotFoundError('Homework not found');

  res.json({
    success: true,
    message: 'Homework assignment removed',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const submitHomework = async (req: Request, res: Response): Promise<void> => {
  let studentId = req.user?.studentId || req.body.studentId;

  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (!student) {
      throw new AuthorizationError('Student profile not found');
    }
    // Block student from submitting on behalf of another student (IDOR impersonation)
    if (req.body.studentId && req.body.studentId !== student.id) {
      throw new AuthorizationError('Forbidden: You cannot submit homework on behalf of another student');
    }
    studentId = student.id;
  }

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
