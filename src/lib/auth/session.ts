import { cookies } from "next/headers";
import type { AccessTokenPayload } from "@/lib/auth/jwt";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/lib/auth/jwt";

export const ACCESS_COOKIE = "nn_access_token";
export const REFRESH_COOKIE = "nn_refresh_token";

const isProd = process.env.NODE_ENV === "production";

export async function setSessionCookies(payload: AccessTokenPayload, tokenVersion: number) {
  const store = await cookies();
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: payload.sub, tokenVersion });

  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getCurrentUser(): Promise<AccessTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
