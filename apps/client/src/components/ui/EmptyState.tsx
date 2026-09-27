import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white space-y-4 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-subtle">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <div className="space-y-1">
        <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
