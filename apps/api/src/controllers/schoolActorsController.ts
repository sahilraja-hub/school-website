import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';
import { userRepository } from '../repositories/userRepository';
import { dtos } from '../types/dtos';
import { NotFoundError, BadRequestError } from '../errors';

// ==========================================
// STUDENTS
// ==========================================
export const listStudents = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search, status, classId, sectionId } = req.query as any;
  const result = await schoolActorsRepository.listStudents({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    search,
    status,
    classId,
    sectionId,
  });

  res.json({
    success: true,
    data: result.items.map((s) => dtos.toStudentResponseDto(s)),
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

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const student = await schoolActorsRepository.getStudentById(req.params.id);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  // If user is STUDENT, check ownership
  if (req.user?.role === 'STUDENT' && student.userId !== req.user.id) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: You can only view your own student record',
      code: 'FORBIDDEN',
    });
    return;
  }

  res.json({
    success: true,
    data: dtos.toStudentResponseDto(student),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  let userId = req.body.userId;
  if (!userId) {
    const existing = await userRepository.findByEmail(req.body.email);
    if (existing) {
      throw new BadRequestError('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(req.body.password || 'Student@123456', 10);
    const user = await userRepository.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash,
      role: 'STUDENT',
      status: req.body.status || 'ACTIVE',
    });
    userId = user.id;
  }

  const student = await schoolActorsRepository.createStudent({
    userId,
    admissionNumber: req.body.admissionNumber,
    rollNumber: req.body.rollNumber,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    bloodGroup: req.body.bloodGroup,
    emergencyContact: req.body.emergencyContact,
    address: req.body.address,
    admissionDate: new Date().toISOString().split('T')[0],
    status: req.body.status || 'ACTIVE',
    parentId: req.body.parentId,
    classId: req.body.classId,
    sectionId: req.body.sectionId,
  });

  res.status(201).json({
    success: true,
    message: 'Student enrolled successfully',
    data: dtos.toStudentResponseDto(student),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const student = await schoolActorsRepository.updateStudent(req.params.id, req.body);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: dtos.toStudentResponseDto(student),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  const deleted = await schoolActorsRepository.deleteStudent(req.params.id);
  if (!deleted) {
    throw new NotFoundError('Student not found');
  }

  res.json({
    success: true,
    message: 'Student record deactivated',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// PARENTS
// ==========================================
export const listParents = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search } = req.query as any;
  const result = await schoolActorsRepository.listParents({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
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

export const getParentById = async (req: Request, res: Response): Promise<void> => {
  const parent = await schoolActorsRepository.getParentById(req.params.id);
  if (!parent) {
    throw new NotFoundError('Parent not found');
  }

  res.json({
    success: true,
    data: parent,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createParent = async (req: Request, res: Response): Promise<void> => {
  let userId = req.body.userId;
  if (!userId) {
    const existing = await userRepository.findByEmail(req.body.email);
    if (existing) {
      throw new BadRequestError('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash('Parent@123456', 10);
    const user = await userRepository.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash,
      role: 'PARENT',
      status: 'ACTIVE',
      phone: req.body.phone,
    });
    userId = user.id;
  }

  const parent = await schoolActorsRepository.createParent({
    userId,
    occupation: req.body.occupation,
    relationship: req.body.relationship,
    emergencyContact: req.body.emergencyContact,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    studentIds: req.body.studentIds || [],
  });

  res.status(201).json({
    success: true,
    message: 'Parent registered successfully',
    data: parent,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateParent = async (req: Request, res: Response): Promise<void> => {
  const parent = await schoolActorsRepository.updateParent(req.params.id, req.body);
  if (!parent) {
    throw new NotFoundError('Parent not found');
  }

  res.json({
    success: true,
    message: 'Parent profile updated',
    data: parent,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// TEACHERS
// ==========================================
export const listTeachers = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, department, search, status } = req.query as any;
  const result = await schoolActorsRepository.listTeachers({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    department,
    search,
    status,
  });

  res.json({
    success: true,
    data: result.items.map((t) => dtos.toTeacherResponseDto(t)),
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

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
  const teacher = await schoolActorsRepository.getTeacherById(req.params.id);
  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  res.json({
    success: true,
    data: dtos.toTeacherResponseDto(teacher),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  let userId = req.body.userId;
  if (!userId) {
    const existing = await userRepository.findByEmail(req.body.email);
    if (existing) {
      throw new BadRequestError('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash('Teacher@123456', 10);
    const user = await userRepository.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash,
      role: 'TEACHER',
      status: req.body.status || 'ACTIVE',
      phone: req.body.phone,
    });
    userId = user.id;
  }

  const teacher = await schoolActorsRepository.createTeacher({
    userId,
    employeeId: req.body.employeeId,
    qualification: req.body.qualification,
    specialization: req.body.specialization,
    department: req.body.department,
    joiningDate: req.body.joiningDate || new Date().toISOString().split('T')[0],
    status: req.body.status || 'ACTIVE',
  });

  res.status(201).json({
    success: true,
    message: 'Teacher profile created',
    data: dtos.toTeacherResponseDto(teacher),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  const teacher = await schoolActorsRepository.updateTeacher(req.params.id, req.body);
  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  res.json({
    success: true,
    message: 'Teacher profile updated',
    data: dtos.toTeacherResponseDto(teacher),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
