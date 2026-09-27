import React, { forwardRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ value, onClear, size = 'md', className = '', ...props }, ref) => {
    const sizes = {
      sm: 'py-1.5 pl-8 pr-7 text-xs',
      md: 'py-2.5 pl-9 pr-8 text-sm',
      lg: 'py-3 pl-10 pr-9 text-base',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5 left-2.5',
      md: 'w-4 h-4 left-3',
      lg: 'w-5 h-5 left-3.5',
    };

    return (
      <div className="relative flex items-center w-full">
        <SearchIcon
          className={`absolute text-slate-400 pointer-events-none ${iconSizes[size]}`}
        />
        <input
          ref={ref}
          type="search"
          value={value}
          className={`w-full rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 focus:border-crest-500 focus:outline-none focus:ring-2 focus:ring-crest-100 transition-all ${sizes[size]} ${className}`}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Search.displayName = 'Search';
