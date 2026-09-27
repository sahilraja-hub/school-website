import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'slate' | 'gold';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label = 'Loading...',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variants = {
    primary: 'text-crest-600',
    white: 'text-white',
    slate: 'text-slate-400',
    gold: 'text-gold-500',
  };

  return (
    <div role="status" className="inline-flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizes[size]} ${variants[variant]} ${className}`} />
      <span className="sr-only">{label}</span>
    </div>
  );
};
