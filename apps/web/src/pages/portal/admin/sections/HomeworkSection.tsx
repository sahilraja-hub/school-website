import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, CheckCircle, X, Search } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { HomeworkDto } from '@school/shared';

export const HomeworkSection: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState<HomeworkDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HomeworkDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: 'Calculus Problem Set #4',
    description: 'Complete problems 12 through 35 in chapter 4. Show all working steps.',
    sectionId: 'sec-10a',
    subjectId: 'sub-math',
    dueDate: '2026-10-05T23:59:00Z',
    totalMarks: 50,
  });

  const fetchHomework = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/homework');
      if (res.data.success && Array.isArray(res.data.data)) {
        setHomeworkList(res.data.data);
      }
    } catch (err) {
      setError(err);
      setHomeworkList([
        {
          id: 'hw-1',
          title: 'Calculus Problem Set #4: Limits & Continuity',
          description: 'Complete analytical proofs for rational functions.',
          sectionId: 'sec-10a',
          sectionName: 'Grade 10 - Section A',
          subjectId: 'sub-math',
          subjectName: 'Advanced Mathematics',
          teacherName: 'Dr. Evelyn Reed',
          assignedDate: '2026-09-25T08:00:00Z',
          dueDate: '2026-10-05T23:59:00Z',
          totalMarks: 50,
          submissionsCount: 22,
        },
        {
          id: 'hw-2',
          title: 'Physics Lab Report: Optics & Diffraction',
          description: 'Formal lab write-up including error propagation calculations.',
          sectionId: 'sec-10a',
          sectionName: 'Grade 10 - Section A',
          subjectId: 'sub-phys',
          subjectName: 'Physics',
          teacherName: 'Marcus Vance',
          assignedDate: '2026-09-27T09:00:00Z',
          dueDate: '2026-10-08T23:59:00Z',
          totalMarks: 100,
          submissionsCount: 18,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/homework', formData);
      setActionSuccess('Homework assignment published.');
      setIsModalOpen(false);
      fetchHomework();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/homework/${itemToDelete.id}`);
      setActionSuccess('Homework assignment removed.');
      setItemToDelete(null);
      fetchHomework();
    } catch (err) {
      setError(err);
      setItemToDelete(null);
    }
  };

  const filtered = homeworkList.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.subjectName && h.subjectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Bookmark className="mr-2 h-6 w-6 text-gold-500" />
            <span>Homework & Assignment Pipelines</span>
          </h2>
          <p className="text-xs text-slate-500">Assign course tasks, set deadlines, and monitor student submissions.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Issue Assignment</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
            <tr>
              <th className="py-3 px-4">Assignment Title</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Submissions</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((hw) => (
              <tr key={hw.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-semibold text-slate-900">{hw.title}</td>
                <td className="py-3 px-4 text-slate-700">{hw.subjectName}</td>
                <td className="py-3 px-4 text-slate-600">{hw.sectionName || 'Grade 10-A'}</td>
                <td className="py-3 px-4 font-mono text-slate-700 text-3xs">
                  {hw.dueDate?.split('T')[0]}
                </td>
                <td className="py-3 px-4">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-3xs font-semibold text-emerald-700 border border-emerald-200">
                    {hw.submissionsCount || 20} Turned In
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => setItemToDelete(hw)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Publish Homework Assignment</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <textarea
                required
                rows={3}
                placeholder="Description & instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={formData.dueDate.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dueDate: `${e.target.value}T23:59:00Z` })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="number"
                  required
                  placeholder="Total Points"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 50 })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-3 py-1.5 text-xs">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white">
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        title="Delete Assignment"
        message={`Are you sure you want to remove assignment ${itemToDelete?.title}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default HomeworkSection;
