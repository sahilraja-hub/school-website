import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Search, CheckCircle, X } from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ResultDto } from '@school/shared';

export const ResultsSection: React.FC = () => {
  const [results, setResults] = useState<ResultDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examSubjectId: 'es-1',
    studentId: 'stud-001',
    marksObtained: 95,
    remarks: 'Outstanding performance in analytical proofs.',
  });

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/results');
      if (res.data.success && Array.isArray(res.data.data)) {
        setResults(res.data.data);
      }
    } catch (err) {
      setError(err);
      setResults([
        { id: 'res-1', examSubjectId: 'es-1', subjectName: 'Advanced Mathematics', studentId: 'stud-001', studentName: 'Liam Vance', marksObtained: 95, percentage: 95, grade: 'A*', isPassed: true, remarks: 'Distinction' },
        { id: 'res-2', examSubjectId: 'es-2', subjectName: 'Physics', studentId: 'stud-001', studentName: 'Liam Vance', marksObtained: 88, percentage: 88, grade: 'A', isPassed: true, remarks: 'Strong lab work' },
        { id: 'res-3', examSubjectId: 'es-1', subjectName: 'Advanced Mathematics', studentId: 'stud-002', studentName: 'Sophia Chen', marksObtained: 92, percentage: 92, grade: 'A*', isPassed: true, remarks: 'Excellent' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/results', formData);
      setActionSuccess('Gradebook marks recorded successfully.');
      setIsModalOpen(false);
      fetchResults();
    } catch (err) {
      setError(err);
    }
  };

  const filtered = results.filter((r) =>
    (r.studentName && r.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.subjectName && r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center">
            <Award className="mr-2 h-6 w-6 text-gold-500" />
            <span>Academic Results & Gradebook</span>
          </h2>
          <p className="text-xs text-slate-500">Record marks, calculate percentage/grades, and verify honors standing.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
        >
          <Plus className="h-4 w-4 text-gold-400" />
          <span>Record Marks</span>
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
            placeholder="Search by scholar or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
            <tr>
              <th className="py-3 px-4">Scholar</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Percentage</th>
              <th className="py-3 px-4">Letter Grade</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-semibold text-slate-900">{res.studentName}</td>
                <td className="py-3 px-4 text-slate-700">{res.subjectName}</td>
                <td className="py-3 px-4 font-mono font-medium">{res.marksObtained} / 100</td>
                <td className="py-3 px-4 font-mono">{res.percentage}%</td>
                <td className="py-3 px-4">
                  <span className="font-bold text-navy-800">{res.grade}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-3xs font-semibold text-emerald-700 border border-emerald-200">
                    Passed
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500 italic text-3xs">{res.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Record Gradebook Marks</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">Scholar</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full rounded-lg border px-3 py-1.5 text-xs bg-white"
                >
                  <option value="stud-001">Liam Vance (Grade 10-A)</option>
                  <option value="stud-002">Sophia Chen (Grade 10-A)</option>
                  <option value="stud-003">Alexander Hayes (Grade 11-B)</option>
                </select>
              </div>
              <input
                type="number"
                required
                placeholder="Marks Obtained (0 - 100)"
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Teacher Remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full rounded-lg border px-3 py-1.5 text-xs"
              />
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-3 py-1.5 text-xs">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white">
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
