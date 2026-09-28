import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Filter, CheckCircle2, XCircle, Clock, Save, X } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { AttendanceDto } from '@school/shared';

export const AttendanceSection: React.FC = () => {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sectionId, setSectionId] = useState('sec-10a');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Batch marking state
  const [studentsRoster, setStudentsRoster] = useState([
    { studentId: 'stud-001', name: 'Liam Vance', rollNumber: '10-A-01', status: 'PRESENT' },
    { studentId: 'stud-002', name: 'Sophia Chen', rollNumber: '10-A-02', status: 'PRESENT' },
    { studentId: 'stud-003', name: 'Alexander Hayes', rollNumber: '10-A-03', status: 'ABSENT' },
  ]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/attendance', {
        params: { date, sectionId },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setAttendanceLogs(res.data.data);
      }
    } catch (err) {
      setError(err);
      setAttendanceLogs([
        { id: 'att-1', studentId: 'stud-001', studentName: 'Liam Vance', rollNumber: '10-A-01', sectionId: 'sec-10a', date, status: 'PRESENT' },
        { id: 'att-2', studentId: 'stud-002', studentName: 'Sophia Chen', rollNumber: '10-A-02', sectionId: 'sec-10a', date, status: 'PRESENT' },
        { id: 'att-3', studentId: 'stud-003', studentName: 'Alexander Hayes', rollNumber: '10-A-03', sectionId: 'sec-10a', date, status: 'ABSENT' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date, sectionId]);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudentsRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveBatch = async () => {
    setError(null);
    try {
      await api.post('/attendance/batch', {
        sectionId,
        date,
        records: studentsRoster.map((s) => ({
          studentId: s.studentId,
          status: s.status,
          remarks: 'Daily Homeroom Attendance',
        })),
      });
      setActionSuccess('Attendance register saved successfully.');
      fetchAttendance();
    } catch (err) {
      setError(err);
    }
  };

  const presentCount = studentsRoster.filter((s) => s.status === 'PRESENT').length;
  const absentCount = studentsRoster.filter((s) => s.status === 'ABSENT').length;
  const attendanceRate = Math.round((presentCount / (studentsRoster.length || 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <CheckSquare className="mr-2 h-6 w-6 text-gold-500" />
            <span>Campus Daily Attendance Register</span>
          </h2>
          <p className="text-xs text-slate-500">Record, verify, and monitor daily scholar presence.</p>
        </div>
        <button
          type="button"
          onClick={handleSaveBatch}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Save className="h-4 w-4 text-gold-400" />
          <span>Save Register</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Date & Section Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Calendar className="h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border px-3 py-1.5 text-xs"
          />
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="rounded-lg border px-3 py-1.5 text-xs bg-white"
          >
            <option value="sec-10a">Grade 10 - Section A</option>
            <option value="sec-10b">Grade 10 - Section B</option>
            <option value="sec-11a">Grade 11 - Section A</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="text-emerald-700">Present: {presentCount}</span>
          <span className="text-red-700">Absent: {absentCount}</span>
          <span className="rounded bg-navy-50 px-2.5 py-1 text-navy-800 font-bold">
            Rate: {attendanceRate}%
          </span>
        </div>
      </div>

      {/* Interactive Roster Table */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
            <tr>
              <th className="py-3 px-4">Roll #</th>
              <th className="py-3 px-4">Scholar Name</th>
              <th className="py-3 px-4">Attendance Status</th>
              <th className="py-3 px-4 text-right">Quick Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentsRoster.map((s) => (
              <tr key={s.studentId} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono text-slate-500">{s.rollNumber}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-3xs font-bold ${
                      s.status === 'PRESENT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'LATE'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-1">
                    {(['PRESENT', 'ABSENT', 'LATE'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(s.studentId, st)}
                        className={`px-2 py-0.5 rounded text-3xs font-semibold ${
                          s.status === st
                            ? 'bg-navy-800 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st[0]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSection;
