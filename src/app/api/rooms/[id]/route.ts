import { type NextRequest } from "next/server";
import { RoomService } from "@/modules/rooms/room.service";
import { updateRoomSchema } from "@/lib/validations/room.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const room = await RoomService.getById(id);
    return ok(room);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const input = updateRoomSchema.parse(body);
    const room = await RoomService.update(id, input);
    return ok(room);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin");
    const { id } = await params;
    const room = await RoomService.softDelete(id);
    return ok(room);
  } catch (error) {
    return fail(error);
  }
}
