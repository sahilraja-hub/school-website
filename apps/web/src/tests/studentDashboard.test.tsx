import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentDashboard } from '../pages/portal/StudentDashboard';
import { StudentOverviewSection } from '../pages/portal/student/sections/StudentOverviewSection';
import { StudentProfileSection } from '../pages/portal/student/sections/StudentProfileSection';
import { StudentAttendanceSection } from '../pages/portal/student/sections/StudentAttendanceSection';
import { StudentResultsSection } from '../pages/portal/student/sections/StudentResultsSection';
import { StudentHomeworkSection } from '../pages/portal/student/sections/StudentHomeworkSection';
import { StudentTimetableSection } from '../pages/portal/student/sections/StudentTimetableSection';
import { StudentNoticesSection } from '../pages/portal/student/sections/StudentNoticesSection';
import { StudentEventsSection } from '../pages/portal/student/sections/StudentEventsSection';
import { StudentDocumentsSection } from '../pages/portal/student/sections/StudentDocumentsSection';
import { AuthProvider } from '../context/AuthContext';

// Mock API service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('/students/me')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
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
              emergencyContact: '+1-555-9999',
              address: '742 Evergreen Terrace',
              status: 'ACTIVE',
              className: 'Grade 10',
              sectionName: 'Section A',
              roomNumber: 'Room 301',
              parent: {
                name: 'David Vance',
                relationship: 'Father',
                phone: '+1 (555) 019-2837',
                email: 'parent@oakridge.edu',
              },
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
              present: 43,
              absent: 1,
              late: 1,
              excused: 0,
              attendanceRate: 96,
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
                sectionName: 'Section 10-A',
                notes: 'Punctual and engaged',
              },
              {
                id: 'att-002',
                studentId: 'stud-001',
                date: '2026-10-09',
                status: 'LATE',
                sectionName: 'Section 10-A',
                notes: 'Tardy 10m bus delay',
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
                passMarks: 40,
                grade: 'A+',
                isPassed: true,
                percentage: 94.5,
                remarks: 'Exemplary problem-solving in calculus section.',
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
                title: 'Problem Set 4: Differential Calculus',
                subjectName: 'Advanced Mathematics',
                dueDate: '2026-10-18',
                totalMarks: 20,
                description: 'Solve questions 1-15 on Page 142.',
                submissionsCount: 1,
                mySubmission: {
                  content: 'All 15 problems solved step-by-step.',
                  status: 'SUBMITTED',
                },
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
                id: 'tt-1',
                dayOfWeek: 'MONDAY',
                periodNumber: 1,
                startTime: '08:30 AM',
                endTime: '09:20 AM',
                subjectName: 'Advanced Mathematics',
                teacherName: 'Dr. Evelyn Reed',
                roomNumber: 'Room 301',
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
                id: 'not-1',
                title: 'Mid-Term Examination Hall Tickets',
                category: 'EXAMINATION',
                publishDate: '2026-10-01',
                author: 'Dean of Academic Affairs',
                content: 'All scholars must download verified hall tickets.',
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
                id: 'evt-1',
                title: 'Oakridge Invitational Mathematics Olympiad',
                category: 'ACADEMIC',
                startDate: '2026-10-24T09:00:00Z',
                location: 'Academic Pavilion',
                description: 'Regional inter-school competition.',
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
                id: 'doc-1',
                title: 'Oakridge Scholar Handbook 2026–2027',
                category: 'HANDBOOK',
                fileName: 'scholar-handbook.pdf',
                fileUrl: 'https://docs.oakridge.edu/handbook.pdf',
                fileSize: 2500000,
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: { success: true, data: [] } });
    }),
    post: vi.fn().mockImplementation((url: string, body: any) => {
      if (url.includes('/submit')) {
        return Promise.resolve({
          data: {
            success: true,
            message: 'Homework submitted successfully',
            data: { id: 'sub-new', ...body },
          },
        });
      }
      return Promise.resolve({ data: { success: true } });
    }),
  },
}));

describe('Phase 12 — Student Portal UI & Section Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('oakridge_user', JSON.stringify({
      id: 'usr-student-01',
      firstName: 'Liam',
      lastName: 'Vance',
      role: 'STUDENT',
      email: 'student@oakridge.edu',
    }));
  });

  // ==========================================
  // 1. Dashboard Container & Tab Navigation
  // ==========================================
  describe('StudentDashboard Container & Navigation', () => {
    it('renders the luxury dashboard with scholar info and sidebar items', async () => {
      render(
        <AuthProvider>
          <StudentDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('student-dashboard')).toBeInTheDocument();
      });

      // Verify academy brand & user greeting
      expect(screen.getAllByText(/RBSRPS|OAKRIDGE|R\.B\.S/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Scholar Portal/i).length).toBeGreaterThan(0);
      expect(screen.getByTestId('student-overview-section')).toBeInTheDocument();
    });

    it('switches between all 8 core student tabs correctly', async () => {
      render(
        <AuthProvider>
          <StudentDashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('student-dashboard')).toBeInTheDocument();
      });

      // 1. Switch to Profile tab
      fireEvent.click(screen.getByRole('button', { name: /Scholar Profile/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-profile-section')).toBeInTheDocument();
      });

      // 2. Switch to Attendance tab
      fireEvent.click(screen.getByRole('button', { name: /Attendance/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-attendance-section')).toBeInTheDocument();
      });

      // 3. Switch to Results tab
      fireEvent.click(screen.getByRole('button', { name: /Results & Gradebook/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-results-section')).toBeInTheDocument();
      });

      // 4. Switch to Homework tab
      fireEvent.click(screen.getByRole('button', { name: /Coursework & Homework/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-homework-section')).toBeInTheDocument();
      });

      // 5. Switch to Timetable tab
      fireEvent.click(screen.getByRole('button', { name: /Class Timetable/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-timetable-section')).toBeInTheDocument();
      });

      // 6. Switch to Notices tab
      fireEvent.click(screen.getByRole('button', { name: /Circulars & Notices/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-notices-section')).toBeInTheDocument();
      });

      // 7. Switch to Events tab
      fireEvent.click(screen.getByRole('button', { name: /Campus Events/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-events-section')).toBeInTheDocument();
      });

      // 8. Switch to Documents tab
      fireEvent.click(screen.getByRole('button', { name: /Handbooks & Docs/i }));
      await waitFor(() => {
        expect(screen.getByTestId('student-documents-section')).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 2. Student Profile Section
  // ==========================================
  describe('StudentProfileSection', () => {
    const mockProfile = {
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
      emergencyContact: '+1-555-9999',
      address: '742 Evergreen Terrace',
      status: 'ACTIVE',
      className: 'Grade 10',
      sectionName: 'Section A',
      roomNumber: 'Room 301',
      parent: {
        name: 'David Vance',
        relationship: 'Father',
        phone: '+1 (555) 019-2837',
        email: 'parent@oakridge.edu',
      },
    };

    it('renders scholar enrollment, demographics, and parent contact details', () => {
      render(<StudentProfileSection profile={mockProfile} />);

      expect(screen.getAllByText('ADM-2026-0089').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10-A-01').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Room 301').length).toBeGreaterThan(0);
      expect(screen.getByText('+1-555-9999')).toBeInTheDocument();
      expect(screen.getByText('David Vance')).toBeInTheDocument();
      expect(screen.getByText('Father')).toBeInTheDocument();
      expect(screen.getByText('+1 (555) 019-2837')).toBeInTheDocument();
      expect(screen.getByText(/Verified Scholar Account/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. Student Attendance Section
  // ==========================================
  describe('StudentAttendanceSection', () => {
    const mockRecords = [
      { id: '1', date: '2026-10-10', status: 'PRESENT', sectionName: 'Section 10-A', notes: 'On time' },
      { id: '2', date: '2026-10-09', status: 'LATE', sectionName: 'Section 10-A', notes: 'Tardy 10m' },
      { id: '3', date: '2026-10-08', status: 'ABSENT', sectionName: 'Section 10-A', notes: 'Medical note' },
    ];
    const mockStats = { attendanceRate: 95, totalDays: 30, present: 28, late: 1, absent: 1 };

    it('renders KPI stats, standing rate, and filters by status', () => {
      render(<StudentAttendanceSection records={mockRecords} stats={mockStats} />);

      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('Exemplary')).toBeInTheDocument();
      expect(screen.getByText('On time')).toBeInTheDocument();

      // Filter by LATE
      fireEvent.click(screen.getByRole('button', { name: /^LATE$/i }));
      expect(screen.getByText('Tardy 10m')).toBeInTheDocument();
      expect(screen.queryByText('On time')).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. Student Results Section
  // ==========================================
  describe('StudentResultsSection', () => {
    const mockResults = [
      {
        id: 'res-1',
        subjectName: 'Advanced Mathematics',
        examName: 'Mid-Term Examinations 2026',
        marksObtained: 94.5,
        maxMarks: 100,
        grade: 'A+',
        isPassed: true,
        percentage: 94.5,
        remarks: 'Exemplary problem-solving in calculus section.',
      },
      {
        id: 'res-2',
        subjectName: 'AP Physics C',
        examName: 'Mid-Term Examinations 2026',
        marksObtained: 89.0,
        maxMarks: 100,
        grade: 'A',
        isPassed: true,
        percentage: 89.0,
        remarks: 'Great lab performance.',
      },
    ];

    it('renders gradebook with marks, percentage, and opens details modal on click', () => {
      render(<StudentResultsSection results={mockResults} />);

      expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument();
      expect(screen.getByText('AP Physics C')).toBeInTheDocument();
      expect(screen.getByText('94.5 / 100')).toBeInTheDocument();

      // Click row to view modal
      fireEvent.click(screen.getByText('Advanced Mathematics'));
      expect(screen.getByText(/Faculty Remarks:/i)).toBeInTheDocument();
      expect(screen.getByText(/"Exemplary problem-solving in calculus section."/i)).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByRole('button', { name: /Close/i }));
      expect(screen.queryByText(/Faculty Remarks:/i)).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // 5. Student Homework Section
  // ==========================================
  describe('StudentHomeworkSection', () => {
    const mockHw = [
      {
        id: 'hw-1',
        title: 'Problem Set 4: Differential Calculus',
        subjectName: 'Advanced Mathematics',
        dueDate: '2026-10-18',
        totalMarks: 20,
        description: 'Solve questions 1-15 on Page 142.',
        submissionsCount: 0,
        mySubmission: null,
      },
    ];

    it('renders coursework and opens assignment submission modal', async () => {
      const onRefresh = vi.fn();
      render(<StudentHomeworkSection homework={mockHw} onRefresh={onRefresh} />);

      expect(screen.getByText('Problem Set 4: Differential Calculus')).toBeInTheDocument();
      expect(screen.getAllByText('PENDING').length).toBeGreaterThan(0);

      // Open submission modal
      fireEvent.click(screen.getByRole('button', { name: /Submit Assignment/i }));
      expect(screen.getByPlaceholderText(/Enter your detailed derivation/i)).toBeInTheDocument();

      // Fill form and submit
      fireEvent.change(screen.getByPlaceholderText(/Enter your detailed derivation/i), {
        target: { value: 'My step-by-step calculus solutions.' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Confirm Submission/i }));

      await waitFor(() => {
        expect(screen.getByText(/Submission Recorded/i)).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 6. Student Timetable Section
  // ==========================================
  describe('StudentTimetableSection', () => {
    const mockTimetable = [
      {
        id: 'tt-1',
        dayOfWeek: 'MONDAY',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        subjectName: 'Advanced Mathematics',
        teacherName: 'Dr. Evelyn Reed',
        roomNumber: 'Room 301',
      },
      {
        id: 'tt-2',
        dayOfWeek: 'TUESDAY',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        subjectName: 'AP Physics C',
        teacherName: 'Dr. Evelyn Reed',
        roomNumber: 'Lab 204',
      },
    ];

    it('renders timetable slots and changes selected day of the week', () => {
      render(
        <StudentTimetableSection
          timetable={mockTimetable}
          profile={{ className: 'Grade 10', sectionName: 'Section A', roomNumber: 'Room 301' }}
        />
      );

      expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument();

      // Switch to Tuesday
      fireEvent.click(screen.getByRole('button', { name: /^tuesday$/i }));
      expect(screen.getByText('AP Physics C')).toBeInTheDocument();
    });
  });

  // ==========================================
  // 7. Student Notices, Events & Documents
  // ==========================================
  describe('Student Notices, Events, and Documents Sections', () => {
    it('renders notices section and opens notice detail modal', () => {
      const mockNotices = [
        {
          id: 'not-1',
          title: 'Mid-Term Examination Hall Tickets',
          category: 'EXAMINATION',
          publishDate: '2026-10-01',
          author: 'Dean',
          content: 'All scholars must download hall tickets for entry into examination halls.',
        },
      ];

      render(<StudentNoticesSection notices={mockNotices} />);
      expect(screen.getByText('Mid-Term Examination Hall Tickets')).toBeInTheDocument();

      // Open detail modal
      fireEvent.click(screen.getByText('Mid-Term Examination Hall Tickets'));
      expect(screen.getAllByText(/All scholars must download hall tickets/i).length).toBeGreaterThan(0);
      fireEvent.click(screen.getByRole('button', { name: /Done/i }));
      expect(screen.queryByRole('button', { name: /Done/i })).not.toBeInTheDocument();
    });

    it('renders events section and toggles RSVP', () => {
      const mockEvents = [
        {
          id: 'evt-1',
          title: 'Mathematics Olympiad',
          category: 'ACADEMIC',
          startDate: '2026-10-24T09:00:00Z',
          location: 'Pavilion 401',
          description: 'Regional olympiad for high schools.',
        },
      ];

      render(<StudentEventsSection events={mockEvents} />);
      expect(screen.getByText('Mathematics Olympiad')).toBeInTheDocument();

      const rsvpBtn = screen.getByRole('button', { name: /RSVP & Attend/i });
      fireEvent.click(rsvpBtn);
      expect(screen.getByText(/Added to My Calendar/i)).toBeInTheDocument();
    });

    it('renders documents section with download options', () => {
      const mockDocs = [
        {
          id: 'doc-1',
          title: 'Scholar Handbook 2026',
          category: 'HANDBOOK',
          fileName: 'handbook.pdf',
          fileSize: 2000000,
        },
      ];

      render(<StudentDocumentsSection documents={mockDocs} />);
      expect(screen.getByText('Scholar Handbook 2026')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
    });
  });
});
