import React, { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  Edit2,
  Trash2,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  X,
  ExternalLink,
  Users,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface HomeworkItem {
  id: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  attachmentUrl?: string;
  isPublished?: boolean;
  sectionName?: string;
  subjectName?: string;
  submissionsCount?: number;
  createdAt?: string;
}

interface TeacherHomeworkProps {
  assignments: any[];
  preselectedSubjectId?: string;
}

export const TeacherHomeworkSection: React.FC<TeacherHomeworkProps> = ({
  assignments,
  preselectedSubjectId,
}) => {
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState(preselectedSubjectId || '');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<HomeworkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<HomeworkItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    sectionId: assignments[0]?.sectionId || 'sec-10a',
    subjectId: assignments[0]?.subjectId || 'sub-math',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalMarks: 20,
    attachmentUrl: '',
    isPublished: true,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch homework assignments
  const fetchHomework = async () => {
    setLoading(true);
    try {
      const res = await api.get('/homework');
      if (res.data.success) {
        setHomeworkList(res.data.data);
      }
    } catch {
      // Fallback sample data if api unavailable
      setHomeworkList([
        {
          id: 'hw-001',
          sectionId: 'sec-10a',
          subjectId: 'sub-math',
          sectionName: 'Grade 10-A',
          subjectName: 'Advanced Mathematics',
          title: 'Problem Set 4: Differential Calculus',
          description: 'Solve questions 1-15 on Page 142 of Advanced Mathematics textbook.',
          dueDate: '2026-10-15',
          totalMarks: 20,
          attachmentUrl: 'https://cdn.oakridge.edu/curriculum/math101-ps4.pdf',
          isPublished: true,
          submissionsCount: 18,
        },
        {
          id: 'hw-002',
          sectionId: 'sec-10a',
          subjectId: 'sub-math',
          sectionName: 'Grade 10-A',
          subjectName: 'Advanced Mathematics',
          title: 'Taylor Polynomials & Convergence Proofs',
          description: 'Review analytical convergence proofs and submit derivation paper.',
          dueDate: '2026-10-22',
          totalMarks: 25,
          attachmentUrl: 'https://cdn.oakridge.edu/curriculum/taylor-series.pdf',
          isPublished: false,
          submissionsCount: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({
      sectionId: assignments[0]?.sectionId || 'sec-10a',
      subjectId: assignments[0]?.subjectId || 'sub-math',
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 20,
      attachmentUrl: '',
      isPublished: true,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (hw: HomeworkItem) => {
    setEditingHomework(hw);
    setFormData({
      sectionId: hw.sectionId,
      subjectId: hw.subjectId,
      title: hw.title,
      description: hw.description,
      dueDate: hw.dueDate,
      totalMarks: hw.totalMarks,
      attachmentUrl: hw.attachmentUrl || '',
      isPublished: hw.isPublished !== false,
    });
    setFormError(null);
  };

  const handleSaveHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setFormError('Title must be at least 3 characters.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      setFormError('Description must be at least 5 characters.');
      return;
    }

    try {
      if (editingHomework) {
        // PATCH
        await api.patch(`/homework/${editingHomework.id}`, formData);
        setActionSuccess('Homework assignment updated successfully.');
      } else {
        // POST
        await api.post('/homework', formData);
        setActionSuccess('Homework assignment created and published.');
      }

      setIsCreateModalOpen(false);
      setEditingHomework(null);
      fetchHomework();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setFormError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to save homework assignment.'
      );
    }
  };

  const handleTogglePublish = async (hw: HomeworkItem) => {
    try {
      const nextState = !hw.isPublished;
      await api.patch(`/homework/${hw.id}`, { isPublished: nextState });
      setHomeworkList((prev) =>
        prev.map((item) => (item.id === hw.id ? { ...item, isPublished: nextState } : item))
      );
      setActionSuccess(`Assignment ${nextState ? 'published' : 'moved to draft'}.`);
      setTimeout(() => setActionSuccess(null), 2500);
    } catch {
      setActionSuccess('Unable to update publish state.');
      setTimeout(() => setActionSuccess(null), 2500);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/homework/${deletingId}`);
      setHomeworkList((prev) => prev.filter((h) => h.id !== deletingId));
      setActionSuccess('Homework assignment successfully deleted.');
      setDeletingId(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete homework');
    }
  };

  // Filtered List
  const filteredList = homeworkList.filter((hw) => {
    const matchesSection = !sectionFilter || hw.sectionId === sectionFilter;
    const matchesSubject = !subjectFilter || hw.subjectId === subjectFilter;
    const matchesSearch =
      !searchTerm ||
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Coursework & Homework</h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, publish, edit, and evaluate assignments with attached materials for your classes.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Assign New Homework
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Section Filter */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="">All Assigned Sections</option>
            {assignments.map((a) => (
              <option key={a.sectionId} value={a.sectionId}>
                {a.className || 'Grade 10'} • {a.sectionName || 'Section A'}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="">All Subjects</option>
            <option value="sub-math">Advanced Mathematics</option>
            <option value="sub-phys">Physics & Mechanics</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredList.length > 0 ? (
          filteredList.map((hw) => (
            <div
              key={hw.id}
              className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-amber-500/30 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-white/5 border border-white/10 text-amber-300">
                      {hw.sectionId === 'sec-10b' ? 'Grade 10-B' : 'Grade 10-A'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {hw.subjectId === 'sub-phys' ? 'Physics' : 'Mathematics'}
                    </span>
                  </div>

                  {/* Publish Toggle Button */}
                  <button
                    onClick={() => handleTogglePublish(hw)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                      hw.isPublished !== false
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}
                  >
                    {hw.isPublished !== false ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition">
                  {hw.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {hw.description}
                </p>

                {/* Attachment & Meta */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Due: {hw.dueDate}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-white font-medium">
                      {hw.totalMarks} Marks
                    </span>
                  </div>

                  {hw.attachmentUrl && (
                    <a
                      href={hw.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition font-medium"
                    >
                      <LinkIcon className="w-3 h-3" />
                      Attached Material
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setViewingSubmissions(hw)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Submissions ({hw.submissionsCount || 1})
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(hw)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                    title="Edit Assignment"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(hw.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-12 text-center text-slate-400 text-sm bg-[#0B1528]/50 border border-white/5 rounded-2xl">
            No coursework assignments found matching the criteria. Click "Assign New Homework" to create one.
          </div>
        )}
      </div>

      {/* Create / Edit Homework Modal */}
      {(isCreateModalOpen || editingHomework) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingHomework ? 'Edit Homework Assignment' : 'Assign New Coursework'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingHomework(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveHomework} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Target Section */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Section</label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    {assignments.map((a) => (
                      <option key={a.sectionId} value={a.sectionId}>
                        {a.className || 'Grade 10'} • {a.sectionName || 'Section A'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="sub-math">Advanced Mathematics</option>
                    <option value="sub-phys">Physics & Mechanics</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4: Matrix Transformations Problem Set"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Instructions & Rubric</label>
                <textarea
                  rows={3}
                  placeholder="Instructions for students, problem set numbers, and guidelines..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Due Date */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                {/* Total Marks */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value, 10) || 20 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* File Attachment URL */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Attachment URL / Document Link</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://cdn.oakridge.edu/materials/worksheet.pdf"
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Publish State */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
                />
                <label htmlFor="isPublishedCheck" className="text-slate-300 select-none cursor-pointer">
                  Publish immediately (visible on Student & Parent Portals)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingHomework(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 transition"
                >
                  {editingHomework ? 'Update Assignment' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white">Delete Homework?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this assignment? All student submission records linked to this task will be removed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {viewingSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  Student Submissions
                </h3>
                <p className="text-xs text-slate-400">{viewingSubmissions.title}</p>
              </div>
              <button
                onClick={() => setViewingSubmissions(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">Liam Vance (10-A-01)</span>
                  <span className="text-[11px] text-slate-400">Submitted on time • 2 pages attached</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
                    19 / 20 Marks
                  </span>
                  <span className="text-[10px] text-slate-400">Graded</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">Emma Watson (10-A-02)</span>
                  <span className="text-[11px] text-slate-400">Submitted today at 09:15</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                    Pending Evaluation
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSubmissions(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
              >
                Close Submissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
