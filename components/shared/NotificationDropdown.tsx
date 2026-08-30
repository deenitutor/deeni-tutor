'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  Clock, 
  Calendar, 
  CreditCard, 
  Award, 
  MessageSquare, 
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { notificationService } from '@/lib/notification-service';
import { AppNotification } from '@/types/notification';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === 'undefined' || !user) return [];
    return notificationService.getNotifications(user.id, user.role);
  });
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = React.useCallback(() => {
    if (user) {
      setNotifications(notificationService.getNotifications(user.id, user.role));
    } else {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    const handleSync = () => loadNotifications();
    window.addEventListener('deenitutor:notification-sync', handleSync);
    window.addEventListener('storage', handleSync);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('deenitutor:notification-sync', handleSync);
      window.removeEventListener('storage', handleSync);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id, user.role);
      loadNotifications();
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.deleteNotification(id);
    loadNotifications();
  };

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'booking_confirmed':
      case 'teacher_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'booking_rejected':
      case 'teacher_rejected':
      case 'payment_failed':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'booking_requested':
      case 'lesson_reminder':
        return <Calendar className="w-4 h-4 text-[#D9A441] shrink-0" />;
      case 'payment_success':
      case 'payout_processed':
        return <CreditCard className="w-4 h-4 text-[#16845B] shrink-0" />;
      case 'review_received':
        return <Award className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'new_message':
      default:
        return <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef} id="notification-dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-700 hover:text-[#0F2A43] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        aria-label="View notifications"
        id="notification-bell-btn"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span 
            id="unread-badge"
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="notification-dropdown-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2"
        >
          {/* Header */}
          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0F2A43]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#16845B] hover:underline cursor-pointer flex items-center gap-1"
                id="mark-all-read-btn"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-slate-100 flex gap-2 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                filter === 'all' 
                  ? 'bg-[#0F2A43] text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                filter === 'unread' 
                  ? 'bg-[#0F2A43] text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  id={`notif-item-${notif.id}`}
                  className={`p-3 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 ${
                    !notif.is_read ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5">{getIconForType(notif.type)}</div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs ${!notif.is_read ? 'font-bold text-[#0F2A43]' : 'font-semibold text-slate-700'} truncate`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => {
                              notificationService.markAsRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-bold text-[#16845B] hover:underline flex items-center gap-0.5 ml-auto"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {!notif.is_read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        title="Mark as read"
                        className="text-slate-400 hover:text-[#16845B] p-1 rounded hover:bg-slate-200 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(notif.id, e)}
                      title="Delete"
                      className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
