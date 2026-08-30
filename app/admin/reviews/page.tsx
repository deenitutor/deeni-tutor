'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  EyeOff, 
  Eye, 
  Trash2, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { reviewService } from '@/lib/review-service';
import { Review, ReviewStatus } from '@/types/review';

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(() => reviewService.getAllReviews());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [notification, setNotification] = useState('');

  const loadReviews = () => {
    setReviews(reviewService.getAllReviews());
  };

  useEffect(() => {
    const handleSync = () => loadReviews();
    window.addEventListener('deenitutor:review-sync', handleSync);
    return () => window.removeEventListener('deenitutor:review-sync', handleSync);
  }, []);

  const handleUpdateStatus = (reviewId: string, status: ReviewStatus, reason?: string) => {
    const res = reviewService.updateReviewStatus(
      reviewId,
      status,
      user?.full_name || 'Super Admin',
      reason || `Admin updated review status to ${status}`
    );
    if (res.success) {
      setNotification(`Review status updated to: ${status.toUpperCase()}`);
      loadReviews();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('Are you sure you want to permanently delete this review?')) {
      reviewService.deleteReview(reviewId, user?.full_name || 'Super Admin');
      setNotification('Review permanently deleted.');
      loadReviews();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject_taken?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teacher_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'published':
        return <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Published</span>;
      case 'hidden':
        return <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>;
      case 'flagged':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Flag className="w-3 h-3" /> Flagged</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Verified Student Reviews &amp; Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Blueprint Section 18: Audit verified lesson reviews, moderate comments, and maintain community trust.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-[#0F2A43] text-white text-xs font-bold rounded-xl self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
          <Star className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
          <span>{reviews.length} Verified Reviews Total</span>
        </span>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by student name, comment keywords, or subject..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'published', 'hidden', 'flagged'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#0F2A43] shadow-xs'
                      : 'text-slate-600 hover:text-[#0F2A43]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-1.5 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-[#0F2A43]">No reviews matching criteria</p>
            <p className="text-xs">Adjust your search or filter settings.</p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-colors shadow-xs space-y-4 ${
                r.status === 'hidden' ? 'border-rose-200 bg-rose-50/20' : 'border-[#E2E8F0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F2A43] text-[#D9A441] font-bold flex items-center justify-center text-sm shrink-0">
                    {r.student_name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F2A43]">{r.student_name}</h4>
                      {r.student_country && (
                        <span className="text-[10px] text-slate-400 font-semibold">&bull; {r.student_country}</span>
                      )}
                      {r.is_verified_lesson && (
                        <span className="text-[10px] font-bold text-[#16845B] bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified Lesson
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Subject: <span className="font-semibold text-slate-700">{r.subject_taken || 'Quran & Tajweed'}</span> &bull; Booking #{r.booking_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating ? 'fill-[#D9A441] text-[#D9A441]' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  {getStatusBadge(r.status)}
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border border-slate-100">
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* Footer with Timestamp and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Submitted on {new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>

                <div className="flex items-center gap-2">
                  {r.status !== 'published' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'published')}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Publish / Restore</span>
                    </button>
                  )}

                  {r.status === 'published' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'hidden', 'Hidden by admin due to policy moderation')}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Hide Review</span>
                    </button>
                  )}

                  {r.status !== 'flagged' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'flagged', 'Flagged for internal review')}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Flag className="w-3 h-3" />
                      <span>Flag</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    title="Delete permanently"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
