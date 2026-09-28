import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle, X, Filter } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { TimetableDto } from '@school/shared';

export const TimetableSection: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [dayFilter, setDayFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TimetableDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sectionId: 'sec-10a',
    subjectId: 'sub-math',
    teacherId: 'teach-001',
    dayOfWeek: 'MONDAY',
    startTime: '08:30',
    endTime: '09:25',
    roomNumber: 'Room 204',
  });

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/timetable', {
        params: {
          dayOfWeek: dayFilter !== 'ALL' ? dayFilter : undefined,
        },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setTimetable(res.data.data);
      }
    } catch (err) {
      setError(err);
      setTimetable([
        {
          id: 'tt-1',
          sectionId: 'sec-10a',
          sectionName: 'Grade 10 - Section A',
          subjectId: 'sub-math',
          subjectName: 'Advanced Mathematics',
          subjectCode: 'MATH-201',
          teacherId: 'teach-001',
          teacherName: 'Dr. Evelyn Reed',
          dayOfWeek: 'MONDAY',
          startTime: '08:30',
          endTime: '09:25',
          roomNumber: 'Room 204',
        },
        {
          id: 'tt-2',
          sectionId: 'sec-10a',
          sectionName: 'Grade 10 - Section A',
          subjectId: 'sub-phys',
          subjectName: 'Physics & Thermodynamics',
          subjectCode: 'PHYS-201',
          teacherId: 'teach-002',
          teacherName: 'Marcus Vance',
          dayOfWeek: 'MONDAY',
          startTime: '09:30',
          endTime: '10:25',
          roomNumber: 'Room 204',
        },
        {
          id: 'tt-3',
          sectionId: 'sec-10a',
          sectionName: 'Grade 10 - Section A',
          subjectId: 'sub-cs',
          subjectName: 'Computer Science & AI',
          subjectCode: 'CS-301',
          teacherId: 'teach-001',
          teacherName: 'Dr. Evelyn Reed',
          dayOfWeek: 'TUESDAY',
          startTime: '10:45',
          endTime: '11:40',
          roomNumber: 'Lab 3',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [dayFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/timetable', formData);
      setActionSuccess('Period scheduled into timetable successfully.');
      setIsModalOpen(false);
      fetchTimetable();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/timetable/${itemToDelete.id}`);
      setActionSuccess('Period removed from timetable.');
      setItemToDelete(null);
      fetchTimetable();
    } catch (err) {
      setError(err);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Clock className="mr-2 h-6 w-6 text-gold-500" />
            <span>Master Academic Timetable</span>
          </h2>
          <p className="text-xs text-slate-500">Weekly scheduling, period allocation, and collision avoidance.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Period</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Filter by Day:</span>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="rounded-lg border px-3 py-1.5 text-xs bg-white"
          >
            <option value="ALL">All Days</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading timetable...</div>
        ) : timetable.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No scheduled periods for selected criteria.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-navy-900">{item.dayOfWeek}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {item.startTime} - {item.endTime}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{item.subjectName}</td>
                  <td className="py-3 px-4 text-slate-700">{item.teacherName}</td>
                  <td className="py-3 px-4 text-slate-600">{item.sectionName || 'Grade 10-A'}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{item.roomNumber}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Schedule Period</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs bg-white"
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Room Number (e.g. Room 204)"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-3 py-1.5 text-xs">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        title="Cancel Period"
        message={`Are you sure you want to cancel ${itemToDelete?.subjectName} on ${itemToDelete?.dayOfWeek} (${itemToDelete?.startTime} - ${itemToDelete?.endTime})?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default TimetableSection;
