import { Request, Response } from 'express';
import { financeRepository } from '../repositories/financeRepository';
import { dtos } from '../types/dtos';
import { NotFoundError, BadRequestError } from '../errors';

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

  // Students can only access their own invoices
  let targetStudentId = studentId;
  if (req.user?.role === 'STUDENT' && req.user.studentId) {
    targetStudentId = req.user.studentId;
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
  if (req.user?.role === 'STUDENT' && req.user.studentId && invoice.studentId !== req.user.studentId) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: You can only view your own invoices',
      code: 'FORBIDDEN',
    });
    return;
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
