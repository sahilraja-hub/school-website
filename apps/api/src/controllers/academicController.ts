import { Request, Response } from 'express';
import { academicRepository } from '../repositories/academicRepository';
import { dtos } from '../types/dtos';
import { NotFoundError, BadRequestError, AuthorizationError } from '../errors';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';

// ==========================================
// CLASSES
// ==========================================
export const listClasses = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, academicYear, search } = req.query as any;
  const result = await academicRepository.listClasses({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    academicYear,
    search,
  });

  res.json({
    success: true,
    data: result.items.map((c) => dtos.toClassDto(c)),
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

export const getClassById = async (req: Request, res: Response): Promise<void> => {
  const cls = await academicRepository.getClassById(req.params.id);
  if (!cls) throw new NotFoundError('Class not found');

  res.json({
    success: true,
    data: dtos.toClassDto(cls),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  const created = await academicRepository.createClass(req.body);
  res.status(201).json({
    success: true,
    message: 'Class created successfully',
    data: dtos.toClassDto(created),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  const updated = await academicRepository.updateClass(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Class not found');

  res.json({
    success: true,
    message: 'Class updated',
    data: dtos.toClassDto(updated),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  const deleted = await academicRepository.deleteClass(req.params.id);
  if (!deleted) throw new NotFoundError('Class not found');

  res.json({
    success: true,
    message: 'Class deleted successfully',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// SECTIONS
// ==========================================
export const listSections = async (req: Request, res: Response): Promise<void> => {
  const { classId, search } = req.query as any;
  const sections = await academicRepository.listSections({ classId, search });

  res.json({
    success: true,
    data: sections,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getSectionById = async (req: Request, res: Response): Promise<void> => {
  const sec = await academicRepository.getSectionById(req.params.id);
  if (!sec) throw new NotFoundError('Section not found');

  res.json({
    success: true,
    data: sec,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createSection = async (req: Request, res: Response): Promise<void> => {
  const created = await academicRepository.createSection(req.body);
  res.status(201).json({
    success: true,
    message: 'Section created successfully',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
  const updated = await academicRepository.updateSection(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Section not found');

  res.json({
    success: true,
    message: 'Section updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  const deleted = await academicRepository.deleteSection(req.params.id);
  if (!deleted) throw new NotFoundError('Section not found');

  res.json({
    success: true,
    message: 'Section deleted successfully',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// SUBJECTS
// ==========================================
export const listSubjects = async (req: Request, res: Response): Promise<void> => {
  const { search, isElective } = req.query as any;
  const subjects = await academicRepository.listSubjects({
    search,
    isElective: isElective !== undefined ? isElective === 'true' : undefined,
  });

  res.json({
    success: true,
    data: subjects,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  const sub = await academicRepository.getSubjectById(req.params.id);
  if (!sub) throw new NotFoundError('Subject not found');

  res.json({
    success: true,
    data: sub,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  const created = await academicRepository.createSubject(req.body);
  res.status(201).json({
    success: true,
    message: 'Subject registered successfully',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  const updated = await academicRepository.updateSubject(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Subject not found');

  res.json({
    success: true,
    message: 'Subject updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  const deleted = await academicRepository.deleteSubject(req.params.id);
  if (!deleted) throw new NotFoundError('Subject not found');

  res.json({
    success: true,
    message: 'Subject deleted',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// TIMETABLE
// ==========================================
export const listTimetable = async (req: Request, res: Response): Promise<void> => {
  let { sectionId, teacherId, dayOfWeek } = req.query as any;

  // IDOR & Section Scope: Students can only view their own class/section timetable
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (student?.sectionId) {
      if (sectionId && sectionId !== student.sectionId) {
        throw new AuthorizationError('Forbidden: You can only access the timetable for your enrolled section');
      }
      sectionId = student.sectionId;
    }
  }

  // IDOR & Section Scope: Parents can only view timetable for their linked children's sections
  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const children = await Promise.all((parent?.studentIds || []).map((sId: string) => schoolActorsRepository.getStudentById(sId)));
    const allowedSections = children.map((c) => c?.sectionId).filter(Boolean);
    if (sectionId && !allowedSections.includes(sectionId)) {
      throw new AuthorizationError('Forbidden: You can only access timetable for your linked children enrolled sections');
    }
    if (!sectionId && allowedSections.length > 0) {
      sectionId = allowedSections[0];
    }
  }

  const schedule = await academicRepository.listTimetable({ sectionId, teacherId, dayOfWeek });

  res.json({
    success: true,
    data: schedule,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getTimetableById = async (req: Request, res: Response): Promise<void> => {
  const slot = await academicRepository.getTimetableById(req.params.id);
  if (!slot) throw new NotFoundError('Timetable slot not found');

  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (student?.sectionId && slot.sectionId !== student.sectionId) {
      throw new AuthorizationError('Forbidden: You can only access timetable slots for your enrolled section');
    }
  }

  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const children = await Promise.all((parent?.studentIds || []).map((sId: string) => schoolActorsRepository.getStudentById(sId)));
    const allowedSections = children.map((c) => c?.sectionId).filter(Boolean);
    if (!allowedSections.includes(slot.sectionId)) {
      throw new AuthorizationError('Forbidden: You can only access timetable slots for your linked children enrolled sections');
    }
  }

  res.json({
    success: true,
    data: slot,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await academicRepository.createTimetable(req.body);
    res.status(201).json({
      success: true,
      message: 'Timetable class slot scheduled',
      data: created,
      meta: { requestId: req.id, timestamp: new Date().toISOString() },
    });
  } catch (err) {
    throw new BadRequestError((err as Error).message);
  }
};

export const updateTimetable = async (req: Request, res: Response): Promise<void> => {
  const updated = await academicRepository.updateTimetable(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Timetable slot not found');

  res.json({
    success: true,
    message: 'Timetable slot updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteTimetable = async (req: Request, res: Response): Promise<void> => {
  const deleted = await academicRepository.deleteTimetable(req.params.id);
  if (!deleted) throw new NotFoundError('Timetable slot not found');

  res.json({
    success: true,
    message: 'Timetable slot deleted',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
