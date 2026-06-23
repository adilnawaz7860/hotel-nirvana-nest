import { type NextRequest } from "next/server";
import { ReservationService } from "@/modules/restaurant/reservation.service";
import { createReservationSchema } from "@/lib/validations/reservation.validation";
import { requireUser, requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";
import { EmailService } from "@/modules/notifications/email.service";
import { minutesToTimeString } from "@/lib/utils/dates";
import { TABLE_TYPE_LABELS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);

    if (user.role === "admin" || user.role === "staff") {
      await requireRole("admin", "staff");
      const status = searchParams.get("status") ?? undefined;
      const dateParam = searchParams.get("date");
      const { reservations, total } = await ReservationService.listAll({
        status,
        date: dateParam ? new Date(dateParam) : undefined,
        page,
        limit,
      });
      return ok(reservations, buildPaginationMeta(total, page, limit));
    }

    const { reservations, total } = await ReservationService.listForUser(user.sub, page, limit);
    return ok(reservations, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const input = createReservationSchema.parse(body);
    const reservation = await ReservationService.createReservation(user.sub, input);

    await EmailService.sendReservationConfirmation(reservation.guestDetails.email, {
      guestName: reservation.guestDetails.name,
      reservationCode: reservation.reservationCode,
      date: reservation.date.toDateString(),
      time: minutesToTimeString(reservation.timeSlot.start),
      partySize: reservation.partySize,
      tableType: TABLE_TYPE_LABELS[reservation.tableType],
    });

    return ok(reservation, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
