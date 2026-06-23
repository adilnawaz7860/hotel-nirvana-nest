import { type NextRequest } from "next/server";
import { BookingService } from "@/modules/bookings/booking.service";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const booking = await BookingService.checkOut(id);
    return ok(booking);
  } catch (error) {
    return fail(error);
  }
}
