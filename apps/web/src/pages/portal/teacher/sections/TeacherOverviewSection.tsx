import React from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ClipboardCheck,
  FileText,
  Award,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface TeacherOverviewProps {
  profile: any;
  assignments: any[];
  studentsCount: number;
  homeworkCount: number;
  examsCount: number;
  timetable: any[];
  onNavigate: (tab: string) => void;
}

export const TeacherOverviewSection: React.FC<TeacherOverviewProps> = ({
  profile,
  assignments,
  studentsCount,
  homeworkCount,
  examsCount,
  timetable,
  onNavigate,
}) => {
  const teacherUser = profile?.user || {};
  const currentDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
    new Date().getDay()
  ];
  const todayClasses = timetable.filter(
    (t) => t.dayOfWeek?.toUpperCase() === currentDay || t.dayOfWeek?.toUpperCase() === 'MONDAY'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#0F1E36] to-[#142646] p-8 border border-white/10 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Faculty Portal • {profile?.department || 'Academic Faculty'}
            </div>
            <h1 className="text-3xl font-serif text-white font-bold tracking-tight">
              Welcome back, {teacherUser.firstName ? `${teacherUser.firstName} ${teacherUser.lastName}` : 'Dr. Sarah Jenkins'}
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm leading-relaxed">
              Faculty ID: <span className="font-mono text-amber-300 font-semibold">{profile?.employeeId || 'EMP-2024-001'}</span> • {profile?.qualification || 'Senior Faculty'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
            >
              <ClipboardCheck className="w-4 h-4" />
              Mark Attendance
            </button>
            <button
              onClick={() => onNavigate('homework')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition border border-white/15"
            >
              <FileText className="w-4 h-4" />
              Post Homework
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('classes')}
          className="bg-[#0B1528]/80 hover:bg-[#0B1528] transition border border-white/10 rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Classes</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-white">{assignments.length || 2}</span>
            <span className="text-xs text-blue-400">cohorts</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Grade 10-A, 10-B</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition transform group-hover:translate-x-1" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('students')}
          className="bg-[#0B1528]/80 hover:bg-[#0B1528] transition border border-white/10 rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-white">{studentsCount || 42}</span>
            <span className="text-xs text-emerald-400">enrolled</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>98.2% avg attendance</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-1" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('homework')}
          className="bg-[#0B1528]/80 hover:bg-[#0B1528] transition border border-white/10 rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Homework</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-white">{homeworkCount || 4}</span>
            <span className="text-xs text-amber-400">published</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>2 due this week</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition transform group-hover:translate-x-1" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('results')}
          className="bg-[#0B1528]/80 hover:bg-[#0B1528] transition border border-white/10 rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Exams & Results</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-white">{examsCount || 2}</span>
            <span className="text-xs text-purple-400">scheduled</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Mid-Terms 2026</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>

      {/* Schedule Today & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Today's Teaching Schedule</h3>
                <p className="text-xs text-slate-400">{todayClasses.length} lecture periods scheduled</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition flex items-center gap-1"
            >
              Full Timetable
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-xs font-mono font-bold text-amber-400 block">{item.startTime || '08:30'}</span>
                      <span className="text-[10px] text-slate-400 block">{item.endTime || '09:25'}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.subjectName || 'Advanced Mathematics'}</h4>
                      <p className="text-xs text-slate-400">
                        {item.sectionName || 'Section 10-A'} • {item.roomNumber || 'Room 301'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Confirmed
                    </span>
                    <button
                      onClick={() => onNavigate('attendance')}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No classes scheduled for today. Enjoy your preparation time!
              </div>
            )}
          </div>
        </div>

        {/* Quick Notices & Faculty Bulletins */}
        <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Faculty Circulars</h3>
                  <p className="text-xs text-slate-400">Recent campus notices</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('notices')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-xs text-amber-400 font-medium mb-1">
                  <span>Academic Advisory</span>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Mid-Term Grade Submission Deadline</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  All faculty members are requested to complete exam result entry by Friday 17:00 EST.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-xs text-blue-400 font-medium mb-1">
                  <span>Faculty Senate</span>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Monthly Faculty Development Workshop</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Session on advanced STEM laboratory simulations in the West Amphitheater.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Need administrative support?</span>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Faculty Helpdesk →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
