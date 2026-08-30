'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  Video, 
  DollarSign, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  History,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { bookingService } from '@/lib/booking-service';
import { adminService } from '@/lib/admin-service';
import { Booking, BookingStatus } from '@/types/booking';

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notification, setNotification] = useState('');

  const loadBookings = () => {
    setBookings(bookingService.getBookings());
  };

  useEffect(() => {
    const handleSync = () => loadBookings();
    window.addEventListener('deenitutor:booking-sync', handleSync);
    return () => window.removeEventListener('deenitutor:booking-sync', handleSync);
  }, []);

  const handleOverrideStatus = (bookingId: string, newStatus: 'confirmed' | 'rejected' | 'cancelled' | 'completed') => {
    const res = bookingService.updateStatus(
      bookingId,
      newStatus,
      { id: user?.id, role: 'admin' },
      'Admin intervention override via Control Center'
    );

    if (res.success) {
      adminService.logAction({
        admin_name: user?.full_name || 'Super Admin',
        action: 'OVERRIDE_BOOKING_STATUS',
        entity_type: 'booking',
        entity_id: bookingId,
        description: `Admin forced booking #${bookingId} status to ${newStatus.toUpperCase()}`
      });

      setNotification(`Booking #${bookingId} status updated to: ${newStatus.toUpperCase()}`);
      loadBookings();
      if (selectedBooking?.id === bookingId && res.booking) {
        setSelectedBooking(res.booking);
      }
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'completed':
        return <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Check className="w-3 h-3" /> Completed</span>;
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><X className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Global Lesson Bookings Master Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track live schedule sessions, Google Meet rooms, lesson confirmations, and override statuses.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-[#0F2A43] text-white text-xs font-bold rounded-xl self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
          <Calendar className="w-4 h-4 text-[#D9A441]" />
          <span>{bookings.length} Total Bookings Recorded</span>
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
              placeholder="Search by student, teacher, booking ID (#bk-...), or subject..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#0F2A43] text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Booking ID &amp; Subject</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-4">Scheduled Slot (UTC)</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* ID & Subject */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0F2A43] text-xs">#{b.id}</span>
                      <p className="font-semibold text-slate-800 text-[11px] truncate max-w-xs">{b.subject}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        b.lesson_type === 'trial' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.lesson_type === 'trial' ? '30m Trial' : `${b.duration_minutes}m Regular`}
                      </span>
                    </div>
                  </td>

                  {/* Student */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-bold text-[#0F2A43]">{b.student_name}</p>
                    <p className="text-[10px] text-slate-400">{b.student_timezone || 'Europe/London'}</p>
                  </td>

                  {/* Teacher */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-bold text-[#16845B]">{b.teacher_name}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{b.teacher_institution}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-700">
                      {new Date(b.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(b.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (UTC)
                    </p>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#0F2A43]">
                    ${b.price_usd.toFixed(2)} USD
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(b.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>

                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleOverrideStatus(b.id, 'completed')}
                          title="Force mark completed"
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Complete
                        </button>
                      )}

                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button
                          onClick={() => handleOverrideStatus(b.id, 'cancelled')}
                          title="Admin cancel"
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold rounded-lg border border-rose-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details / Timeline Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Booking Inspection
                </span>
                <h3 className="text-lg font-bold text-[#0F2A43]">#{selectedBooking.id} Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Student:</span>
                  <p className="font-bold text-[#0F2A43]">{selectedBooking.student_name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Teacher:</span>
                  <p className="font-bold text-[#16845B]">{selectedBooking.teacher_name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Price / Duration:</span>
                  <p className="font-bold text-[#0F2A43]">${selectedBooking.price_usd} USD &bull; {selectedBooking.duration_minutes}m</p>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <div className="pt-0.5">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              {selectedBooking.meeting_link && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 text-blue-900">
                  <div className="flex items-center gap-2 truncate">
                    <Video className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">{selectedBooking.meeting_link}</span>
                  </div>
                  <a
                    href={selectedBooking.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:underline shrink-0"
                  >
                    Join
                  </a>
                </div>
              )}

              {/* Event Timeline */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <History className="w-3.5 h-3.5" /> Event &amp; State Audit Trail
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto divide-y divide-slate-100">
                  {selectedBooking.events?.map((ev) => (
                    <div key={ev.id} className="pt-1.5 text-[11px] flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold uppercase text-[#0F2A43]">{ev.event_type}</span>
                        <p className="text-slate-500">{ev.notes || 'State transitioned'}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
