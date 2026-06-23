import { type NextRequest } from "next/server";
import { CmsService } from "@/modules/cms/cms.service";
import { amenitySchema } from "@/lib/validations/cms.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const input = amenitySchema.partial().parse(body);
    const amenity = await CmsService.updateAmenity(id, input);
    return ok(amenity);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin");
    const { id } = await params;
    const amenity = await CmsService.deleteAmenity(id);
    return ok(amenity);
  } catch (error) {
    return fail(error);
  }
}
