import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Award,
  Calendar,
  Bell,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

// Subsections
import { TeacherOverviewSection } from './teacher/sections/TeacherOverviewSection';
import { TeacherProfileSection } from './teacher/sections/TeacherProfileSection';
import { TeacherClassesSection } from './teacher/sections/TeacherClassesSection';
import { TeacherSubjectsSection } from './teacher/sections/TeacherSubjectsSection';
import { TeacherStudentsSection } from './teacher/sections/TeacherStudentsSection';
import { TeacherAttendanceSection } from './teacher/sections/TeacherAttendanceSection';
import { TeacherHomeworkSection } from './teacher/sections/TeacherHomeworkSection';
import { TeacherExamsSection } from './teacher/sections/TeacherExamsSection';
import { TeacherResultsSection } from './teacher/sections/TeacherResultsSection';
import { TeacherTimetableSection } from './teacher/sections/TeacherTimetableSection';
import { TeacherNoticesSection } from './teacher/sections/TeacherNoticesSection';

export type TeacherPortalTab =
  | 'overview'
  | 'profile'
  | 'classes'
  | 'subjects'
  | 'students'
  | 'attendance'
  | 'homework'
  | 'exams'
  | 'results'
  | 'timetable'
  | 'notices';

export const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TeacherPortalTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data
  const [profile, setProfile] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cross-section navigation state
  const [attendancePreselect, setAttendancePreselect] = useState<{ classId?: string; sectionId?: string }>({});
  const [studentSectionFilter, setStudentSectionFilter] = useState<string>('');
  const [homeworkSubjectPreselect, setHomeworkSubjectPreselect] = useState<string>('');
  const [resultsExamPreselect, setResultsExamPreselect] = useState<string>('');

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      // 1. Fetch current teacher profile & assignments
      const profRes = await api.get('/teachers/me');
      if (profRes.data.success && profRes.data.data) {
        setProfile(profRes.data.data);
        if (profRes.data.data.assignments) {
          setAssignments(profRes.data.data.assignments);
        }
      }
    } catch {
      // Realistic fallback for dev/offline
      setProfile({
        id: 'teach-001',
        employeeId: 'EMP-2024-001',
        qualification: 'M.Sc. Pure Mathematics, Oxford',
        specialization: 'Advanced Calculus & Mathematical Physics',
        department: 'Mathematics',
        joiningDate: '2021-08-01',
        status: 'ACTIVE',
        user: {
          firstName: user?.firstName || 'Dr. Sarah',
          lastName: user?.lastName || 'Jenkins',
          email: user?.email || 'teacher@oakridge.edu',
          role: 'TEACHER',
        },
      });

      setAssignments([
        {
          id: 'ta-1',
          teacherId: 'teach-001',
          classId: 'cls-10',
          className: 'Grade 10',
          gradeLevel: 'GRADE_10',
          sectionId: 'sec-10a',
          sectionName: 'Section A',
          roomNumber: 'Room 301',
          subjectId: 'sub-math',
          subjectName: 'Advanced Mathematics',
          subjectCode: 'MATH-101',
          academicYear: '2026-2027',
          isPrimaryTeacher: true,
        },
        {
          id: 'ta-2',
          teacherId: 'teach-001',
          classId: 'cls-10',
          className: 'Grade 10',
          gradeLevel: 'GRADE_10',
          sectionId: 'sec-10b',
          sectionName: 'Section B',
          roomNumber: 'Room 302',
          subjectId: 'sub-math',
          subjectName: 'Advanced Mathematics',
          subjectCode: 'MATH-101',
          academicYear: '2026-2027',
          isPrimaryTeacher: false,
        },
      ]);
    }

    try {
      // 2. Fetch students for teacher's classes
      const studRes = await api.get('/students?limit=50');
      if (studRes.data.success) {
        setStudents(studRes.data.data);
      }
    } catch {
      setStudents([
        {
          id: 'stud-001',
          admissionNumber: 'ADM-2026-0089',
          rollNumber: '10-A-01',
          classId: 'cls-10',
          sectionId: 'sec-10a',
          status: 'ACTIVE',
          emergencyContact: '+1-555-9999',
          gender: 'MALE',
          bloodGroup: 'O+',
          dateOfBirth: '2010-04-12',
          admissionDate: '2024-06-01',
          user: { firstName: 'Liam', lastName: 'Vance', email: 'liam.vance@oakridge.edu' },
        },
        {
          id: 'stud-002',
          admissionNumber: 'ADM-2026-0090',
          rollNumber: '10-A-02',
          classId: 'cls-10',
          sectionId: 'sec-10a',
          status: 'ACTIVE',
          emergencyContact: '+1-555-8888',
          gender: 'FEMALE',
          bloodGroup: 'A+',
          dateOfBirth: '2010-06-18',
          admissionDate: '2024-06-01',
          user: { firstName: 'Emma', lastName: 'Watson', email: 'emma.watson@oakridge.edu' },
        },
        {
          id: 'stud-003',
          admissionNumber: 'ADM-2026-0091',
          rollNumber: '10-B-01',
          classId: 'cls-10',
          sectionId: 'sec-10b',
          status: 'ACTIVE',
          emergencyContact: '+1-555-7777',
          gender: 'MALE',
          bloodGroup: 'B+',
          dateOfBirth: '2010-09-02',
          admissionDate: '2024-06-01',
          user: { firstName: 'Noah', lastName: 'Clark', email: 'noah.clark@oakridge.edu' },
        },
      ]);
    }

    try {
      // 3. Fetch timetable
      const ttRes = await api.get('/timetable');
      if (ttRes.data.success) {
        setTimetable(ttRes.data.data);
      }
    } catch {
      setTimetable([
        {
          id: 'tt-1',
          dayOfWeek: 'MONDAY',
          startTime: '08:30',
          endTime: '09:25',
          sectionName: 'Grade 10-A',
          subjectName: 'Advanced Mathematics',
          subjectCode: 'MATH-101',
          roomNumber: 'Room 301',
        },
        {
          id: 'tt-2',
          dayOfWeek: 'MONDAY',
          startTime: '10:30',
          endTime: '11:25',
          sectionName: 'Grade 10-B',
          subjectName: 'Advanced Mathematics',
          subjectCode: 'MATH-101',
          roomNumber: 'Room 302',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Faculty Profile', icon: User },
    { id: 'classes', label: 'Assigned Classes', icon: Users, badge: assignments.length },
    { id: 'subjects', label: 'Assigned Subjects', icon: BookOpen },
    { id: 'students', label: 'Students Roster', icon: Users },
    { id: 'attendance', label: 'Attendance Register', icon: ClipboardCheck },
    { id: 'homework', label: 'Homework & Tasks', icon: FileText },
    { id: 'exams', label: 'Examinations', icon: Award },
    { id: 'results', label: 'Results & Gradebook', icon: Award },
    { id: 'timetable', label: 'Teaching Schedule', icon: Calendar },
    { id: 'notices', label: 'Circulars & Notices', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#060D1A] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0B1528] border-r border-white/10 shrink-0 select-none">
        {/* Portal Branding */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-bold text-lg shadow-lg shadow-amber-500/20">
              R
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base tracking-wide block">
                R.B.S Public School
              </span>
              <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase block">
                Faculty Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-serif">
            {profile?.user?.firstName ? profile.user.firstName.charAt(0) : 'S'}
          </div>
          <div className="overflow-hidden">
            <span className="text-sm font-semibold text-white truncate block">
              {profile?.user?.firstName
                ? `${profile.user.firstName} ${profile.user.lastName}`
                : 'Dr. Sarah Jenkins'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono block">
              {profile?.employeeId || 'EMP-2024-001'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TeacherPortalTab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B1528] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-serif font-bold text-sm">
            O
          </div>
          <span className="font-serif font-bold text-white text-sm">Faculty Portal</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/5"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B1528] border-b border-white/10 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TeacherPortalTab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 pt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0B1528]/80 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-serif font-bold text-white capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Verified Instructor
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden md:inline font-mono">Academic Year 2026-2027</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        </header>

        {/* Section View Container */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <TeacherOverviewSection
              profile={profile}
              assignments={assignments}
              studentsCount={students.length}
              homeworkCount={4}
              examsCount={2}
              timetable={timetable}
              onNavigate={(tab) => setActiveTab(tab as TeacherPortalTab)}
            />
          )}

          {activeTab === 'profile' && (
            <TeacherProfileSection
              profile={profile}
              assignments={assignments}
              onRefresh={fetchTeacherData}
            />
          )}

          {activeTab === 'classes' && (
            <TeacherClassesSection
              assignments={assignments}
              onSelectClassForAttendance={(classId, sectionId) => {
                setAttendancePreselect({ classId, sectionId });
                setActiveTab('attendance');
              }}
              onSelectClassForStudents={(sectionId) => {
                setStudentSectionFilter(sectionId);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'subjects' && (
            <TeacherSubjectsSection
              assignments={assignments}
              onNavigateToHomework={(subjectId) => {
                setHomeworkSubjectPreselect(subjectId);
                setActiveTab('homework');
              }}
              onNavigateToResults={(subjectId) => {
                setActiveTab('results');
              }}
            />
          )}

          {activeTab === 'students' && (
            <TeacherStudentsSection
              students={students}
              assignments={assignments}
              selectedSectionFilter={studentSectionFilter}
              onFilterChange={(secId) => setStudentSectionFilter(secId)}
            />
          )}

          {activeTab === 'attendance' && (
            <TeacherAttendanceSection
              assignments={assignments}
              students={students}
              preselectedClassId={attendancePreselect.classId}
              preselectedSectionId={attendancePreselect.sectionId}
            />
          )}

          {activeTab === 'homework' && (
            <TeacherHomeworkSection
              assignments={assignments}
              preselectedSubjectId={homeworkSubjectPreselect}
            />
          )}

          {activeTab === 'exams' && (
            <TeacherExamsSection
              assignments={assignments}
              onNavigateToResults={(examId) => {
                setResultsExamPreselect(examId);
                setActiveTab('results');
              }}
            />
          )}

          {activeTab === 'results' && (
            <TeacherResultsSection
              assignments={assignments}
              students={students}
              preselectedExamId={resultsExamPreselect}
            />
          )}

          {activeTab === 'timetable' && (
            <TeacherTimetableSection timetable={timetable} />
          )}

          {activeTab === 'notices' && <TeacherNoticesSection />}
        </div>
      </main>
    </div>
  );
};
export default TeacherDashboard;
