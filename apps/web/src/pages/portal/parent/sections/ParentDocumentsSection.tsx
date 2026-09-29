import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  fileSize: string;
  updatedAt: string;
  description: string;
}

interface ParentDocumentsSectionProps {
  documents: DocumentItem[];
  loading?: boolean;
}

export const ParentDocumentsSection: React.FC<ParentDocumentsSectionProps> = ({
  documents,
  loading,
}) => {
  const [search, setSearch] = useState('');

  // Fallback demo documents
  const defaultDocs: DocumentItem[] = [
    {
      id: 'doc-01',
      title: 'Oakridge Scholar & Family Handbook (2026–2027)',
      category: 'Institutional Policies',
      fileSize: '3.4 MB',
      updatedAt: '2026-09-01',
      description:
        'Complete academic regulations, honor code expectations, disciplinary guidelines, and parental engagement standards.',
    },
    {
      id: 'doc-02',
      title: 'Senior High School AP Curriculum Pacing & Syllabi',
      category: 'Academic Curricula',
      fileSize: '4.8 MB',
      updatedAt: '2026-09-15',
      description:
        'Comprehensive subject pacing maps, recommended literature lists, and College Board examination timelines.',
    },
    {
      id: 'doc-03',
      title: 'Bursar Tuition Schedule & Sibling Discount Policy',
      category: 'Finance & Tuition',
      fileSize: '1.2 MB',
      updatedAt: '2026-08-20',
      description:
        'Fee structures, payment milestone due dates, tax identification numbers, and wire transfer routing procedures.',
    },
    {
      id: 'doc-04',
      title: 'Health, Immunization & Infirmary Care Protocol',
      category: 'Medical & Safety',
      fileSize: '1.9 MB',
      updatedAt: '2026-09-10',
      description:
        'Emergency allergen protocols, prescription medication handling, and mandatory physician immunization records.',
    },
    {
      id: 'doc-05',
      title: 'Campus Transit, Bus Routes & Safety Manifest',
      category: 'Transportation',
      fileSize: '2.1 MB',
      updatedAt: '2026-08-30',
      description:
        'Daily morning and afternoon bus pickup schedules, driver credentials, and GPS tracking application guidance.',
    },
  ];

  const displayDocs = documents.length > 0 ? documents : defaultDocs;

  const filteredDocs = displayDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8" data-testid="parent-documents-section">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-crest-700" />
            <span>Institutional Handbooks & Documents</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified institutional publications, curriculum syllabi, and official parental guidelines.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-crest-600 transition"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-crest-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start gap-3">
                <span className="text-[10px] uppercase font-bold text-crest-800 bg-crest-50 px-2 py-0.5 rounded border border-crest-100">
                  {doc.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{doc.fileSize}</span>
              </div>

              <h3 className="font-serif font-bold text-base text-slate-900 mt-2.5">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => alert(`Downloading "${doc.title}" (PDF)...`)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-crest-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-crest-700" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
