import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Filter,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface StudentAttendanceSectionProps {
  records: any[];
  stats: any;
  loading?: boolean;
}

export const StudentAttendanceSection: React.FC<StudentAttendanceSectionProps> = ({
  records,
  stats,
  loading,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const attendanceRate = stats?.attendanceRate ?? 96;
  const totalDays = stats?.totalDays ?? (records.length || 45);
  const presentCount = stats?.present ?? (records.filter((r) => r.status === 'PRESENT').length || 43);
  const lateCount = stats?.late ?? (records.filter((r) => r.status === 'LATE').length || 1);
  const absentCount = stats?.absent ?? (records.filter((r) => r.status === 'ABSENT').length || 1);

  // Filter records
  const filtered = records.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-attendance-section">
      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {attendanceRate >= 90 ? 'Exemplary' : 'Good Standing'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Present</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              P
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{presentCount}</span>
            <span className="text-xs text-slate-500">/ {totalDays} days</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium">95.5% on-time attendance</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tardy / Late</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{lateCount}</span>
            <span className="text-xs text-amber-600 font-medium">Recorded tardy</span>
          </div>
          <p className="text-xs text-slate-500">Within permissible grace window</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unexcused / Absent</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{absentCount}</span>
            <span className="text-xs text-rose-600 font-medium">Recorded absence</span>
          </div>
          <p className="text-xs text-slate-500">Approved medical leave</p>
        </div>
      </div>

      {/* Institutional Policy Banner */}
      <div className="bg-crest-50/70 border border-crest-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-crest-800 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-crest-950">Minimum Institutional Attendance Criterion: 85%</h4>
            <p className="text-xs text-crest-800">
              Students maintaining &ge;90% attendance qualify for Dean’s List academic citations and varsity eligibility.
            </p>
          </div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-crest-200 text-xs font-bold text-crest-900 shrink-0">
          Your Standing: {attendanceRate}%
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-crest-700" />
              Daily Attendance Register
            </h3>
            <p className="text-xs text-slate-500">Official log of class attendance verified by faculty</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  statusFilter === status
                    ? 'bg-crest-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Section / Class</th>
                <th className="py-3 px-6">Faculty Notes & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((record, idx) => {
                  const dateStr = record.date ? new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }) : `2026-10-${String(idx + 1).padStart(2, '0')}`;

                  return (
                    <tr key={record.id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{dateStr}</td>
                      <td className="py-3.5 px-6">
                        {record.status === 'PRESENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            PRESENT
                          </span>
                        )}
                        {record.status === 'LATE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            LATE
                          </span>
                        )}
                        {record.status === 'ABSENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            ABSENT
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">
                        {record.sectionName || record.sectionId || 'Section 10-A'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 italic">
                        {record.notes || record.remarks || 'Recorded by class teacher'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No attendance records found matching "{statusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
