import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, X, Search } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { ClassDto } from '@school/shared';

export const ClassesSection: React.FC = () => {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Grade 10',
    gradeLevel: '10',
    academicYear: '2026-2027',
    description: 'Senior Secondary Grade 10 Cohort',
  });

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/classes');
      if (res.data.success && Array.isArray(res.data.data)) {
        setClasses(res.data.data);
      }
    } catch (err) {
      setError(err);
      setClasses([
        { id: 'cls-9', name: 'Grade 9', gradeLevel: '9', academicYear: '2026-2027', sectionsCount: 3 },
        { id: 'cls-10', name: 'Grade 10', gradeLevel: '10', academicYear: '2026-2027', sectionsCount: 3 },
        { id: 'cls-11', name: 'Grade 11', gradeLevel: '11', academicYear: '2026-2027', sectionsCount: 2 },
        { id: 'cls-12', name: 'Grade 12', gradeLevel: '12', academicYear: '2026-2027', sectionsCount: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingClass) {
        await api.patch(`/classes/${editingClass.id}`, formData);
        setActionSuccess('Class updated successfully.');
      } else {
        await api.post('/classes', formData);
        setActionSuccess('New class grade level created successfully.');
      }
      setIsModalOpen(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!classToDelete) return;
    try {
      await api.delete(`/classes/${classToDelete.id}`);
      setActionSuccess(`Class ${classToDelete.name} deleted.`);
      setClassToDelete(null);
      fetchClasses();
    } catch (err) {
      setError(err);
      setClassToDelete(null);
    }
  };

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Layers className="mr-2 h-6 w-6 text-gold-500" />
            <span>Academic Classes & Grade Levels</span>
          </h2>
          <p className="text-xs text-slate-500">Configure institutional grades and cohorts.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingClass(null);
            setFormData({
              name: 'Grade 10',
              gradeLevel: '10',
              academicYear: '2026-2027',
              description: '',
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Class</span>
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
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading classes...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Class Name</th>
                <th className="py-3 px-4">Grade Level</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900">{cls.name}</td>
                  <td className="py-3 px-4 text-slate-600">{cls.gradeLevel}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{cls.academicYear}</td>
                  <td className="py-3 px-4 font-medium text-navy-800">{cls.sectionsCount || 2} Sections</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClass(cls);
                          setFormData({
                            name: cls.name,
                            gradeLevel: cls.gradeLevel,
                            academicYear: cls.academicYear,
                            description: cls.description || '',
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-navy-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setClassToDelete(cls)}
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
            <h3 className="text-base font-bold text-slate-900">{editingClass ? 'Edit Class' : 'Create Class'}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Class Name (e.g. Grade 10)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Grade Level (e.g. 10)"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Academic Year (e.g. 2026-2027)"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
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
        isOpen={!!classToDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${classToDelete?.name}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setClassToDelete(null)}
      />
    </div>
  );
};

export default ClassesSection;
