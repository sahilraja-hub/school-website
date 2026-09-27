import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label': string; // Enforce accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.96] shrink-0';

    const variants = {
      primary: 'bg-crest-700 hover:bg-crest-800 text-white shadow-subtle focus-visible:ring-crest-600',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus-visible:ring-slate-400',
      outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
      ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
      danger: 'bg-danger-50 text-danger-600 hover:bg-danger-100 focus-visible:ring-danger-500',
    };

    const sizes = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
