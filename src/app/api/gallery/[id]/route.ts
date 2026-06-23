import { type NextRequest } from "next/server";
import { GalleryService } from "@/modules/gallery/gallery.service";
import { galleryItemSchema } from "@/lib/validations/cms.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const input = galleryItemSchema.partial().parse(body);
    const item = await GalleryService.update(id, input);
    return ok(item);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const item = await GalleryService.remove(id);
    return ok(item);
  } catch (error) {
    return fail(error);
  }
}
