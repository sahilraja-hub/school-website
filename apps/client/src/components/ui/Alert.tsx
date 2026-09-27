import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const styles = {
    info: 'bg-info-50/80 border-info-200 text-info-900',
    success: 'bg-success-50/80 border-success-200 text-success-900',
    warning: 'bg-warning-50/80 border-warning-200 text-warning-900',
    danger: 'bg-danger-50/80 border-danger-200 text-danger-900',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-info-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-danger-600 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border text-left shadow-subtle ${styles[type]} ${className}`}
    >
      <div className="pt-0.5">{icons[type]}</div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="text-xs sm:text-sm font-bold leading-none">{title}</h5>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
