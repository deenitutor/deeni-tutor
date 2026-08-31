'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Languages, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Video, 
  Heart,
  Globe,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { useAuth } from '@/features/auth/AuthContext';
import { COMMON_TIMEZONES, generateTeacherSlots, SlotItem, DaySlotsGroup } from '@/lib/timezone';
import { bookingService } from '@/lib/booking-service';
import { reviewService } from '@/lib/review-service';

export default function TeacherProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const [allTeachers, setAllTeachers] = useState(() => adminService.getTeachers());

  useEffect(() => {
    const handleSync = () => setAllTeachers(adminService.getTeachers());
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const teacher = useMemo(() => {
    return allTeachers.find(t => t.slug === slug || t.id === slug) || allTeachers[0];
  }, [allTeachers, slug]);

  const isOwnerOrAdmin = user?.role === 'admin' || user?.id === teacher?.id || user?.email?.includes('teacher');
  const isApproved = teacher?.is_approved;

  // State
  const [studentTimezone, setStudentTimezone] = useState<string>(user?.timezone || 'Europe/London');
  const [lessonType, setLessonType] = useState<'trial' | 'regular'>('trial');
  const [selectedSubject, setSelectedSubject] = useState<string>(teacher.subjects[0] || 'Arabic Language (Fusha)');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [studentNotes, setStudentNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<{ id: string; price: number; dateStr: string; timeStr: string } | null>(null);
  const [isFav, setIsFav] = useState(() => bookingService.isFavourite(teacher.id, user?.id || 'std-001'));
  const [publishedReviews, setPublishedReviews] = useState(() => reviewService.getPublishedReviewsForTeacher(teacher.id));

  useEffect(() => {
    const handleSync = () => {
      setPublishedReviews(reviewService.getPublishedReviewsForTeacher(teacher.id));
    };
    window.addEventListener('deenitutor:review-sync', handleSync);
    return () => window.removeEventListener('deenitutor:review-sync', handleSync);
  }, [teacher.id]);

  const handleToggleFav = () => {
    const nextState = bookingService.toggleFavourite(teacher.id, user?.id || 'std-001');
    setIsFav(nextState);
  };

  // Generate Slots dynamically based on teacher availability & timezone
  const duration = lessonType === 'trial' ? (teacher.trial_duration_minutes || 30) : 60;

  const daySlotGroups: DaySlotsGroup[] = useMemo(() => {
    const teacherExceptions = bookingService.getExceptions(teacher.id);
    const existingBookings = bookingService.getBookings().filter(b => b.teacher_id === teacher.id);

    return generateTeacherSlots({
      teacherAvailability: teacher.availability || [],
      exceptions: teacherExceptions,
      existingBookings,
      studentTimezone,
      teacherTimezone: 'Asia/Dhaka',
      durationMinutes: duration,
      daysCount: 14
    });
  }, [teacher.id, teacher.availability, studentTimezone, duration]);

  const currentDayGroup = daySlotGroups[selectedDayIndex] || daySlotGroups[0];

  // Derive active selected slot directly without useEffect setState
  const selectedSlot = useMemo(() => {
    if (!currentDayGroup || !currentDayGroup.slots) return null;
    if (selectedSlotId) {
      const match = currentDayGroup.slots.find(s => s.id === selectedSlotId && !s.isBooked && !s.isPast);
      if (match) return match;
    }
    return currentDayGroup.slots.find(s => !s.isBooked && !s.isPast) || null;
  }, [currentDayGroup, selectedSlotId]);

  // Handle booking submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSlot) {
      setErrorMessage('Please pick an available time slot from the schedule.');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentUser = {
        id: user?.id || 'std-001',
        full_name: user?.full_name || 'Tariq Rahman',
        email: user?.email || 'tariq.rahman@example.co.uk',
        timezone: studentTimezone
      };

      const result = bookingService.createBooking({
        teacher_id: teacher.id,
        subject: selectedSubject,
        lesson_type: lessonType,
        scheduled_at_utc: selectedSlot.startUtc,
        duration_minutes: duration,
        student_notes: studentNotes,
        student_timezone: studentTimezone
      }, studentUser);

      if (!result.success || !result.booking) {
        setErrorMessage(result.error || 'Failed to create booking.');
        setIsSubmitting(false);
        return;
      }

      setBookingSuccessData({
        id: result.booking.id,
        price: result.booking.price_usd,
        dateStr: selectedSlot.displayDateStudent,
        timeStr: selectedSlot.displayTimeStudent
      });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedPrice = lessonType === 'trial' 
    ? (teacher.trial_rate ?? 4) 
    : (teacher.hourly_rate ?? 10);

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F2A43] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Teacher Directory</span>
          </Link>
        </div>

        {/* Unapproved Notice Banner */}
        {!isApproved && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Profile Pending Administrative Approval (is_approved = false)
                </p>
                <p className="text-xs text-amber-700">
                  This teacher profile is currently hidden from the public directory until reviewed and approved by a Deeni Tutor Administrator.
                </p>
              </div>
            </div>
            {user?.role === 'admin' && (
              <Link
                href="/admin/applications"
                className="px-3.5 py-1.5 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-xs font-bold rounded-lg shrink-0 text-center"
              >
                Review in Admin Queue
              </Link>
            )}
          </div>
        )}

        {/* Profile Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Details & Qualifications */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs relative">
              
              {/* Favourite Bookmark Button */}
              <button
                type="button"
                onClick={handleToggleFav}
                aria-label={isFav ? 'Remove from saved teachers' : 'Save teacher to favourites'}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-[#FAF9F5] border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Heart className={`w-5 h-5 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-6 pr-12">
                
                {/* Avatar with geometric frame */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF9F5] relative border-2 border-[#16845B]/30 shadow-xs">
                    <Image
                      src={teacher.photo_url}
                      alt={teacher.full_name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {teacher.is_verified && (
                    <div 
                      className="absolute -bottom-1 -right-1 bg-[#16845B] text-white p-1.5 rounded-full shadow-xs"
                      title="Verified Scholar"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Name, Title & Meta */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
                      {teacher.full_name}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#E8F5EF] text-[#16845B] px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#16845B]">
                    {teacher.title}
                  </p>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.madrasa_institution}</span>
                  </p>

                  {/* Rating & Location Pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-600">
                    <div className="flex items-center gap-1 font-bold text-[#0F2A43]">
                      <Star className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                      <span>{teacher.rating.toFixed(2)}</span>
                      <span className="text-slate-400 font-normal">({teacher.review_count} reviews)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.years_of_experience} Years Teaching</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.city}, {teacher.country}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Teaching Languages Bar */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-[#16845B]" /> Languages:
                </span>
                {teacher.teaching_languages.map((lang) => (
                  <span
                    key={lang}
                    className="bg-[#F7F5EF] text-[#0F2A43] font-semibold px-2.5 py-0.5 rounded-md border border-[#E2E8F0]"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Intro Video Player (Blueprint Section 9) */}
            {teacher.video_url && (
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F2A43] flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#16845B]" />
                    <span>Teacher Introduction Video</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-500">1:45 min intro</span>
                </div>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
                  <iframe
                    src={teacher.video_url}
                    title={`${teacher.full_name} Introduction Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* About / Bio */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F2A43]">
                About the Teacher
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {teacher.bio}
              </p>
              
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h3 className="text-sm font-bold text-[#0F2A43]">
                  Teaching Methodology &amp; Lesson Structure
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {teacher.about_teaching}
                </p>
              </div>
            </div>

            {/* Qualifications & Degrees */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F2A43]">
                Qualifications &amp; Verified Degrees
              </h2>

              <div className="space-y-3">
                {teacher.qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E2E8F0]">
                    <div className="w-6 h-6 rounded-md bg-[#16845B] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#0F2A43]">{q}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Verified by Deeni Tutor Academic Review Committee</p>
                    </div>
                  </div>
                ))}
              </div>

              {teacher.certificates && teacher.certificates.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-sm font-bold text-[#0F2A43] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#D9A441]" />
                    <span>Specialized Sanads &amp; Certifications</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.certificates.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-[#FDF7EC] text-[#0F2A43] px-3 py-1.5 rounded-lg border border-[#D9A441]/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subjects & Levels Taught */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F2A43]">
                Subjects &amp; Levels
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E8F0] space-y-2">
                  <h3 className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
                    Subjects Offered
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#0F2A43] font-semibold">
                    {teacher.subjects.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E8F0] space-y-2">
                  <h3 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
                    Target Levels
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#0F2A43] font-semibold">
                    {teacher.levels.map((l, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F2A43]">
                  Student Reviews ({publishedReviews.length})
                </h2>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F2A43]">
                  <Star className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                  <span>
                    {publishedReviews.length > 0
                      ? (publishedReviews.reduce((acc, r) => acc + r.rating, 0) / publishedReviews.length).toFixed(2)
                      : teacher.rating.toFixed(2)}{' '}
                    out of 5
                  </span>
                </div>
              </div>

              {publishedReviews && publishedReviews.length > 0 ? (
                <div className="space-y-3">
                  {publishedReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-[#0F2A43]">{rev.student_name}</p>
                            {rev.is_verified_lesson && (
                              <span className="text-[10px] font-bold text-[#16845B] bg-[#E8F5EF] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" /> Verified Lesson
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {rev.student_country || 'United Kingdom'} &bull; {new Date(rev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex text-[#D9A441]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#D9A441]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      {rev.subject_taken && (
                        <span className="inline-block text-[10px] font-bold text-[#16845B] bg-[#E8F5EF] px-2 py-0.5 rounded">
                          Class: {rev.subject_taken}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No public reviews written yet for this semester.</p>
              )}
            </div>

          </div>

          {/* Right Col: Interactive Timezone-Aware Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
              
              {/* Header Price Info */}
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Book 1-on-1 Online Lesson
                </span>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-[#16845B]">
                      ${calculatedPrice}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {lessonType === 'trial' ? ' / 30-min trial' : ' / 60-min lesson'}
                    </span>
                  </div>
                  {lessonType === 'trial' && (
                    <span className="text-xs font-bold text-[#16845B] bg-[#E8F5EF] px-2.5 py-1 rounded-md">
                      Special Trial Rate
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Type Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF9F5] rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setLessonType('trial');
                    setBookingSuccessData(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    lessonType === 'trial'
                      ? 'bg-[#16845B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  30m Trial (${teacher.trial_rate || 4})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLessonType('regular');
                    setBookingSuccessData(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    lessonType === 'regular'
                      ? 'bg-[#0F2A43] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  60m Regular (${teacher.hourly_rate || 10})
                </button>
              </div>

              {/* Success Confirmation Card */}
              {bookingSuccessData ? (
                <div className="p-5 rounded-xl bg-[#E8F5EF] border border-[#16845B]/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#16845B] text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#0F2A43]">Booking Request Submitted!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your {lessonType === 'trial' ? '30-minute trial' : '60-minute standard'} session on <strong className="text-[#0F2A43]">{bookingSuccessData.dateStr} at {bookingSuccessData.timeStr}</strong> has been created (Status: <strong>Pending Teacher Confirmation</strong>).
                  </p>
                  <div className="pt-2 space-y-2">
                    <Link
                      href="/student/dashboard"
                      className="block w-full py-2.5 bg-[#0F2A43] text-white text-xs font-bold rounded-lg hover:bg-[#163C5F] transition-colors"
                    >
                      Go to Student Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingSuccessData(null)}
                      className="text-xs font-semibold text-[#16845B] hover:underline"
                    >
                      Book Another Slot
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  
                  {/* Timezone Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#16845B]" />
                      <span>Your Local Timezone</span>
                    </label>
                    <select
                      value={studentTimezone}
                      onChange={(e) => setStudentTimezone(e.target.value)}
                      className="w-full text-xs font-semibold text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                    >
                      {COMMON_TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Learning Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full text-xs font-semibold text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                    >
                      {teacher.subjects.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  {/* Day Picker (Next 7-14 Days) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Select Date ({studentTimezone.split('/')[1] || studentTimezone})
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                      {daySlotGroups.slice(0, 7).map((group, idx) => {
                        const isSelected = selectedDayIndex === idx;
                        const availableSlotsCount = group.slots.filter(s => !s.isBooked && !s.isPast).length;

                        return (
                          <button
                            type="button"
                            key={group.dateString}
                            onClick={() => setSelectedDayIndex(idx)}
                            className={`px-2.5 py-2 rounded-lg border text-center shrink-0 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0F2A43] text-white border-[#0F2A43] shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-[#FAF9F5]'
                            }`}
                          >
                            <span className="block text-[10px] font-bold uppercase">{group.dayShort}</span>
                            <span className="block text-xs font-bold">{group.displayDate.split(',')[0]}</span>
                            <span className={`block text-[9px] font-medium mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                              {availableSlotsCount > 0 ? `${availableSlotsCount} slots` : 'No slots'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid with Dual Timezone */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Available Time Slots
                      </label>
                      <span className="text-[10px] text-slate-400">Showing local vs Dhaka time</span>
                    </div>

                    {currentDayGroup && currentDayGroup.slots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {currentDayGroup.slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          const isUnavailable = slot.isBooked || slot.isPast || slot.isExceptionUnavailable;

                          return (
                            <button
                              type="button"
                              key={slot.id}
                              disabled={isUnavailable}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                isUnavailable
                                  ? 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-[#16845B] text-white border-[#16845B] shadow-xs'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#16845B] hover:bg-[#FAF9F5]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{slot.displayTimeStudent}</span>
                                {isUnavailable && (
                                  <span className="text-[9px] font-bold text-slate-400">
                                    {slot.isPast ? 'Past' : 'Booked'}
                                  </span>
                                )}
                              </div>
                              <span className={`block text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                                BD: {slot.displayTimeDhaka}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                        No available slots on this day. Please select another day.
                      </div>
                    )}
                  </div>

                  {/* Student Learning Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Learning Notes or Goal (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      placeholder="e.g. Beginner level, want to practice Tajweed rules for Surah Al-Mulk..."
                      className="w-full text-xs text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                    />
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedSlot}
                    className="w-full py-3 px-4 bg-[#16845B] hover:bg-[#126D4B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Validating Slot...</span>
                      </>
                    ) : (
                      <span>Book {lessonType === 'trial' ? '30m Trial' : '60m Lesson'} (${calculatedPrice})</span>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    Pay securely after booking. 100% money-back guarantee.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

