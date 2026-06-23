import { type NextRequest } from "next/server";
import { ReservationService } from "@/modules/restaurant/reservation.service";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const reservation = await ReservationService.markCompleted(id);
    return ok(reservation);
  } catch (error) {
    return fail(error);
  }
}
