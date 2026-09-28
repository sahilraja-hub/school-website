import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { StudentResponseDto } from '@school/shared';

export const StudentsSection: React.FC = () => {
  const [students, setStudents] = useState<StudentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Search, Filter, Sort, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalStudents, setTotalStudents] = useState(0);

  // Modals & Action states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponseDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentResponseDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '2010-05-15',
    gender: 'MALE',
    emergencyContact: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace',
    classId: 'cls-10',
    sectionId: 'sec-10a',
  });

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/students', {
        params: {
          page,
          limit,
          search: searchQuery.trim() || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          sortBy,
          sortOrder,
        },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
        setTotalStudents(res.data.meta?.pagination?.total || res.data.data.length);
      }
    } catch (err) {
      setError(err);
      // High-grade fallback student dataset for resilient demonstration
      const mockList: StudentResponseDto[] = [
        {
          id: 'stud-001',
          userId: 'usr-stud-01',
          admissionNumber: 'OAK-2024-001',
          rollNumber: '10-A-01',
          firstName: 'Liam',
          lastName: 'Vance',
          fullName: 'Liam Vance',
          email: 'liam.vance@oakridge.edu',
          dateOfBirth: '2008-04-12',
          gender: 'MALE',
          emergencyContact: '+1 (555) 019-2834',
          address: '458 Meadow Lane, Cambridge, MA',
          admissionDate: '2024-08-15',
          status: 'ACTIVE',
          currentEnrollment: {
            className: 'Grade 10',
            sectionName: 'Section A',
            academicYear: '2026-2027',
          },
        },
        {
          id: 'stud-002',
          userId: 'usr-stud-02',
          admissionNumber: 'OAK-2024-002',
          rollNumber: '10-A-02',
          firstName: 'Sophia',
          lastName: 'Chen',
          fullName: 'Sophia Chen',
          email: 'sophia.chen@oakridge.edu',
          dateOfBirth: '2008-09-22',
          gender: 'FEMALE',
          emergencyContact: '+1 (555) 349-8812',
          address: '12 Harbor View Rd, Boston, MA',
          admissionDate: '2024-08-15',
          status: 'ACTIVE',
          currentEnrollment: {
            className: 'Grade 10',
            sectionName: 'Section A',
            academicYear: '2026-2027',
          },
        },
        {
          id: 'stud-003',
          userId: 'usr-stud-03',
          admissionNumber: 'OAK-2023-045',
          rollNumber: '11-B-08',
          firstName: 'Alexander',
          lastName: 'Hayes',
          fullName: 'Alexander Hayes',
          email: 'alex.hayes@oakridge.edu',
          dateOfBirth: '2007-11-05',
          gender: 'MALE',
          emergencyContact: '+1 (555) 892-1144',
          address: '89 Beacon Street, Boston, MA',
          admissionDate: '2023-08-15',
          status: 'ACTIVE',
          currentEnrollment: {
            className: 'Grade 11',
            sectionName: 'Section B',
            academicYear: '2026-2027',
          },
        },
      ];
      setStudents(mockList);
      setTotalStudents(mockList.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, statusFilter, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/students', formData);
      if (res.data.success) {
        setActionSuccess('Student enrolled successfully.');
        setIsCreateModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setError(null);
    try {
      const res = await api.patch(`/students/${selectedStudent.id}`, formData);
      if (res.data.success) {
        setActionSuccess('Student dossier updated successfully.');
        setIsEditModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setError(null);
    try {
      await api.delete(`/students/${studentToDelete.id}`);
      setActionSuccess(`Student ${studentToDelete.fullName} withdrawn successfully.`);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      setError(err);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditModal = (student: StudentResponseDto) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      dateOfBirth: student.dateOfBirth?.split('T')[0] || '2010-05-15',
      gender: student.gender,
      emergencyContact: student.emergencyContact,
      address: student.address || '',
      classId: 'cls-10',
      sectionId: 'sec-10a',
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (student: StudentResponseDto) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <GraduationCap className="mr-2 h-6 w-6 text-gold-500" />
            <span>Student Registry & Rosters</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage academic profiles, enrollments, and status tracking for all scholars.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              dateOfBirth: '2010-05-15',
              gender: 'MALE',
              emergencyContact: '+1 (555) 019-2834',
              address: '742 Evergreen Terrace',
              classId: 'cls-10',
              sectionId: 'sec-10a',
            });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-navy-700 transition"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Error Alert Display */}
      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll # or admission ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-navy-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="ALUMNI">Alumni</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so as any);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-navy-800"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="admissionNumber-desc">Newest Admissions</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-navy-800 border-t-transparent" />
            <p className="mt-2">Loading student records...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No students found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or register a new student above.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission #</th>
                    <th className="py-3 px-4">Scholar</th>
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Emergency Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-medium text-navy-900">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.fullName}</div>
                        <div className="text-3xs text-slate-500">{student.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {student.currentEnrollment
                          ? `${student.currentEnrollment.className} (${student.currentEnrollment.sectionName})`
                          : 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {student.rollNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-3xs">
                        {student.emergencyContact}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openViewModal(student)}
                            title="View Dossier"
                            className="p-1 rounded text-slate-400 hover:text-navy-800 hover:bg-slate-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(student)}
                            title="Edit Student"
                            className="p-1 rounded text-slate-400 hover:text-navy-800 hover:bg-slate-100"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStudentToDelete(student);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Withdraw Student"
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50 text-xs">
              <span className="text-slate-500">
                Showing {students.length} of {totalStudents} scholars
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded px-2.5 py-1 text-slate-700 bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-xs"
                >
                  Previous
                </button>
                <span className="text-slate-700 font-semibold px-2">Page {page}</span>
                <button
                  type="button"
                  disabled={students.length < limit}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded px-2.5 py-1 text-slate-700 bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Student Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Enroll New Scholar</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                  Emergency Phone Contact
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-700"
                >
                  Save Scholar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Scholar: {selectedStudent.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-semibold uppercase text-slate-600 mb-1">
                  Emergency Phone Contact
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-700"
                >
                  Update Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Dossier Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Scholar Profile Dossier</h3>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-900">{selectedStudent.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Admission #</span>
                <span className="font-mono font-medium text-navy-800">
                  {selectedStudent.admissionNumber}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-700">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Enrolled Class</span>
                <span className="font-medium text-slate-900">
                  {selectedStudent.currentEnrollment?.className || 'Grade 10'} (
                  {selectedStudent.currentEnrollment?.sectionName || 'Section A'})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Roll Number</span>
                <span className="font-mono text-slate-800">{selectedStudent.rollNumber || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Emergency Phone</span>
                <span className="font-mono text-slate-800">{selectedStudent.emergencyContact}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-700">{selectedStudent.status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Student Deletion */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Withdraw Scholar"
        message={`Are you sure you want to withdraw ${studentToDelete?.fullName} (${studentToDelete?.admissionNumber})? This will archive their current academic enrollment.`}
        confirmLabel="Confirm Withdrawal"
        cancelLabel="Keep Enrolled"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setStudentToDelete(null);
        }}
      />
    </div>
  );
};

export default StudentsSection;
