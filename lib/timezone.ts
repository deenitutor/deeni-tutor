import { format, parseISO, addDays, isAfter, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { TeacherAvailability } from '@/types/teacher';
import { Booking, TeacherAvailabilityException } from '@/types/booking';

export interface TimezoneOption {
  value: string;
  label: string;
  city: string;
  region: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Dhaka', label: 'Bangladesh (GMT+6)', city: 'Dhaka', region: 'Bangladesh' },
  { value: 'Europe/London', label: 'UK London (GMT / BST)', city: 'London', region: 'United Kingdom' },
  { value: 'America/New_York', label: 'US Eastern (EDT/EST)', city: 'New York', region: 'United States' },
  { value: 'America/Chicago', label: 'US Central (CDT/CST)', city: 'Chicago', region: 'United States' },
  { value: 'America/Los_Angeles', label: 'US Pacific (PDT/PST)', city: 'Los Angeles', region: 'United States' },
  { value: 'America/Toronto', label: 'Canada Eastern (EDT)', city: 'Toronto', region: 'Canada' },
  { value: 'Asia/Riyadh', label: 'Saudi Arabia (GMT+3)', city: 'Riyadh', region: 'Middle East' },
  { value: 'Asia/Dubai', label: 'UAE / Dubai (GMT+4)', city: 'Dubai', region: 'Middle East' },
  { value: 'Asia/Singapore', label: 'Singapore / Malaysia (GMT+8)', city: 'Singapore', region: 'Asia' },
  { value: 'Australia/Sydney', label: 'Australia Sydney (AEST)', city: 'Sydney', region: 'Australia' }
];

export interface SlotItem {
  id: string;
  startUtc: string; // ISO string in UTC
  endUtc: string;   // ISO string in UTC
  dateStringStudent: string; // YYYY-MM-DD in student tz
  displayDateStudent: string; // e.g. "Sat, Aug 29"
  displayTimeStudent: string; // e.g. "13:00 (1:00 PM)"
  displayTimeDhaka: string;   // e.g. "18:00 (6:00 PM BST)"
  durationMinutes: number;
  isBooked: boolean;
  isPast: boolean;
  isExceptionUnavailable: boolean;
}

export interface DaySlotsGroup {
  dateString: string; // YYYY-MM-DD
  dayName: string;   // "Saturday"
  dayShort: string;  // "Sat"
  displayDate: string; // "Aug 29, 2026"
  isToday: boolean;
  slots: SlotItem[];
}

/**
 * Format a UTC ISO string into target timezone
 */
export function formatInUserTimezone(
  utcIsoString: string, 
  targetTimezone: string, 
  formatPattern: string = 'dd MMM yyyy, hh:mm a'
): string {
  try {
    const date = typeof utcIsoString === 'string' ? parseISO(utcIsoString) : utcIsoString;
    return formatInTimeZone(date, targetTimezone, formatPattern);
  } catch {
    return utcIsoString;
  }
}

/**
 * Format local time in specified timezone
 */
export function formatLocalTime(
  utcIsoString: string,
  targetTimezone: string = 'Asia/Dhaka',
  formatPattern: string = 'h:mm a'
): string {
  try {
    const date = typeof utcIsoString === 'string' ? parseISO(utcIsoString) : utcIsoString;
    return formatInTimeZone(date, targetTimezone, formatPattern);
  } catch {
    return utcIsoString;
  }
}

/**
 * Format local date in specified timezone
 */
export function formatLocalDate(
  utcIsoString: string,
  targetTimezone: string = 'Asia/Dhaka',
  formatPattern: string = 'EEE, MMM d, yyyy'
): string {
  try {
    const date = typeof utcIsoString === 'string' ? parseISO(utcIsoString) : utcIsoString;
    return formatInTimeZone(date, targetTimezone, formatPattern);
  } catch {
    return utcIsoString;
  }
}

/**
 * Format a lesson time displaying both student's timezone and teacher's Dhaka timezone
 */
export function formatDualTime(utcIsoString: string, studentTimezone: string = 'Europe/London'): {
  studentTime: string;
  dhakaTime: string;
  fullStudentDate: string;
} {
  try {
    const date = parseISO(utcIsoString);
    const studentTime = formatInTimeZone(date, studentTimezone, 'h:mm a (z)');
    const dhakaTime = formatInTimeZone(date, 'Asia/Dhaka', 'h:mm a (GMT+6)');
    const fullStudentDate = formatInTimeZone(date, studentTimezone, 'EEEE, MMMM d, yyyy');
    
    return { studentTime, dhakaTime, fullStudentDate };
  } catch {
    return {
      studentTime: utcIsoString,
      dhakaTime: '',
      fullStudentDate: ''
    };
  }
}

/**
 * Convert local date + time string in source timezone to a UTC ISO string
 */
export function convertLocalToUtcIso(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:mm (24hr)
  sourceTimezone: string = 'Asia/Dhaka'
): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Create Date in target timezone
  const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const utcDate = fromZonedTime(dateObj, sourceTimezone);
  return utcDate.toISOString();
}

/**
 * Generate calendar slots for the next N days based on teacher schedule
 */
export function generateTeacherSlots({
  teacherAvailability = [],
  exceptions = [],
  existingBookings = [],
  studentTimezone = 'Europe/London',
  teacherTimezone = 'Asia/Dhaka',
  durationMinutes = 60,
  daysCount = 14
}: {
  teacherAvailability: TeacherAvailability[];
  exceptions?: TeacherAvailabilityException[];
  existingBookings?: Booking[];
  studentTimezone?: string;
  teacherTimezone?: string;
  durationMinutes?: number;
  daysCount?: number;
}): DaySlotsGroup[] {
  const groups: DaySlotsGroup[] = [];
  const now = new Date();
  const startDate = startOfDay(now);

  const activeDayMap = new Map<string, TeacherAvailability>();
  teacherAvailability.forEach((item) => {
    if (item.is_active) {
      activeDayMap.set(String(item.day_of_week).toLowerCase(), item);
      activeDayMap.set(item.day_name.toLowerCase(), item);
      activeDayMap.set(item.day_short.toLowerCase(), item);
    }
  });

  const exceptionMap = new Map<string, boolean>();
  exceptions.forEach(ex => {
    exceptionMap.set(ex.date, ex.is_available);
  });

  // Helper to check booking overlaps
  const isSlotBooked = (startUtcIso: string, endUtcIso: string) => {
    const slotStart = parseISO(startUtcIso).getTime();
    const slotEnd = parseISO(endUtcIso).getTime();

    return existingBookings.some((b) => {
      if (b.status === 'cancelled' || b.status === 'rejected') return false;
      const bStart = parseISO(b.scheduled_at).getTime();
      const bEnd = bStart + (b.duration_minutes * 60 * 1000);

      // Overlap condition: slotStart < bEnd && slotEnd > bStart
      return slotStart < bEnd && slotEnd > bStart;
    });
  };

  for (let i = 0; i < daysCount; i++) {
    const currentDay = addDays(startDate, i);
    // Format date in Teacher's timezone (Dhaka)
    const dhakaDateStr = formatInTimeZone(currentDay, teacherTimezone, 'yyyy-MM-dd');
    const dayOfWeekStr = formatInTimeZone(currentDay, teacherTimezone, 'eeee').toLowerCase(); // 'saturday', 'sunday', etc.
    const dayShortStr = formatInTimeZone(currentDay, teacherTimezone, 'eee');

    const dayAvailability = activeDayMap.get(dayOfWeekStr);
    const daySlots: SlotItem[] = [];

    // Check if whole day is blocked by an exception
    const isExceptionUnavailable = exceptionMap.get(dhakaDateStr) === false;

    if (dayAvailability && !isExceptionUnavailable) {
      const [startHour, startMin] = dayAvailability.start_time.split(':').map(Number);
      const [endHour, endMin] = dayAvailability.end_time.split(':').map(Number);

      const totalStartMinutes = startHour * 60 + (startMin || 0);
      const totalEndMinutes = endHour * 60 + (endMin || 0);

      // Step by duration (30 min or 60 min)
      const step = durationMinutes <= 30 ? 30 : 60;

      for (let m = totalStartMinutes; m + durationMinutes <= totalEndMinutes; m += step) {
        const slotHour = Math.floor(m / 60);
        const slotMinute = m % 60;

        const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`;
        
        // Calculate UTC ISO
        const startUtcIso = convertLocalToUtcIso(dhakaDateStr, timeStr, teacherTimezone);
        const endUtcDate = new Date(parseISO(startUtcIso).getTime() + durationMinutes * 60 * 1000);
        const endUtcIso = endUtcDate.toISOString();

        const slotStartDate = parseISO(startUtcIso);
        const isPast = isBefore(slotStartDate, new Date());
        const isBooked = isSlotBooked(startUtcIso, endUtcIso);

        const dateStringStudent = formatInTimeZone(slotStartDate, studentTimezone, 'yyyy-MM-dd');
        const displayDateStudent = formatInTimeZone(slotStartDate, studentTimezone, 'EEE, MMM d');
        const displayTimeStudent = formatInTimeZone(slotStartDate, studentTimezone, 'h:mm a');
        const displayTimeDhaka = formatInTimeZone(slotStartDate, teacherTimezone, 'h:mm a');

        daySlots.push({
          id: `slot-${startUtcIso}-${durationMinutes}`,
          startUtc: startUtcIso,
          endUtc: endUtcIso,
          dateStringStudent,
          displayDateStudent,
          displayTimeStudent,
          displayTimeDhaka,
          durationMinutes,
          isBooked,
          isPast,
          isExceptionUnavailable: false
        });
      }
    }

    // Format group date for student display
    const studentGroupDateStr = formatInTimeZone(currentDay, studentTimezone, 'yyyy-MM-dd');
    const dayName = formatInTimeZone(currentDay, studentTimezone, 'EEEE');
    const dayShort = formatInTimeZone(currentDay, studentTimezone, 'EEE');
    const displayDate = formatInTimeZone(currentDay, studentTimezone, 'MMM d, yyyy');
    const isToday = i === 0;

    groups.push({
      dateString: studentGroupDateStr,
      dayName,
      dayShort,
      displayDate,
      isToday,
      slots: daySlots
    });
  }

  return groups;
}
