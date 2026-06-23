import { type NextRequest } from "next/server";
import { ReviewService } from "@/modules/reviews/review.service";
import { createReviewSchema } from "@/lib/validations/review.validation";
import { requireUser, requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePagination(searchParams);
    const targetType = searchParams.get("targetType") ?? undefined;
    const targetId = searchParams.get("targetId") ?? undefined;
    const moderation = searchParams.get("moderation") === "1";
    const mine = searchParams.get("mine") === "1";

    if (moderation) {
      await requireRole("admin", "staff");
      const isApprovedParam = searchParams.get("isApproved");
      const isApproved = isApprovedParam === null ? undefined : isApprovedParam === "1";
      const { reviews, total } = await ReviewService.listAllForModeration({ isApproved, page, limit });
      return ok(reviews, buildPaginationMeta(total, page, limit));
    }

    if (mine) {
      const user = await requireUser();
      const { reviews, total } = await ReviewService.listMine(user.sub, page, limit);
      return ok(reviews, buildPaginationMeta(total, page, limit));
    }

    const { reviews, total } = await ReviewService.listApproved({ targetType, targetId, page, limit });
    return ok(reviews, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const input = createReviewSchema.parse(body);
    const review = await ReviewService.create(user.sub, input);
    return ok(review, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
