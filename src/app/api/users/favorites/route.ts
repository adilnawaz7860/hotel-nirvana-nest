import { type NextRequest } from "next/server";
import { z } from "zod";
import { UserService } from "@/modules/users/user.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

const schema = z.object({ roomId: z.string().min(1) });

export async function GET() {
  try {
    const session = await requireUser();
    const user = await UserService.getProfile(session.sub);
    return ok(user.favorites);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const { roomId } = schema.parse(body);
    const user = await UserService.toggleFavorite(session.sub, roomId);
    return ok(user.favorites);
  } catch (error) {
    return fail(error);
  }
}
