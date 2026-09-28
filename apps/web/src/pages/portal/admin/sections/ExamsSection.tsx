import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, CheckCircle, X, Search } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { ExamDto } from '@school/shared';

export const ExamsSection: React.FC = () => {
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);
  const [examToDelete, setExamToDelete] = useState<ExamDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Fall Mid-Term Assessments 2026',
    academicYear: '2026-2027',
    term: 'FALL',
    startDate: '2026-10-15',
    endDate: '2026-10-25',
    status: 'SCHEDULED',
    description: 'Mid-term assessment examination series',
  });

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/exams');
      if (res.data.success && Array.isArray(res.data.data)) {
        setExams(res.data.data);
      }
    } catch (err) {
      setError(err);
      setExams([
        {
          id: 'exam-1',
          name: 'Fall Mid-Term Examinations 2026',
          academicYear: '2026-2027',
          term: 'FALL',
          startDate: '2026-10-15',
          endDate: '2026-10-25',
          status: 'SCHEDULED',
          subjectsCount: 8,
        },
        {
          id: 'exam-2',
          name: 'Spring Final Honors Examinations',
          academicYear: '2026-2027',
          term: 'SPRING',
          startDate: '2027-05-10',
          endDate: '2027-05-22',
          status: 'DRAFT',
          subjectsCount: 10,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingExam) {
        await api.patch(`/exams/${editingExam.id}`, formData);
        setActionSuccess('Examination schedule updated.');
      } else {
        await api.post('/exams', formData);
        setActionSuccess('New examination created.');
      }
      setIsModalOpen(false);
      setEditingExam(null);
      fetchExams();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!examToDelete) return;
    try {
      await api.delete(`/exams/${examToDelete.id}`);
      setActionSuccess(`Exam ${examToDelete.name} deleted.`);
      setExamToDelete(null);
      fetchExams();
    } catch (err) {
      setError(err);
      setExamToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <FileText className="mr-2 h-6 w-6 text-gold-500" />
            <span>Examinations & Term Assessments</span>
          </h2>
          <p className="text-xs text-slate-500">Configure examination terms, test series, and grading schedules.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingExam(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Create Examination</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No exams scheduled.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Examination</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900">{exam.name}</td>
                  <td className="py-3 px-4 text-slate-600">{exam.term}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{exam.academicYear}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-3xs">
                    {exam.startDate?.split('T')[0]} to {exam.endDate?.split('T')[0]}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-3xs font-semibold text-navy-800">
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExam(exam);
                          setFormData({
                            name: exam.name,
                            academicYear: exam.academicYear,
                            term: exam.term,
                            startDate: exam.startDate?.split('T')[0] || '',
                            endDate: exam.endDate?.split('T')[0] || '',
                            status: exam.status,
                            description: exam.description || '',
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-navy-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExamToDelete(exam)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
            <h3 className="text-base font-bold text-slate-900">{editingExam ? 'Edit Exam' : 'Create Exam'}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Examination Title"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-3 py-1.5 text-xs">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!examToDelete}
        title="Delete Examination"
        message={`Are you sure you want to delete ${examToDelete?.name}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setExamToDelete(null)}
      />
    </div>
  );
};

export default ExamsSection;
