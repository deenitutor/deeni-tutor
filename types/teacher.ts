export type TeacherVerificationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'suspended';

export type TeacherDocumentType = 
  | 'identity_document' 
  | 'madrasa_certificate' 
  | 'academic_qualification' 
  | 'teaching_certificate' 
  | 'other_proof';

export type DocumentVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface TeacherDocument {
  id: string;
  teacher_id: string;
  document_type: TeacherDocumentType;
  title: string;
  file_url: string;
  file_name?: string;
  status: DocumentVerificationStatus;
  reviewer_notes?: string;
  created_at?: string;
}

export type Gender = 'male' | 'female';

export type ArabicLevel = 
  | 'Beginner (Noorani Qaida / Alphabet)' 
  | 'Elementary (A1-A2)' 
  | 'Intermediate (B1-B2)' 
  | 'Advanced / Dawra-e-Hadith' 
  | 'All Levels';

export interface SubjectItem {
  id: string;
  name: string;
  category: 'arabic' | 'quran' | 'islamic_studies';
  description?: string;
  icon?: string;
}

export interface TeacherReview {
  id: string;
  student_name: string;
  student_country: string;
  rating: number;
  date: string;
  comment: string;
  subject_taken: string;
}

export type DayOfWeek = 
  | 'saturday' 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday';

export type DayOfWeekShort = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface TeacherAvailability {
  id: string;
  teacher_id: string;
  day_of_week: DayOfWeek | number | string; // 0=Sunday..6=Saturday or string 'saturday'..'friday'
  day_name: string; // 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  day_short: DayOfWeekShort; // 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'
  start_time: string; // e.g. "18:00"
  end_time: string; // e.g. "22:00"
  slots_description: string; // e.g. "18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)"
  timezone: string; // 'Asia/Dhaka'
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeacherProfile {
  id: string;
  slug: string;
  full_name: string;
  title: string;
  photo_url: string;
  gender: Gender;
  city: string;
  district: string;
  country: string;
  madrasa_institution: string;
  qualifications: string[];
  certificates: string[];
  years_of_experience: number;
  total_lessons: number;
  rating: number;
  review_count: number;
  hourly_rate: number; // in USD
  trial_rate: number; // in USD
  trial_available: boolean;
  trial_duration_minutes: number;
  bio: string;
  about_teaching: string;
  subjects: string[];
  levels: string[];
  teaching_languages: string[];
  timezone: string;
  verification_status: TeacherVerificationStatus;
  is_verified: boolean;
  is_approved: boolean;
  video_url?: string;
  featured?: boolean;
  documents?: TeacherDocument[];
  reviews?: TeacherReview[];
  availability?: TeacherAvailability[];
}

export interface TeacherRegistrationFormState {
  full_name: string;
  email: string;
  password?: string;
  photo_url: string;
  gender: Gender;
  city: string;
  district: string;
  bio: string;
  about_teaching: string;
  madrasa_institution: string;
  qualifications: string[];
  certificates: string[];
  years_of_experience: number;
  subjects: string[];
  levels: string[];
  teaching_languages: string[];
  hourly_rate: number;
  trial_rate: number;
  timezone: string;
  intro_video_url?: string;
  documents: {
    type: TeacherDocumentType;
    file_name: string;
    file_url: string;
  }[];
}

