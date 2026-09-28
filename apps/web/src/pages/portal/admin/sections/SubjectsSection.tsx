import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle, X, Search, Filter } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { SubjectDto } from '@school/shared';

export const SubjectsSection: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Advanced Mathematics',
    code: 'MATH-201',
    description: 'Calculus, Vectors, and Complex Numbers',
    credits: 4,
    isElective: false,
  });

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/subjects');
      if (res.data.success && Array.isArray(res.data.data)) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      setError(err);
      setSubjects([
        { id: 'sub-math', name: 'Advanced Mathematics', code: 'MATH-201', credits: 4, isElective: false },
        { id: 'sub-phys', name: 'Physics & Thermodynamics', code: 'PHYS-201', credits: 4, isElective: false },
        { id: 'sub-chem', name: 'Organic Chemistry', code: 'CHEM-201', credits: 3, isElective: false },
        { id: 'sub-cs', name: 'Computer Science & AI', code: 'CS-301', credits: 4, isElective: true },
        { id: 'sub-lit', name: 'World Literature', code: 'ENG-201', credits: 3, isElective: false },
        { id: 'sub-econ', name: 'Macroeconomics', code: 'ECON-101', credits: 3, isElective: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSubject) {
        await api.patch(`/subjects/${editingSubject.id}`, formData);
        setActionSuccess('Subject updated successfully.');
      } else {
        await api.post('/subjects', formData);
        setActionSuccess('New subject added to curriculum.');
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await api.delete(`/subjects/${subjectToDelete.id}`);
      setActionSuccess(`Subject ${subjectToDelete.name} removed.`);
      setSubjectToDelete(null);
      fetchSubjects();
    } catch (err) {
      setError(err);
      setSubjectToDelete(null);
    }
  };

  const filtered = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'CORE' && !s.isElective) ||
      (typeFilter === 'ELECTIVE' && s.isElective);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-gold-500" />
            <span>Curriculum Subjects Catalog</span>
          </h2>
          <p className="text-xs text-slate-500">Configure academic subjects, syllabus credits, and course codes.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingSubject(null);
            setFormData({ name: '', code: '', description: '', credits: 3, isElective: false });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Subject</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex-1 w-full flex items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject name or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
        >
          <option value="ALL">All Course Types</option>
          <option value="CORE">Core Mandatory</option>
          <option value="ELECTIVE">Elective / AP</option>
        </select>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading subjects catalog...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900">{sub.name}</td>
                  <td className="py-3 px-4 font-mono text-navy-800 font-medium">{sub.code}</td>
                  <td className="py-3 px-4 text-slate-700">{sub.credits} Units</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        sub.isElective
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-navy-50 text-navy-700 border border-navy-200'
                      }`}
                    >
                      {sub.isElective ? 'Elective' : 'Core'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubject(sub);
                          setFormData({
                            name: sub.name,
                            code: sub.code,
                            description: sub.description || '',
                            credits: sub.credits,
                            isElective: sub.isElective,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-navy-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubjectToDelete(sub)}
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
            <h3 className="text-base font-bold text-slate-900">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Subject Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Course Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs font-mono"
                />
                <input
                  type="number"
                  required
                  placeholder="Credits"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <label className="flex items-center space-x-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isElective}
                  onChange={(e) => setFormData({ ...formData, isElective: e.target.checked })}
                  className="rounded border-slate-300 text-navy-800"
                />
                <span>Elective / Advanced Placement course</span>
              </label>
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
        isOpen={!!subjectToDelete}
        title="Remove Subject"
        message={`Are you sure you want to remove ${subjectToDelete?.name} from the curriculum?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setSubjectToDelete(null)}
      />
    </div>
  );
};

export default SubjectsSection;
