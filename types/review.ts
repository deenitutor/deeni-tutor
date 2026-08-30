export type ReviewStatus = 'published' | 'hidden' | 'flagged';

export interface Review {
  id: string;
  booking_id: string;
  teacher_id: string;
  teacher_name: string;
  student_id: string;
  student_name: string;
  student_country?: string;
  rating: number; // 1 to 5
  comment: string;
  subject_taken: string;
  status: ReviewStatus;
  is_verified_lesson: boolean;
  moderation_reason?: string;
  moderated_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreateInput {
  booking_id: string;
  teacher_id: string;
  student_id: string;
  student_name: string;
  student_country?: string;
  rating: number;
  comment: string;
  subject_taken: string;
}
