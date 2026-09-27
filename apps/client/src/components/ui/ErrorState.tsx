import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  description = 'An unexpected network error occurred while retrieving data. Please verify your connection.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-danger-200 bg-danger-50/40 space-y-4 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-danger-100 text-danger-600 flex items-center justify-center mx-auto shadow-subtle">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
