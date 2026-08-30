'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { reviewService } from '@/lib/review-service';
import { Booking } from '@/types/booking';

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({ booking, isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters describing your lesson experience.');
      return;
    }

    setIsSubmitting(true);

    const result = reviewService.createReview({
      booking_id: booking.id,
      teacher_id: booking.teacher_id,
      student_id: booking.student_id,
      student_name: booking.student_name,
      student_country: booking.student_timezone?.includes('London') ? 'London, UK' : 'United States',
      rating,
      comment,
      subject_taken: booking.subject
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to submit review.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2A43]">JazakAllahu Khayran!</h3>
            <p className="text-sm text-slate-600">
              Your verified review for <span className="font-semibold text-[#16845B]">{booking.teacher_name}</span> has been published.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16845B] bg-emerald-50 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Completed Lesson Review</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F2A43]">
                Review {booking.teacher_name}
              </h2>
              <p className="text-xs text-slate-500">
                Lesson: <span className="font-semibold text-slate-700">{booking.subject}</span> ({booking.duration_minutes} mins)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#D9A441] text-[#D9A441]'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-[#0F2A43]">
                  {rating === 5 ? '5.0 - Excellent (Mumtaz)' : `${rating}.0 / 5.0`}
                </span>
              </div>
            </div>

            {/* Review text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Feedback &amp; Methodology Review
                </label>
                <span className="text-[11px] text-slate-400">
                  {comment.length} chars (min 10)
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the teacher's Tajweed, English clarity, patience, and teaching pace? Would you recommend them to other diaspora families?"
                rows={4}
                required
                className="w-full text-sm p-3.5 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
