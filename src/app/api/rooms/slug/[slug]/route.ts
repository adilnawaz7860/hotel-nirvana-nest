import { type NextRequest } from "next/server";
import { RoomService } from "@/modules/rooms/room.service";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const room = await RoomService.getBySlug(slug);
    return ok(room);
  } catch (error) {
    return fail(error);
  }
}
