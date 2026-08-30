import { MOCK_TEACHERS } from './mock-data';
import { Booking, BookingEvent, Payment, TeacherAvailabilityException, BookingCreateInput } from '@/types/booking';
import { bookingCreateSchema } from './validation/booking';
import { parseISO, addMinutes, isBefore } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Initial Mock Bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    student_id: 'std-001',
    student_name: 'Tariq Rahman',
    student_email: 'tariq.rahman@example.co.uk',
    student_timezone: 'Europe/London',
    teacher_id: 'tch-001',
    teacher_name: 'Mawlana Abdullah Al-Mahmud',
    teacher_slug: 'mawlana-abdullah-al-mahmud',
    teacher_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    teacher_institution: 'Darul Uloom Hathazari & University of Dhaka',
    subject: 'Arabic Syntax (Nahw) - Lesson 4',
    lesson_type: 'regular',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration_minutes: 60,
    price_usd: 10.00,
    status: 'confirmed',
    meeting_link: 'https://meet.google.com/dee-tutor-nahw',
    student_notes: 'Focus on Ajrumiyyah chapter on Irab and Mansubat.',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    events: [
      {
        id: 'evt-001',
        booking_id: 'bk-101',
        event_type: 'created',
        actor_role: 'student',
        notes: 'Student booked 60min regular lesson',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'evt-002',
        booking_id: 'bk-101',
        event_type: 'confirmed',
        actor_role: 'teacher',
        notes: 'Teacher confirmed lesson and assigned Google Meet room',
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'bk-102',
    student_id: 'std-001',
    student_name: 'Tariq Rahman',
    student_email: 'tariq.rahman@example.co.uk',
    student_timezone: 'Europe/London',
    teacher_id: 'tch-002',
    teacher_name: 'Ustadha Fatima bint Noor',
    teacher_slug: 'ustadha-fatima-bint-noor',
    teacher_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    teacher_institution: 'Jamia Madania Baridhara (Girls Section)',
    subject: 'Tajweed & Makharij',
    lesson_type: 'trial',
    scheduled_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days later
    duration_minutes: 30,
    price_usd: 4.00,
    status: 'pending',
    student_notes: 'Introductory 30-minute trial for my 8-year-old daughter Maryam.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    events: [
      {
        id: 'evt-003',
        booking_id: 'bk-102',
        event_type: 'created',
        actor_role: 'student',
        notes: 'Student requested trial lesson slot',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'bk-099',
    student_id: 'std-001',
    student_name: 'Tariq Rahman',
    student_email: 'tariq.rahman@example.co.uk',
    student_timezone: 'Europe/London',
    teacher_id: 'tch-001',
    teacher_name: 'Mawlana Abdullah Al-Mahmud',
    teacher_slug: 'mawlana-abdullah-al-mahmud',
    teacher_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    teacher_institution: 'Darul Uloom Hathazari & University of Dhaka',
    subject: 'Nahw Fundamentals - Introduction',
    lesson_type: 'regular',
    scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    duration_minutes: 60,
    price_usd: 10.00,
    status: 'completed',
    meeting_link: 'https://meet.google.com/dee-tutor-nahw-prev',
    student_notes: 'Initial evaluation and placement.',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    events: [
      {
        id: 'evt-000',
        booking_id: 'bk-099',
        event_type: 'completed',
        actor_role: 'system',
        notes: 'Lesson completed successfully',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

const INITIAL_EXCEPTIONS: TeacherAvailabilityException[] = [
  {
    id: 'exc-01',
    teacher_id: 'tch-001',
    date: '2026-09-04',
    is_available: false,
    reason: 'Jumu\'ah Special Khutbah preparation and travel',
    created_at: new Date().toISOString()
  }
];

const INITIAL_FAVOURITES: string[] = ['tch-001', 'tch-002'];

// LocalStorage Keys
const STORAGE_KEY_BOOKINGS = 'deenitutor_bookings_v2';
const STORAGE_KEY_EXCEPTIONS = 'deenitutor_exceptions_v2';
const STORAGE_KEY_FAVOURITES = 'deenitutor_favourites_v2';
const STORAGE_KEY_PAYMENTS = 'deenitutor_payments_v2';

class BookingManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Get all bookings
  public getBookings(): Booking[] {
    if (!this.isBrowser()) return INITIAL_BOOKINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (stored) {
        return JSON.parse(stored);
      }
      this.saveBookings(INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  private saveBookings(bookings: Booking[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
      window.dispatchEvent(new CustomEvent('deenitutor:booking-sync'));
    } catch (err) {
      console.error('Error saving bookings:', err);
    }
  }

  // Get availability exceptions for teacher
  public getExceptions(teacherId?: string): TeacherAvailabilityException[] {
    if (!this.isBrowser()) return INITIAL_EXCEPTIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXCEPTIONS);
      const list: TeacherAvailabilityException[] = stored ? JSON.parse(stored) : INITIAL_EXCEPTIONS;
      if (teacherId) {
        return list.filter(e => e.teacher_id === teacherId);
      }
      return list;
    } catch {
      return INITIAL_EXCEPTIONS;
    }
  }

  public saveExceptions(exceptions: TeacherAvailabilityException[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_EXCEPTIONS, JSON.stringify(exceptions));
      window.dispatchEvent(new CustomEvent('deenitutor:booking-sync'));
    } catch (err) {
      console.error('Error saving exceptions:', err);
    }
  }

  public addException(teacherId: string, date: string, isAvailable: boolean = false, reason: string = '') {
    const list = this.getExceptions();
    const filtered = list.filter(e => !(e.teacher_id === teacherId && e.date === date));
    const newEx: TeacherAvailabilityException = {
      id: `exc-${Date.now()}`,
      teacher_id: teacherId,
      date,
      is_available: isAvailable,
      reason,
      created_at: new Date().toISOString()
    };
    filtered.push(newEx);
    this.saveExceptions(filtered);
    return newEx;
  }

  public removeException(teacherId: string, date: string) {
    const list = this.getExceptions();
    const updated = list.filter(e => !(e.teacher_id === teacherId && e.date === date));
    this.saveExceptions(updated);
  }

  // Favourites
  public getFavourites(studentId: string = 'std-001'): string[] {
    if (!this.isBrowser()) return INITIAL_FAVOURITES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVOURITES);
      return stored ? JSON.parse(stored) : INITIAL_FAVOURITES;
    } catch {
      return INITIAL_FAVOURITES;
    }
  }

  public toggleFavourite(teacherId: string, studentId: string = 'std-001'): boolean {
    const favs = this.getFavourites(studentId);
    let updated: string[];
    let isFav: boolean;
    if (favs.includes(teacherId)) {
      updated = favs.filter(id => id !== teacherId);
      isFav = false;
    } else {
      updated = [...favs, teacherId];
      isFav = true;
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('deenitutor:booking-sync'));
    }
    return isFav;
  }

  public isFavourite(teacherId: string, studentId: string = 'std-001'): boolean {
    return this.getFavourites(studentId).includes(teacherId);
  }

  // -------------------------------------------------------------
  // SERVER / CORE VALIDATION FUNCTION
  // -------------------------------------------------------------
  public validateAvailability(
    teacherId: string,
    scheduledAtUtc: string,
    durationMinutes: number
  ): { valid: boolean; error?: string } {
    const teacher = MOCK_TEACHERS.find(t => t.id === teacherId);
    if (!teacher) {
      return { valid: false, error: 'Teacher not found' };
    }

    if (!teacher.is_approved) {
      return { valid: false, error: 'Teacher profile is not yet approved for public bookings' };
    }

    const startSlot = parseISO(scheduledAtUtc);
    if (isNaN(startSlot.getTime())) {
      return { valid: false, error: 'Invalid scheduled date format' };
    }

    if (isBefore(startSlot, new Date(Date.now() - 2 * 60 * 1000))) {
      return { valid: false, error: 'Cannot book slots in the past' };
    }

    const endSlot = addMinutes(startSlot, durationMinutes);

    // 1. Check Date Exceptions
    const dateStrDhaka = formatInTimeZone(startSlot, 'Asia/Dhaka', 'yyyy-MM-dd');
    const exceptions = this.getExceptions(teacherId);
    const dayException = exceptions.find(e => e.date === dateStrDhaka);
    if (dayException && !dayException.is_available) {
      return { 
        valid: false, 
        error: `Teacher is not taking lessons on ${dateStrDhaka} (${dayException.reason || 'Leave of absence'})` 
      };
    }

    // 2. Check Overlapping Existing Bookings (Conflict Prevention)
    const bookings = this.getBookings().filter(b => b.teacher_id === teacherId);
    const hasOverlap = bookings.some(b => {
      if (b.status === 'cancelled' || b.status === 'rejected') return false;
      const bStart = parseISO(b.scheduled_at);
      const bEnd = addMinutes(bStart, b.duration_minutes);

      // Overlap: startSlot < bEnd && endSlot > bStart
      return startSlot < bEnd && endSlot > bStart;
    });

    if (hasOverlap) {
      return { 
        valid: false, 
        error: 'This time slot is already reserved or in-progress. Please select another slot.' 
      };
    }

    return { valid: true };
  }

  // -------------------------------------------------------------
  // CREATE BOOKING (Server-side authoritative pricing & validation)
  // -------------------------------------------------------------
  public createBooking(
    input: BookingCreateInput, 
    student: { id: string; full_name: string; email?: string; timezone?: string }
  ): { success: boolean; booking?: Booking; error?: string } {
    // 1. Zod schema validation
    const parsed = bookingCreateSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid booking data';
      return { success: false, error: errorMsg };
    }

    const data = parsed.data;

    // 2. Teacher lookup
    const teacher = MOCK_TEACHERS.find(t => t.id === data.teacher_id);
    if (!teacher) {
      return { success: false, error: 'Selected teacher does not exist.' };
    }

    // 3. Conflict & slot validation
    const availabilityCheck = this.validateAvailability(
      data.teacher_id, 
      data.scheduled_at_utc, 
      data.duration_minutes
    );
    if (!availabilityCheck.valid) {
      return { success: false, error: availabilityCheck.error };
    }

    // 4. Authoritative Price Calculation (NEVER trust client price)
    let calculatedPrice: number;
    if (data.lesson_type === 'trial') {
      if (!teacher.trial_available) {
        return { success: false, error: 'This teacher does not currently offer trial lessons.' };
      }
      calculatedPrice = teacher.trial_rate ?? 4.00;
    } else {
      const hourlyRate = teacher.hourly_rate || 10.00;
      calculatedPrice = Number((hourlyRate * (data.duration_minutes / 60)).toFixed(2));
    }

    const newBookingId = `bk-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      id: newBookingId,
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      student_timezone: data.student_timezone || student.timezone || 'Europe/London',
      teacher_id: teacher.id,
      teacher_name: teacher.full_name,
      teacher_slug: teacher.slug,
      teacher_photo: teacher.photo_url,
      teacher_institution: teacher.madrasa_institution,
      subject: data.subject,
      lesson_type: data.lesson_type,
      scheduled_at: data.scheduled_at_utc,
      duration_minutes: data.duration_minutes,
      price_usd: calculatedPrice,
      status: 'pending', // Starts as pending teacher confirmation
      student_notes: data.student_notes,
      created_at: nowIso,
      events: [
        {
          id: `evt-${Date.now()}`,
          booking_id: newBookingId,
          event_type: 'created',
          actor_role: 'student',
          notes: `Booking created (${data.lesson_type === 'trial' ? '30m Trial' : `${data.duration_minutes}m Regular`}) for $${calculatedPrice}`,
          created_at: nowIso
        }
      ]
    };

    const currentBookings = this.getBookings();
    currentBookings.unshift(newBooking);
    this.saveBookings(currentBookings);

    return { success: true, booking: newBooking };
  }

  // -------------------------------------------------------------
  // STATUS TRANSITIONS (Confirm, Reject, Cancel, Complete)
  // -------------------------------------------------------------
  public updateStatus(
    bookingId: string,
    newStatus: 'confirmed' | 'rejected' | 'cancelled' | 'completed',
    actor: { id?: string; role: 'teacher' | 'student' | 'admin' | 'system' },
    reason?: string,
    customMeetingLink?: string
  ): { success: boolean; booking?: Booking; error?: string } {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Booking not found' };
    }

    const booking = bookings[index];
    const nowIso = new Date().toISOString();

    // Generate meeting link upon confirmation if not present
    let meetingLink = booking.meeting_link;
    if (newStatus === 'confirmed') {
      meetingLink = customMeetingLink || `https://meet.google.com/dee-${booking.id.replace(/[^a-zA-Z0-9]/g, '')}-cls`;
    }

    const updatedBooking: Booking = {
      ...booking,
      status: newStatus,
      meeting_link: meetingLink,
      cancellation_reason: reason || booking.cancellation_reason,
      updated_at: nowIso,
      events: [
        ...(booking.events || []),
        {
          id: `evt-${Date.now()}`,
          booking_id: bookingId,
          event_type: newStatus,
          actor_role: actor.role,
          notes: reason ? `${newStatus.toUpperCase()}: ${reason}` : `Status changed to ${newStatus}`,
          created_at: nowIso
        }
      ]
    };

    bookings[index] = updatedBooking;
    this.saveBookings(bookings);

    return { success: true, booking: updatedBooking };
  }

  // -------------------------------------------------------------
  // FINANCIALS / EARNINGS CALCULATOR
  // -------------------------------------------------------------
  public getTeacherFinancials(teacherId: string = 'tch-001') {
    const bookings = this.getBookings().filter(b => b.teacher_id === teacherId);
    
    // Platform fee 15%
    const PLATFORM_FEE_RATE = 0.15;

    let totalEarnings = 0;
    let availableBalance = 0;
    let pendingBalance = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let confirmedCount = 0;

    bookings.forEach(b => {
      const teacherShare = b.price_usd * (1 - PLATFORM_FEE_RATE);
      if (b.status === 'completed') {
        totalEarnings += teacherShare;
        availableBalance += teacherShare;
        completedCount++;
      } else if (b.status === 'confirmed' || b.status === 'pending') {
        pendingBalance += teacherShare;
        if (b.status === 'pending') pendingCount++;
        if (b.status === 'confirmed') confirmedCount++;
      }
    });

    const paidOut = 450.00; // Mock past withdrawals to bKash / Bank
    // Available is after subtracting paidOut (floor at 0)
    const netAvailable = Math.max(0, availableBalance);

    return {
      totalEarnings: Number(totalEarnings.toFixed(2)),
      availableBalance: Number(netAvailable.toFixed(2)),
      pendingBalance: Number(pendingBalance.toFixed(2)),
      paidOut: Number(paidOut.toFixed(2)),
      platformFeePercent: 15,
      completedCount,
      pendingCount,
      confirmedCount,
      totalLessons: bookings.length
    };
  }
}

export const bookingService = new BookingManager();
