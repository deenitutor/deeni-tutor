import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/lib/booking-service';
import { bookingCreateSchema } from '@/lib/validation/booking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          issues: parsed.error.issues 
        }, 
        { status: 400 }
      );
    }

    // 2. Mock or Session user identity
    const studentUser = {
      id: body.student_id || 'std-001',
      full_name: body.student_name || 'Tariq Rahman',
      email: body.student_email || 'tariq.rahman@example.co.uk',
      timezone: body.student_timezone || 'Europe/London'
    };

    // 3. Process authoritative booking creation & conflict check
    const result = bookingService.createBooking(parsed.data, studentUser);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully and pending teacher confirmation.',
      booking: result.booking
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
