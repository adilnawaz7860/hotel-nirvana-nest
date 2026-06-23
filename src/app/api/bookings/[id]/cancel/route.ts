import { type NextRequest } from "next/server";
import { BookingService } from "@/modules/bookings/booking.service";
import { cancelBookingSchema } from "@/lib/validations/booking.validation";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { EmailService } from "@/modules/notifications/email.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = cancelBookingSchema.parse(body);

    const booking = await BookingService.cancel(id, { userId: user.sub, role: user.role }, reason);

    await EmailService.sendCancellation(booking.guestDetails.email, {
      guestName: booking.guestDetails.name,
      code: booking.bookingCode,
      refundAmount: booking.cancellation?.refundAmount,
    });

    return ok(booking);
  } catch (error) {
    return fail(error);
  }
}
