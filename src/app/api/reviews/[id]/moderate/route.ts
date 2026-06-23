import { type NextRequest } from "next/server";
import { ReviewService } from "@/modules/reviews/review.service";
import { moderateReviewSchema } from "@/lib/validations/review.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const input = moderateReviewSchema.parse(body);
    const review = await ReviewService.moderate(id, admin.sub, input);
    return ok(review);
  } catch (error) {
    return fail(error);
  }
}
