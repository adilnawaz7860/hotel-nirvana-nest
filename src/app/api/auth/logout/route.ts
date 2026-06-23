import { clearSessionCookies } from "@/lib/auth/session";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST() {
  try {
    await clearSessionCookies();
    return ok({ message: "Logged out" });
  } catch (error) {
    return fail(error);
  }
}
