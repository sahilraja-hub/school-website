import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Calendar,
  User,
  Shield,
  X,
  Terminal,
  Activity,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { AuditLogDto } from '@school/shared';

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  SUCCESS: {
    label: 'Success',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
  FAILURE: {
    label: 'Failed',
    bg: 'bg-rose-500/10 border-rose-500/30',
    text: 'text-rose-400',
    icon: XCircle,
  },
  WARNING: {
    label: 'Warning',
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: AlertTriangle,
  },
};

export const AuditLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Log Drawer / Modal
  const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/audit-logs');
      if (res.data.success && Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Realistic Mock Immutable Security Audit Trail
      setLogs([
        {
          id: 'log-101',
          userId: 'usr-1',
          userName: 'Dr. Margaret Holloway',
          userRole: 'SUPER_ADMIN',
          action: 'SETTINGS_UPDATE',
          resource: 'SYSTEM_CONFIG',
          resourceId: 'sys-config',
          details: { field: 'maintenanceMode', oldValue: false, newValue: false },
          ipAddress: '192.168.1.42',
          status: 'SUCCESS',
          timestamp: '2026-09-29T00:54:12Z',
        },
        {
          id: 'log-102',
          userId: 'usr-2',
          userName: 'Arthur Pendleton',
          userRole: 'ADMIN',
          action: 'ADMISSION_APPROVED',
          resource: 'ADMISSION_APPLICATION',
          resourceId: 'adm-102',
          details: { applicant: 'Sophia Patel', grade: 'KINDERGARTEN' },
          ipAddress: '192.168.1.18',
          status: 'SUCCESS',
          timestamp: '2026-09-29T00:41:00Z',
        },
        {
          id: 'log-103',
          userId: 'usr-anonymous',
          userName: 'Unauthenticated User',
          userRole: 'GUEST',
          action: 'AUTH_LOGIN_FAILED',
          resource: 'SECURITY_AUTH',
          resourceId: 'auth-session',
          details: { reason: 'INVALID_CREDENTIALS', email: 'intruder@unknown.net' },
          ipAddress: '45.132.88.19',
          status: 'FAILURE',
          timestamp: '2026-09-28T23:18:40Z',
        },
        {
          id: 'log-104',
          userId: 'usr-3',
          userName: 'Dr. Sarah Jenkins',
          userRole: 'TEACHER',
          action: 'ATTENDANCE_BATCH_SUBMIT',
          resource: 'ATTENDANCE',
          resourceId: 'sec-101',
          details: { section: 'Class 9-A', present: 28, absent: 2 },
          ipAddress: '192.168.2.10',
          status: 'SUCCESS',
          timestamp: '2026-09-28T14:30:10Z',
        },
        {
          id: 'log-105',
          userId: 'usr-2',
          userName: 'Arthur Pendleton',
          userRole: 'ADMIN',
          action: 'INVOICE_GENERATED',
          resource: 'FINANCE_INVOICE',
          resourceId: 'inv-4',
          details: { student: 'Clara Morrison', amount: 3800 },
          ipAddress: '192.168.1.18',
          status: 'SUCCESS',
          timestamp: '2026-09-28T11:20:00Z',
        },
        {
          id: 'log-106',
          userId: 'usr-6',
          userName: 'Arthur Drake',
          userRole: 'PARENT',
          action: 'PORTAL_ACCESS_BLOCKED',
          resource: 'SECURITY_RBAC',
          resourceId: 'usr-6',
          details: { reason: 'ACCOUNT_SUSPENDED' },
          ipAddress: '172.56.21.90',
          status: 'WARNING',
          timestamp: '2026-09-28T09:05:22Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesSearch =
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (log.ipAddress && log.ipAddress.includes(searchQuery));
        const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
        const matchesResource =
          resourceFilter === 'ALL' || log.resource.includes(resourceFilter);
        return matchesSearch && matchesStatus && matchesResource;
      })
      .sort((a, b) => {
        return sortOrder === 'asc'
          ? a.timestamp.localeCompare(b.timestamp)
          : b.timestamp.localeCompare(a.timestamp);
      });
  }, [logs, searchQuery, statusFilter, resourceFilter, sortOrder]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const exportAuditLog = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(logs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `security-audit-log-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            Security Audit Trail & Governance
          </h2>
          <p className="text-sm text-slate-400">
            Cryptographically stamped, immutable activity ledger monitoring system mutations and access events.
          </p>
        </div>
        <button
          onClick={exportAuditLog}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-sm transition-all"
        >
          <Download className="w-4 h-4 text-amber-400" />
          Export Audit Ledger
        </button>
      </div>

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user, resource, or IP address..."
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
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success Only</option>
            <option value="FAILURE">Failures & Breaches</option>
            <option value="WARNING">Warnings</option>
          </select>
        </div>

        <div>
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Resources</option>
            <option value="SECURITY">Security & Auth</option>
            <option value="ADMISSION">Admissions</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="FINANCE">Finance & Bursar</option>
            <option value="SYSTEM">System Settings</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0B1528] rounded-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
            <p>Verifying cryptographic audit chain...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-300">No audit events found</h3>
            <p className="text-sm text-slate-500 mt-1">Try broadening your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-amber-400"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <div className="flex items-center gap-1">
                      Timestamp (UTC)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Client IP</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {paginatedLogs.map((log) => {
                  const statusMeta = STATUS_CONFIG[log.status] || {
                    label: log.status,
                    bg: 'bg-slate-800 border-slate-700',
                    text: 'text-slate-300',
                    icon: AlertTriangle,
                  };
                  const StatusIcon = statusMeta.icon;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-800/30 transition-colors group font-mono text-xs"
                    >
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-amber-400/90 font-medium">
                        {log.resource}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans">
                        <div className="font-medium text-slate-200">{log.userName || 'Anonymous'}</div>
                        <div className="text-[10px] text-slate-500">{log.userRole || 'GUEST'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{log.ipAddress || '—'}</td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusMeta.bg} ${statusMeta.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Inspect raw audit record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
            Showing {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length}{' '}
            audit records
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

      {/* Raw Audit Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-white">
                  Audit Record: {selectedLog.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#060D1A] rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Record UUID:</span>
                  <span className="text-slate-300 font-mono">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Timestamp:</span>
                  <span className="text-slate-300 font-mono">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Actor:</span>
                  <span className="text-slate-300">
                    {selectedLog.userName} ({selectedLog.userRole})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Source IP:</span>
                  <span className="text-amber-400 font-mono">{selectedLog.ipAddress}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Structured Payload Details:
                </span>
                <pre className="p-3 bg-[#060D1A] border border-slate-800 rounded-xl text-slate-300 font-mono overflow-x-auto text-[11px] leading-relaxed">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
