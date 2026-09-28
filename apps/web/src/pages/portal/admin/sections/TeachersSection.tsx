import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  GraduationCap,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { TeacherResponseDto } from '@school/shared';

export const TeachersSection: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponseDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherResponseDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: 'M.Sc. Mathematics',
    specialization: 'Pure & Applied Mathematics',
    department: 'Mathematics',
  });

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/teachers', {
        params: {
          page,
          limit,
          search: searchQuery.trim() || undefined,
          department: deptFilter !== 'ALL' ? deptFilter : undefined,
        },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setTeachers(res.data.data);
        setTotalTeachers(res.data.meta?.pagination?.total || res.data.data.length);
      }
    } catch (err) {
      setError(err);
      const mockList: TeacherResponseDto[] = [
        {
          id: 'teach-001',
          userId: 'usr-teach-01',
          employeeId: 'FAC-1001',
          firstName: 'Dr. Evelyn',
          lastName: 'Reed',
          fullName: 'Dr. Evelyn Reed',
          email: 'evelyn.reed@oakridge.edu',
          phone: '+1 (555) 019-2832',
          qualification: 'Ph.D. in Pure Mathematics, Harvard University',
          specialization: 'Multivariable Calculus & Number Theory',
          department: 'Mathematics',
          joiningDate: '2019-08-01',
          status: 'ACTIVE',
          assignedSections: [
            {
              sectionId: 'sec-10a',
              sectionName: 'Section A',
              className: 'Grade 10',
              subjectName: 'Advanced Mathematics',
              isClassTeacher: true,
            },
          ],
        },
        {
          id: 'teach-002',
          userId: 'usr-teach-02',
          employeeId: 'FAC-1002',
          firstName: 'Marcus',
          lastName: 'Vance',
          fullName: 'Marcus Vance',
          email: 'marcus.vance@oakridge.edu',
          phone: '+1 (555) 019-2833',
          qualification: 'M.Sc. Applied Physics, MIT',
          specialization: 'Mechanics & Thermodynamics',
          department: 'Science',
          joiningDate: '2021-08-01',
          status: 'ACTIVE',
          assignedSections: [
            {
              sectionId: 'sec-10a',
              sectionName: 'Section A',
              className: 'Grade 10',
              subjectName: 'Physics',
              isClassTeacher: false,
            },
          ],
        },
      ];
      setTeachers(mockList);
      setTotalTeachers(mockList.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, deptFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/teachers', formData);
      if (res.data.success) {
        setActionSuccess('Faculty member added successfully.');
        setIsCreateModalOpen(false);
        fetchTeachers();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setError(null);
    try {
      const res = await api.patch(`/teachers/${selectedTeacher.id}`, formData);
      if (res.data.success) {
        setActionSuccess('Faculty dossier updated successfully.');
        setIsEditModalOpen(false);
        fetchTeachers();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    setError(null);
    try {
      await api.delete(`/teachers/${teacherToDelete.id}`);
      setActionSuccess(`Faculty record for ${teacherToDelete.fullName} archived.`);
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      fetchTeachers();
    } catch (err) {
      setError(err);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-gold-500" />
            <span>Faculty & Academic Staff</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage instructional staff, departmental chairs, and assigned sections.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              qualification: 'M.Sc. Mathematics',
              specialization: 'Advanced Calculus',
              department: 'Mathematics',
            });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-navy-700 transition"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchTeachers();
          }}
          className="flex-1 w-full flex items-center relative"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by faculty name, employee ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-navy-800"
          >
            <option value="ALL">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Humanities">Humanities</option>
            <option value="Languages">Languages</option>
            <option value="Arts">Fine Arts</option>
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-navy-800 border-t-transparent" />
            <p className="mt-2">Loading faculty directory...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No faculty members found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Qualifications</th>
                  <th className="py-3 px-4">Assigned Section</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-medium text-navy-900">
                      {t.employeeId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{t.fullName}</div>
                      <div className="text-3xs text-slate-500">{t.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-navy-50 border border-navy-200 px-2 py-0.5 text-3xs font-semibold text-navy-800">
                        {t.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {t.qualification}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.assignedSections && t.assignedSections.length > 0 ? (
                        <span className="text-xs font-medium">
                          {t.assignedSections[0].className} ({t.assignedSections[0].sectionName})
                        </span>
                      ) : (
                        <span className="text-3xs text-slate-400">Not assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacher(t);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-navy-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacher(t);
                            setFormData({
                              firstName: t.firstName,
                              lastName: t.lastName,
                              email: t.email,
                              phone: t.phone || '',
                              qualification: t.qualification,
                              specialization: t.specialization || '',
                              department: t.department,
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-navy-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTeacherToDelete(t);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Faculty Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <input
                type="email"
                required
                placeholder="Institutional Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs bg-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Languages">Languages</option>
                  <option value="Arts">Fine Arts</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Degree / Qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Archive Faculty Record"
        message={`Are you sure you want to archive the faculty record for ${teacherToDelete?.fullName}?`}
        confirmLabel="Archive Record"
        cancelLabel="Keep Active"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setTeacherToDelete(null);
        }}
      />
    </div>
  );
};

export default TeachersSection;
