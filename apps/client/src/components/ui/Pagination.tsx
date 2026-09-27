import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  pageSize,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 text-xs text-slate-600 ${className}`}>
      {totalRecords !== undefined && pageSize !== undefined && (
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {Math.min((currentPage - 1) * pageSize + 1, totalRecords)}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900">
            {Math.min(currentPage * pageSize, totalRecords)}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{totalRecords}</span> results
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                isCurrent
                  ? 'bg-crest-700 text-white shadow-subtle'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
