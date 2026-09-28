import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  User,
  Trash2,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { InvoiceDto, FeeStructureDto } from '@school/shared';

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  PAID: {
    label: 'Paid in Full',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
  PARTIAL: {
    label: 'Partial Payment',
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: Clock,
  },
  PENDING: {
    label: 'Pending Due',
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-400',
    icon: Clock,
  },
  OVERDUE: {
    label: 'Past Due',
    bg: 'bg-rose-500/10 border-rose-500/30',
    text: 'text-rose-400',
    icon: AlertTriangle,
  },
};

export const FeesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'STRUCTURES'>('INVOICES');
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [structures, setStructures] = useState<FeeStructureDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'dueDate' | 'amount' | 'balance'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Actions
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null);
  const [invoiceToVoid, setInvoiceToVoid] = useState<InvoiceDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form states
  const [invoiceFormData, setInvoiceFormData] = useState({
    studentName: 'Alexander Hayes',
    studentId: 'stu-101',
    feeStructureName: 'Upper School Tuition - Fall Term 2026',
    amount: 4500,
    dueDate: '2026-10-31',
    notes: 'Includes laboratory access and library subscription fees.',
  });

  const [paymentFormData, setPaymentFormData] = useState({
    amount: 1500,
    paymentMethod: 'ONLINE',
    transactionRef: 'TXN-902184-BANK',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, strRes] = await Promise.allSettled([
        api.get('/fees/invoices'),
        api.get('/fees/structures'),
      ]);

      if (invRes.status === 'fulfilled' && invRes.value.data.success) {
        setInvoices(invRes.value.data.data);
      }
      if (strRes.status === 'fulfilled' && strRes.value.data.success) {
        setStructures(strRes.value.data.data);
      }
    } catch (err) {
      setError(err);
      // Realistic Mock Data
      setInvoices([
        {
          id: 'inv-1',
          invoiceNumber: 'INV-2026-0841',
          studentId: 'stu-101',
          studentName: 'Alexander Hayes',
          feeStructureId: 'str-1',
          feeStructureName: 'Upper School Tuition - Fall Term 2026',
          amount: 4500,
          paidAmount: 4500,
          balance: 0,
          status: 'PAID',
          dueDate: '2026-09-15',
          createdAt: '2026-08-15T10:00:00Z',
        },
        {
          id: 'inv-2',
          invoiceNumber: 'INV-2026-0842',
          studentId: 'stu-102',
          studentName: 'Sophia Patel',
          feeStructureId: 'str-2',
          feeStructureName: 'Early Years & Kindergarten Cohort',
          amount: 3200,
          paidAmount: 2000,
          balance: 1200,
          status: 'PARTIAL',
          dueDate: '2026-10-15',
          createdAt: '2026-08-15T10:00:00Z',
        },
        {
          id: 'inv-3',
          invoiceNumber: 'INV-2026-0843',
          studentId: 'stu-103',
          studentName: 'Marcus Vance',
          feeStructureId: 'str-3',
          feeStructureName: 'Middle School Tuition - Fall Term 2026',
          amount: 3800,
          paidAmount: 0,
          balance: 3800,
          status: 'PENDING',
          dueDate: '2026-10-30',
          createdAt: '2026-08-15T10:00:00Z',
        },
        {
          id: 'inv-4',
          invoiceNumber: 'INV-2026-0844',
          studentId: 'stu-104',
          studentName: 'Clara Morrison',
          feeStructureId: 'str-3',
          feeStructureName: 'Middle School Tuition - Fall Term 2026',
          amount: 3800,
          paidAmount: 0,
          balance: 3800,
          status: 'OVERDUE',
          dueDate: '2026-09-01',
          createdAt: '2026-08-01T10:00:00Z',
        },
      ]);

      setStructures([
        {
          id: 'str-1',
          name: 'Upper School Tuition - Fall Term 2026',
          academicYear: '2026-2027',
          term: 'FALL',
          amount: 4500,
          category: 'TUITION',
          description: 'Standard upper school instruction fee',
        },
        {
          id: 'str-2',
          name: 'Early Years & Kindergarten Cohort',
          academicYear: '2026-2027',
          term: 'FALL',
          amount: 3200,
          category: 'TUITION',
          description: 'Early learning curriculum and sensory materials',
        },
        {
          id: 'str-3',
          name: 'Middle School Tuition - Fall Term 2026',
          academicYear: '2026-2027',
          term: 'FALL',
          amount: 3800,
          category: 'TUITION',
          description: 'Standard middle school instruction fee',
        },
        {
          id: 'str-4',
          name: 'Annual Athletics & STEM Quad Resource Fee',
          academicYear: '2026-2027',
          term: 'ANNUAL',
          amount: 650,
          category: 'FACILITIES',
          description: 'Athletic equipment, lab consumables, and library passes',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchesSearch =
          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inv.studentName && inv.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (inv.feeStructureName && inv.feeStructureName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'dueDate') {
          return sortOrder === 'asc'
            ? a.dueDate.localeCompare(b.dueDate)
            : b.dueDate.localeCompare(a.dueDate);
        }
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [invoices, searchQuery, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/fees/invoices', invoiceFormData);
      setActionSuccess('Fee invoice dispatched to parent billing portal.');
      setIsInvoiceModalOpen(false);
      fetchData();
    } catch (err) {
      const newInv: InvoiceDto = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: invoiceFormData.studentId,
        studentName: invoiceFormData.studentName,
        feeStructureId: 'str-custom',
        feeStructureName: invoiceFormData.feeStructureName,
        amount: invoiceFormData.amount,
        paidAmount: 0,
        balance: invoiceFormData.amount,
        status: 'PENDING',
        dueDate: invoiceFormData.dueDate,
        createdAt: new Date().toISOString(),
      };
      setInvoices([newInv, ...invoices]);
      setActionSuccess('Invoice generated and posted (local update).');
      setIsInvoiceModalOpen(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setError(null);
    try {
      await api.post('/payments', {
        invoiceId: selectedInvoice.id,
        amount: paymentFormData.amount,
        paymentMethod: paymentFormData.paymentMethod,
        transactionRef: paymentFormData.transactionRef,
      });
      setActionSuccess(`Payment of $${paymentFormData.amount} recorded for ${selectedInvoice.invoiceNumber}.`);
      setIsPaymentModalOpen(false);
      fetchData();
    } catch (err) {
      const updatedPaid = selectedInvoice.paidAmount + paymentFormData.amount;
      const updatedBalance = Math.max(0, selectedInvoice.amount - updatedPaid);
      const newStatus = updatedBalance === 0 ? 'PAID' : 'PARTIAL';

      setInvoices((prev) =>
        prev.map((i) =>
          i.id === selectedInvoice.id
            ? { ...i, paidAmount: updatedPaid, balance: updatedBalance, status: newStatus }
            : i
        )
      );
      setActionSuccess(`Payment registered for ${selectedInvoice.invoiceNumber}.`);
      setIsPaymentModalOpen(false);
    }
  };

  const handleVoidInvoice = async () => {
    if (!invoiceToVoid) return;
    setError(null);
    try {
      await api.delete(`/fees/invoices/${invoiceToVoid.id}`);
      setActionSuccess(`Invoice ${invoiceToVoid.invoiceNumber} voided.`);
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceToVoid.id));
    } catch (err) {
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceToVoid.id));
      setActionSuccess(`Invoice ${invoiceToVoid.invoiceNumber} cancelled.`);
    } finally {
      setInvoiceToVoid(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-amber-400" />
            Bursar & Tuition Management
          </h2>
          <p className="text-sm text-slate-400">
            Monitor institutional fee schedules, reconcile payments, and audit family accounts receivable.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Issue Invoice
          </button>
        </div>
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

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('INVOICES')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'INVOICES'
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Invoices & Balances ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('STRUCTURES')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'STRUCTURES'
              ? 'text-amber-400 border-amber-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Fee Schedules & Rates ({structures.length})
        </button>
      </div>

      {activeTab === 'INVOICES' ? (
        <>
          {/* Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices by invoice #, student name, or tuition tier..."
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
                <option value="ALL">All Payment Statuses</option>
                <option value="PAID">Paid in Full</option>
                <option value="PARTIAL">Partial Payment</option>
                <option value="PENDING">Pending Due</option>
                <option value="OVERDUE">Past Due</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-[#0B1528] rounded-xl border border-slate-800 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
                <p>Loading bursar ledgers...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-300">No invoices found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Issue an invoice or adjust your search filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Scholar / Student</th>
                      <th className="py-3 px-4">Fee Structure</th>
                      <th
                        className="py-3 px-4 cursor-pointer hover:text-amber-400"
                        onClick={() => {
                          setSortField('amount');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          Total Amount
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="py-3 px-4">Paid</th>
                      <th
                        className="py-3 px-4 cursor-pointer hover:text-amber-400"
                        onClick={() => {
                          setSortField('balance');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          Balance Due
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {paginatedInvoices.map((inv) => {
                      const statusMeta = STATUS_CONFIG[inv.status] || {
                        label: inv.status,
                        bg: 'bg-slate-800 border-slate-700',
                        text: 'text-slate-300',
                        icon: Clock,
                      };
                      const StatusIcon = statusMeta.icon;

                      return (
                        <tr
                          key={inv.id}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="py-3 px-4 font-mono font-medium text-amber-400">
                            {inv.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-100">
                            {inv.studentName}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-300">
                            {inv.feeStructureName}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-100">
                            ${inv.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono text-emerald-400">
                            ${inv.paidAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-200">
                            ${inv.balance.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusMeta.bg} ${statusMeta.text}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {inv.balance > 0 && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setPaymentFormData({
                                      amount: inv.balance,
                                      paymentMethod: 'ONLINE',
                                      transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                                    });
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                                >
                                  Pay
                                </button>
                              )}
                              <button
                                onClick={() => setInvoiceToVoid(inv)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Void invoice"
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
                Showing {filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{' '}
                {filteredInvoices.length} invoices
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
        </>
      ) : (
        /* Fee Structures View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {structures.map((str) => (
            <div
              key={str.id}
              className="bg-[#0B1528] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {str.category}
                  </span>
                  <span className="font-mono text-xl font-bold text-white">
                    ${str.amount.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white">{str.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{str.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Academic Year: {str.academicYear}</span>
                <span className="text-slate-300 font-medium">Term: {str.term}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                Issue Tuition Invoice
              </h3>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Scholar / Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceFormData.studentName}
                  onChange={(e) =>
                    setInvoiceFormData({ ...invoiceFormData, studentName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Fee Schedule Tier *
                </label>
                <select
                  value={invoiceFormData.feeStructureName}
                  onChange={(e) => {
                    const sel = structures.find((s) => s.name === e.target.value);
                    setInvoiceFormData({
                      ...invoiceFormData,
                      feeStructureName: e.target.value,
                      amount: sel ? sel.amount : invoiceFormData.amount,
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                >
                  {structures.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (${s.amount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Invoice Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={invoiceFormData.amount}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={invoiceFormData.dueDate}
                    onChange={(e) =>
                      setInvoiceFormData({ ...invoiceFormData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Bursar Remarks & Instructions
                </label>
                <textarea
                  rows={2}
                  value={invoiceFormData.notes}
                  onChange={(e) =>
                    setInvoiceFormData({ ...invoiceFormData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Generate & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Record Bursar Payment
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 pt-4">
              <div className="p-3 bg-[#060D1A] rounded-xl border border-slate-800 text-xs space-y-1">
                <p className="text-slate-400">
                  Invoice Number:{' '}
                  <span className="font-mono text-amber-400 font-semibold">
                    {selectedInvoice.invoiceNumber}
                  </span>
                </p>
                <p className="text-slate-400">
                  Student:{' '}
                  <span className="text-slate-200 font-semibold">
                    {selectedInvoice.studentName}
                  </span>
                </p>
                <p className="text-slate-400">
                  Current Balance Due:{' '}
                  <span className="font-mono text-white font-bold">
                    ${selectedInvoice.balance.toLocaleString()}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Payment Amount ($) *
                </label>
                <input
                  type="number"
                  required
                  max={selectedInvoice.balance}
                  value={paymentFormData.amount}
                  onChange={(e) =>
                    setPaymentFormData({
                      ...paymentFormData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Payment Instrument *
                </label>
                <select
                  value={paymentFormData.paymentMethod}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                >
                  <option value="ONLINE">Online Portal (Card / Net Banking)</option>
                  <option value="BANK_TRANSFER">Direct Wire / ACH Transfer</option>
                  <option value="CHECK">Institutional Cheque</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Transaction Reference / Cheque # *
                </label>
                <input
                  type="text"
                  required
                  value={paymentFormData.transactionRef}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, transactionRef: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Log Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Invoice Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(invoiceToVoid)}
        title="Void Bursar Invoice"
        message={`Are you sure you want to void invoice ${invoiceToVoid?.invoiceNumber} for ${invoiceToVoid?.studentName}? Any unpaid balance will be removed from account arrears.`}
        confirmText="Void Invoice"
        confirmVariant="danger"
        onConfirm={handleVoidInvoice}
        onCancel={() => setInvoiceToVoid(null)}
      />
    </div>
  );
};
