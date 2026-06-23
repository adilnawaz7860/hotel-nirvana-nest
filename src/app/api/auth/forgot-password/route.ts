import { type NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth.validation";
import { AuthService } from "@/modules/auth/auth.service";
import { ok, fail, AppError } from "@/lib/utils/api-response";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000)) {
      throw new AppError("RATE_LIMITED", "Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const input = forgotPasswordSchema.parse(body);
    await AuthService.forgotPassword(input);
    return ok({ message: "If an account exists for this email, a reset link has been sent." });
  } catch (error) {
    return fail(error);
  }
}
