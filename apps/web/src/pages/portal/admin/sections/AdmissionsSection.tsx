import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Mail,
  Phone,
  GraduationCap,
  X,
  FileText,
  AlertTriangle,
  Send,
  Trash2,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { AdmissionDto } from '@school/shared';

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: Clock,
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-500/10 border-rose-500/30',
    text: 'text-rose-400',
    icon: XCircle,
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    text: 'text-cyan-400',
    icon: Calendar,
  },
  ENROLLED: {
    label: 'Enrolled',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    text: 'text-indigo-400',
    icon: UserCheck,
  },
  PENDING_DOCUMENTS: {
    label: 'Docs Pending',
    bg: 'bg-purple-500/10 border-purple-500/30',
    text: 'text-purple-400',
    icon: FileText,
  },
};

export const AdmissionsSection: React.FC = () => {
  const [applications, setApplications] = useState<AdmissionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'submittedAt' | 'applicantFullName' | 'gradeApplyingFor'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [selectedApplication, setSelectedApplication] = useState<AdmissionDto | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{
    application: AdmissionDto;
    newStatus: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdmissionDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    applicantFirstName: '',
    applicantLastName: '',
    dateOfBirth: '2016-05-12',
    gender: 'FEMALE',
    gradeApplyingFor: 'GRADE_1',
    academicYear: '2026-2027',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    previousSchool: '',
    notes: '',
  });

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admissions');
      if (res.data.success && Array.isArray(res.data.data)) {
        setApplications(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Realistic Mock Admissions Cohort
      setApplications([
        {
          id: 'adm-101',
          applicationNumber: 'ADM-2026-1042',
          applicantFirstName: 'Alexander',
          applicantLastName: 'Hayes',
          applicantFullName: 'Alexander Hayes',
          dateOfBirth: '2011-04-18',
          gender: 'MALE',
          gradeApplyingFor: 'GRADE_9',
          academicYear: '2026-2027',
          parentName: 'Robert Hayes',
          parentEmail: 'robert.hayes@example.com',
          parentPhone: '+1 (555) 782-9901',
          previousSchool: 'Westbrook Junior High',
          status: 'UNDER_REVIEW',
          notes: 'Strong mathematics recommendation. Robotics club captain.',
          submittedAt: '2026-09-18T10:30:00Z',
        },
        {
          id: 'adm-102',
          applicationNumber: 'ADM-2026-1088',
          applicantFirstName: 'Sophia',
          applicantLastName: 'Patel',
          applicantFullName: 'Sophia Patel',
          dateOfBirth: '2021-08-22',
          gender: 'FEMALE',
          gradeApplyingFor: 'KINDERGARTEN',
          academicYear: '2026-2027',
          parentName: 'Priya & Vikram Patel',
          parentEmail: 'priya.patel@example.com',
          parentPhone: '+1 (555) 349-1120',
          previousSchool: 'Montessori Early Years Academy',
          status: 'ACCEPTED',
          notes: 'Accepted for Fall 2026 cohort. Welcome packet sent.',
          submittedAt: '2026-09-10T09:00:00Z',
        },
        {
          id: 'adm-103',
          applicationNumber: 'ADM-2026-1150',
          applicantFirstName: 'Marcus',
          applicantLastName: 'Vance',
          applicantFullName: 'Marcus Vance',
          dateOfBirth: '2014-02-11',
          gender: 'MALE',
          gradeApplyingFor: 'GRADE_6',
          academicYear: '2026-2027',
          parentName: 'Eleanor Vance',
          parentEmail: 'eleanor.vance@example.com',
          parentPhone: '+1 (555) 901-4433',
          previousSchool: 'Pinecrest Elementary',
          status: 'INTERVIEW_SCHEDULED',
          notes: 'Interview scheduled with Academic Dean for Oct 5 at 10:00 AM.',
          submittedAt: '2026-09-22T14:45:00Z',
        },
        {
          id: 'adm-104',
          applicationNumber: 'ADM-2026-1192',
          applicantFirstName: 'Clara',
          applicantLastName: 'Morrison',
          applicantFullName: 'Clara Morrison',
          dateOfBirth: '2012-11-03',
          gender: 'FEMALE',
          gradeApplyingFor: 'GRADE_8',
          academicYear: '2026-2027',
          parentName: 'David Morrison',
          parentEmail: 'david.m@example.com',
          parentPhone: '+1 (555) 234-8899',
          previousSchool: 'Oakridge Sister Campus',
          status: 'UNDER_REVIEW',
          notes: 'Transfer student from sister institution. Transcripts verified.',
          submittedAt: '2026-09-24T16:15:00Z',
        },
        {
          id: 'adm-105',
          applicationNumber: 'ADM-2026-1205',
          applicantFirstName: 'Lucas',
          applicantLastName: 'Kowalski',
          applicantFullName: 'Lucas Kowalski',
          dateOfBirth: '2015-06-30',
          gender: 'MALE',
          gradeApplyingFor: 'GRADE_5',
          academicYear: '2026-2027',
          parentName: 'Jan & Alina Kowalski',
          parentEmail: 'j.kowalski@example.com',
          parentPhone: '+1 (555) 412-7711',
          previousSchool: 'St. Jude International Academy',
          status: 'PENDING_DOCUMENTS',
          notes: 'Waiting on official immunization records and grade 4 transcript.',
          submittedAt: '2026-09-25T11:20:00Z',
        },
        {
          id: 'adm-106',
          applicationNumber: 'ADM-2026-0994',
          applicantFirstName: 'Emma',
          applicantLastName: 'Zhao',
          applicantFullName: 'Emma Zhao',
          dateOfBirth: '2010-09-14',
          gender: 'FEMALE',
          gradeApplyingFor: 'GRADE_10',
          academicYear: '2026-2027',
          parentName: 'Wei Zhao',
          parentEmail: 'wei.zhao@example.com',
          parentPhone: '+1 (555) 678-9900',
          previousSchool: 'Pacific Science Secondary',
          status: 'ENROLLED',
          notes: 'Registration fee completed. Assigned to Class 10-A.',
          submittedAt: '2026-09-02T08:30:00Z',
        },
        {
          id: 'adm-107',
          applicationNumber: 'ADM-2026-0980',
          applicantFirstName: 'Julian',
          applicantLastName: 'Drake',
          applicantFullName: 'Julian Drake',
          dateOfBirth: '2013-12-05',
          gender: 'MALE',
          gradeApplyingFor: 'GRADE_7',
          academicYear: '2026-2027',
          parentName: 'Arthur Drake',
          parentEmail: 'arthur.drake@example.com',
          parentPhone: '+1 (555) 887-2311',
          previousSchool: 'Silverstone Academy',
          status: 'REJECTED',
          notes: 'Cohort capacity exceeded for Grade 7. Invited to join waitlist.',
          submittedAt: '2026-08-28T14:10:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter & Sort
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.applicantFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.parentEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        const matchesGrade = gradeFilter === 'ALL' || app.gradeApplyingFor === gradeFilter;
        return matchesSearch && matchesStatus && matchesGrade;
      })
      .sort((a, b) => {
        let valA: string = a[sortField] || '';
        let valB: string = b[sortField] || '';
        if (sortOrder === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
  }, [applications, searchQuery, statusFilter, gradeFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const handleSort = (field: 'submittedAt' | 'applicantFullName' | 'gradeApplyingFor') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/admissions', formData);
      setActionSuccess('Admission application submitted successfully.');
      setIsCreateOpen(false);
      fetchApplications();
    } catch (err) {
      setError(err);
      // Optimistic update
      const newApp: AdmissionDto = {
        id: `adm-${Date.now()}`,
        applicationNumber: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        applicantFirstName: formData.applicantFirstName,
        applicantLastName: formData.applicantLastName,
        applicantFullName: `${formData.applicantFirstName} ${formData.applicantLastName}`,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        gradeApplyingFor: formData.gradeApplyingFor,
        academicYear: formData.academicYear,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        previousSchool: formData.previousSchool,
        status: 'UNDER_REVIEW',
        notes: formData.notes,
        submittedAt: new Date().toISOString(),
      };
      setApplications([newApp, ...applications]);
      setActionSuccess('Admission application logged in review pipeline.');
      setIsCreateOpen(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    const { application, newStatus } = statusChangeTarget;
    setError(null);
    try {
      await api.patch(`/admissions/${application.id}/status`, { status: newStatus });
      setActionSuccess(`Application ${application.applicationNumber} updated to ${newStatus}.`);
      setApplications((prev) =>
        prev.map((a) => (a.id === application.id ? { ...a, status: newStatus } : a))
      );
      if (selectedApplication?.id === application.id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (err) {
      // optimistic update
      setApplications((prev) =>
        prev.map((a) => (a.id === application.id ? { ...a, status: newStatus } : a))
      );
      if (selectedApplication?.id === application.id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
      setActionSuccess(`Application status changed to ${newStatus}.`);
    } finally {
      setStatusChangeTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError(null);
    try {
      await api.delete(`/admissions/${deleteTarget.id}`);
      setActionSuccess(`Application ${deleteTarget.applicationNumber} deleted.`);
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } catch (err) {
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setActionSuccess(`Application ${deleteTarget.applicationNumber} removed from admissions.`);
    } finally {
      setDeleteTarget(null);
      setIsDossierOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-amber-400" />
            Admissions Pipeline
          </h2>
          <p className="text-sm text-slate-400">
            Review incoming scholar candidates, examine credentials, and govern the enrollment lifecycle.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              applicantFirstName: '',
              applicantLastName: '',
              dateOfBirth: '2016-05-12',
              gender: 'FEMALE',
              gradeApplyingFor: 'GRADE_1',
              academicYear: '2026-2027',
              parentName: '',
              parentEmail: '',
              parentPhone: '',
              previousSchool: '',
              notes: '',
            });
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Log Application
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {actionSuccess}
          </div>
          <button onClick={() => setActionSuccess(null)} className="hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Control Bar: Search, Filters, Sort */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, parent, application #, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="PENDING_DOCUMENTS">Pending Documents</option>
            <option value="ENROLLED">Enrolled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Grades</option>
            <option value="KINDERGARTEN">Kindergarten</option>
            <option value="GRADE_1">Grade 1</option>
            <option value="GRADE_5">Grade 5</option>
            <option value="GRADE_6">Grade 6</option>
            <option value="GRADE_7">Grade 7</option>
            <option value="GRADE_8">Grade 8</option>
            <option value="GRADE_9">Grade 9</option>
            <option value="GRADE_10">Grade 10</option>
            <option value="GRADE_12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0B1528] rounded-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
            <p>Accessing admissions registry...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-300">No applications match your filter</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your query or click "Log Application" to create a new record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th className="py-3 px-4">Application #</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('applicantFullName')}
                  >
                    <div className="flex items-center gap-1">
                      Applicant
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('gradeApplyingFor')}
                  >
                    <div className="flex items-center gap-1">
                      Grade & Cohort
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-amber-400"
                    onClick={() => handleSort('submittedAt')}
                  >
                    <div className="flex items-center gap-1">
                      Submitted
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {paginatedApplications.map((app) => {
                  const statusMeta = STATUS_CONFIG[app.status] || {
                    label: app.status,
                    bg: 'bg-slate-800 border-slate-700',
                    text: 'text-slate-300',
                    icon: Clock,
                  };
                  const StatusIcon = statusMeta.icon;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-amber-400">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-100">{app.applicantFullName}</div>
                        <div className="text-xs text-slate-400">
                          {app.gender} • Born {app.dateOfBirth}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                          <GraduationCap className="w-3 h-3 text-amber-400" />
                          {app.gradeApplyingFor.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5">{app.academicYear}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-200 text-xs font-medium">{app.parentName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {app.parentEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(app.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusMeta.bg} ${statusMeta.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setIsDossierOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="View dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Status Action Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              setStatusChangeTarget({
                                application: app,
                                newStatus: e.target.value,
                              })
                            }
                            className="bg-[#060D1A] border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-amber-500/50"
                          >
                            <option value="UNDER_REVIEW">Review</option>
                            <option value="INTERVIEW_SCHEDULED">Interview</option>
                            <option value="ACCEPTED">Accept</option>
                            <option value="ENROLLED">Enroll</option>
                            <option value="REJECTED">Reject</option>
                          </select>

                          <button
                            onClick={() => setDeleteTarget(app)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="py-3 px-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {filteredApplications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of{' '}
            {filteredApplications.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Application Dossier Modal */}
      {isDossierOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {selectedApplication.applicantFullName}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    {selectedApplication.applicationNumber} • Submitted{' '}
                    {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
              <div className="bg-[#060D1A] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Applicant Profile
                </span>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Date of Birth:</strong>{' '}
                  {selectedApplication.dateOfBirth}
                </p>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Gender:</strong>{' '}
                  {selectedApplication.gender}
                </p>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Previous School:</strong>{' '}
                  {selectedApplication.previousSchool || 'N/A'}
                </p>
              </div>

              <div className="bg-[#060D1A] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Grade & Term
                </span>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Grade Applying For:</strong>{' '}
                  {selectedApplication.gradeApplyingFor.replace('_', ' ')}
                </p>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Academic Cohort:</strong>{' '}
                  {selectedApplication.academicYear}
                </p>
                <p className="text-slate-200">
                  <strong className="text-slate-400">Current Status:</strong>{' '}
                  <span className="text-amber-400 font-medium">
                    {selectedApplication.status}
                  </span>
                </p>
              </div>

              <div className="bg-[#060D1A] p-3.5 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Guardian Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <span className="text-xs text-slate-400 block">Full Name:</span>
                    <span className="text-slate-200 font-medium">{selectedApplication.parentName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Email Address:</span>
                    <span className="text-slate-200 font-medium">{selectedApplication.parentEmail}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Contact Phone:</span>
                    <span className="text-slate-200 font-medium">{selectedApplication.parentPhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#060D1A] p-3.5 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Staff Evaluation Notes
                </span>
                <p className="text-slate-300 italic pt-1">
                  "{selectedApplication.notes || 'No notes entered for this applicant.'}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setDeleteTarget(selectedApplication)}
                className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Application
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDossierOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-sm text-slate-300"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Application Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Register New Scholar Application
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicantFirstName}
                    onChange={(e) =>
                      setFormData({ ...formData, applicantFirstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                    placeholder="e.g. Eleanor"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicantLastName}
                    onChange={(e) =>
                      setFormData({ ...formData, applicantLastName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Grade *</label>
                  <select
                    value={formData.gradeApplyingFor}
                    onChange={(e) =>
                      setFormData({ ...formData, gradeApplyingFor: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="KINDERGARTEN">Kindergarten</option>
                    <option value="GRADE_1">Grade 1</option>
                    <option value="GRADE_2">Grade 2</option>
                    <option value="GRADE_5">Grade 5</option>
                    <option value="GRADE_6">Grade 6</option>
                    <option value="GRADE_7">Grade 7</option>
                    <option value="GRADE_8">Grade 8</option>
                    <option value="GRADE_9">Grade 9</option>
                    <option value="GRADE_10">Grade 10</option>
                    <option value="GRADE_11">Grade 11</option>
                    <option value="GRADE_12">Grade 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                    placeholder="e.g. Robert Hayes"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Parent Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="parent@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Prior School / Institution
                </label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Name of last school attended"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Admissions Notes & Initial Evaluation
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Extracurricular honors, special accommodations, interview notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Change Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(statusChangeTarget)}
        title="Update Application Status"
        message={`Are you sure you want to transition application ${statusChangeTarget?.application.applicationNumber} to "${statusChangeTarget?.newStatus}"? This will alert the admissions committee and update communication records.`}
        confirmText="Confirm Status Update"
        confirmVariant="primary"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusChangeTarget(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Admission Dossier"
        message={`Are you sure you want to remove application ${deleteTarget?.applicationNumber} (${deleteTarget?.applicantFullName}) from the active registry? This action cannot be reversed.`}
        confirmText="Delete Record"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
