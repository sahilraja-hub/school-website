import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Phone,
  Mail,
  Home,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { ParentResponseDto } from '@school/shared';

export const ParentsSection: React.FC = () => {
  const [parents, setParents] = useState<ParentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalParents, setTotalParents] = useState(0);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponseDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<ParentResponseDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: 'Software Engineer',
    relationship: 'FATHER',
    emergencyContact: '+1 (555) 019-2837',
    address: '458 Meadow Lane',
    city: 'Cambridge',
    state: 'MA',
    postalCode: '02138',
  });

  const fetchParents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/parents', {
        params: {
          page,
          limit,
          search: searchQuery.trim() || undefined,
        },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setParents(res.data.data);
        setTotalParents(res.data.meta?.pagination?.total || res.data.data.length);
      }
    } catch (err) {
      setError(err);
      const mockList: ParentResponseDto[] = [
        {
          id: 'par-001',
          userId: 'usr-parent-01',
          firstName: 'David',
          lastName: 'Vance',
          fullName: 'David Vance',
          email: 'david.vance@example.com',
          phone: '+1 (555) 019-2837',
          occupation: 'Biotech Executive',
          relationship: 'FATHER',
          emergencyContact: '+1 (555) 019-2838',
          address: '458 Meadow Lane',
          city: 'Cambridge',
          state: 'MA',
          postalCode: '02138',
          children: [
            {
              id: 'stud-001',
              admissionNumber: 'OAK-2024-001',
              name: 'Liam Vance',
              status: 'ACTIVE',
            },
          ],
        },
        {
          id: 'par-002',
          userId: 'usr-parent-02',
          firstName: 'Priya & Vikram',
          lastName: 'Patel',
          fullName: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '+1 (555) 349-1120',
          occupation: 'Physician',
          relationship: 'MOTHER',
          emergencyContact: '+1 (555) 349-1121',
          address: '12 Harbor View Road',
          city: 'Boston',
          state: 'MA',
          postalCode: '02110',
          children: [
            {
              id: 'stud-002',
              admissionNumber: 'OAK-2024-002',
              name: 'Sophia Patel',
              status: 'ACTIVE',
            },
          ],
        },
      ];
      setParents(mockList);
      setTotalParents(mockList.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchParents();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/parents', formData);
      if (res.data.success) {
        setActionSuccess('Guardian record created successfully.');
        setIsCreateModalOpen(false);
        fetchParents();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent) return;
    setError(null);
    try {
      const res = await api.patch(`/parents/${selectedParent.id}`, formData);
      if (res.data.success) {
        setActionSuccess('Guardian record updated successfully.');
        setIsEditModalOpen(false);
        fetchParents();
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!parentToDelete) return;
    setError(null);
    try {
      await api.delete(`/parents/${parentToDelete.id}`);
      setActionSuccess(`Guardian record for ${parentToDelete.fullName} removed.`);
      setIsDeleteDialogOpen(false);
      setParentToDelete(null);
      fetchParents();
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
            <Users className="mr-2 h-6 w-6 text-gold-500" />
            <span>Parents & Guardians Directory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage guardian relationships, linked scholars, and contact demographics.
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
              occupation: 'Professional',
              relationship: 'FATHER',
              emergencyContact: '+1 (555) 019-2837',
              address: '458 Meadow Lane',
              city: 'Cambridge',
              state: 'MA',
              postalCode: '02138',
            });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-navy-700 transition"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Add Guardian</span>
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

      {/* Search Toolbar */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by parent name, email, or ward name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-navy-800 focus:outline-none"
          />
        </form>
      </div>

      {/* Parents Table */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-navy-800 border-t-transparent" />
            <p className="mt-2">Loading guardian records...</p>
          </div>
        ) : parents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No guardians found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guardian Name</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Occupation</th>
                  <th className="py-3 px-4">Linked Scholars</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">{parent.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-3xs font-semibold text-slate-700">
                        {parent.relationship}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{parent.email}</div>
                      <div className="text-3xs font-mono text-slate-400">{parent.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{parent.occupation || '—'}</td>
                    <td className="py-3 px-4">
                      {parent.children && parent.children.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {parent.children.map((child) => (
                            <span
                              key={child.id}
                              className="rounded-full bg-navy-50 border border-navy-200 px-2 py-0.5 text-3xs font-medium text-navy-800"
                            >
                              {child.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-3xs text-slate-400">No linked scholar</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParent(parent);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-navy-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParent(parent);
                            setFormData({
                              firstName: parent.firstName,
                              lastName: parent.lastName,
                              email: parent.email,
                              phone: parent.phone || '',
                              occupation: parent.occupation || '',
                              relationship: parent.relationship || 'FATHER',
                              emergencyContact: parent.emergencyContact,
                              address: parent.address || '',
                              city: parent.city || '',
                              state: parent.state || '',
                              postalCode: parent.postalCode || '',
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
                            setParentToDelete(parent);
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

      {/* Create Guardian Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Guardian Record</h3>
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
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs"
                />
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="rounded-lg border px-3 py-1.5 text-xs bg-white"
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Guardian</option>
                </select>
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
                  Save Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Remove Guardian Record"
        message={`Are you sure you want to remove the guardian record for ${parentToDelete?.fullName}?`}
        confirmLabel="Remove Guardian"
        cancelLabel="Keep Record"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setParentToDelete(null);
        }}
      />
    </div>
  );
};

export default ParentsSection;
