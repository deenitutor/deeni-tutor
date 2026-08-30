import { z } from 'zod';
import { parseISO, isBefore } from 'date-fns';

export const bookingCreateSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  lesson_type: z.enum(['trial', 'regular'] as const),
  scheduled_at_utc: z.string().refine((val) => {
    try {
      const parsed = parseISO(val);
      return !isNaN(parsed.getTime());
    } catch {
      return false;
    }
  }, { message: 'scheduled_at_utc must be a valid ISO 8601 string' }).refine((val) => {
    try {
      const parsed = parseISO(val);
      // Scheduled time must be in future (or at least within 2 minutes of current time)
      return isBefore(new Date(Date.now() - 2 * 60 * 1000), parsed);
    } catch {
      return false;
    }
  }, { message: 'Selected lesson time must be in the future' }),
  duration_minutes: z.number().refine((val) => [30, 45, 60, 90].includes(val), {
    message: 'Duration must be 30, 45, 60, or 90 minutes'
  }),
  student_notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
  student_timezone: z.string().optional().default('Europe/London')
});

export type BookingCreateSchemaType = z.infer<typeof bookingCreateSchema>;

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'no_show', 'disputed']),
  reason: z.string().max(300).optional(),
  meeting_link: z.string().url().optional()
});

export type BookingStatusUpdateSchemaType = z.infer<typeof bookingStatusUpdateSchema>;
