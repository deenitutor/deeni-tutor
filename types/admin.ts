export type AuditActionType =
  | 'APPROVE_TEACHER'
  | 'REJECT_TEACHER'
  | 'SUSPEND_TEACHER'
  | 'ACTIVATE_TEACHER'
  | 'TOGGLE_FEATURED_TEACHER'
  | 'UPDATE_TEACHER_RATE'
  | 'PROCESS_PAYOUT'
  | 'REJECT_PAYOUT'
  | 'MODERATE_REVIEW_HIDE'
  | 'MODERATE_REVIEW_RESTORE'
  | 'OVERRIDE_BOOKING_STATUS'
  | 'RESOLVE_REPORT'
  | 'UPDATE_PLATFORM_SETTINGS'
  | 'SUSPEND_STUDENT'
  | 'ACTIVATE_STUDENT';

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: AuditActionType;
  entity_type: 'teacher' | 'student' | 'booking' | 'payout' | 'review' | 'report' | 'settings';
  entity_id: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface PayoutRequest {
  id: string;
  teacher_id: string;
  teacher_name: string;
  teacher_madrasa: string;
  amount_usd: number;
  amount_bdt: number;
  method: 'bank' | 'bkash' | 'nagad';
  account_details: string;
  status: PayoutStatus;
  requested_at: string;
  processed_at?: string;
  transaction_reference?: string;
  admin_notes?: string;
}

export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface PlatformReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reporter_role: 'student' | 'teacher' | 'parent';
  target_id: string;
  target_name: string;
  target_role: 'teacher' | 'student' | 'booking';
  category: 'lesson_quality' | 'no_show' | 'harassment' | 'payment_issue' | 'technical_issue' | 'other';
  subject: string;
  description: string;
  status: ReportStatus;
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface PlatformSettings {
  platform_name: string;
  commission_percentage: number; // e.g. 15 or 20
  trial_lesson_default_duration_min: number; // 30
  trial_lesson_min_price_usd: number; // 3
  hourly_rate_min_usd: number; // 6
  currency: string; // 'USD'
  bdt_exchange_rate: number; // 120
  bkash_payout_enabled: boolean;
  nagad_payout_enabled: boolean;
  bank_beftn_enabled: boolean;
  maintenance_mode: boolean;
  support_email: string;
  support_whatsapp: string;
  auto_cancel_unconfirmed_hours: number; // 24
}

export interface AdminStudentSummary {
  id: string;
  full_name: string;
  email: string;
  country: string;
  timezone: string;
  total_bookings: number;
  total_spent_usd: number;
  status: 'active' | 'suspended';
  created_at: string;
}
