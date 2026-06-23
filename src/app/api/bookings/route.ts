import { type NextRequest } from "next/server";
import { BookingService } from "@/modules/bookings/booking.service";
import { createBookingSchema } from "@/lib/validations/booking.validation";
import { requireUser, requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);

    if (user.role === "admin" || user.role === "staff") {
      await requireRole("admin", "staff");
      const status = searchParams.get("status") ?? undefined;
      const { bookings, total } = await BookingService.listAll({ status, page, limit });
      return ok(bookings, buildPaginationMeta(total, page, limit));
    }

    const { bookings, total } = await BookingService.listForUser(user.sub, page, limit);
    return ok(bookings, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const input = createBookingSchema.parse(body);
    const booking = await BookingService.createBooking(user.sub, input);
    return ok(booking, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
