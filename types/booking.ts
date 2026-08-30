export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'rejected' 
  | 'cancelled' 
  | 'completed' 
  | 'no_show' 
  | 'disputed';

export type LessonType = 'trial' | 'regular';

export interface BookingEvent {
  id: string;
  booking_id: string;
  event_type: 'created' | 'confirmed' | 'rejected' | 'cancelled' | 'completed' | 'rescheduled' | 'no_show' | 'disputed';
  actor_id?: string;
  actor_role?: 'student' | 'teacher' | 'admin' | 'system';
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  student_id: string;
  teacher_id: string;
  provider: 'stripe' | 'bkash' | 'sslcommerz' | 'manual';
  provider_transaction_id?: string;
  gross_amount: number;
  platform_fee: number;
  teacher_amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paid_at?: string;
  refunded_at?: string;
  created_at: string;
}

export interface TeacherAvailabilityException {
  id: string;
  teacher_id: string;
  date: string; // YYYY-MM-DD
  is_available: boolean;
  reason?: string;
  created_at: string;
}

export interface Favourite {
  id: string;
  student_id: string;
  teacher_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  student_name: string;
  student_email?: string;
  student_timezone?: string;
  teacher_id: string;
  teacher_name: string;
  teacher_slug: string;
  teacher_photo: string;
  teacher_institution?: string;
  subject: string;
  lesson_type: LessonType;
  scheduled_at: string; // ISO string in UTC
  duration_minutes: number;
  price_usd: number;
  status: BookingStatus;
  meeting_link?: string;
  student_notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at?: string;
  events?: BookingEvent[];
}

export interface BookingCreateInput {
  teacher_id: string;
  subject: string;
  lesson_type: LessonType;
  scheduled_at_utc: string; // ISO string in UTC
  duration_minutes: number;
  student_notes?: string;
  student_timezone?: string;
}

