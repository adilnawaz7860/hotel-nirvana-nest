import { type NextRequest } from "next/server";
import { RoomService } from "@/modules/rooms/room.service";
import { createRoomSchema } from "@/lib/validations/room.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const roomType = searchParams.get("roomType") ?? undefined;

    const { rooms, total } = await RoomService.list({ roomType, isActive: true, page, limit });
    return ok(rooms, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const body = await request.json();
    const input = createRoomSchema.parse(body);
    const room = await RoomService.create(input);
    return ok(room, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
