import { type NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/auth.validation";
import { AuthService } from "@/modules/auth/auth.service";
import { setSessionCookies } from "@/lib/auth/session";
import { ok, fail, AppError } from "@/lib/utils/api-response";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000)) {
      throw new AppError("RATE_LIMITED", "Too many login attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const input = loginSchema.parse(body);

    const user = await AuthService.login(input);
    await setSessionCookies(
      { sub: String(user._id), role: user.role, name: user.name },
      user.tokenVersion
    );

    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
