import React from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  BookOpen,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { LinkedChild, ParentProfile, FeeInvoice, ParentPortalTab } from '../types';

interface ParentOverviewSectionProps {
  parent: ParentProfile | null;
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  attendanceStats: any;
  results: any[];
  homework: any[];
  invoices: FeeInvoice[];
  onNavigateTab: (tab: ParentPortalTab) => void;
  onOpenPayModal?: (invoice?: FeeInvoice) => void;
}

export const ParentOverviewSection: React.FC<ParentOverviewSectionProps> = ({
  parent,
  childrenList,
  selectedChild,
  onSelectChild,
  attendanceStats,
  results,
  homework,
  invoices,
  onNavigateTab,
  onOpenPayModal,
}) => {
  // Compute overall invoice stats
  const totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
  const pendingHomeworkCount = homework.filter(
    (hw) => !hw.submissions || hw.submissions.length === 0
  ).length;

  const attendanceRate = attendanceStats?.attendanceRate ?? 96;
  const recentResults = results.slice(0, 3);

  return (
    <div className="space-y-8" data-testid="parent-overview-section">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Guardian & Family Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Academic Year 2026–2027</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome, {parent?.fullName || 'Parent'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Guardian of <span className="font-semibold text-slate-700">{childrenList.map((c) => c.firstName).join(' & ') || 'your student'}</span>. Real-time academic tracking, attendance, and administrative services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalBalance === 0 ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Tuition Dues Cleared</span>
            </span>
          ) : (
            <button
              onClick={() => onOpenPayModal ? onOpenPayModal(invoices.find((i) => i.balance > 0)) : onNavigateTab('fees')}
              className="bg-amber-500 hover:bg-amber-600 text-crest-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Outstanding: ${totalBalance.toLocaleString()} — Pay Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Multiple Children Switcher Bar */}
      {childrenList.length > 1 && (
        <div className="bg-crest-950/5 border border-crest-900/10 rounded-2xl p-4 sm:p-5" data-testid="child-switcher-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-crest-700" />
              <h3 className="font-serif font-bold text-sm text-slate-900">
                Linked Scholars ({childrenList.length} Children)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Click to switch active profile</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {childrenList.map((child) => {
              const isSelected = selectedChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  data-testid={`child-select-btn-${child.id}`}
                  className={`text-left p-3.5 rounded-xl transition-all border flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-crest-900 to-slate-900 text-white border-crest-700 shadow-md ring-2 ring-gold-400/50'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-crest-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                        : 'bg-crest-100 text-crest-900'
                    }`}
                  >
                    {child.firstName[0]}
                    {child.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {child.fullName}
                      </p>
                      {isSelected && (
                        <span className="text-[10px] bg-gold-400/20 text-gold-300 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {child.className} • {child.sectionName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked Student Hero Card */}
      {selectedChild && (
        <div className="bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-crest-800/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-crest-950 flex items-center justify-center font-serif font-bold text-gold-400 text-xl">
                {selectedChild.firstName[0]}
                {selectedChild.lastName[0]}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                  Active Scholar
                </span>
                <span className="text-xs text-slate-300">Roll: {selectedChild.rollNumber || '10-A-01'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1" data-testid="selected-child-name">
                {selectedChild.fullName}
              </h2>
              <p className="text-xs text-slate-300">
                {selectedChild.className} • {selectedChild.sectionName} • Admission: {selectedChild.admissionNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 text-xs w-full md:w-auto justify-around md:justify-start">
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Attendance</span>
              <span className="font-serif text-xl font-bold text-emerald-400">{attendanceRate}%</span>
            </div>
            <div className="h-7 w-px bg-white/20 hidden sm:block" />
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Assignments</span>
              <span className="font-serif text-xl font-bold text-gold-400">
                {homework.length} Active
              </span>
            </div>
            <div className="h-7 w-px bg-white/20 hidden sm:block" />
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Tuition Balance</span>
              <span className={`font-serif text-xl font-bold ${totalBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ${totalBalance}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance KPI */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-crest-300 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-crest-600 flex items-center gap-1 font-semibold transition">
              Details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Term Attendance</span>
          <h4 className="font-serif text-2xl font-bold text-slate-900 mt-1">{attendanceRate}%</h4>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Excellent punctuality record
          </p>
        </div>

        {/* Academic Results KPI */}
        <div
          onClick={() => onNavigateTab('results')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-crest-300 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-crest-600 flex items-center gap-1 font-semibold transition">
              Gradebook <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Evaluations Recorded</span>
          <h4 className="font-serif text-2xl font-bold text-slate-900 mt-1">{results.length} Exams</h4>
          <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> High Academic Standing
          </p>
        </div>

        {/* Coursework & Homework KPI */}
        <div
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-crest-300 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-crest-600 flex items-center gap-1 font-semibold transition">
              Tasks <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Assigned Coursework</span>
          <h4 className="font-serif text-2xl font-bold text-slate-900 mt-1">{homework.length} Tasks</h4>
          <p className="text-[11px] text-indigo-700 font-medium mt-1">
            {pendingHomeworkCount} awaiting final submission
          </p>
        </div>

        {/* Fees Information KPI */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-crest-300 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-crest-50 text-crest-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-crest-600 flex items-center gap-1 font-semibold transition">
              Invoices <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Tuition & Fees</span>
          <h4 className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {totalBalance === 0 ? 'Settled' : `$${totalBalance.toLocaleString()}`}
          </h4>
          <p className={`text-[11px] font-medium mt-1 ${totalBalance === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {totalBalance === 0 ? 'No outstanding dues' : 'Action required on invoice'}
          </p>
        </div>
      </div>

      {/* Two Column Grid: Conferences & Recent Evaluations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Parent-Teacher Academic Conferences */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-crest-700" />
              <span>Parent-Teacher Academic Conferences</span>
            </h3>
            <span className="text-[11px] bg-crest-50 text-crest-700 px-2 py-0.5 rounded font-semibold">
              Upcoming
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Fall Mid-Term Progress Review</span>
              <span className="text-crest-700">Oct 15, 2026</span>
            </div>
            <p className="text-slate-600 text-xs">
              Scheduled consultation with homeroom faculty and subject mentors regarding curriculum pacing and co-curricular involvement.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Time: 3:30 PM – 4:15 PM (Conference Hall B / Hybrid Zoom)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Assigned Faculty Mentors</h4>
            <div className="flex items-center justify-between text-xs p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <div>
                <span className="font-bold text-slate-900 block">Dr. Robert Chen</span>
                <span className="text-slate-500">AP Mathematics & Homeroom Advisor</span>
              </div>
              <a
                href="mailto:teacher@oakridge.edu"
                className="flex items-center gap-1 text-crest-700 font-semibold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> Message
              </a>
            </div>

            <div className="flex items-center justify-between text-xs p-3 border border-slate-100 rounded-lg bg-slate-50/50">
              <div>
                <span className="font-bold text-slate-900 block">Sarah Jenkins</span>
                <span className="text-slate-500">Department Head - World Literature</span>
              </div>
              <a
                href="mailto:teacher@oakridge.edu"
                className="flex items-center gap-1 text-crest-700 font-semibold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> Message
              </a>
            </div>
          </div>
        </div>

        {/* Recent Evaluations Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Recent Evaluations for {selectedChild?.firstName || 'Scholar'}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('results')}
              className="text-xs text-crest-700 hover:text-crest-900 font-semibold flex items-center gap-1"
            >
              All Grades <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {recentResults.length > 0 ? (
              recentResults.map((r, idx) => (
                <div key={r.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">{r.subjectName}</h4>
                    <span className="text-slate-500 text-[11px]">{r.examName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">{r.percentage}% ({r.grade})</span>
                    <span className="text-[10px] text-slate-400 block">{r.marksObtained}/{r.maxMarks} pts</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">
                No recent evaluations recorded for this semester yet.
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigateTab('timetable')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-crest-700" /> View Timetable
            </button>
            <button
              onClick={() => onNavigateTab('documents')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-crest-700" /> Handbooks & Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
