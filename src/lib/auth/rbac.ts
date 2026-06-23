import type { UserRole } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth/session";
import { ForbiddenError, UnauthorizedError } from "@/lib/utils/api-response";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be logged in");
  return user;
}

export async function requireRole(...roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new ForbiddenError("You do not have permission to perform this action");
  }
  return user;
}

export const isAdmin = (role: UserRole) => role === "admin";
export const isStaffOrAdmin = (role: UserRole) => role === "staff" || role === "admin";
