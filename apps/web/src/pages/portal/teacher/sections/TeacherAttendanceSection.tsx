import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Save,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface AttendanceRecordState {
  studentId: string;
  studentName: string;
  rollNumber: string;
  admissionNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes: string;
}

interface TeacherAttendanceProps {
  assignments: any[];
  students: any[];
  preselectedClassId?: string;
  preselectedSectionId?: string;
}

export const TeacherAttendanceSection: React.FC<TeacherAttendanceProps> = ({
  assignments,
  students,
  preselectedClassId,
  preselectedSectionId,
}) => {
  // Available classes from assignments
  const classesMap = new Map<string, string>();
  assignments.forEach((a) => {
    if (a.classId) {
      classesMap.set(a.classId, a.className || 'Grade 10');
    }
  });
  const availableClasses = Array.from(classesMap.entries()).map(([id, name]) => ({ id, name }));

  const defaultClassId = preselectedClassId || availableClasses[0]?.id || 'cls-10';
  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId);

  // Filter sections belonging to selected class and assigned to this teacher
  const availableSections = assignments
    .filter((a) => !selectedClassId || a.classId === selectedClassId)
    .map((a) => ({ id: a.sectionId, name: a.sectionName || 'Section A', room: a.roomNumber }));

  const defaultSectionId =
    preselectedSectionId || availableSections[0]?.id || 'sec-10a';
  const [selectedSectionId, setSelectedSectionId] = useState<string>(defaultSectionId);

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<AttendanceRecordState[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or fetch roster when section or date changes
  useEffect(() => {
    if (!selectedSectionId) return;

    // Filter students belonging to this section
    const sectionStudents = students.filter((s) => s.sectionId === selectedSectionId);

    // If section students exist, use them; otherwise provide default realistic students for section
    if (sectionStudents.length > 0) {
      setRoster(
        sectionStudents.map((st, idx) => ({
          studentId: st.id,
          studentName: st.user ? `${st.user.firstName} ${st.user.lastName}` : `Student ${idx + 1}`,
          rollNumber: st.rollNumber || `10-A-${(idx + 1).toString().padStart(2, '0')}`,
          admissionNumber: st.admissionNumber || `ADM-2026-${(idx + 100).toString()}`,
          status: 'PRESENT',
          notes: '',
        }))
      );
    } else {
      // Fallback sample roster for the chosen section
      setRoster([
        {
          studentId: 'stud-001',
          studentName: 'Liam Vance',
          rollNumber: '10-A-01',
          admissionNumber: 'ADM-2026-0089',
          status: 'PRESENT',
          notes: '',
        },
        {
          studentId: 'stud-002',
          studentName: 'Emma Watson',
          rollNumber: '10-A-02',
          admissionNumber: 'ADM-2026-0090',
          status: 'PRESENT',
          notes: '',
        },
        {
          studentId: 'stud-003',
          studentName: 'Noah Clark',
          rollNumber: '10-A-03',
          admissionNumber: 'ADM-2026-0091',
          status: 'LATE',
          notes: 'Bus delay',
        },
        {
          studentId: 'stud-004',
          studentName: 'Sophia Miller',
          rollNumber: '10-A-04',
          admissionNumber: 'ADM-2026-0092',
          status: 'PRESENT',
          notes: '',
        },
      ]);
    }
  }, [selectedSectionId, students]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setRoster((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item))
    );
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setRoster((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, notes } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'PRESENT' })));
  };

  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        date,
        records: roster.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          notes: r.notes || undefined,
        })),
      };

      const res = await api.post('/attendance/batch', payload);

      if (res.data.success) {
        setSuccessMessage(
          `Attendance register for ${date} successfully recorded (${roster.length} students).`
        );
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('Attendance recording error:', err);
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Authorization error: You are not authorized to modify attendance for this class or section.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const lateCount = roster.filter((r) => r.status === 'LATE').length;
  const attendanceRate = roster.length > 0 ? Math.round((presentCount / roster.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header and Class/Section Selection */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Register Session
            </div>
            <h2 className="text-xl font-serif font-bold text-white">Daily Attendance Register</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your assigned class and section to record roll call. Unauthorized classes are restricted by RBAC.
            </p>
          </div>

          {/* Quick Mark All Present */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark All Present
            </button>
          </div>
        </div>

        {/* Filters Row: Class, Section, Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
            >
              {availableClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Section
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
            >
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.room || 'Room 301'})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-3 animate-shake">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Roster & Attendance Marking Table */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {/* Attendance Summary Bar */}
        <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <span className="text-slate-300 font-medium">
              Total Enrolled: <strong className="text-white">{roster.length}</strong>
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="text-rose-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Absent: <strong>{absentCount}</strong>
            </span>
            <span className="text-amber-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Late: <strong>{lateCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Attendance Rate:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{attendanceRate}%</span>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Mark Status</th>
                <th className="py-3 px-4">Notes / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {roster.map((student) => (
                <tr key={student.studentId} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-amber-300">
                    {student.rollNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{student.studentName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{student.admissionNumber}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex rounded-xl p-1 bg-black/40 border border-white/10 gap-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                          student.status === 'PRESENT'
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                          student.status === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <XCircle className="w-3 h-3" />
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.studentId, 'LATE')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                          student.status === 'LATE'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        Late
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      placeholder="Optional remarks (e.g. Excused, tardy 10m)..."
                      value={student.notes}
                      onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                      className="w-full max-w-xs px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Submit Button */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Records will be committed to the institutional attendance ledger.
          </span>
          <button
            onClick={handleSaveAttendance}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Recording Register...' : 'Save & Publish Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};
