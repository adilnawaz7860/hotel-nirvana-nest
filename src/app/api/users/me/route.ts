import { type NextRequest } from "next/server";
import { z } from "zod";
import { UserService } from "@/modules/users/user.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/)
    .optional(),
  avatarUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await requireUser();
    const user = await UserService.getProfile(session.sub);
    return ok(user);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const input = updateSchema.parse(body);
    const user = await UserService.updateProfile(session.sub, input);
    return ok(user);
  } catch (error) {
    return fail(error);
  }
}
