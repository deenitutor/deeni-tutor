'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Video, 
  TrendingUp, 
  Edit2, 
  Plus, 
  Trash2, 
  X, 
  Save, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Ban,
  CalendarOff,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { MOCK_TEACHERS } from '@/lib/mock-data';
import { bookingService } from '@/lib/booking-service';
import { Booking, TeacherAvailabilityException } from '@/types/booking';
import { formatLocalTime, formatLocalDate } from '@/lib/timezone';
import { DayOfWeek } from '@/types/teacher';

interface AvailabilitySlotItem {
  id: string;
  day_of_week: DayOfWeek;
  day_name: string;
  day_bengali: string;
  slots: string;
  is_active: boolean;
}

const INITIAL_SCHEDULE: AvailabilitySlotItem[] = [
  { 
    id: 'slot-sat',
    day_of_week: 'saturday', 
    day_name: 'Saturday', 
    day_bengali: 'শনিবার',
    slots: '14:00 - 22:00 (Weekend afternoon & prime evening)',
    is_active: true
  },
  { 
    id: 'slot-sun',
    day_of_week: 'sunday', 
    day_name: 'Sunday', 
    day_bengali: 'রবিবার',
    slots: '14:00 - 22:00 (Weekend afternoon & prime evening)',
    is_active: true
  },
  { 
    id: 'slot-mon',
    day_of_week: 'monday', 
    day_name: 'Monday', 
    day_bengali: 'সোমবার',
    slots: '18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)',
    is_active: true
  },
  { 
    id: 'slot-tue',
    day_of_week: 'tuesday', 
    day_name: 'Tuesday', 
    day_bengali: 'মঙ্গলবার',
    slots: '18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)',
    is_active: true
  },
  { 
    id: 'slot-wed',
    day_of_week: 'wednesday', 
    day_name: 'Wednesday', 
    day_bengali: 'বুধবার',
    slots: '18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)',
    is_active: true
  },
  { 
    id: 'slot-thu',
    day_of_week: 'thursday', 
    day_name: 'Thursday', 
    day_bengali: 'বৃহস্পতিবার',
    slots: '18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)',
    is_active: true
  },
  { 
    id: 'slot-fri',
    day_of_week: 'friday', 
    day_name: 'Friday', 
    day_bengali: 'শুক্রবার',
    slots: '09:00 - 13:00 (Morning) | 16:00 - 22:00 (Full)',
    is_active: true
  }
];

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const teacher = MOCK_TEACHERS[0]; // Primary scholar context
  const teacherId = teacher.id; // 'tch-001'

  // Reactive Bookings & Financials State
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getBookings());
  const [financials, setFinancials] = useState(() => bookingService.getTeacherFinancials(teacherId));
  const [exceptions, setExceptions] = useState<TeacherAvailabilityException[]>(() => bookingService.getExceptions(teacherId));
  
  // UI States
  const [scheduleList, setScheduleList] = useState<AvailabilitySlotItem[]>(INITIAL_SCHEDULE);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isAddingException, setIsAddingException] = useState(false);
  const [newExceptionDate, setNewExceptionDate] = useState('');
  const [newExceptionReason, setNewExceptionReason] = useState('Personal leave / Travel');
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutProvider, setPayoutProvider] = useState<'bkash' | 'nagad' | 'bank'>('bank');
  const [payoutAccount, setPayoutAccount] = useState('Islami Bank BD (A/C: ****4892)');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setBookings(bookingService.getBookings());
      setFinancials(bookingService.getTeacherFinancials(teacherId));
      setExceptions(bookingService.getExceptions(teacherId));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('deenitutor:booking-sync', handleSync);
      return () => window.removeEventListener('deenitutor:booking-sync', handleSync);
    }
  }, [teacherId]);

  // Filter Bookings
  const teacherBookings = bookings.filter(b => b.teacher_id === teacherId);
  const pendingRequests = teacherBookings.filter(b => b.status === 'pending');
  const confirmedUpcoming = teacherBookings.filter(b => b.status === 'confirmed');
  const completedLessons = teacherBookings.filter(b => b.status === 'completed');

  // Accept Booking
  const handleAcceptBooking = (bookingId: string) => {
    const meetLink = `https://meet.google.com/dee-${bookingId.slice(0, 4)}-cls`;
    bookingService.updateStatus(bookingId, 'confirmed', { id: teacherId, role: 'teacher' }, 'Accepted by Teacher', meetLink);
    setSaveSuccessMsg(`Booking ${bookingId} has been confirmed! Google Meet link generated.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Decline Booking
  const handleDeclineBooking = (bookingId: string) => {
    const reason = prompt('Please provide a reason for declining:', 'Teacher has an unavoidable scheduling conflict');
    if (reason !== null) {
      bookingService.updateStatus(bookingId, 'rejected', { id: teacherId, role: 'teacher' }, reason);
      setSaveSuccessMsg(`Booking ${bookingId} declined.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  // Mark Completed
  const handleCompleteBooking = (bookingId: string) => {
    bookingService.updateStatus(bookingId, 'completed', { id: teacherId, role: 'teacher' }, 'Class completed successfully');
    setSaveSuccessMsg(`Lesson ${bookingId} marked as completed! Payment credited to your available balance.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Schedule Toggling
  const handleToggleDay = (id: string) => {
    setScheduleList(prev => prev.map(item => 
      item.id === id ? { ...item, is_active: !item.is_active } : item
    ));
  };

  const handleUpdateSlots = (id: string, newSlots: string) => {
    setScheduleList(prev => prev.map(item => 
      item.id === id ? { ...item, slots: newSlots } : item
    ));
  };

  const handleSaveAvailability = () => {
    setIsEditingAvailability(false);
    setSaveSuccessMsg('Weekly 7-day schedule updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Exceptions Handlers
  const handleAddExceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExceptionDate) return;
    bookingService.addException(teacherId, newExceptionDate, false, newExceptionReason);
    setNewExceptionDate('');
    setIsAddingException(false);
    setSaveSuccessMsg(`Date ${newExceptionDate} marked as unavailable.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleRemoveException = (date: string) => {
    bookingService.removeException(teacherId, date);
    setSaveSuccessMsg(`Date ${date} restored to normal schedule.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Payout Submit
  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutModalOpen(false);
      setPayoutSuccess(false);
      setSaveSuccessMsg('Payout request received. Processing via Bangladesh BEFTN / bKash gateway.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }, 1500);
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Verification Status Banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#E8F5EF] text-[#16845B] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Approved Scholar Profile
              </span>
              <span className="text-xs text-slate-400">• Timezone: Asia/Dhaka (GMT+6)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              Assalamu Alaikum, {user?.full_name || teacher.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Institution: <span className="font-bold text-[#0F2A43]">{teacher.madrasa_institution}</span> • Rating: <span className="font-bold text-[#D9A441]">{teacher.rating} ★</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/teachers/${teacher.slug}`}
              className="px-4 py-2 bg-[#FAF9F5] hover:bg-slate-100 border border-slate-200 text-[#0F2A43] text-xs font-bold rounded-lg transition-colors"
            >
              Preview Public Profile
            </Link>
            <button 
              onClick={() => setIsEditingAvailability(true)}
              className="px-4 py-2 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Availability
            </button>
          </div>
        </div>

        {/* Global Toast / Success Alert */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-xl bg-[#E8F5EF] border border-[#16845B]/30 text-[#16845B] text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Financial Metrics Grid (Section 19 Blueprint) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
              <DollarSign className="w-4 h-4 text-[#16845B]" />
            </div>
            <p className="text-3xl font-bold text-[#0F2A43]">${financials.availableBalance.toFixed(2)}</p>
            <p className="text-[11px] text-slate-400">Ready for instant withdrawal (bKash / Bank)</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Balance</span>
              <Clock className="w-4 h-4 text-[#D9A441]" />
            </div>
            <p className="text-3xl font-bold text-[#0F2A43]">${financials.pendingBalance.toFixed(2)}</p>
            <p className="text-[11px] text-slate-400">In escrow for {financials.pendingCount + financials.confirmedCount} upcoming lessons</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Lessons</span>
              <Users className="w-4 h-4 text-[#0F2A43]" />
            </div>
            <p className="text-3xl font-bold text-[#0F2A43]">{financials.completedCount} Lessons</p>
            <p className="text-[11px] text-slate-400">Taught to UK, USA, UAE &amp; European students</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Net Earnings</span>
              <TrendingUp className="w-4 h-4 text-[#16845B]" />
            </div>
            <p className="text-3xl font-bold text-[#16845B]">${financials.totalEarnings.toFixed(2)}</p>
            <p className="text-[11px] text-slate-400">After platform fee ({financials.platformFeePercent}%)</p>
          </div>

        </div>

        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Lesson Requests, Upcoming Schedule & Exceptions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Pending Booking Requests (Section 12 Blueprint) */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2A43] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#D9A441]" />
                  <span>Pending Lesson Requests ({pendingRequests.length})</span>
                </h3>
                {pendingRequests.length > 0 && (
                  <span className="text-xs text-[#D9A441] font-bold">Action needed</span>
                )}
              </div>

              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((req) => {
                    const localDateStr = formatLocalDate(req.scheduled_at, 'Asia/Dhaka');
                    const localTimeStr = formatLocalTime(req.scheduled_at, 'Asia/Dhaka');
                    const studentTzStr = formatLocalTime(req.scheduled_at, req.student_timezone || 'Europe/London');

                    return (
                      <div key={req.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#16845B] bg-[#E8F5EF] px-2 py-0.5 rounded">
                              {req.lesson_type === 'trial' ? '30m Trial' : '60m Regular'} • ${req.price_usd}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">ID: {req.id}</span>
                          </div>
                          <h4 className="font-bold text-sm text-[#0F2A43]">{req.subject}</h4>
                          <p className="text-xs text-slate-500">
                            Student: <strong className="text-[#0F2A43]">{req.student_name}</strong> ({req.student_timezone || 'Europe/London'})
                          </p>
                          <p className="text-xs text-[#0F2A43] font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{localDateStr} at {localTimeStr} (BD) / {studentTzStr} ({req.student_timezone?.split('/')[1] || 'Local'})</span>
                          </p>
                          {req.student_notes && (
                            <p className="text-[11px] text-slate-500 italic">
                              Student note: &ldquo;{req.student_notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => handleAcceptBooking(req.id)}
                            className="px-3.5 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Accept Lesson
                          </button>
                          <button 
                            onClick={() => handleDeclineBooking(req.id)}
                            className="px-3 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No new pending booking requests at this time.</p>
              )}
            </div>

            {/* 2. Confirmed Upcoming Lessons */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#0F2A43] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#16845B]" />
                <span>Confirmed Upcoming Lessons ({confirmedUpcoming.length})</span>
              </h3>

              {confirmedUpcoming.length > 0 ? (
                <div className="space-y-3">
                  {confirmedUpcoming.map((item) => {
                    const localDateStr = formatLocalDate(item.scheduled_at, 'Asia/Dhaka');
                    const localTimeStr = formatLocalTime(item.scheduled_at, 'Asia/Dhaka');

                    return (
                      <div key={item.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#16845B] bg-[#E8F5EF] px-2 py-0.5 rounded uppercase">
                            Confirmed Session (${item.price_usd})
                          </span>
                          <h4 className="font-bold text-sm text-[#0F2A43]">{item.subject}</h4>
                          <p className="text-xs text-slate-500">Student: {item.student_name}</p>
                          <p className="text-xs font-semibold text-[#0F2A43]">
                            {localDateStr} at {localTimeStr} (Dhaka Time)
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.meeting_link && (
                            <a
                              href={item.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Start Classroom</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleCompleteBooking(item.id)}
                            className="px-3 py-2 bg-[#FAF9F5] hover:bg-emerald-50 hover:text-[#16845B] border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No confirmed upcoming lessons.</p>
              )}
            </div>

            {/* 3. Date Exceptions & Leave Management (Blueprint Section 11 & 20) */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F2A43] flex items-center gap-2">
                    <CalendarOff className="w-5 h-5 text-amber-600" />
                    <span>Availability Date Overrides / Exceptions</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Block specific dates (e.g., Eid holidays, exam travel, illness) to prevent bookings without altering your regular weekly schedule.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingException(true)}
                  className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#E8F5EF] text-[#16845B] border border-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Block Date</span>
                </button>
              </div>

              {exceptions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {exceptions.map((ex) => (
                    <div key={ex.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#0F2A43]">{ex.date}</span>
                        <span className="text-xs text-red-600 font-bold ml-2">• Blocked (Unavailable)</span>
                        <p className="text-xs text-slate-500 mt-0.5">{ex.reason || 'Leave of absence'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveException(ex.date)}
                        className="text-xs text-slate-400 hover:text-red-600 p-1.5 rounded"
                        title="Remove exception"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No dates blocked. All regular weekly slots are active.</p>
              )}
            </div>

            {/* 4. Weekly Availability Settings */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F2A43] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#16845B]" />
                    <span>Weekly Schedule (All 7 Days)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Timezone: <span className="font-semibold text-slate-700">Asia/Dhaka (GMT+6)</span>.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingAvailability(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#E8F5EF] text-[#16845B] border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Configure Slots
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {scheduleList.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-2 transition-all ${
                      item.is_active 
                        ? 'bg-[#FAF9F5] border-slate-200' 
                        : 'bg-slate-50/70 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-36 shrink-0">
                      <span className="font-bold text-[#0F2A43]">{item.day_name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({item.day_bengali})</span>
                    </div>
                    
                    <span className="text-slate-600 flex-1 text-xs">
                      {item.is_active ? item.slots : <span className="italic text-slate-400">Unavailable / Day Off</span>}
                    </span>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleToggleDay(item.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          item.is_active 
                            ? 'text-[#16845B] bg-[#E8F5EF] hover:bg-emerald-100' 
                            : 'text-slate-500 bg-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Off'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Payouts & Documents */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Payout Card */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
              <h3 className="text-base font-bold text-[#0F2A43] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#16845B]" />
                <span>Scholar Payout (Bangladesh)</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Available to Withdraw:</span>
                  <span className="font-bold text-[#0F2A43]">${financials.availableBalance.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Est. Payout in BDT:</span>
                  <span className="font-bold text-[#16845B]">≈ ৳ {(financials.availableBalance * 120).toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                  <span>Method:</span>
                  <span className="font-semibold text-[#0F2A43]">{payoutAccount}</span>
                </div>
              </div>

              <button
                onClick={() => setPayoutModalOpen(true)}
                disabled={financials.availableBalance <= 0}
                className="w-full py-2.5 bg-[#16845B] hover:bg-[#126D4B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Request Payout Transfer
              </button>

              <div className="text-[11px] text-slate-400 leading-relaxed text-center">
                Automated BEFTN bank transfer or bKash merchant payout processed in 24 hrs.
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#0F2A43]">
                Pricing Settings
              </h3>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                <span className="text-slate-600">Hourly Rate (60m):</span>
                <span className="font-bold text-[#0F2A43]">${teacher.hourly_rate || 10} / hr</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-slate-600">Trial Lesson (30m):</span>
                <span className="font-bold text-[#16845B]">${teacher.trial_rate || 4} / 30m</span>
              </div>
            </div>

            {/* Verified Documents (Section 10 Blueprint) */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F2A43] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16845B]" />
                  <span>My Sanads &amp; NID</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  2 Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0F2A43]">National NID Card</p>
                    <p className="text-[10px] text-slate-400">nid_abdullah.pdf</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#16845B] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0F2A43]">Dawra-e-Hadith Sanad</p>
                    <p className="text-[10px] text-slate-400">takmeel_sanad.pdf</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#16845B] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              <Link
                href="/teacher/register"
                className="block text-center py-2 text-xs font-bold text-[#16845B] bg-[#E8F5EF] hover:bg-[#d6eee3] rounded-lg transition-colors"
              >
                Upload Additional Certificate
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: Block Date / Exception */}
      {isAddingException && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#0F2A43]">Block Date (Add Exception)</h3>
            <p className="text-xs text-slate-500">
              Students will not be able to book slots on this date.
            </p>

            <form onSubmit={handleAddExceptionSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Date (yyyy-mm-dd)</label>
                <input
                  type="date"
                  required
                  value={newExceptionDate}
                  onChange={(e) => setNewExceptionDate(e.target.value)}
                  className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel, Jumu'ah khutbah preparation, Illness"
                  value={newExceptionReason}
                  onChange={(e) => setNewExceptionReason(e.target.value)}
                  className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingException(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Block This Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Request Payout */}
      {payoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#0F2A43]">Request Payout Transfer</h3>
            
            {payoutSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs text-center font-bold space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p>Payout request of ${financials.availableBalance.toFixed(2)} USD (≈ ৳ {(financials.availableBalance * 120).toLocaleString()} BDT) submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handlePayoutSubmit} className="space-y-4">
                <div className="p-3 rounded-lg bg-[#FAF9F5] border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-[#0F2A43]">
                    <span>Amount:</span>
                    <span>${financials.availableBalance.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500 mt-1">
                    <span>BDT Equivalent:</span>
                    <span className="font-semibold text-[#16845B]">≈ ৳ {(financials.availableBalance * 120).toLocaleString()} BDT</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Payout Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bank', 'bkash', 'nagad'] as const).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          setPayoutProvider(p);
                          if (p === 'bkash') setPayoutAccount('bKash Personal: 01712-345678');
                          else if (p === 'nagad') setPayoutAccount('Nagad Personal: 01712-345678');
                          else setPayoutAccount('Islami Bank BD (A/C: ****4892)');
                        }}
                        className={`py-2 text-xs font-bold rounded-lg border capitalize cursor-pointer ${
                          payoutProvider === p 
                            ? 'bg-[#0F2A43] text-white border-[#0F2A43]' 
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Account Details</label>
                  <input
                    type="text"
                    required
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    className="w-full text-xs bg-[#FAF9F5] border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Availability Modal */}
      {isEditingAvailability && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-[#FAF9F5]">
              <div>
                <h3 className="text-lg font-bold text-[#0F2A43]">Configure 7-Day Availability</h3>
                <p className="text-xs text-slate-500">
                  Set available lesson time slots for all 7 days of the week (Asia/Dhaka GMT+6)
                </p>
              </div>
              <button
                onClick={() => setIsEditingAvailability(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                Toggle days on/off and customize the slot schedule below. All 7 days (including Tuesday &amp; Thursday) are stored in the <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">teacher_availability</code> table.
              </p>

              <div className="space-y-3">
                {scheduleList.map((slotItem) => (
                  <div 
                    key={slotItem.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      slotItem.is_active 
                        ? 'bg-white border-slate-200 shadow-xs' 
                        : 'bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`chk-${slotItem.id}`}
                          checked={slotItem.is_active}
                          onChange={() => handleToggleDay(slotItem.id)}
                          className="w-4 h-4 text-[#16845B] rounded border-slate-300 focus:ring-[#16845B] cursor-pointer"
                        />
                        <label 
                          htmlFor={`chk-${slotItem.id}`}
                          className="font-bold text-xs text-[#0F2A43] cursor-pointer"
                        >
                          {slotItem.day_name} ({slotItem.day_bengali})
                        </label>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        slotItem.is_active ? 'bg-[#E8F5EF] text-[#16845B]' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {slotItem.is_active ? 'Available' : 'Day Off'}
                      </span>
                    </div>

                    {slotItem.is_active && (
                      <div className="mt-2 pl-6">
                        <input
                          type="text"
                          value={slotItem.slots}
                          onChange={(e) => handleUpdateSlots(slotItem.id, e.target.value)}
                          placeholder="e.g. 18:00 - 22:00 (Evening) | 23:00 - 02:00 (US/UK prime)"
                          className="w-full text-xs px-3 py-2 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#FAF9F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingAvailability(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvailability}
                className="px-5 py-2 text-xs font-bold text-white bg-[#16845B] hover:bg-[#126D4B] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save 7-Day Schedule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
