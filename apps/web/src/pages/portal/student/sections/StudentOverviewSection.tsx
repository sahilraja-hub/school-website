import React from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  Bell,
  Download,
  AlertCircle,
} from 'lucide-react';
import { StudentPortalTab } from '../types';

interface StudentOverviewSectionProps {
  profile: any;
  attendanceStats: any;
  results: any[];
  homework: any[];
  timetable: any[];
  notices: any[];
  setActiveTab: (tab: StudentPortalTab) => void;
}

export const StudentOverviewSection: React.FC<StudentOverviewSectionProps> = ({
  profile,
  attendanceStats,
  results,
  homework,
  timetable,
  notices,
  setActiveTab,
}) => {
  const attendanceRate = attendanceStats?.attendanceRate ?? 95;
  const pendingHomeworkCount = homework.filter((h) => !h.submissionsCount || h.submissionsCount === 0).length;

  // Calculate average percentage from results if available
  const avgPercentage =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.percentage || (r.marksObtained / (r.maxMarks || 100)) * 100), 0) /
            results.length
        )
      : 94;

  const currentGrade = avgPercentage >= 90 ? 'A+' : avgPercentage >= 80 ? 'A' : avgPercentage >= 70 ? 'B' : 'C';

  // Get current day timetable slots (default to Monday or today)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const currentDaySlots = timetable.filter(
    (slot) => slot.dayOfWeek === todayName || slot.dayOfWeek === 'MONDAY' || slot.dayOfWeek === 'Monday'
  );

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-overview-section">
      {/* Scholar Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-crest-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">
                  {profile?.firstName?.[0] || 'L'}
                  {profile?.lastName?.[0] || 'V'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-gold-500/20 text-gold-400 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-gold-500/30 tracking-wide uppercase">
                  {profile?.className || 'Grade 10'} • {profile?.sectionName || 'Section A'}
                </span>
                <span className="text-xs text-slate-300 font-mono bg-white/10 px-2 py-0.5 rounded">
                  Adm #{profile?.admissionNumber || 'ADM-2026-0089'}
                </span>
                <span className="text-xs text-slate-300 font-mono bg-white/10 px-2 py-0.5 rounded">
                  Roll #{profile?.rollNumber || '10-A-01'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Welcome back, {profile?.firstName || 'Liam'} {profile?.lastName || 'Vance'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                R.B.S. Residential Public School • Scholar Portal Academic Session 2026–2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300 block">Term Average</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {avgPercentage}% <span className="text-gold-400 text-lg">({currentGrade})</span>
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">Homeroom</span>
              <span className="font-serif text-base sm:text-xl font-bold text-white">
                {profile?.roomNumber || 'Room 301'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Attendance Rate */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">
              {attendanceRate >= 90 ? 'Exemplary' : 'Good'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Present: {attendanceStats?.present ?? 42} days</span>
            <span className="text-crest-700 font-semibold group-hover:translate-x-1 transition flex items-center">
              View Log <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </p>
        </div>

        {/* Academic Performance */}
        <div
          onClick={() => setActiveTab('results')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
            <div className="w-10 h-10 rounded-xl bg-crest-50 text-crest-700 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgPercentage}%</span>
            <span className="text-xs font-bold text-crest-700 bg-crest-100 px-2 py-0.5 rounded">
              Grade {currentGrade}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Evaluated in {results.length || 1} Subjects</p>
          <p className="text-[11px] text-crest-700 font-semibold mt-2 flex items-center justify-end group-hover:translate-x-1 transition">
            View Gradebook <ArrowRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* Assignments Pending */}
        <div
          onClick={() => setActiveTab('homework')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Homework</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{homework.length || 1}</span>
            <span className="text-xs font-semibold text-amber-600">Assigned Tasks</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Section {profile?.sectionName || '10-A'} Coursework</p>
          <p className="text-[11px] text-crest-700 font-semibold mt-2 flex items-center justify-end group-hover:translate-x-1 transition">
            Submit Tasks <ArrowRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* Timetable / Classes Today */}
        <div
          onClick={() => setActiveTab('timetable')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Schedule</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {currentDaySlots.length > 0 ? currentDaySlots.length : 5}
            </span>
            <span className="text-xs font-semibold text-purple-700">Periods</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Scheduled for {todayName}</p>
          <p className="text-[11px] text-crest-700 font-semibold mt-2 flex items-center justify-end group-hover:translate-x-1 transition">
            View Schedule <ArrowRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>
      </div>

      {/* Main Overview Grid: Schedule & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-crest-700" />
                Today's Class Schedule ({todayName})
              </h2>
              <p className="text-xs text-slate-500">Enrolled timetable for {profile?.className || 'Grade 10'} • {profile?.sectionName || 'Section A'}</p>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-semibold text-crest-700 hover:text-crest-900 flex items-center gap-1"
            >
              Full Week <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {currentDaySlots.length > 0 ? (
              currentDaySlots.map((slot, idx) => (
                <div
                  key={slot.id || idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-crest-100 text-crest-800 font-bold text-xs flex items-center justify-center shrink-0">
                      P{slot.periodNumber || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{slot.subjectName || 'Advanced Mathematics'}</h4>
                      <p className="text-xs text-slate-500">
                        Instructor: {slot.teacherName || 'Dr. Evelyn Reed'} • Room: {slot.roomNumber || profile?.roomNumber || '301'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right sm:text-right shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                      {slot.startTime || '08:30 AM'} – {slot.endTime || '09:20 AM'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Default representative schedule
              [
                { period: 1, time: '08:30 AM – 09:20 AM', subject: 'Advanced Mathematics (MATH-101)', teacher: 'Dr. Evelyn Reed', room: 'Room 301' },
                { period: 2, time: '09:25 AM – 10:15 AM', subject: 'AP Physics C: Mechanics', teacher: 'Dr. Evelyn Reed', room: 'Lab 204' },
                { period: 3, time: '10:30 AM – 11:20 AM', subject: 'World Literature & Rhetoric', teacher: 'Mrs. Sarah Jenkins', room: 'Room 105' },
                { period: 4, time: '11:25 AM – 12:15 PM', subject: 'Computer Science & AI', teacher: 'Prof. Alan Vance', room: 'Innovation Hub 1' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-crest-100 text-crest-800 font-bold text-xs flex items-center justify-center shrink-0">
                      P{item.period}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.subject}</h4>
                      <p className="text-xs text-slate-500">Instructor: {item.teacher} • Room: {item.room}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
                    {item.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notices & Announcements Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-gold-600" />
                Latest Notices
              </h2>
              <p className="text-xs text-slate-500">Official campus bulletins</p>
            </div>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs font-semibold text-crest-700 hover:text-crest-900 flex items-center gap-1"
            >
              All Notices <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {notices.length > 0 ? (
              notices.slice(0, 3).map((notice, idx) => (
                <div
                  key={notice.id || idx}
                  onClick={() => setActiveTab('notices')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-gold-300 hover:bg-gold-50/20 transition cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crest-700 bg-crest-50 px-2 py-0.5 rounded">
                      {notice.category || 'ACADEMIC'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{notice.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{notice.content}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">
                No recent circulars found.
              </div>
            )}
          </div>

          {/* Quick Handbooks and Resources link */}
          <div
            onClick={() => setActiveTab('documents')}
            className="p-4 rounded-xl bg-gradient-to-r from-crest-900 to-slate-900 text-white flex items-center justify-between cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs">Student Handbook 2026</h4>
                <p className="text-[11px] text-slate-300">Official syllabus & conduct rules</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
