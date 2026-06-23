import { type NextRequest } from "next/server";
import { ReservationService } from "@/modules/restaurant/reservation.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail, ForbiddenError } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const reservation = await ReservationService.getById(id);

    const isOwner = String(reservation.user) === user.sub;
    const isStaff = user.role === "admin" || user.role === "staff";
    if (!isOwner && !isStaff) throw new ForbiddenError();

    return ok(reservation);
  } catch (error) {
    return fail(error);
  }
}
