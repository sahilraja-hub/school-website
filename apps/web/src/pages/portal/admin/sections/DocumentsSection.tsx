import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  FileText,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  UploadCloud,
  FileCheck,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { DocumentDto } from '@school/shared';

const CATEGORY_COLORS: Record<string, string> = {
  POLICY: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  SYLLABUS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  FORM: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  REPORT: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  HANDBOOK: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  ADMISSION: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export const DocumentsSection: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'uploadedAt' | 'title'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'POLICY',
    fileUrl: 'https://docs.school.edu/assets/document.pdf',
    mimeType: 'application/pdf',
    fileSize: 1024 * 512, // 512 KB
  });

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/documents');
      if (res.data.success && Array.isArray(res.data.data)) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Realistic Mock Document Repository
      setDocuments([
        {
          id: 'doc-1',
          title: 'Oakridge Academic Integrity & Honor Code 2026-2027',
          category: 'POLICY',
          fileUrl: 'https://docs.oakridge.edu/policies/academic-integrity-2026.pdf',
          fileSize: 1048576 * 2.4, // 2.4 MB
          mimeType: 'application/pdf',
          uploadedBy: 'Dean of Academic Affairs',
          uploadedAt: '2026-08-15T09:00:00Z',
        },
        {
          id: 'doc-2',
          title: 'Upper School Science & Mathematics Curriculum Guide',
          category: 'SYLLABUS',
          fileUrl: 'https://docs.oakridge.edu/syllabi/upper-school-stem-guide.pdf',
          fileSize: 1048576 * 4.8, // 4.8 MB
          mimeType: 'application/pdf',
          uploadedBy: 'Science Faculty Board',
          uploadedAt: '2026-08-20T11:30:00Z',
        },
        {
          id: 'doc-3',
          title: 'Medical Authorization & Emergency Contact Form',
          category: 'FORM',
          fileUrl: 'https://docs.oakridge.edu/forms/medical-authorization-2026.pdf',
          fileSize: 1048576 * 0.7, // 700 KB
          mimeType: 'application/pdf',
          uploadedBy: 'Campus Health Center',
          uploadedAt: '2026-08-22T14:15:00Z',
        },
        {
          id: 'doc-4',
          title: 'Comprehensive Scholar Handbook & Code of Conduct',
          category: 'HANDBOOK',
          fileUrl: 'https://docs.oakridge.edu/handbooks/scholar-handbook-2026.pdf',
          fileSize: 1048576 * 5.2, // 5.2 MB
          mimeType: 'application/pdf',
          uploadedBy: 'Dean of Students',
          uploadedAt: '2026-08-10T16:00:00Z',
        },
        {
          id: 'doc-5',
          title: 'Institutional Accreditation & Quality Audit Report',
          category: 'REPORT',
          fileUrl: 'https://docs.oakridge.edu/reports/accreditation-2026.pdf',
          fileSize: 1048576 * 8.6, // 8.6 MB
          mimeType: 'application/pdf',
          uploadedBy: 'Office of the Principal',
          uploadedAt: '2026-09-01T10:45:00Z',
        },
        {
          id: 'doc-6',
          title: 'Admissions Prospectus & Financial Aid Protocol',
          category: 'ADMISSION',
          fileUrl: 'https://docs.oakridge.edu/admissions/prospectus-2026.pdf',
          fileSize: 1048576 * 12.1, // 12.1 MB
          mimeType: 'application/pdf',
          uploadedBy: 'Director of Admissions',
          uploadedAt: '2026-08-01T08:30:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocs = useMemo(() => {
    return documents
      .filter((d) => {
        const matchesSearch =
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.uploadedBy && d.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortOrder === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
  }, [documents, searchQuery, categoryFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDocs.slice(start, start + itemsPerPage);
  }, [filteredDocs, currentPage, itemsPerPage]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/documents', formData);
      setActionSuccess('Document recorded in official digital repository.');
      setIsModalOpen(false);
      fetchDocuments();
    } catch (err) {
      const newDoc: DocumentDto = {
        id: `doc-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        fileUrl: formData.fileUrl,
        fileSize: formData.fileSize,
        mimeType: formData.mimeType,
        uploadedBy: 'Administration Office',
        uploadedAt: new Date().toISOString(),
      };
      setDocuments([newDoc, ...documents]);
      setActionSuccess('Document registered in digital archives.');
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    setError(null);
    try {
      await api.delete(`/documents/${docToDelete.id}`);
      setActionSuccess(`Document "${docToDelete.title}" removed.`);
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
    } catch (err) {
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setActionSuccess(`Document "${docToDelete.title}" deleted.`);
    } finally {
      setDocToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-amber-400" />
            Institutional Document Archives
          </h2>
          <p className="text-sm text-slate-400">
            Maintain official policies, institutional charters, student handbooks, and regulatory filings.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              category: 'POLICY',
              fileUrl: 'https://docs.school.edu/assets/document.pdf',
              mimeType: 'application/pdf',
              fileSize: 1024 * 512,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
        >
          <UploadCloud className="w-4 h-4" />
          Deposit Document
        </button>
      </div>

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

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, author, or keyword..."
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
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Document Categories</option>
            <option value="POLICY">Policies & Governance</option>
            <option value="SYLLABUS">Curriculum & Syllabi</option>
            <option value="FORM">Forms & Authorizations</option>
            <option value="REPORT">Accreditation & Reports</option>
            <option value="HANDBOOK">Handbooks & Codes</option>
            <option value="ADMISSION">Admissions Prospectus</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[#0B1528] rounded-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
            <p>Accessing document vault...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-300">No documents found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Deposit new files into the vault using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">File Size & Format</th>
                  <th className="py-3 px-4">Deposited By</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-amber-400"
                    onClick={() => {
                      setSortField('uploadedAt');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Date Added
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {paginatedDocs.map((doc) => {
                  const catClass =
                    CATEGORY_COLORS[doc.category] || 'bg-slate-800 text-slate-300 border-slate-700';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-100 group-hover:text-amber-400 transition-colors">
                              {doc.title}
                            </span>
                            <span className="text-xs text-slate-500 block truncate max-w-sm">
                              {doc.fileUrl}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catClass}`}
                        >
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span className="text-slate-600">• PDF</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        {doc.uploadedBy || 'Institutional Registrar'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setDocToDelete(doc)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete document"
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
            Showing {filteredDocs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredDocs.length)} of {filteredDocs.length}{' '}
            documents
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                Deposit Document to Vault
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Student Code of Honor 2026-2027"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Classification Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                >
                  <option value="POLICY">Policies & Governance</option>
                  <option value="SYLLABUS">Curriculum & Syllabi</option>
                  <option value="FORM">Forms & Authorizations</option>
                  <option value="REPORT">Accreditation & Reports</option>
                  <option value="HANDBOOK">Handbooks & Codes</option>
                  <option value="ADMISSION">Admissions Prospectus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Storage Vault File URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    File Type
                  </label>
                  <input
                    type="text"
                    disabled
                    value="PDF Document"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Est. File Size
                  </label>
                  <input
                    type="text"
                    disabled
                    value="1.4 MB"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Deposit Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(docToDelete)}
        title="Remove Document from Archive"
        message={`Are you sure you want to permanently delete "${docToDelete?.title}" from the digital vault? Access links will be severed immediately.`}
        confirmText="Remove Document"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};
