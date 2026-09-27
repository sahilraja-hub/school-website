import React, { useState } from 'react';
import { User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  status?: AvatarStatus;
  shape?: AvatarShape;
  className?: string;
}

const getInitials = (name: string): string => {
  if (!name.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  fallback,
  size = 'md',
  status,
  shape = 'circle',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: string; status: string }> = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', icon: 'w-3 h-3', status: 'w-1.5 h-1.5 ring-1' },
    sm: { container: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4', status: 'w-2 h-2 ring-1.5' },
    md: { container: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5', status: 'w-2.5 h-2.5 ring-2' },
    lg: { container: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6', status: 'w-3 h-3 ring-2' },
    xl: { container: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8', status: 'w-3.5 h-3.5 ring-2' },
  };

  const statusColors: Record<AvatarStatus, string> = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const initials = name ? getInitials(name) : '';
  const currentSize = sizeClasses[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none bg-crest-100 text-crest-800 font-semibold shadow-subtle ${shapeClass} ${currentSize.container} ${className}`}
      aria-label={alt || name || 'Avatar'}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'User Avatar'}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover ${shapeClass}`}
        />
      ) : fallback ? (
        <span className="flex items-center justify-center">{fallback}</span>
      ) : initials ? (
        <span className={`font-serif tracking-wider ${currentSize.text}`}>{initials}</span>
      ) : (
        <User className={`${currentSize.icon} text-crest-600`} aria-hidden="true" />
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${statusColors[status]} ${currentSize.status}`}
          aria-label={`Status: ${status}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
