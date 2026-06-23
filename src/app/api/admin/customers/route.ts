import { type NextRequest } from "next/server";
import { UserService } from "@/modules/users/user.service";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const search = searchParams.get("search") ?? undefined;

    const { users, total } = await UserService.listAll({ page, limit, search });
    return ok(users, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}
