import { AppNotification, NotificationType } from '@/types/notification';

const STORAGE_KEY_NOTIFICATIONS = 'deenitutor_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipient_id: 'std-101',
    recipient_role: 'student',
    type: 'booking_confirmed',
    title: 'Lesson Confirmed by Mawlana Abdullah',
    message: 'Your Arabic Syntax (Nahw) lesson has been confirmed. The Google Meet classroom link is ready.',
    link: '/student/dashboard',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    recipient_id: 'std-101',
    recipient_role: 'student',
    type: 'payment_success',
    title: 'Payment Successful ($10.00 USD)',
    message: 'Payment for booking #bk-101 was processed securely. Escrow hold is active until lesson completion.',
    link: '/student/dashboard',
    is_read: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    recipient_id: 'tch-001',
    recipient_role: 'teacher',
    type: 'booking_requested',
    title: 'New Trial Lesson Request',
    message: 'Student Tariq Rahman has requested a 30m Tajweed trial slot.',
    link: '/teacher/dashboard',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    recipient_id: 'tch-001',
    recipient_role: 'teacher',
    type: 'payout_processed',
    title: 'Payout Processed (৳54,000 BDT)',
    message: 'Your withdrawal to Islami Bank BD (A/C ****4892) has been sent via BEFTN.',
    link: '/teacher/dashboard',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    recipient_id: 'admin',
    recipient_role: 'admin',
    type: 'booking_requested',
    title: 'New Teacher Application Submitted',
    message: 'Mawlana Hafizur Rahman has submitted Dawra-e-Hadith credentials for review.',
    link: '/admin/applications',
    is_read: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-6',
    recipient_id: 'admin',
    recipient_role: 'admin',
    type: 'payout_processed',
    title: 'Payout Request Pending Approval',
    message: 'Ustadha Fatima Jannat requested a payout of $180.00 USD (bKash).',
    link: '/admin/payouts',
    is_read: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

class NotificationManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getNotifications(recipientId?: string, recipientRole?: 'student' | 'teacher' | 'admin' | 'parent'): AppNotification[] {
    let list: AppNotification[] = INITIAL_NOTIFICATIONS;
    if (this.isBrowser()) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
        if (stored) {
          list = JSON.parse(stored);
        } else {
          this.saveNotifications(INITIAL_NOTIFICATIONS);
        }
      } catch {
        list = INITIAL_NOTIFICATIONS;
      }
    }

    if (recipientRole === 'admin') {
      return list.filter(n => n.recipient_role === 'admin' || n.recipient_id === 'admin');
    }

    if (recipientId) {
      return list.filter(n => n.recipient_id === recipientId || (recipientRole && n.recipient_role === recipientRole));
    }

    return list;
  }

  public saveNotifications(notifications: AppNotification[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
      window.dispatchEvent(new CustomEvent('deenitutor:notification-sync'));
    } catch (err) {
      console.error('Failed to save notifications', err);
    }
  }

  public notify(params: {
    recipient_id: string;
    recipient_role: 'student' | 'teacher' | 'admin' | 'parent';
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, unknown>;
  }): AppNotification {
    const list = this.getNotifications();
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient_id: params.recipient_id,
      recipient_role: params.recipient_role,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      metadata: params.metadata,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const updated = [newNotif, ...list];
    this.saveNotifications(updated);
    return newNotif;
  }

  public markAsRead(id: string) {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, is_read: true } : n);
    this.saveNotifications(updated);
  }

  public markAllAsRead(recipientId?: string, recipientRole?: 'student' | 'teacher' | 'admin' | 'parent') {
    const list = this.getNotifications();
    const updated = list.map(n => {
      if (recipientRole === 'admin' && (n.recipient_role === 'admin' || n.recipient_id === 'admin')) {
        return { ...n, is_read: true };
      }
      if (recipientId && (n.recipient_id === recipientId || n.recipient_role === recipientRole)) {
        return { ...n, is_read: true };
      }
      return n;
    });
    this.saveNotifications(updated);
  }

  public deleteNotification(id: string) {
    const list = this.getNotifications();
    const updated = list.filter(n => n.id !== id);
    this.saveNotifications(updated);
  }
}

export const notificationService = new NotificationManager();
