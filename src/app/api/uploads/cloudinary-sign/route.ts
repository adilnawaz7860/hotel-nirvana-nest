import { type NextRequest } from "next/server";
import { getCloudinarySignature } from "@/lib/storage/cloudinary";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const folder = request.nextUrl.searchParams.get("folder") ?? "nirvana-nest/general";
    const signature = getCloudinarySignature(folder);
    return ok(signature);
  } catch (error) {
    return fail(error);
  }
}
