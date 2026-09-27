import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'urgent' | 'academic' | 'event';
}

export const NotificationsUI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([
    {
      id: '1',
      title: 'Mid-Term Exam Schedule Published',
      message: 'The official schedule for fall mid-terms has been released to students and guardians.',
      time: '10m ago',
      isRead: false,
      type: 'academic',
    },
    {
      id: '2',
      title: 'Admissions Decision Released',
      message: 'Candidate ADM-2026-1088 has been accepted for Kindergarten 2026 cohort.',
      time: '1h ago',
      isRead: false,
      type: 'event',
    },
    {
      id: '3',
      title: 'Varsity Soccer Quarterfinals',
      message: 'Quarterfinal fixture against Lakeside Prep this Saturday at 2:00 PM.',
      time: '3h ago',
      isRead: true,
      type: 'event',
    },
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div ref={popoverRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-modal border border-slate-200 py-3 z-50 animate-slide-down text-left">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-sm font-bold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <Badge variant="danger" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-crest-700 hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                    !n.isRead ? 'bg-crest-50/30' : ''
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.isRead ? 'bg-crest-600' : 'bg-transparent'
                    }`}
                  />
                  <div className="space-y-0.5 flex-1">
                    <h5 className="font-bold text-xs text-slate-900">{n.title}</h5>
                    <p className="text-xs text-slate-500 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
