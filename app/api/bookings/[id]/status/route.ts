import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/lib/booking-service';
import { bookingStatusUpdateSchema } from '@/lib/validation/booking';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = bookingStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const actor = {
      id: body.actor_id,
      role: (body.actor_role || 'teacher') as 'teacher' | 'student' | 'admin' | 'system'
    };

    const result = bookingService.updateStatus(
      id,
      parsed.data.status as 'confirmed' | 'rejected' | 'cancelled' | 'completed',
      actor,
      parsed.data.reason,
      parsed.data.meeting_link
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
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
