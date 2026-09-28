import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { dtos } from '../types/dtos';
import { NotFoundError, BadRequestError } from '../errors';

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search, role, status } = req.query as any;
  const result = await userRepository.list({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    search,
    role,
    status,
  });

  res.json({
    success: true,
    data: result.items.map((u) => dtos.toUserResponseDto(u)),
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

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await userRepository.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    data: dtos.toUserResponseDto(user),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const existing = await userRepository.findByEmail(req.body.email);
  if (existing) {
    throw new BadRequestError('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await userRepository.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    passwordHash,
    role: req.body.role,
    status: req.body.status || 'ACTIVE',
    phone: req.body.phone,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: dtos.toUserResponseDto(user),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userRepository.update(req.params.id, req.body);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: dtos.toUserResponseDto(user),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  const user = await userRepository.update(req.params.id, { status: req.body.status });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    message: `User status changed to ${req.body.status}`,
    data: dtos.toUserResponseDto(user),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const deleted = await userRepository.delete(req.params.id);
  if (!deleted) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    message: 'User deactivated successfully',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
