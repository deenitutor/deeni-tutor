'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Video, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Heart, 
  AlertCircle,
  Plus,
  Trash2,
  Receipt,
  XCircle,
  ExternalLink,
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { MOCK_TEACHERS } from '@/lib/mock-data';
import { bookingService } from '@/lib/booking-service';
import { Booking } from '@/types/booking';
import { formatLocalTime, formatLocalDate } from '@/lib/timezone';
import { reviewService } from '@/lib/review-service';
import ReviewModal from '@/components/shared/ReviewModal';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'favourites' | 'children' | 'payments'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getBookings());
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => bookingService.getFavourites(user?.id || 'std-001'));
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Children state
  const [childrenList, setChildrenList] = useState<Array<{ id: string; name: string; age: number; level: string; targetSubject: string }>>([
    { id: 'ch-01', name: 'Zayd Rahman', age: 8, level: 'Beginner', targetSubject: 'Noorani Qaida & Basic Tajweed' }
  ]);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('7');
  const [newChildLevel, setNewChildLevel] = useState('Beginner');
  const [newChildSubject, setNewChildSubject] = useState('Tajweed & Quran Recitation');

  // Load and subscribe to updates
  useEffect(() => {
    const refreshData = () => {
      setBookings(bookingService.getBookings());
      setFavouriteIds(bookingService.getFavourites(user?.id || 'std-001'));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('deenitutor:booking-sync', refreshData);
      return () => window.removeEventListener('deenitutor:booking-sync', refreshData);
    }
  }, [user?.id]);

  const studentTz = user?.timezone || 'Europe/London';

  // Filter bookings for student
  const studentBookings = bookings.filter(b => b.student_id === (user?.id || 'std-001'));
  const upcomingBookings = studentBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = studentBookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected');

  const favouriteTeachers = MOCK_TEACHERS.filter(t => favouriteIds.includes(t.id));

  // Handle Cancel Booking
  const handleConfirmCancel = () => {
    if (!cancellingBookingId) return;
    bookingService.updateStatus(cancellingBookingId, 'cancelled', { id: user?.id || 'std-001', role: 'student' }, cancelReason);
    setCancellingBookingId(null);
    setBookings(bookingService.getBookings());
  };

  // Handle Add Child
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    const newChild = {
      id: `ch-${Date.now()}`,
      name: newChildName.trim(),
      age: parseInt(newChildAge) || 7,
      level: newChildLevel,
      targetSubject: newChildSubject
    };
    setChildrenList([...childrenList, newChild]);
    setNewChildName('');
    setShowAddChildModal(false);
  };

  const handleRemoveChild = (id: string) => {
    setChildrenList(childrenList.filter(c => c.id !== id));
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
              <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
                Student &amp; Parent Dashboard
              </span>
              <span className="text-xs text-slate-400">• Local Timezone: {studentTz}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              Assalamu Alaikum, {user?.full_name || 'Tariq Rahman'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              You have <span className="font-bold text-[#16845B]">{upcomingBookings.length} upcoming lessons</span> on your schedule.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teachers"
              className="px-4 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore &amp; Book Scholars</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Upcoming Lessons ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Past Lessons &amp; History ({pastBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'favourites'
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Saved Scholars ({favouriteTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('children')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'children'
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Children Profiles ({childrenList.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Billing &amp; Receipts
          </button>
        </div>

        {/* TAB 1: Upcoming Lessons */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((lesson) => {
                const localDateStr = formatLocalDate(lesson.scheduled_at, studentTz);
                const localTimeStr = formatLocalTime(lesson.scheduled_at, studentTz);
                const dhakaTimeStr = formatLocalTime(lesson.scheduled_at, 'Asia/Dhaka');

                return (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#FAF9F5] border border-slate-200">
                        <Image
                          src={lesson.teacher_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={lesson.teacher_name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            lesson.status === 'confirmed' 
                              ? 'bg-[#E8F5EF] text-[#16845B]' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {lesson.status === 'confirmed' ? 'Confirmed' : 'Pending Teacher Confirmation'}
                          </span>
                          <span className="text-[10px] font-bold bg-[#F7F5EF] text-[#0F2A43] px-2 py-0.5 rounded border border-slate-200">
                            {lesson.lesson_type === 'trial' ? '30m Trial' : `${lesson.duration_minutes}m Regular`} (${lesson.price_usd})
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#0F2A43]">
                          {lesson.subject}
                        </h3>

                        <p className="text-xs text-slate-500 font-medium">
                          With <Link href={`/teachers/${lesson.teacher_slug || 'mawlana-abdullah-al-mahmud'}`} className="text-[#0F2A43] font-bold hover:underline">{lesson.teacher_name}</Link> ({lesson.teacher_institution})
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                          <div className="flex items-center gap-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{localDateStr}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{localTimeStr} (Your Time) / {dhakaTimeStr} (Dhaka)</span>
                          </div>
                        </div>

                        {lesson.student_notes && (
                          <p className="text-[11px] text-slate-500 italic pt-1">
                            Note: &ldquo;{lesson.student_notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {lesson.status === 'confirmed' && lesson.meeting_link ? (
                        <a
                          href={lesson.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Classroom</span>
                        </a>
                      ) : (
                        <div className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Teacher reviewing slot</span>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setCancellingBookingId(lesson.id)}
                        className="px-3 py-2 bg-[#FAF9F5] hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] text-center space-y-3">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-[#0F2A43]">No Upcoming Lessons</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any pending or confirmed lessons scheduled. Browse our verified scholars to book your next session.
                </p>
                <Link
                  href="/teachers"
                  className="inline-block px-4 py-2 bg-[#16845B] text-white text-xs font-bold rounded-lg hover:bg-[#126D4B]"
                >
                  Browse Teachers
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Lesson History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0F2A43]">Completed &amp; Past Lessons</h3>
            {pastBookings.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pastBookings.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.status === 'completed' 
                            ? 'bg-[#E8F5EF] text-[#16845B]' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">{item.subject}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Teacher: {item.teacher_name} • {formatLocalDate(item.scheduled_at, studentTz)} at {formatLocalTime(item.scheduled_at, studentTz)}
                      </p>
                      {item.cancellation_reason && (
                        <p className="text-[11px] text-red-600 italic mt-0.5">
                          Reason: {item.cancellation_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">${item.price_usd}</span>
                      
                      {item.status === 'completed' && (
                        reviewService.getReviewByBookingId(item.id) ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-[#16845B] border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" /> Reviewed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setReviewBooking(item)}
                            className="px-3 py-1.5 bg-[#D9A441] hover:bg-amber-500 text-[#0F2A43] text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3" /> Leave Review
                          </button>
                        )
                      )}

                      <Link
                        href={`/teachers/${item.teacher_slug || 'mawlana-abdullah-al-mahmud'}`}
                        className="px-3 py-1.5 bg-[#FAF9F5] border border-slate-200 text-xs font-bold text-[#0F2A43] rounded-lg hover:bg-slate-100"
                      >
                        Re-book Slot
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No past completed sessions yet.</p>
            )}
          </div>
        )}

        {/* TAB 3: Saved Teachers */}
        {activeTab === 'favourites' && (
          <div className="space-y-4">
            {favouriteTeachers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favouriteTeachers.map((t) => (
                  <div key={t.id} className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={t.photo_url}
                          alt={t.full_name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[#0F2A43]">{t.full_name}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{t.madrasa_institution}</p>
                        <p className="text-xs font-bold text-[#16845B] mt-0.5">
                          ${t.trial_rate || 4} trial / ${t.hourly_rate}/hr
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        href={`/teachers/${t.slug}`}
                        className="px-3 py-1.5 bg-[#0F2A43] text-white text-xs font-bold rounded-lg hover:bg-[#163C5F] text-center"
                      >
                        Book
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          bookingService.toggleFavourite(t.id, user?.id || 'std-001');
                          setFavouriteIds(bookingService.getFavourites(user?.id || 'std-001'));
                        }}
                        className="text-[11px] text-slate-400 hover:text-red-600 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] text-center space-y-3">
                <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-[#0F2A43]">No Saved Scholars</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any scholar profile to save them for quick lesson scheduling.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Children Management */}
        {activeTab === 'children' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F2A43]">Managed Child Accounts</h3>
                <p className="text-xs text-slate-500">Track and schedule Arabic classes for each child securely.</p>
              </div>
              <button 
                onClick={() => setShowAddChildModal(true)}
                className="px-3.5 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Child</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childrenList.map((ch) => (
                <div key={ch.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D9A441] text-[#0F2A43] flex items-center justify-center font-bold text-sm shrink-0">
                      {ch.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">
                        {ch.name} (Age {ch.age})
                      </h4>
                      <p className="text-xs text-slate-500">Focus: {ch.targetSubject}</p>
                      <span className="inline-block text-[10px] font-bold text-[#16845B] bg-[#E8F5EF] px-2 py-0.5 rounded mt-1">
                        Level: {ch.level}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveChild(ch.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Remove child profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Billing & Receipts */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A43]">Lesson Transactions &amp; Receipts</h3>
              <p className="text-xs text-slate-500">View all paid and scheduled lesson receipts with transparent breakdowns.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Teacher</th>
                    <th className="pb-3">Lesson Track</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentBookings.map((b) => (
                    <tr key={b.id} className="py-2.5">
                      <td className="py-3 font-mono font-bold text-[#0F2A43]">{b.id}</td>
                      <td className="py-3 font-medium">{b.teacher_name}</td>
                      <td className="py-3">{b.subject}</td>
                      <td className="py-3">{formatLocalDate(b.scheduled_at, studentTz)}</td>
                      <td className="py-3 font-bold text-[#0F2A43]">${b.price_usd.toFixed(2)} USD</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          b.status === 'completed'
                            ? 'bg-[#E8F5EF] text-[#16845B]'
                            : b.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700'
                              : b.status === 'pending'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: Cancel Confirmation */}
        {cancellingBookingId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#0F2A43]">Cancel Lesson Booking?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-[#0F2A43]">{cancellingBookingId}</strong>? This slot will be released back to the teacher&apos;s schedule.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2 rounded-lg"
                >
                  <option value="Schedule conflict">Schedule conflict</option>
                  <option value="Child is unwell">Child is unwell / unable to attend</option>
                  <option value="Want to change time slot">Want to choose a different time slot</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Child */}
        {showAddChildModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-[#0F2A43]">Add Child Profile</h3>
              
              <form onSubmit={handleAddChild} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Child&apos;s Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maryam Rahman"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      min={4}
                      max={18}
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Learning Level</label>
                    <select
                      value={newChildLevel}
                      onChange={(e) => setNewChildLevel(e.target.value)}
                      className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                    >
                      <option value="Beginner">Beginner (Qaida/Letters)</option>
                      <option value="Intermediate">Intermediate (Tajweed Rules)</option>
                      <option value="Advanced">Advanced (Hifz/Recitation)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Track</label>
                  <select
                    value={newChildSubject}
                    onChange={(e) => setNewChildSubject(e.target.value)}
                    className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                  >
                    <option value="Noorani Qaida & Basic Tajweed">Noorani Qaida &amp; Basic Tajweed</option>
                    <option value="Tajweed & Quran Recitation">Tajweed &amp; Quran Recitation</option>
                    <option value="Hifz (Memorization) Revision">Hifz (Memorization) Revision</option>
                    <option value="Spoken Arabic for Kids">Spoken Arabic for Kids</option>
                    <option value="Islamic Studies & Duas">Islamic Studies &amp; Duas</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddChildModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save Child Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewBooking && (
          <ReviewModal
            booking={reviewBooking}
            isOpen={Boolean(reviewBooking)}
            onClose={() => setReviewBooking(null)}
            onSuccess={() => {
              setBookings(bookingService.getBookings());
            }}
          />
        )}

      </div>
    </div>
  );
}
