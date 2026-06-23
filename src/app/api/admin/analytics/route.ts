import { type NextRequest } from "next/server";
import { AnalyticsService } from "@/modules/cms/analytics.service";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const range = Number(request.nextUrl.searchParams.get("range") ?? 30);
    const data = await AnalyticsService.overview(range);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
