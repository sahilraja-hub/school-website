import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminSidebar } from '../pages/portal/admin/AdminSidebar';
import { OverviewSection } from '../pages/portal/admin/sections/OverviewSection';
import { AdminDashboard } from '../pages/portal/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';

// Mock API service so network requests don't fail in tests
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('/stats/dashboard')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              totalStudents: 420,
              totalTeachers: 48,
              totalParents: 380,
              totalClasses: 28,
              pendingAdmissions: 5,
              attendanceRate: 96.4,
              totalRevenue: 345000,
              systemStatus: 'Optimal',
              currentTerm: 'Fall 2026',
            },
          },
        });
      }
      return Promise.resolve({ data: { success: true, data: [] } });
    }),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    patch: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

describe('Phase 10 — Complete Admin Dashboard Test Suite', () => {
  const mockStats = {
    totalStudents: 420,
    totalTeachers: 48,
    totalParents: 380,
    totalClasses: 28,
    pendingAdmissions: 3,
    attendanceRate: 96.4,
    totalRevenue: 345000,
    systemStatus: 'Optimal',
    currentTerm: 'Fall 2026',
  };

  const mockAdmissions = [
    {
      id: 'adm-1',
      applicationNumber: 'ADM-2026-1042',
      applicantFullName: 'Alexander Hayes',
      gradeApplyingFor: 'GRADE_9',
      parentName: 'Robert Hayes',
      status: 'UNDER_REVIEW',
      submittedAt: '2026-09-18T10:30:00Z',
    },
  ];

  const mockNotices = [
    {
      id: 'not-1',
      title: 'Campus Safety Advisory Protocol',
      category: 'ADMINISTRATIVE',
      publishedAt: '2026-09-24T08:00:00Z',
      isPinned: true,
    },
  ];

  const mockEvents = [
    {
      id: 'evt-1',
      title: 'Science & Innovation Symposium',
      location: 'Grand Exhibition Hall',
      startDate: '2026-10-18T09:00:00Z',
      isPublic: true,
    },
  ];

  const mockActivities = [
    {
      id: 'act-1',
      actor: 'Dr. Margaret Holloway',
      action: 'Updated system security and portal session timeouts',
      timestamp: '25 mins ago',
    },
  ];

  describe('1. AdminSidebar Component', () => {
    it('renders all primary administrative navigation sections', () => {
      const handleSelect = vi.fn();
      render(
        <AuthProvider>
          <AdminSidebar
            activeSection="dashboard"
            onSelectSection={handleSelect}
            pendingAdmissionsCount={3}
          />
        </AuthProvider>
      );

      // Verify core section buttons
      expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /admissions/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /students/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /parents/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /teachers/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /classes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sections/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subjects/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /timetable/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /attendance/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /exams/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /results/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /homework/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /notices/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /events/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /gallery/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /documents/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fees/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^settings$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /audit logs/i })).toBeInTheDocument();
    });

    it('triggers onSelectSection when a section is clicked', () => {
      const handleSelect = vi.fn();
      render(
        <AuthProvider>
          <AdminSidebar
            activeSection="dashboard"
            onSelectSection={handleSelect}
            pendingAdmissionsCount={5}
          />
        </AuthProvider>
      );

      const studentsBtn = screen.getByRole('button', { name: /students/i });
      fireEvent.click(studentsBtn);
      expect(handleSelect).toHaveBeenCalledWith('students');

      const feesBtn = screen.getByRole('button', { name: /fees/i });
      fireEvent.click(feesBtn);
      expect(handleSelect).toHaveBeenCalledWith('fees');
    });

    it('displays pending admissions badge count', () => {
      render(
        <AuthProvider>
          <AdminSidebar
            activeSection="dashboard"
            onSelectSection={vi.fn()}
            pendingAdmissionsCount={7}
          />
        </AuthProvider>
      );

      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  describe('2. OverviewSection Component', () => {
    it('renders KPI summary cards, term status, and recent activity', () => {
      const handleNavigate = vi.fn();
      render(
        <OverviewSection
          stats={mockStats}
          recentAdmissions={mockAdmissions}
          recentNotices={mockNotices}
          upcomingEvents={mockEvents}
          recentActivities={mockActivities}
          onNavigateSection={handleNavigate}
        />
      );

      // Verify header and stats
      expect(screen.getByText(/Oakridge Command Center/i)).toBeInTheDocument();
      expect(screen.getByText(/Fall 2026/i)).toBeInTheDocument();
      expect(screen.getByText('420')).toBeInTheDocument(); // Total Scholars
      expect(screen.getByText('48')).toBeInTheDocument(); // Faculty
      expect(screen.getByText('96.4%')).toBeInTheDocument(); // Attendance

      // Verify sections
      expect(screen.getByText(/Recent Admission Inquiries/i)).toBeInTheDocument();
      expect(screen.getByText('Alexander Hayes')).toBeInTheDocument();
      expect(screen.getByText(/Campus Safety Advisory Protocol/i)).toBeInTheDocument();
      expect(screen.getByText(/Science & Innovation Symposium/i)).toBeInTheDocument();
    });

    it('navigates to relevant sections when clicking shortcuts', () => {
      const handleNavigate = vi.fn();
      render(
        <OverviewSection
          stats={mockStats}
          recentAdmissions={mockAdmissions}
          recentNotices={mockNotices}
          upcomingEvents={mockEvents}
          recentActivities={mockActivities}
          onNavigateSection={handleNavigate}
        />
      );

      const enrollBtn = screen.getByRole('button', { name: /enroll student/i });
      fireEvent.click(enrollBtn);
      expect(handleNavigate).toHaveBeenCalledWith('students');

      const reviewBtn = screen.getByRole('button', { name: /review admissions/i });
      fireEvent.click(reviewBtn);
      expect(handleNavigate).toHaveBeenCalledWith('admissions');
    });
  });

  describe('3. AdminDashboard Integration', () => {
    it('renders dashboard with sidebar and switches to Students section', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      // Initial overview should be rendered
      expect(screen.getByText(/Oakridge Command Center/i)).toBeInTheDocument();

      // Click on Students in the sidebar
      const studentsNav = screen.getAllByRole('button', { name: /students/i })[0];
      fireEvent.click(studentsNav);

      // Students header should now be visible
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Student Registry & Rosters/i })).toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /enroll new student/i })).toBeInTheDocument();
    });

    it('switches to Admissions section and opens new application modal', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      const admissionsNav = screen.getAllByRole('button', { name: /admissions/i })[0];
      fireEvent.click(admissionsNav);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Admissions Pipeline/i })).toBeInTheDocument();
      });

      // Click "Log Application"
      const logAppBtn = screen.getByRole('button', { name: /log application/i });
      fireEvent.click(logAppBtn);

      expect(screen.getByText(/Register New Scholar Application/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. Eleanor/i)).toBeInTheDocument();
    });

    it('switches to Notices section and displays bulletins', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      const noticesNav = screen.getAllByRole('button', { name: /notices/i })[0];
      fireEvent.click(noticesNav);

      await waitFor(() => {
        expect(screen.getByText(/Institutional Bulletins & Notices/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish bulletin/i })).toBeInTheDocument();
    });

    it('switches to Fees section and toggles tabs', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      const feesNav = screen.getByRole('button', { name: /fees/i });
      fireEvent.click(feesNav);

      await waitFor(() => {
        expect(screen.getByText(/Bursar & Tuition Management/i)).toBeInTheDocument();
      });

      // Click Fee Schedules tab
      const structuresTab = screen.getByRole('button', { name: /fee schedules & rates/i });
      fireEvent.click(structuresTab);

      expect(structuresTab).toHaveClass('text-amber-400');
    });

    it('switches to Settings section and renders configuration fields', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      const settingsNav = screen.getByRole('button', { name: /^settings$/i });
      fireEvent.click(settingsNav);

      await waitFor(() => {
        expect(screen.getByText(/Institutional Settings & Configuration/i)).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue(/The Oakridge Academy of Excellence/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save configuration/i })).toBeInTheDocument();
    });

    it('switches to Audit Logs section and renders audit ledger', async () => {
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      );

      const auditNav = screen.getByRole('button', { name: /audit logs/i });
      fireEvent.click(auditNav);

      await waitFor(() => {
        expect(screen.getByText(/Security Audit Trail & Governance/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /export audit ledger/i })).toBeInTheDocument();
    });
  });
});
