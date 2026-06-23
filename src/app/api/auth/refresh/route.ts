import { cookies } from "next/headers";
import { AuthService } from "@/modules/auth/auth.service";
import { setSessionCookies, REFRESH_COOKIE } from "@/lib/auth/session";
import { ok, fail, UnauthorizedError } from "@/lib/utils/api-response";

export async function POST() {
  try {
    const store = await cookies();
    const refreshToken = store.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) throw new UnauthorizedError("Session expired, please log in again");

    const user = await AuthService.refresh(refreshToken);
    await setSessionCookies(
      { sub: String(user._id), role: user.role, name: user.name },
      user.tokenVersion
    );

    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
