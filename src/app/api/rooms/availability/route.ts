import { type NextRequest } from "next/server";
import { findAvailableRooms } from "@/modules/bookings/availability.algorithm";
import { roomAvailabilityQuerySchema } from "@/lib/validations/room.validation";
import { connectMongo } from "@/lib/db/connect";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);

    const query = roomAvailabilityQuerySchema.parse({
      checkIn: searchParams.get("checkIn"),
      checkOut: searchParams.get("checkOut"),
      roomType: searchParams.get("roomType") ?? undefined,
      adults: searchParams.get("adults") ?? undefined,
      children: searchParams.get("children") ?? undefined,
    });

    const { rooms, total } = await findAvailableRooms({ ...query, page, limit });
    return ok(rooms, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}
