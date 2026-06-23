import { type NextRequest } from "next/server";
import { ReservationService } from "@/modules/restaurant/reservation.service";
import { cancelReservationSchema } from "@/lib/validations/reservation.validation";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { EmailService } from "@/modules/notifications/email.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = cancelReservationSchema.parse(body);

    const reservation = await ReservationService.cancel(id, { userId: user.sub, role: user.role }, reason);

    await EmailService.sendCancellation(reservation.guestDetails.email, {
      guestName: reservation.guestDetails.name,
      code: reservation.reservationCode,
    });

    return ok(reservation);
  } catch (error) {
    return fail(error);
  }
}
