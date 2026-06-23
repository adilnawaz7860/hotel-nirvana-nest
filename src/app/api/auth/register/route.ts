import { type NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth.validation";
import { AuthService } from "@/modules/auth/auth.service";
import { setSessionCookies } from "@/lib/auth/session";
import { ok, fail, AppError } from "@/lib/utils/api-response";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!rateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
      throw new AppError("RATE_LIMITED", "Too many attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const input = registerSchema.parse(body);

    const user = await AuthService.register(input);

    await setSessionCookies(
      { sub: String(user._id), role: user.role, name: user.name },
      user.tokenVersion
    );

    return ok({ user }, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
