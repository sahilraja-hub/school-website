import React from 'react';
import { User, LogOut, Settings, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Dropdown } from '../ui/Dropdown';
import { Badge } from '../ui/Badge';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleColors: Record<string, 'primary' | 'warning' | 'success' | 'gold'> = {
    ADMIN: 'primary',
    TEACHER: 'success',
    STUDENT: 'gold',
    PARENT: 'warning',
  };

  const trigger = (
    <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none">
      <img
        src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
        alt={user.firstName}
        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
      />
      <div className="hidden md:block text-left">
        <span className="text-xs font-bold text-slate-800 block leading-tight">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
          {user.role}
        </span>
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </div>
  );

  const items = [
    {
      label: (
        <div className="py-1">
          <p className="text-xs font-bold text-slate-900">{user.firstName} {user.lastName}</p>
          <p className="text-[11px] text-slate-400">{user.email}</p>
          <div className="mt-1.5">
            <Badge variant={roleColors[user.role] || 'primary'} size="sm">
              {user.role}
            </Badge>
          </div>
        </div>
      ),
      disabled: true,
    },
    { divider: true, label: '' },
    {
      label: 'Personal Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: 'Security & Preferences',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {},
    },
    { divider: true, label: '' },
    {
      label: 'Sign Out of System',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: logout,
    },
  ];

  return <Dropdown trigger={trigger} items={items} align="right" />;
};
