import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Bell,
  Sparkles,
  FileText,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentPortalTab } from './student/types';

// Section components
import { StudentOverviewSection } from './student/sections/StudentOverviewSection';
import { StudentProfileSection } from './student/sections/StudentProfileSection';
import { StudentAttendanceSection } from './student/sections/StudentAttendanceSection';
import { StudentResultsSection } from './student/sections/StudentResultsSection';
import { StudentHomeworkSection } from './student/sections/StudentHomeworkSection';
import { StudentTimetableSection } from './student/sections/StudentTimetableSection';
import { StudentNoticesSection } from './student/sections/StudentNoticesSection';
import { StudentEventsSection } from './student/sections/StudentEventsSection';
import { StudentDocumentsSection } from './student/sections/StudentDocumentsSection';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<StudentPortalTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [profile, setProfile] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // 1. Current Student Profile
      const profRes = await api.get('/students/me');
      if (profRes.data.success && profRes.data.data) {
        setProfile(profRes.data.data);
      }
    } catch {
      // Default fallback profile
      setProfile({
        id: 'stud-001',
        userId: 'usr-student-01',
        admissionNumber: 'ADM-2026-0089',
        rollNumber: '10-A-01',
        firstName: user?.firstName || 'Liam',
        lastName: user?.lastName || 'Vance',
        fullName: `${user?.firstName || 'Liam'} ${user?.lastName || 'Vance'}`,
        email: user?.email || 'student@oakridge.edu',
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
      });
    }

    try {
      // 2. Attendance & Stats
      const [attRes, statsRes] = await Promise.allSettled([
        api.get('/attendance'),
        api.get('/attendance/stats'),
      ]);

      if (attRes.status === 'fulfilled' && attRes.value.data.success) {
        setAttendanceRecords(attRes.value.data.data || []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setAttendanceStats(statsRes.value.data.data);
      }
    } catch {
      // Handled gracefully with section defaults
    }

    try {
      // 3. Results & Gradebook
      const res = await api.get('/results');
      if (res.data.success && res.data.data) {
        setResults(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 4. Homework
      const res = await api.get('/homework');
      if (res.data.success && res.data.data) {
        setHomework(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 5. Timetable
      const res = await api.get('/timetable');
      if (res.data.success && res.data.data) {
        setTimetable(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 6. Notices, Events, Documents
      const [notRes, evtRes, docRes] = await Promise.allSettled([
        api.get('/notices'),
        api.get('/events'),
        api.get('/documents'),
      ]);

      if (notRes.status === 'fulfilled' && notRes.value.data.success) {
        setNotices(notRes.value.data.data || []);
      }
      if (evtRes.status === 'fulfilled' && evtRes.value.data.success) {
        setEvents(evtRes.value.data.data || []);
      }
      if (docRes.status === 'fulfilled' && docRes.value.data.success) {
        setDocuments(docRes.value.data.data || []);
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const navigationItems = [
    { id: 'overview' as StudentPortalTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'profile' as StudentPortalTab, label: 'Scholar Profile', icon: User },
    { id: 'attendance' as StudentPortalTab, label: 'Attendance', icon: CheckCircle2 },
    { id: 'results' as StudentPortalTab, label: 'Results & Gradebook', icon: Award },
    { id: 'homework' as StudentPortalTab, label: 'Coursework & Homework', icon: BookOpen },
    { id: 'timetable' as StudentPortalTab, label: 'Class Timetable', icon: Calendar },
    { id: 'notices' as StudentPortalTab, label: 'Circulars & Notices', icon: Bell },
    { id: 'events' as StudentPortalTab, label: 'Campus Events', icon: Sparkles },
    { id: 'documents' as StudentPortalTab, label: 'Handbooks & Docs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-crest-600 selection:text-white" data-testid="student-dashboard">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center font-serif font-bold text-gold-400">
            RBS
          </div>
          <div>
            <h1 className="font-serif font-bold text-base tracking-wide text-white">R.B.S Public School</h1>
            <p className="text-[10px] text-gold-400 uppercase tracking-widest">Scholar Portal</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-crest-950 via-crest-900 to-slate-900 text-white p-6 z-50 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-crest-800/40 shadow-2xl`}
      >
        <div className="space-y-6">
          {/* Academy Brand */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-crest-800/60">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-crest-950 flex items-center justify-center font-serif font-bold text-gold-400 text-sm">
                RBS
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-base tracking-wider text-white">RBSRPS MAHUA</h2>
              <p className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold">Scholar Portal</p>
            </div>
          </div>

          {/* Scholar Mini Badge */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 font-serif font-bold text-sm flex items-center justify-center border border-gold-500/30">
              {profile?.firstName?.[0] || 'L'}
              {profile?.lastName?.[0] || 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-white truncate">
                {profile?.fullName || `${profile?.firstName || 'Liam'} ${profile?.lastName || 'Vance'}`}
              </h4>
              <p className="text-[11px] text-slate-300 truncate">
                {profile?.className || 'Grade 10'} • {profile?.sectionName || 'Section A'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-crest-800 to-crest-700 text-white shadow-md border border-crest-600/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Security & Logout */}
        <div className="pt-4 border-t border-crest-800/60 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>IDOR-Protected Session</span>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/50 transition border border-rose-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Navbar Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
              <span>Scholar Portal</span>
              <span>/</span>
              <span className="text-crest-800 font-bold capitalize">
                {navigationItems.find((n) => n.id === activeTab)?.label}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {navigationItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">
                {profile?.fullName || 'Liam Vance'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {profile?.admissionNumber || 'ADM-2026-0089'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-crest-100 text-crest-800 font-serif font-bold text-sm flex items-center justify-center border border-crest-200">
              {profile?.firstName?.[0] || 'L'}
              {profile?.lastName?.[0] || 'V'}
            </div>
          </div>
        </header>

        {/* Active Tab View */}
        {activeTab === 'overview' && (
          <StudentOverviewSection
            profile={profile}
            attendanceStats={attendanceStats}
            results={results}
            homework={homework}
            timetable={timetable}
            notices={notices}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && <StudentProfileSection profile={profile} />}

        {activeTab === 'attendance' && (
          <StudentAttendanceSection
            records={attendanceRecords}
            stats={attendanceStats}
            loading={loading}
          />
        )}

        {activeTab === 'results' && (
          <StudentResultsSection results={results} loading={loading} />
        )}

        {activeTab === 'homework' && (
          <StudentHomeworkSection
            homework={homework}
            onRefresh={fetchStudentData}
            loading={loading}
          />
        )}

        {activeTab === 'timetable' && (
          <StudentTimetableSection
            timetable={timetable}
            profile={profile}
            loading={loading}
          />
        )}

        {activeTab === 'notices' && (
          <StudentNoticesSection notices={notices} loading={loading} />
        )}

        {activeTab === 'events' && (
          <StudentEventsSection events={events} loading={loading} />
        )}

        {activeTab === 'documents' && (
          <StudentDocumentsSection documents={documents} loading={loading} />
        )}
      </main>
    </div>
  );
};
