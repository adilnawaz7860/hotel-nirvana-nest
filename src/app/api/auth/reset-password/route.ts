import { type NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth.validation";
import { AuthService } from "@/modules/auth/auth.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = resetPasswordSchema.parse(body);
    await AuthService.resetPassword(input);
    return ok({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    return fail(error);
  }
}
