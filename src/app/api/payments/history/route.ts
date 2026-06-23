import { type NextRequest } from "next/server";
import { PaymentService } from "@/modules/payments/payment.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { page, limit } = parsePagination(request.nextUrl.searchParams);
    const { payments, total } = await PaymentService.historyForUser(user.sub, page, limit);
    return ok(payments, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}
