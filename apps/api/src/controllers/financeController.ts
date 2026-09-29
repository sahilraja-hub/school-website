import { Request, Response } from 'express';
import { financeRepository } from '../repositories/financeRepository';
import { dtos } from '../types/dtos';
import { NotFoundError, BadRequestError, AuthorizationError } from '../errors';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';

// ==========================================
// FEE STRUCTURES
// ==========================================
export const listFeeStructures = async (req: Request, res: Response): Promise<void> => {
  const { classId, academicYear } = req.query as any;
  const fees = await financeRepository.listFeeStructures({ classId, academicYear });

  res.json({
    success: true,
    data: fees,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getFeeStructureById = async (req: Request, res: Response): Promise<void> => {
  const fee = await financeRepository.getFeeStructureById(req.params.id);
  if (!fee) throw new NotFoundError('Fee structure not found');

  res.json({
    success: true,
    data: fee,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createFeeStructure = async (req: Request, res: Response): Promise<void> => {
  const created = await financeRepository.createFeeStructure(req.body);
  res.status(201).json({
    success: true,
    message: 'Fee structure created',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// INVOICES
// ==========================================
export const listInvoices = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, studentId, status, search } = req.query as any;

  let targetStudentId = studentId;

  // Students can only access their own invoices
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (studentId && studentId !== student?.id) {
      throw new AuthorizationError('Forbidden: You can only view your own invoices');
    }
    targetStudentId = student?.id;
  }

  // Parents can only access invoices for their linked children
  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const linkedIds = parent?.studentIds || [];
    if (studentId) {
      if (!linkedIds.includes(studentId)) {
        throw new AuthorizationError('Forbidden: You can only view invoices of your linked children');
      }
      targetStudentId = studentId;
    } else {
      targetStudentId = linkedIds[0];
    }
  }

  const result = await financeRepository.listInvoices({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    studentId: targetStudentId,
    status,
    search,
  });

  res.json({
    success: true,
    data: result.items.map((i) => dtos.toInvoiceDto(i)),
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

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  const invoice = await financeRepository.getInvoiceById(req.params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');

  // Enforce student tenancy
  if (req.user?.role === 'STUDENT' && req.user?.id) {
    const student = await schoolActorsRepository.getStudentByUserId(req.user.id);
    if (student && invoice.studentId !== student.id) {
      throw new AuthorizationError('Forbidden: You can only view your own invoices');
    }
  }

  // Enforce parent tenancy
  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const linkedIds = parent?.studentIds || [];
    if (!linkedIds.includes(invoice.studentId)) {
      throw new AuthorizationError('Forbidden: You can only view invoices of your linked children');
    }
  }

  res.json({
    success: true,
    data: dtos.toInvoiceDto(invoice),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  const invoice = await financeRepository.createInvoice(req.body);
  res.status(201).json({
    success: true,
    message: 'Fee invoice issued',
    data: dtos.toInvoiceDto(invoice),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// PAYMENTS
// ==========================================
export const listPayments = async (req: Request, res: Response): Promise<void> => {
  const { invoiceId, search } = req.query as any;
  const payments = await financeRepository.listPayments({ invoiceId, search });

  res.json({
    success: true,
    data: payments,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  const inv = await financeRepository.getInvoiceById(req.body.invoiceId);
  if (!inv) throw new NotFoundError('Invoice not found');

  if (req.user?.role === 'PARENT' && req.user?.id) {
    const parent = await schoolActorsRepository.getParentByUserId(req.user.id);
    const linkedIds = parent?.studentIds || [];
    if (!linkedIds.includes(inv.studentId)) {
      throw new AuthorizationError('Forbidden: You can only pay invoices of your linked children');
    }
  }

  try {
    const payment = await financeRepository.recordPayment(req.body);
    res.status(201).json({
      success: true,
      message: 'Payment recorded and receipt generated',
      data: payment,
      meta: { requestId: req.id, timestamp: new Date().toISOString() },
    });
  } catch (err) {
    throw new BadRequestError((err as Error).message);
  }
};
