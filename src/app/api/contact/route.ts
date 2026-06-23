import { type NextRequest } from "next/server";
import { CmsService } from "@/modules/cms/cms.service";
import { contactQuerySchema } from "@/lib/validations/contact.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail, AppError } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const status = searchParams.get("status") ?? undefined;
    const { queries, total } = await CmsService.listContactQueries({ status, page, limit });
    return ok(queries, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      throw new AppError("RATE_LIMITED", "Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
    const input = contactQuerySchema.parse(body);
    const query = await CmsService.submitContactQuery(input);
    return ok(query, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
