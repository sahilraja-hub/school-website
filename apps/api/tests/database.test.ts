import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { dtos } from '../src/types/dtos';

describe('Phase 7 — Production Database Architecture & DTOs', () => {
  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  const migrationPath = path.resolve(__dirname, '../prisma/migrations/20260929000000_init/migration.sql');

  it('should have a valid schema.prisma file defining all 27 required models', () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    const expectedModels = [
      'User',
      'Role',
      'Permission',
      'Student',
      'Parent',
      'Teacher',
      'Class',
      'Section',
      'Subject',
      'TeacherAssignment',
      'StudentEnrollment',
      'Attendance',
      'Exam',
      'ExamSubject',
      'Result',
      'Homework',
      'Timetable',
      'Admission',
      'Notice',
      'Event',
      'Gallery',
      'Media',
      'Document',
      'FeeStructure',
      'Invoice',
      'Payment',
      'AuditLog',
    ];

    for (const model of expectedModels) {
      const modelRegex = new RegExp(`model\\s+${model}\\s+{`);
      expect(schemaContent).toMatch(modelRegex);
    }
  });

  it('should implement soft deletion flags and timestamps on auditable entities', () => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    expect(schemaContent).toContain('isDeleted');
    expect(schemaContent).toContain('deletedAt');
    expect(schemaContent).toContain('createdAt');
    expect(schemaContent).toContain('updatedAt');
  });

  it('should have generated SQL migration containing tables, foreign keys, and indexes', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

    // Verify key tables
    expect(sqlContent).toContain('CREATE TABLE "users"');
    expect(sqlContent).toContain('CREATE TABLE "students"');
    expect(sqlContent).toContain('CREATE TABLE "teachers"');
    expect(sqlContent).toContain('CREATE TABLE "invoices"');
    expect(sqlContent).toContain('CREATE TABLE "payments"');
    expect(sqlContent).toContain('CREATE TABLE "audit_logs"');

    // Verify foreign keys & constraints
    expect(sqlContent).toContain('ADD CONSTRAINT "users_roleId_fkey"');
    expect(sqlContent).toContain('ADD CONSTRAINT "students_userId_fkey"');
    expect(sqlContent).toContain('ADD CONSTRAINT "attendances_studentId_fkey"');
    expect(sqlContent).toContain('ADD CONSTRAINT "invoices_studentId_fkey"');

    // Verify query performance indexes
    expect(sqlContent).toContain('CREATE INDEX "users_email_idx"');
    expect(sqlContent).toContain('CREATE INDEX "students_studentIdNumber_idx"');
    expect(sqlContent).toContain('CREATE INDEX "attendances_sectionId_date_idx"');
    expect(sqlContent).toContain('CREATE INDEX "audit_logs_entityType_entityId_idx"');
  });

  it('should never expose passwordHash in UserResponseDto', () => {
    const rawDbUser = {
      id: 'usr-12345',
      email: 'teacher@oakridge.edu',
      passwordHash: '$2a$10$e9qO...hashed_secret_never_leak',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      phone: '+1-555-0102',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: { name: 'TEACHER' },
      status: 'ACTIVE',
      emailVerified: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const userDto = dtos.toUserResponseDto(rawDbUser);

    expect(userDto).not.toHaveProperty('passwordHash');
    expect(userDto.fullName).toBe('Sarah Jenkins');
    expect(userDto.email).toBe('teacher@oakridge.edu');
    expect(userDto.role).toBe('TEACHER');
    expect(userDto.status).toBe('ACTIVE');
  });

  it('should safely map StudentResponseDto with parent and enrollment details', () => {
    const rawDbStudent = {
      id: 'stud-1',
      userId: 'usr-stud-1',
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      gender: 'MALE',
      emergencyContact: '+1-555-9999',
      admissionDate: new Date('2024-06-01'),
      status: 'ACTIVE',
      user: {
        firstName: 'Alex',
        lastName: 'Sterling',
        email: 'alex.sterling@oakridge.edu',
      },
      parent: {
        id: 'parent-1',
        relationship: 'FATHER',
        user: {
          firstName: 'Robert',
          lastName: 'Sterling',
          email: 'robert@example.com',
          phone: '+1-555-8888',
        },
      },
      enrollments: [
        {
          academicYear: '2026-2027',
          section: {
            name: 'Section A',
            class: { name: 'Grade 10' },
          },
        },
      ],
    };

    const studentDto = dtos.toStudentResponseDto(rawDbStudent);

    expect(studentDto.admissionNumber).toBe('ADM-2026-0089');
    expect(studentDto.fullName).toBe('Alex Sterling');
    expect(studentDto.parent?.name).toBe('Robert Sterling');
    expect(studentDto.currentEnrollment?.className).toBe('Grade 10');
    expect(studentDto.currentEnrollment?.sectionName).toBe('Section A');
  });

  it('should safely map InvoiceDto and calculate numeric financial values', () => {
    const rawDbInvoice = {
      id: 'inv-1',
      studentId: 'stud-1',
      feeStructureId: 'fee-1',
      invoiceNumber: 'INV-2026-001',
      amount: '4500.00',
      paidAmount: '2000.00',
      balance: '2500.00',
      status: 'PARTIALLY_PAID',
      dueDate: new Date('2026-10-01'),
      createdAt: new Date(),
      feeStructure: { name: 'Term 1 Tuition' },
      student: { user: { firstName: 'Alex', lastName: 'Sterling' } },
      payments: [
        {
          id: 'pay-1',
          invoiceId: 'inv-1',
          paymentNumber: 'PAY-100',
          amount: '2000.00',
          paymentMethod: 'ONLINE',
          status: 'SUCCESS',
          paidAt: new Date(),
        },
      ],
    };

    const invoiceDto = dtos.toInvoiceDto(rawDbInvoice);

    expect(invoiceDto.invoiceNumber).toBe('INV-2026-001');
    expect(invoiceDto.amount).toBe(4500);
    expect(invoiceDto.paidAmount).toBe(2000);
    expect(invoiceDto.balance).toBe(2500);
    expect(invoiceDto.payments).toHaveLength(1);
    expect(invoiceDto.payments?.[0].amount).toBe(2000);
  });
});
