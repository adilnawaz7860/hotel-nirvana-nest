import { type NextRequest } from "next/server";
import { CmsService } from "@/modules/cms/cms.service";
import { amenitySchema } from "@/lib/validations/cms.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const amenities = await CmsService.listAmenities(category);
    return ok(amenities);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const body = await request.json();
    const input = amenitySchema.parse(body);
    const amenity = await CmsService.createAmenity(input);
    return ok(amenity, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
