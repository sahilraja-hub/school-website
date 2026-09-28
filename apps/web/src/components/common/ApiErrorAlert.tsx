import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { parseApiError } from '../../services/apiError';

interface ApiErrorAlertProps {
  error: unknown;
  onDismiss?: () => void;
  className?: string;
}

export const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error, onDismiss, className = '' }) => {
  if (!error) return null;

  const apiError = parseApiError(error);

  return (
    <div
      role="alert"
      className={`rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-semibold text-red-800">{apiError.message}</h4>
            {apiError.details && apiError.details.length > 0 && (
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-700">
                {apiError.details.map((detail, idx) => (
                  <li key={idx}>
                    {detail.field ? <strong className="capitalize">{detail.field}: </strong> : null}
                    {detail.message}
                  </li>
                ))}
              </ul>
            )}
            {apiError.requestId && (
              <p className="mt-2 text-2xs text-red-500 font-mono">
                Request ID: {apiError.requestId}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiErrorAlert;
