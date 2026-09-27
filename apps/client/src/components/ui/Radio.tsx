import React, { forwardRef } from 'react';

export interface RadioOption {
  label: string;
  value: string | number;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  selectedValue?: string | number;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  selectedValue,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-2 text-left ${className}`}>
      {label && <span className="block text-xs font-semibold text-slate-700">{label}</span>}
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-crest-600 bg-crest-50/50 shadow-subtle'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'border-crest-700' : 'border-slate-300'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-crest-700" />}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 block">{opt.label}</span>
                {opt.description && <span className="text-xs text-slate-500 block">{opt.description}</span>}
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-danger-600 font-medium">{error}</p>}
    </div>
  );
};
