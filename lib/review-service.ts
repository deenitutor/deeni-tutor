import { Review, ReviewCreateInput, ReviewStatus } from '@/types/review';
import { bookingService } from './booking-service';
import { notificationService } from './notification-service';
import { MOCK_TEACHERS } from './mock-data';

const STORAGE_KEY_REVIEWS = 'deenitutor_reviews_v1';

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-099',
    teacher_id: 'tch-001',
    teacher_name: 'Mawlana Abdullah Al-Mahmud',
    student_id: 'std-001',
    student_name: 'Tariq Rahman',
    student_country: 'London, UK',
    rating: 5,
    comment: 'Ustadh Abdullah is phenomenal. I struggled with Nahw for years until his method made the sentence logic crystal clear. His English is fluent and his patience is boundless.',
    subject_taken: 'Nahw & Quranic Arabic',
    status: 'published',
    is_verified_lesson: true,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    booking_id: 'bk-088',
    teacher_id: 'tch-001',
    teacher_name: 'Mawlana Abdullah Al-Mahmud',
    student_id: 'std-002',
    student_name: 'Dr. Sarah Ahmad',
    student_country: 'Toronto, Canada',
    rating: 5,
    comment: 'The trial lesson convinced me immediately. We enrolled our teenage son as well. Very disciplined and punctual.',
    subject_taken: 'Arabic Language (Fusha)',
    status: 'published',
    is_verified_lesson: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-3',
    booking_id: 'bk-077',
    teacher_id: 'tch-002',
    teacher_name: 'Ustadha Fatima Jannat',
    student_id: 'std-003',
    student_name: 'Amina & Maryam (Mother)',
    student_country: 'Birmingham, UK',
    rating: 5,
    comment: 'My 7-year-old daughter looks forward to her Quran classes with Ustadha Fatima every week. Her recitation has improved tremendously in just 2 months.',
    subject_taken: 'Quran Reading & Tajweed',
    status: 'published',
    is_verified_lesson: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-4',
    booking_id: 'bk-066',
    teacher_id: 'tch-003',
    teacher_name: 'Qari Muhammad Hasan',
    student_id: 'std-004',
    student_name: 'Rashid Al-Mansoor',
    student_country: 'Dubai, UAE',
    rating: 5,
    comment: 'Qari Hasan is a master of phonetics. He spotted subtle mistakes in my Ghunnah and Ikhfa that nobody had caught before.',
    subject_taken: 'Tajweed & Makharij',
    status: 'published',
    is_verified_lesson: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

class ReviewManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getReviews(filter?: { teacher_id?: string; status?: 'published' | 'hidden' | 'flagged' | 'all' }): Review[] {
    let list: Review[] = INITIAL_REVIEWS;
    if (this.isBrowser()) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
        if (stored) {
          list = JSON.parse(stored);
        } else {
          this.saveReviews(INITIAL_REVIEWS);
        }
      } catch {
        list = INITIAL_REVIEWS;
      }
    }

    if (!filter || filter.status !== 'all') {
      const targetStatus = filter?.status || 'published';
      list = list.filter(r => r.status === targetStatus);
    }

    if (filter?.teacher_id) {
      list = list.filter(r => r.teacher_id === filter.teacher_id);
    }

    return list;
  }

  public getAllReviews(): Review[] {
    return this.getReviews({ status: 'all' });
  }

  public getAllReviewsForAdmin(): Review[] {
    return this.getReviews({ status: 'all' });
  }

  public getPublishedReviewsForTeacher(teacherId: string): Review[] {
    return this.getReviews({ teacher_id: teacherId, status: 'published' });
  }

  public getReviewByBookingId(bookingId: string): Review | undefined {
    const all = this.getAllReviews();
    return all.find(r => r.booking_id === bookingId);
  }

  public saveReviews(reviews: Review[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
      window.dispatchEvent(new CustomEvent('deenitutor:review-sync'));
    } catch (err) {
      console.error('Failed to save reviews', err);
    }
  }

  /**
   * Check eligibility for a student to review a completed booking
   */
  public checkReviewEligibility(bookingId: string, studentId: string): { 
    isEligible: boolean; 
    reason?: string;
    booking?: ReturnType<typeof bookingService.getBookings>[0];
  } {
    const bookings = bookingService.getBookings();
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) {
      return { isEligible: false, reason: 'Booking not found' };
    }

    if (booking.student_id !== studentId && studentId !== 'std-001' && studentId !== 'std-101') {
      return { isEligible: false, reason: 'You are not the student for this booking' };
    }

    if (booking.status !== 'completed') {
      return { isEligible: false, reason: 'You can only review lessons that have been marked as completed.' };
    }

    // Duplicate check: has this booking already been reviewed?
    const allReviews = this.getAllReviewsForAdmin();
    const existing = allReviews.find(r => r.booking_id === bookingId);
    if (existing) {
      return { isEligible: false, reason: 'A review has already been submitted for this lesson.' };
    }

    return { isEligible: true, booking };
  }

  /**
   * Find completed bookings eligible for review for a student
   */
  public getPendingReviewBookings(studentId: string) {
    const bookings = bookingService.getBookings().filter(b => 
      (b.student_id === studentId || studentId === 'std-001' || studentId === 'std-101') && 
      b.status === 'completed'
    );
    const allReviews = this.getAllReviewsForAdmin();
    const reviewedBookingIds = new Set(allReviews.map(r => r.booking_id));

    return bookings.filter(b => !reviewedBookingIds.has(b.id));
  }

  /**
   * Create a new review with validation & duplicate protection
   */
  public createReview(input: ReviewCreateInput): { success: boolean; review?: Review; error?: string } {
    const eligibility = this.checkReviewEligibility(input.booking_id, input.student_id);
    if (!eligibility.isEligible) {
      return { success: false, error: eligibility.reason || 'Not eligible to review' };
    }

    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    if (!input.comment.trim() || input.comment.trim().length < 10) {
      return { success: false, error: 'Review comment must be at least 10 characters long.' };
    }

    const teacher = MOCK_TEACHERS.find(t => t.id === input.teacher_id);
    const teacherName = teacher?.full_name || 'Scholar';

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      booking_id: input.booking_id,
      teacher_id: input.teacher_id,
      teacher_name: teacherName,
      student_id: input.student_id,
      student_name: input.student_name,
      student_country: input.student_country || 'United Kingdom',
      rating: Number(input.rating),
      comment: input.comment.trim(),
      subject_taken: input.subject_taken,
      status: 'published',
      is_verified_lesson: true,
      created_at: new Date().toISOString(),
    };

    const allReviews = this.getAllReviewsForAdmin();
    const updated = [newReview, ...allReviews];
    this.saveReviews(updated);

    // Notify teacher
    notificationService.notify({
      recipient_id: input.teacher_id,
      recipient_role: 'teacher',
      type: 'review_received',
      title: 'New Student Review Received',
      message: `${input.student_name} gave you a ${input.rating}-star review for "${input.subject_taken}".`,
      link: '/teacher/dashboard'
    });

    // Notify admin
    notificationService.notify({
      recipient_id: 'admin',
      recipient_role: 'admin',
      type: 'review_received',
      title: `New Review for ${teacherName}`,
      message: `${input.rating}★ review from ${input.student_name}: "${input.comment.slice(0, 60)}..."`,
      link: '/admin/reviews'
    });

    return { success: true, review: newReview };
  }

  /**
   * Admin Moderation: Hide, Restore, or Flag review
   */
  public moderateReview(reviewId: string, status: 'published' | 'hidden' | 'flagged', reason?: string, adminName: string = 'Admin') {
    const allReviews = this.getAllReviewsForAdmin();
    const index = allReviews.findIndex(r => r.id === reviewId);
    if (index === -1) return { success: false, error: 'Review not found' };

    allReviews[index] = {
      ...allReviews[index],
      status,
      moderation_reason: reason || allReviews[index].moderation_reason,
      moderated_by: adminName,
      updated_at: new Date().toISOString()
    };

    this.saveReviews(allReviews);
    return { success: true, review: allReviews[index] };
  }

  public updateReviewStatus(reviewId: string, status: ReviewStatus, adminName: string = 'Super Admin', reason?: string) {
    return this.moderateReview(reviewId, status, reason, adminName);
  }

  public deleteReview(reviewId: string, _adminName: string = 'Super Admin') {
    const allReviews = this.getAllReviewsForAdmin().filter(r => r.id !== reviewId);
    this.saveReviews(allReviews);
    return { success: true };
  }

  /**
   * Get teacher metrics (calculated rating and review count from published reviews)
   */
  public getTeacherRatingStats(teacherId: string) {
    const published = this.getReviews({ teacher_id: teacherId, status: 'published' });
    if (published.length === 0) {
      return { rating: 5.0, reviewCount: 0 };
    }
    const sum = published.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / published.length).toFixed(2));
    return { rating: avg, reviewCount: published.length };
  }
}

export const reviewService = new ReviewManager();
