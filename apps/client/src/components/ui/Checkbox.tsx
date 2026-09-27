import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, id, checked, className = '', onChange, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5 text-left select-none">
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            onClick={(e) => {
              // Trigger input change
              const input = (e.currentTarget.previousSibling as HTMLInputElement);
              input?.click();
            }}
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              checked
                ? 'bg-crest-700 border-crest-700 text-white'
                : 'bg-white border-slate-300 hover:border-slate-400'
            } ${error ? 'border-danger-500' : ''}`}
          >
            {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {(label || description) && (
          <label htmlFor={checkboxId} className="cursor-pointer text-xs sm:text-sm">
            {label && <span className="font-medium text-slate-800 block">{label}</span>}
            {description && <span className="text-slate-500 text-xs block">{description}</span>}
            {error && <span className="text-danger-600 text-xs block font-medium mt-0.5">{error}</span>}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
