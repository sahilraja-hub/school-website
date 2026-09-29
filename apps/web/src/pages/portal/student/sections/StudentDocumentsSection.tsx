import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface StudentDocumentsSectionProps {
  documents: any[];
  loading?: boolean;
}

export const StudentDocumentsSection: React.FC<StudentDocumentsSectionProps> = ({
  documents,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const displayDocs =
    documents.length > 0
      ? documents
      : [
          {
            id: 'doc-001',
            title: 'Oakridge Scholar Handbook & Academic Honor Code 2026–2027',
            category: 'HANDBOOK',
            fileName: 'scholar-handbook-2026.pdf',
            fileUrl: 'https://docs.oakridge.edu/handbooks/scholar-handbook-2026.pdf',
            mimeType: 'application/pdf',
            fileSize: 3420000,
            uploadedAt: '2026-08-15',
          },
          {
            id: 'doc-002',
            title: 'Annual Academic Calendar & Term Examination Schedules',
            category: 'CALENDAR',
            fileName: 'academic-calendar-2026-27.pdf',
            fileUrl: 'https://docs.oakridge.edu/calendars/academic-calendar-2026-27.pdf',
            mimeType: 'application/pdf',
            fileSize: 1250000,
            uploadedAt: '2026-08-20',
          },
          {
            id: 'doc-003',
            title: 'Advanced Mathematics (Grade 10) Syllabus & Reference Reading List',
            category: 'SYLLABUS',
            fileName: 'math10-syllabus.pdf',
            fileUrl: 'https://docs.oakridge.edu/curriculum/math10-syllabus.pdf',
            mimeType: 'application/pdf',
            fileSize: 840000,
            uploadedAt: '2026-09-01',
          },
          {
            id: 'doc-004',
            title: 'Physics & Chemistry Laboratory Safety Protocols',
            category: 'SAFETY',
            fileName: 'lab-safety-regulations.pdf',
            fileUrl: 'https://docs.oakridge.edu/guidelines/lab-safety-regulations.pdf',
            mimeType: 'application/pdf',
            fileSize: 1980000,
            uploadedAt: '2026-09-05',
          },
        ];

  const filtered = displayDocs.filter((d) =>
    (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '1.2 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = (doc: any) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      window.open(doc.fileUrl || '#', '_blank');
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-documents-section">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-crest-700" />
            Official Academic Documents & Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Download institutional handbooks, curriculum syllabi, and administrative guidelines
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((doc, idx) => {
            const isDownloading = downloadingId === doc.id;

            return (
              <div
                key={doc.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-crest-100 text-crest-800 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-crest-800 bg-crest-50 px-2.5 py-0.5 rounded">
                        {doc.category || 'DOCUMENT'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatFileSize(doc.fileSize)}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-mono truncate">
                      {doc.fileName || 'academic-document.pdf'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Updated: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-crest-900 text-white font-semibold text-xs hover:bg-crest-950 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Opening...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm">
            No documents found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};
