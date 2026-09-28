import React, { useState, useEffect } from 'react';
import { Grid, Plus, Edit2, Trash2, CheckCircle, X, Search } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { SectionDto } from '@school/shared';

export const SectionsSection: React.FC = () => {
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionDto | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<SectionDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Section A',
    classId: 'cls-10',
    roomNumber: 'Room 204',
    capacity: 30,
  });

  const fetchSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sections');
      if (res.data.success && Array.isArray(res.data.data)) {
        setSections(res.data.data);
      }
    } catch (err) {
      setError(err);
      setSections([
        { id: 'sec-10a', name: 'Section A', classId: 'cls-10', className: 'Grade 10', roomNumber: 'Room 204', capacity: 30, currentStudentCount: 26 },
        { id: 'sec-10b', name: 'Section B', classId: 'cls-10', className: 'Grade 10', roomNumber: 'Room 205', capacity: 30, currentStudentCount: 24 },
        { id: 'sec-11a', name: 'Section A', classId: 'cls-11', className: 'Grade 11', roomNumber: 'Room 301', capacity: 28, currentStudentCount: 22 },
        { id: 'sec-12a', name: 'Section A', classId: 'cls-12', className: 'Grade 12', roomNumber: 'Room 402', capacity: 25, currentStudentCount: 20 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSection) {
        await api.patch(`/sections/${editingSection.id}`, formData);
        setActionSuccess('Section updated successfully.');
      } else {
        await api.post('/sections', formData);
        setActionSuccess('New section created successfully.');
      }
      setIsModalOpen(false);
      setEditingSection(null);
      fetchSections();
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (!sectionToDelete) return;
    try {
      await api.delete(`/sections/${sectionToDelete.id}`);
      setActionSuccess(`Section ${sectionToDelete.name} deleted.`);
      setSectionToDelete(null);
      fetchSections();
    } catch (err) {
      setError(err);
      setSectionToDelete(null);
    }
  };

  const filtered = sections.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.className && s.className.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Grid className="mr-2 h-6 w-6 text-gold-500" />
            <span>Classroom Sections</span>
          </h2>
          <p className="text-xs text-slate-500">Manage class sections, room allocations, and student caps.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingSection(null);
            setFormData({ name: 'Section C', classId: 'cls-10', roomNumber: 'Room 206', capacity: 30 });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Section</span>
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
            placeholder="Search sections or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading sections...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Section Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Room Number</th>
                <th className="py-3 px-4">Enrollment / Capacity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900">{sec.name}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{sec.className || 'Grade 10'}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{sec.roomNumber || 'TBD'}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-navy-800">{sec.currentStudentCount || 24}</span> / {sec.capacity}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSection(sec);
                          setFormData({
                            name: sec.name,
                            classId: sec.classId,
                            roomNumber: sec.roomNumber || '',
                            capacity: sec.capacity,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-navy-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSectionToDelete(sec)}
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
            <h3 className="text-base font-bold text-slate-900">{editingSection ? 'Edit Section' : 'Create Section'}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Section Name (e.g. Section A)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Room Number"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="number"
                  required
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 30 })}
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
        isOpen={!!sectionToDelete}
        title="Delete Section"
        message={`Are you sure you want to delete ${sectionToDelete?.name}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setSectionToDelete(null)}
      />
    </div>
  );
};

export default SectionsSection;
