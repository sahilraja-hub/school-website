export type ParentPortalTab =
  | 'overview'
  | 'parent-profile'
  | 'child-profile'
  | 'attendance'
  | 'results'
  | 'homework'
  | 'timetable'
  | 'notices'
  | 'events'
  | 'fees'
  | 'documents';

export interface LinkedChild {
  id: string;
  userId?: string;
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  status: string;
  className: string;
  sectionName: string;
  sectionId?: string;
  roomNumber?: string;
  avatarUrl?: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  relationship: string;
  phone: string;
  occupation: string;
  address: string;
  studentIds: string[];
  children?: LinkedChild[];
}

export interface FeeInvoiceItem {
  description: string;
  amount: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName?: string;
  title: string;
  items: FeeInvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
  issueDate?: string;
  paidAt?: string;
}
