export type NotificationType = 
  | 'booking_requested'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'lesson_reminder'
  | 'new_message'
  | 'review_received'
  | 'teacher_approved'
  | 'teacher_rejected'
  | 'payout_processed';

export interface AppNotification {
  id: string;
  recipient_id: string; // user id or role 'admin'
  recipient_role: 'student' | 'teacher' | 'admin' | 'parent';
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}
