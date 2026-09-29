import { academicRepository } from './academicRepository';
import { schoolActorsRepository } from './schoolActorsRepository';

export interface IFeeStructureRecord {
  id: string;
  classId: string;
  name: string;
  amount: number;
  frequency: string;
  academicYear: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoiceRecord {
  id: string;
  studentId: string;
  feeStructureId: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentRecord {
  id: string;
  invoiceId: string;
  paymentNumber: string;
  amount: number;
  paymentMethod: string;
  transactionRef?: string;
  status: string;
  paidAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

class FinanceRepository {
  private feeStructures: Map<string, IFeeStructureRecord> = new Map();
  private invoices: Map<string, IInvoiceRecord> = new Map();
  private payments: Map<string, IPaymentRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const feeId = 'fee-001';
    this.feeStructures.set(feeId, {
      id: feeId,
      classId: 'cls-10',
      name: 'Grade 10 Annual Tuition Fee',
      amount: 4500.00,
      frequency: 'SEMESTER',
      academicYear: '2026-2027',
      description: 'Comprehensive academic tuition',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invId = 'inv-001';
    this.invoices.set(invId, {
      id: invId,
      studentId: 'stud-001',
      feeStructureId: feeId,
      invoiceNumber: 'INV-2026-00452',
      amount: 4500.00,
      paidAmount: 4500.00,
      balance: 0.00,
      status: 'PAID',
      dueDate: '2026-09-01',
      notes: 'Semester 1 Tuition Fee Paid in Full',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const payId = 'pay-001';
    this.payments.set(payId, {
      id: payId,
      invoiceId: invId,
      paymentNumber: 'PAY-2026-00891',
      amount: 4500.00,
      paymentMethod: 'ONLINE',
      transactionRef: 'TXN-OAK-98421048',
      status: 'SUCCESS',
      paidAt: new Date(),
      notes: 'Stripe Gateway',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invId2 = 'inv-002';
    this.invoices.set(invId2, {
      id: invId2,
      studentId: 'stud-002',
      feeStructureId: feeId,
      invoiceNumber: 'INV-2026-00453',
      amount: 4500.00,
      paidAmount: 4500.00,
      balance: 0.00,
      status: 'PAID',
      dueDate: '2026-09-01',
      notes: 'Semester 1 Tuition Fee Paid in Full',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invId3 = 'inv-003';
    this.invoices.set(invId3, {
      id: invId3,
      studentId: 'stud-003',
      feeStructureId: feeId,
      invoiceNumber: 'INV-2026-00454',
      amount: 4500.00,
      paidAmount: 2000.00,
      balance: 2500.00,
      status: 'PARTIALLY_PAID',
      dueDate: '2026-11-15',
      notes: 'Installment 1 Received; Installment 2 Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // --- Fee Structures ---
  public async listFeeStructures(query: { classId?: string; academicYear?: string }) {
    let items = Array.from(this.feeStructures.values());
    if (query.classId) items = items.filter((f) => f.classId === query.classId);
    if (query.academicYear) items = items.filter((f) => f.academicYear === query.academicYear);

    return Promise.all(
      items.map(async (f) => {
        const cls = await academicRepository.getClassById(f.classId);
        return { ...f, className: cls?.name };
      })
    );
  }

  public async getFeeStructureById(id: string) {
    const f = this.feeStructures.get(id);
    if (!f) return null;
    const cls = await academicRepository.getClassById(f.classId);
    return { ...f, className: cls?.name };
  }

  public async createFeeStructure(data: Omit<IFeeStructureRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `fee-${Date.now().toString(36)}`;
    const record: IFeeStructureRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.feeStructures.set(id, record);
    return this.getFeeStructureById(id);
  }

  // --- Invoices ---
  public async listInvoices(query: { page?: number; limit?: number; studentId?: string; status?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.invoices.values());

    if (query.studentId) items = items.filter((i) => i.studentId === query.studentId);
    if (query.status) items = items.filter((i) => i.status === query.status);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((i) => i.invoiceNumber.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (inv) => {
        const student = await schoolActorsRepository.getStudentById(inv.studentId);
        const fee = await this.getFeeStructureById(inv.feeStructureId);
        const payments = Array.from(this.payments.values()).filter((p) => p.invoiceId === inv.id);
        return {
          ...inv,
          studentName: student?.user?.firstName ? `${student.user.firstName} ${student.user.lastName}` : undefined,
          feeStructureName: fee?.name,
          payments,
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getInvoiceById(id: string) {
    const inv = this.invoices.get(id);
    if (!inv) return null;
    const student = await schoolActorsRepository.getStudentById(inv.studentId);
    const fee = await this.getFeeStructureById(inv.feeStructureId);
    const payments = Array.from(this.payments.values()).filter((p) => p.invoiceId === inv.id);
    return {
      ...inv,
      studentName: student?.user?.firstName ? `${student.user.firstName} ${student.user.lastName}` : undefined,
      feeStructureName: fee?.name,
      payments,
    };
  }

  public async createInvoice(data: Omit<IInvoiceRecord, 'id' | 'paidAmount' | 'balance' | 'status' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) {
    const id = `inv-${Date.now().toString(36)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const record: IInvoiceRecord = {
      ...data,
      id,
      invoiceNumber,
      paidAmount: 0,
      balance: data.amount,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.invoices.set(id, record);
    return this.getInvoiceById(id);
  }

  // --- Payments ---
  public async listPayments(query: { invoiceId?: string; search?: string }) {
    let items = Array.from(this.payments.values());
    if (query.invoiceId) items = items.filter((p) => p.invoiceId === query.invoiceId);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((p) => p.paymentNumber.toLowerCase().includes(s) || (p.transactionRef && p.transactionRef.toLowerCase().includes(s)));
    }
    return items;
  }

  public async recordPayment(data: { invoiceId: string; amount: number; paymentMethod: string; transactionRef?: string; notes?: string }) {
    const inv = this.invoices.get(data.invoiceId);
    if (!inv) throw new Error('Invoice not found');

    const paymentNumber = `PAY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = `pay-${Date.now().toString(36)}`;
    const payment: IPaymentRecord = {
      id,
      invoiceId: data.invoiceId,
      paymentNumber,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionRef: data.transactionRef,
      notes: data.notes,
      status: 'SUCCESS',
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.set(id, payment);

    // update invoice balance
    inv.paidAmount += data.amount;
    inv.balance = Math.max(0, inv.amount - inv.paidAmount);
    inv.status = inv.balance === 0 ? 'PAID' : 'PARTIALLY_PAID';
    inv.updatedAt = new Date();
    this.invoices.set(inv.id, inv);

    return payment;
  }
}

export const financeRepository = new FinanceRepository();
