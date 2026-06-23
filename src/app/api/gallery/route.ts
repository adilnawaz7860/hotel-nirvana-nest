import { type NextRequest } from "next/server";
import { GalleryService } from "@/modules/gallery/gallery.service";
import { galleryItemSchema } from "@/lib/validations/cms.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const items = await GalleryService.list(category);
    return ok(items);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const body = await request.json();
    const input = galleryItemSchema.parse(body);
    const item = await GalleryService.create(input);
    return ok(item, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
