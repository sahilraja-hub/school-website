import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminSection } from './admin/types';
import { AdminSidebar } from './admin/AdminSidebar';

// Section Components
import { OverviewSection } from './admin/sections/OverviewSection';
import { StudentsSection } from './admin/sections/StudentsSection';
import { ParentsSection } from './admin/sections/ParentsSection';
import { TeachersSection } from './admin/sections/TeachersSection';
import { ClassesSection } from './admin/sections/ClassesSection';
import { SectionsSection } from './admin/sections/SectionsSection';
import { SubjectsSection } from './admin/sections/SubjectsSection';
import { AttendanceSection } from './admin/sections/AttendanceSection';
import { ExamsSection } from './admin/sections/ExamsSection';
import { ResultsSection } from './admin/sections/ResultsSection';
import { HomeworkSection } from './admin/sections/HomeworkSection';
import { TimetableSection } from './admin/sections/TimetableSection';
import { AdmissionsSection } from './admin/sections/AdmissionsSection';
import { NoticesSection } from './admin/sections/NoticesSection';
import { EventsSection } from './admin/sections/EventsSection';
import { GallerySection } from './admin/sections/GallerySection';
import { DocumentsSection } from './admin/sections/DocumentsSection';
import { FeesSection } from './admin/sections/FeesSection';
import { UsersSection } from './admin/sections/UsersSection';
import { SettingsSection } from './admin/sections/SettingsSection';
import { AuditLogsSection } from './admin/sections/AuditLogsSection';

const SECTION_TITLES: Record<AdminSection, string> = {
  dashboard: 'Executive Dashboard',
  admissions: 'Admissions Pipeline',
  students: 'Scholar Registry',
  parents: 'Guardian Relations',
  teachers: 'Faculty & Instructors',
  users: 'Users & Roles',
  classes: 'Academic Classes',
  sections: 'Classroom Sections',
  subjects: 'Course Curriculum',
  timetable: 'Master Timetable',
  attendance: 'Attendance Matrix',
  exams: 'Examinations',
  results: 'Gradebook & Results',
  homework: 'Assignments & Homework',
  notices: 'Institutional Bulletins',
  events: 'Events & Symposia',
  gallery: 'Media & Gallery',
  documents: 'Document Vault',
  fees: 'Bursar & Fees',
  settings: 'Institutional Settings',
  'audit-logs': 'Security Audit Trail',
};

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Overview Data States
  const [stats, setStats] = useState({
    totalStudents: 420,
    totalTeachers: 48,
    totalParents: 380,
    totalClasses: 28,
    pendingAdmissions: 2,
    attendanceRate: 96.4,
    totalRevenue: 345000,
    systemStatus: 'Optimal',
    currentTerm: 'Fall 2026',
  });

  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([
    {
      id: 'adm-1',
      applicationNumber: 'ADM-2026-1042',
      applicantFullName: 'Alexander Hayes',
      gradeApplyingFor: 'GRADE_9',
      parentName: 'Robert Hayes',
      status: 'UNDER_REVIEW',
      submittedAt: '2026-09-18T10:30:00Z',
    },
    {
      id: 'adm-2',
      applicationNumber: 'ADM-2026-1088',
      applicantFullName: 'Sophia Patel',
      gradeApplyingFor: 'KINDERGARTEN',
      parentName: 'Priya & Vikram Patel',
      status: 'ACCEPTED',
      submittedAt: '2026-09-10T09:00:00Z',
    },
    {
      id: 'adm-3',
      applicationNumber: 'ADM-2026-1150',
      applicantFullName: 'Marcus Vance',
      gradeApplyingFor: 'GRADE_6',
      parentName: 'Eleanor Vance',
      status: 'INTERVIEW_SCHEDULED',
      submittedAt: '2026-09-22T14:45:00Z',
    },
  ]);

  const [recentNotices, setRecentNotices] = useState<any[]>([
    {
      id: 'not-1',
      title: 'Campus Safety & Health Advisory Protocol 2026',
      category: 'ADMINISTRATIVE',
      publishedAt: '2026-09-24T08:00:00Z',
      isPinned: true,
    },
    {
      id: 'not-2',
      title: 'Fall Term Mid-Term Examination Schedule Released',
      category: 'EXAMINATION',
      publishedAt: '2026-09-22T10:30:00Z',
      isPinned: true,
    },
    {
      id: 'not-3',
      title: 'Annual Founders Day Gala & Scholar Showcase',
      category: 'GENERAL',
      publishedAt: '2026-09-18T14:15:00Z',
      isPinned: false,
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([
    {
      id: 'evt-1',
      title: 'Annual Science & Innovation Symposium 2026',
      location: 'Grand Exhibition Hall',
      startDate: '2026-10-18T09:00:00Z',
      isPublic: true,
    },
    {
      id: 'evt-2',
      title: 'Parent-Teacher Academic Progress Conference',
      location: 'Main Academic Quad',
      startDate: '2026-10-24T13:00:00Z',
      isPublic: false,
    },
    {
      id: 'evt-3',
      title: 'Oakridge Varsity Cross-Country Invitational',
      location: 'Athletics Complex',
      startDate: '2026-11-04T08:30:00Z',
      isPublic: true,
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<any[]>([
    {
      id: 'act-1',
      actor: 'Dr. Margaret Holloway',
      action: 'Updated system security and portal session timeouts',
      timestamp: '25 mins ago',
    },
    {
      id: 'act-2',
      actor: 'Arthur Pendleton',
      action: 'Approved admission dossier for Sophia Patel (Kindergarten)',
      timestamp: '1 hour ago',
    },
    {
      id: 'act-3',
      actor: 'Dr. Sarah Jenkins',
      action: 'Submitted attendance roll for Class 9-A (28 present, 2 absent)',
      timestamp: '2 hours ago',
    },
    {
      id: 'act-4',
      actor: 'Bursar Office',
      action: 'Generated 42 tuition invoices for Fall Term 2026',
      timestamp: '4 hours ago',
    },
  ]);

  // Fetch initial summary stats
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [statsRes, admRes, notRes, evtRes] = await Promise.allSettled([
          api.get('/stats/dashboard'),
          api.get('/admissions'),
          api.get('/notices'),
          api.get('/events'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setStats((prev) => ({ ...prev, ...statsRes.value.data.data }));
        }
        if (admRes.status === 'fulfilled' && admRes.value.data.success) {
          setRecentAdmissions(admRes.value.data.data.slice(0, 5));
        }
        if (notRes.status === 'fulfilled' && notRes.value.data.success) {
          setRecentNotices(notRes.value.data.data.slice(0, 5));
        }
        if (evtRes.status === 'fulfilled' && evtRes.value.data.success) {
          setUpcomingEvents(evtRes.value.data.data.slice(0, 5));
        }
      } catch (err) {
        console.warn('Dashboard using fallback data for demo.');
      }
    };

    fetchOverviewData();
  }, []);

  return (
    <div className="flex h-screen bg-[#060D1A] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(section) => {
          setActiveSection(section);
          setMobileSidebarOpen(false);
        }}
        pendingAdmissionsCount={stats.pendingAdmissions}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#0B1528] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400 hidden sm:inline">Admin Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
              <span className="font-semibold text-white">
                {SECTION_TITLES[activeSection] || activeSection}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Public Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Website</span>
            </a>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveSection('notices')}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Notices & Bulletins"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0B1528]" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-900/60 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">
                    {user ? `${user.firstName} ${user.lastName}` : 'Staff'}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    {user?.role || 'ADMIN'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-xs shadow-inner">
                  {user?.firstName ? user.firstName[0] : 'A'}
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#0B1528] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-fade-in"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-medium text-white">
                      {user ? `${user.firstName} ${user.lastName}` : 'Staff'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveSection('settings')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Security & Settings
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Section Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' && (
              <OverviewSection
                stats={stats}
                recentAdmissions={recentAdmissions}
                recentNotices={recentNotices}
                upcomingEvents={upcomingEvents}
                recentActivities={recentActivities}
                onNavigateSection={setActiveSection}
              />
            )}
            {activeSection === 'students' && <StudentsSection />}
            {activeSection === 'parents' && <ParentsSection />}
            {activeSection === 'teachers' && <TeachersSection />}
            {activeSection === 'classes' && <ClassesSection />}
            {activeSection === 'sections' && <SectionsSection />}
            {activeSection === 'subjects' && <SubjectsSection />}
            {activeSection === 'attendance' && <AttendanceSection />}
            {activeSection === 'exams' && <ExamsSection />}
            {activeSection === 'results' && <ResultsSection />}
            {activeSection === 'homework' && <HomeworkSection />}
            {activeSection === 'timetable' && <TimetableSection />}
            {activeSection === 'admissions' && <AdmissionsSection />}
            {activeSection === 'notices' && <NoticesSection />}
            {activeSection === 'events' && <EventsSection />}
            {activeSection === 'gallery' && <GallerySection />}
            {activeSection === 'documents' && <DocumentsSection />}
            {activeSection === 'fees' && <FeesSection />}
            {activeSection === 'users' && <UsersSection />}
            {activeSection === 'settings' && <SettingsSection />}
            {activeSection === 'audit-logs' && <AuditLogsSection />}
          </div>
        </main>
      </div>
    </div>
  );
};
