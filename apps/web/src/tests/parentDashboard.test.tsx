import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParentDashboard } from '../pages/portal/ParentDashboard';
import { ParentOverviewSection } from '../pages/portal/parent/sections/ParentOverviewSection';
import { ParentProfileSection } from '../pages/portal/parent/sections/ParentProfileSection';
import { ParentChildProfileSection } from '../pages/portal/parent/sections/ParentChildProfileSection';
import { ParentAttendanceSection } from '../pages/portal/parent/sections/ParentAttendanceSection';
import { ParentResultsSection } from '../pages/portal/parent/sections/ParentResultsSection';
import { ParentHomeworkSection } from '../pages/portal/parent/sections/ParentHomeworkSection';
import { ParentTimetableSection } from '../pages/portal/parent/sections/ParentTimetableSection';
import { ParentFeesSection } from '../pages/portal/parent/sections/ParentFeesSection';
import { ParentNoticesSection } from '../pages/portal/parent/sections/ParentNoticesSection';
import { ParentEventsSection } from '../pages/portal/parent/sections/ParentEventsSection';
import { ParentDocumentsSection } from '../pages/portal/parent/sections/ParentDocumentsSection';
import { AuthProvider } from '../context/AuthContext';

// Mock API service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('/parents/me')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              id: 'par-001',
              userId: 'usr-parent-01',
              fullName: 'David Vance',
              firstName: 'David',
              lastName: 'Vance',
              email: 'parent@oakridge.edu',
              relationship: 'Father',
              phone: '+1 (555) 019-2837',
              occupation: 'Senior Architect',
              address: '742 Evergreen Terrace',
              studentIds: ['stud-001', 'stud-003'],
              children: [
                {
                  id: 'stud-001',
                  admissionNumber: 'ADM-2026-0089',
                  rollNumber: '10-A-01',
                  firstName: 'Liam',
                  lastName: 'Vance',
                  fullName: 'Liam Vance',
                  email: 'student@oakridge.edu',
                  className: 'Grade 10',
                  sectionName: 'Section A',
                  sectionId: 'sec-10a',
                  roomNumber: 'Room 301',
                  bloodGroup: 'O+',
                  dateOfBirth: '2010-04-12',
                  gender: 'Male',
                  emergencyContact: '+1 (555) 019-2837',
                  address: '742 Evergreen Terrace',
                },
                {
                  id: 'stud-003',
                  admissionNumber: 'ADM-2026-0091',
                  rollNumber: '10-B-04',
                  firstName: 'Lucas',
                  lastName: 'Vance',
                  fullName: 'Lucas Vance',
                  email: 'lucas.vance@oakridge.edu',
                  className: 'Grade 10',
                  sectionName: 'Section B',
                  sectionId: 'sec-10b',
                  roomNumber: 'Room 304',
                  bloodGroup: 'A+',
                  dateOfBirth: '2010-08-22',
                  gender: 'Male',
                  emergencyContact: '+1 (555) 019-2837',
                  address: '742 Evergreen Terrace',
                },
              ],
            },
          },
        });
      }

      if (url.includes('/attendance/stats')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              totalDays: 45,
              presentDays: 43,
              absentDays: 1,
              lateDays: 1,
              attendancePercentage: 96,
            },
          },
        });
      }

      if (url.includes('/attendance')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'att-001',
                studentId: 'stud-001',
                date: '2026-10-10',
                status: 'PRESENT',
                sectionName: 'Section A',
                notes: 'Punctual in lab',
              },
            ],
          },
        });
      }

      if (url.includes('/results')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'res-001',
                studentId: 'stud-001',
                subjectName: 'Advanced Mathematics',
                examName: 'Mid-Term Examinations 2026',
                marksObtained: 94.5,
                maxMarks: 100,
                grade: 'A+',
                percentage: 94.5,
                isPassed: true,
                remarks: 'Outstanding performance',
              },
            ],
          },
        });
      }

      if (url.includes('/fees/invoices')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'inv-001',
                invoiceNumber: 'INV-2026-0042',
                studentId: 'stud-001',
                studentName: 'Liam Vance',
                title: 'Fall Semester 2026 Tuition',
                totalAmount: 4500,
                paidAmount: 1500,
                balance: 3000,
                status: 'PARTIALLY_PAID',
                dueDate: '2026-11-15',
                items: [
                  { description: 'Academic Instruction', amount: 3500 },
                  { description: 'Laboratory Fee', amount: 1000 },
                ],
              },
            ],
          },
        });
      }

      if (url.includes('/homework')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'hw-001',
                title: 'Thermodynamics Problem Set',
                description: 'Solve questions 1-10',
                subjectName: 'AP Physics C',
                dueDate: '2026-10-16',
                maxPoints: 100,
                submissions: [
                  {
                    id: 'sub-001',
                    studentId: 'stud-001',
                    status: 'GRADED',
                    grade: '98/100',
                    remarks: 'Excellent work',
                  },
                ],
              },
            ],
          },
        });
      }

      if (url.includes('/timetable')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'tt-001',
                dayOfWeek: 'Monday',
                periodNumber: 1,
                startTime: '08:30',
                endTime: '09:20',
                subjectName: 'Advanced Mathematics',
                teacherName: 'Dr. Robert Chen',
                roomNumber: 'Room 302',
              },
            ],
          },
        });
      }

      if (url.includes('/notices')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'not-001',
                title: 'Annual Parent-Teacher Conference',
                content: 'Book your 15-minute consultations via portal.',
                category: 'Academic',
                date: '2026-10-10',
                priority: 'HIGH',
              },
            ],
          },
        });
      }

      if (url.includes('/events')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'evt-001',
                title: 'Oakridge Annual Athletics Gala',
                description: 'Inter-house athletic track competitions.',
                date: '2026-10-24',
                time: '09:00 AM',
                location: 'Athletics Track',
                category: 'Sports',
              },
            ],
          },
        });
      }

      if (url.includes('/documents')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'doc-001',
                title: 'Oakridge Scholar & Family Handbook',
                category: 'Institutional Policies',
                fileSize: '3.4 MB',
                updatedAt: '2026-09-01',
                description: 'Complete academic regulations and guidelines.',
              },
            ],
          },
        });
      }

      return Promise.resolve({ data: { success: true, data: [] } });
    }),
    post: vi.fn().mockImplementation((url: string, body: any) => {
      if (url.includes('/payments')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              id: 'pay-001',
              invoiceId: body.invoiceId,
              amount: body.amount,
              paymentMethod: body.paymentMethod,
              transactionRef: body.transactionRef || 'TXN-999',
              status: 'COMPLETED',
            },
          },
        });
      }
      return Promise.resolve({ data: { success: true } });
    }),
  },
}));

describe('Phase 13 — Parent Portal Frontend Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it('renders ParentDashboard container with welcome banner and multi-child support', async () => {
    renderWithAuth(<ParentDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    });

    // Check parent greeting
    expect(screen.getAllByText(/David Vance/i).length).toBeGreaterThan(0);
    // Check multi-child top pills or dropdown
    expect(screen.getByTestId('topbar-child-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('top-child-pill-stud-001')).toBeInTheDocument();
    expect(screen.getByTestId('top-child-pill-stud-003')).toBeInTheDocument();
  });

  it('allows switching between multiple children and updates the active scholar profile', async () => {
    renderWithAuth(<ParentDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('top-child-pill-stud-003')).toBeInTheDocument();
    });

    // Initial selected child is Liam Vance
    expect(screen.getByTestId('selected-child-name')).toHaveTextContent('Liam Vance');

    // Switch to second child Lucas Vance
    const lucasPill = screen.getByTestId('top-child-pill-stud-003');
    fireEvent.click(lucasPill);

    await waitFor(() => {
      expect(screen.getByTestId('selected-child-name')).toHaveTextContent('Lucas Vance');
    });
  });

  it('switches between all 11 core navigation tabs seamlessly', async () => {
    renderWithAuth(<ParentDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    });

    const tabs = [
      { id: 'parent-profile', testId: 'parent-profile-section' },
      { id: 'child-profile', testId: 'parent-child-profile-section' },
      { id: 'attendance', testId: 'parent-attendance-section' },
      { id: 'results', testId: 'parent-results-section' },
      { id: 'homework', testId: 'parent-homework-section' },
      { id: 'timetable', testId: 'parent-timetable-section' },
      { id: 'fees', testId: 'parent-fees-section' },
      { id: 'notices', testId: 'parent-notices-section' },
      { id: 'events', testId: 'parent-events-section' },
      { id: 'documents', testId: 'parent-documents-section' },
      { id: 'overview', testId: 'parent-overview-section' },
    ];

    for (const tab of tabs) {
      const navBtn = screen.getByTestId(`nav-tab-${tab.id}`);
      fireEvent.click(navBtn);
      await waitFor(() => {
        expect(screen.getByTestId(tab.testId)).toBeInTheDocument();
      });
    }
  });

  it('renders ParentProfileSection with guardian demographics and verified badge', () => {
    const mockParent = {
      id: 'par-001',
      userId: 'usr-parent-01',
      fullName: 'David Vance',
      firstName: 'David',
      lastName: 'Vance',
      email: 'parent@oakridge.edu',
      relationship: 'Father',
      phone: '+1 (555) 019-2837',
      occupation: 'Senior Architect',
      address: '742 Evergreen Terrace',
      studentIds: ['stud-001', 'stud-003'],
    };

    const mockChildren = [
      {
        id: 'stud-001',
        admissionNumber: 'ADM-2026-0089',
        rollNumber: '10-A-01',
        firstName: 'Liam',
        lastName: 'Vance',
        fullName: 'Liam Vance',
        email: 'student@oakridge.edu',
        status: 'ACTIVE',
        className: 'Grade 10',
        sectionName: 'Section A',
      },
      {
        id: 'stud-003',
        admissionNumber: 'ADM-2026-0091',
        rollNumber: '10-B-04',
        firstName: 'Lucas',
        lastName: 'Vance',
        fullName: 'Lucas Vance',
        email: 'lucas.vance@oakridge.edu',
        status: 'ACTIVE',
        className: 'Grade 10',
        sectionName: 'Section B',
      },
    ];

    render(
      <ParentProfileSection
        parent={mockParent}
        childrenList={mockChildren}
        selectedChild={mockChildren[0]}
        onSelectChild={vi.fn()}
        onNavigateTab={vi.fn()}
      />
    );

    expect(screen.getByTestId('parent-profile-section')).toBeInTheDocument();
    expect(screen.getByText('Verified Guardian')).toBeInTheDocument();
    expect(screen.getByText('Senior Architect')).toBeInTheDocument();
    expect(screen.getByText('742 Evergreen Terrace')).toBeInTheDocument();
  });

  it('renders ParentChildProfileSection for the active child', () => {
    const mockChildren = [
      {
        id: 'stud-001',
        admissionNumber: 'ADM-2026-0089',
        rollNumber: '10-A-01',
        firstName: 'Liam',
        lastName: 'Vance',
        fullName: 'Liam Vance',
        email: 'student@oakridge.edu',
        dateOfBirth: '2010-04-12',
        gender: 'Male',
        bloodGroup: 'O+',
        emergencyContact: '+1 (555) 019-2837',
        status: 'ACTIVE',
        className: 'Grade 10',
        sectionName: 'Section A',
      },
    ];

    render(
      <ParentChildProfileSection
        childrenList={mockChildren}
        selectedChild={mockChildren[0]}
        onSelectChild={vi.fn()}
        onNavigateTab={vi.fn()}
      />
    );

    expect(screen.getByTestId('parent-child-profile-section')).toBeInTheDocument();
    expect(screen.getByTestId('child-profile-title')).toHaveTextContent('Liam Vance');
    expect(screen.getByText('ADM-2026-0089')).toBeInTheDocument();
    expect(screen.getByText('O+')).toBeInTheDocument();
  });

  it('renders ParentAttendanceSection with rate gauge and daily history log', () => {
    const mockChild = {
      id: 'stud-001',
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      firstName: 'Liam',
      lastName: 'Vance',
      fullName: 'Liam Vance',
      email: 'student@oakridge.edu',
      status: 'ACTIVE',
      className: 'Grade 10',
      sectionName: 'Section A',
    };

    const mockStats = {
      totalDays: 45,
      presentDays: 43,
      absentDays: 1,
      lateDays: 1,
      attendancePercentage: 96,
    };

    const mockRecords = [
      {
        id: 'att-01',
        studentId: 'stud-001',
        date: '2026-10-10',
        status: 'PRESENT' as const,
        sectionName: 'Section A',
        notes: 'Punctual in laboratory',
      },
    ];

    render(
      <ParentAttendanceSection
        childrenList={[mockChild]}
        selectedChild={mockChild}
        onSelectChild={vi.fn()}
        attendanceRecords={mockRecords}
        attendanceStats={mockStats}
      />
    );

    expect(screen.getByTestId('parent-attendance-section')).toBeInTheDocument();
    expect(screen.getByTestId('attendance-rate-value')).toHaveTextContent('96%');
    expect(screen.getByText('Punctual in laboratory')).toBeInTheDocument();
  });

  it('renders ParentResultsSection and opens the feedback review modal', () => {
    const mockChild = {
      id: 'stud-001',
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      firstName: 'Liam',
      lastName: 'Vance',
      fullName: 'Liam Vance',
      email: 'student@oakridge.edu',
      status: 'ACTIVE',
      className: 'Grade 10',
      sectionName: 'Section A',
    };

    const mockResults = [
      {
        id: 'res-01',
        studentId: 'stud-001',
        subjectName: 'Advanced Mathematics',
        examName: 'Mid-Term Examinations 2026',
        marksObtained: 94.5,
        maxMarks: 100,
        grade: 'A+',
        isPassed: true,
        percentage: 94.5,
        remarks: 'Exemplary problem-solving in calculus section.',
      },
    ];

    render(
      <ParentResultsSection
        childrenList={[mockChild]}
        selectedChild={mockChild}
        onSelectChild={vi.fn()}
        results={mockResults}
      />
    );

    expect(screen.getByTestId('parent-results-section')).toBeInTheDocument();
    expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument();

    // Click Review button
    const reviewBtn = screen.getByText('Review');
    fireEvent.click(reviewBtn);

    // Modal appears
    expect(screen.getByText('Evaluation Report')).toBeInTheDocument();
    expect(screen.getByText(/Exemplary problem-solving/i)).toBeInTheDocument();
  });

  it('renders ParentFeesSection and allows paying outstanding tuition via modal', async () => {
    const mockChild = {
      id: 'stud-001',
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      firstName: 'Liam',
      lastName: 'Vance',
      fullName: 'Liam Vance',
      email: 'student@oakridge.edu',
      status: 'ACTIVE',
      className: 'Grade 10',
      sectionName: 'Section A',
    };

    const mockInvoices = [
      {
        id: 'inv-001',
        invoiceNumber: 'INV-2026-0042',
        studentId: 'stud-001',
        studentName: 'Liam Vance',
        title: 'Fall Semester 2026 Comprehensive Tuition',
        totalAmount: 4500,
        paidAmount: 1500,
        balance: 3000,
        status: 'PARTIALLY_PAID' as const,
        dueDate: '2026-11-15',
        items: [
          { description: 'Academic Instruction', amount: 3500 },
          { description: 'Laboratory Fee', amount: 1000 },
        ],
      },
    ];

    const onPaymentSuccess = vi.fn();

    render(
      <ParentFeesSection
        childrenList={[mockChild]}
        selectedChild={mockChild}
        onSelectChild={vi.fn()}
        invoices={mockInvoices}
        onPaymentSuccess={onPaymentSuccess}
      />
    );

    expect(screen.getByTestId('parent-fees-section')).toBeInTheDocument();
    expect(screen.getByTestId('total-balance-value')).toHaveTextContent('$3,000');

    // Click Pay Now
    const payBtn = screen.getByTestId('pay-invoice-btn-inv-001');
    fireEvent.click(payBtn);

    // Modal appears
    expect(screen.getByText('Secure Bursar Payment Gateway')).toBeInTheDocument();

    // Authorize payment
    const authorizeBtn = screen.getByText(/Authorize/i);
    fireEvent.click(authorizeBtn);

    await waitFor(() => {
      expect(onPaymentSuccess).toHaveBeenCalled();
    });
  });

  it('renders ParentNoticesSection, ParentEventsSection, and ParentDocumentsSection', () => {
    const { unmount: unmountNotices } = render(
      <ParentNoticesSection notices={[]} />
    );
    expect(screen.getByTestId('parent-notices-section')).toBeInTheDocument();
    unmountNotices();

    const { unmount: unmountEvents } = render(
      <ParentEventsSection events={[]} />
    );
    expect(screen.getByTestId('parent-events-section')).toBeInTheDocument();
    unmountEvents();

    render(<ParentDocumentsSection documents={[]} />);
    expect(screen.getByTestId('parent-documents-section')).toBeInTheDocument();
  });
});
