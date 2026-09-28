import React from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  CreditCard,
  ClipboardList,
  CheckCircle2,
  Calendar,
  Bell,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AdminSection } from '../types';

interface OverviewSectionProps {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    totalClasses: number;
    pendingAdmissions: number;
    attendanceRate: number;
    totalRevenue: number;
    systemStatus: string;
    currentTerm: string;
  };
  recentAdmissions: any[];
  recentNotices: any[];
  upcomingEvents: any[];
  recentActivities: any[];
  onNavigateSection: (section: AdminSection) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  stats,
  recentAdmissions,
  recentNotices,
  upcomingEvents,
  recentActivities,
  onNavigateSection,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 p-6 text-white shadow-xl border border-navy-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Institutional Executive Overview</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              Oakridge Command Center
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Active Term: <strong className="text-white">{stats.currentTerm}</strong> | System Health:{' '}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {stats.systemStatus}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateSection('students')}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-gold-500 px-3.5 py-2 text-xs font-semibold text-navy-950 shadow-md hover:bg-gold-400 transition"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Enroll Student</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateSection('admissions')}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-3.5 py-2 text-xs font-medium text-slate-200 border border-navy-700 hover:bg-navy-700 transition"
            >
              <ClipboardList className="h-4 w-4 text-gold-400" />
              <span>Review Admissions ({stats.pendingAdmissions})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigateSection('students')}
          className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Total Scholars
            </span>
            <div className="rounded-lg bg-navy-50 p-2 text-navy-800 group-hover:bg-navy-800 group-hover:text-white transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-slate-900">
              {stats.totalStudents.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-3xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="mr-0.5 h-3 w-3" /> +12% YoY
            </span>
          </div>
        </div>

        {/* Total Faculty */}
        <div
          onClick={() => onNavigateSection('teachers')}
          className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Faculty & Staff
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-slate-900">
              {stats.totalTeachers}
            </span>
            <span className="text-3xs text-slate-500">Ratio 1:8</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => onNavigateSection('attendance')}
          className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Daily Attendance
            </span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition-colors">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-slate-900">
              {stats.attendanceRate}%
            </span>
            <span className="text-3xs text-emerald-600 font-medium">Optimal</span>
          </div>
        </div>

        {/* Tuition Revenue */}
        <div
          onClick={() => onNavigateSection('fees')}
          className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Fee Collections
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-slate-900">
              ${stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-3xs text-slate-500">Term total</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Admissions & Attendance Breakdown */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Admissions Queue */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Admission Inquiries</h3>
                <p className="text-3xs text-slate-500">Prospective applicants awaiting evaluation</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateSection('admissions')}
                className="text-xs font-semibold text-navy-800 hover:text-gold-600 inline-flex items-center"
              >
                <span>View Pipeline</span>
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-3xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">App #</th>
                    <th className="py-2.5 px-3">Applicant</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAdmissions.slice(0, 4).map((app) => (
                    <tr key={app.id || app.applicationNumber} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {app.applicationNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {app.applicantFullName || `${app.studentFirstName || ''} ${app.studentLastName || ''}`.trim() || 'Applicant'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {app.gradeApplyingFor?.replace('GRADE_', 'Grade ')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold ${
                            app.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'UNDER_REVIEW'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {app.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigateSection('admissions')}
                          className="text-xs font-semibold text-navy-800 hover:text-gold-600"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Attendance Progress */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Attendance Summary</h3>
                <p className="text-3xs text-slate-500">Live attendance across divisions</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateSection('attendance')}
                className="text-xs font-semibold text-navy-800 hover:text-gold-600 inline-flex items-center"
              >
                <span>Full Register</span>
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Senior High School (Grades 9-12)</span>
                  <span className="font-bold text-emerald-700">96.8% Present</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '96.8%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Middle School (Grades 6-8)</span>
                  <span className="font-bold text-emerald-700">94.2% Present</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '94.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Primary Academy (Grades 1-5)</span>
                  <span className="font-bold text-emerald-700">95.5% Present</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '95.5%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Bulletins, Events, & Recent Activity */}
        <div className="space-y-6">
          {/* Recent Bulletins / Notices */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Bell className="h-4 w-4 mr-1.5 text-gold-500" />
                <span>Recent Bulletins</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateSection('notices')}
                className="text-3xs font-semibold text-navy-800 hover:text-gold-600"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {recentNotices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 hover:border-slate-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-navy-100 px-1.5 py-0.5 text-3xs font-semibold text-navy-800">
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="text-3xs font-bold text-amber-600">★ Pinned</span>
                    )}
                  </div>
                  <h4 className="mt-1 text-xs font-semibold text-slate-900 line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-3xs text-slate-500 line-clamp-2 mt-0.5">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-navy-800" />
                <span>Upcoming Calendar</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateSection('events')}
                className="text-3xs font-semibold text-navy-800 hover:text-gold-600"
              >
                Calendar
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 rounded-lg border border-slate-100 p-2.5 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-navy-800 text-white">
                    <span className="text-3xs uppercase font-bold text-gold-400">
                      {new Date(event.startDate || Date.now()).toLocaleString('default', {
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs font-extrabold leading-none">
                      {new Date(event.startDate || Date.now()).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{event.title}</h4>
                    <p className="text-3xs text-slate-500 truncate">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Trail Activity */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-slate-500" />
                <span>Security & Audit Stream</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateSection('audit-logs')}
                className="text-3xs font-semibold text-navy-800 hover:text-gold-600"
              >
                Logs
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {recentActivities.slice(0, 3).map((act, i) => (
                <div key={i} className="flex items-start space-x-2 text-slate-600 text-3xs">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <div className="truncate">
                    <strong className="text-slate-800 font-semibold">{act.action}</strong> on{' '}
                    <span>{act.resource}</span> by {act.userName || 'Admin'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
