import { type NextRequest } from "next/server";
import { CmsService } from "@/modules/cms/cms.service";
import { websiteSettingsSchema } from "@/lib/validations/cms.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const settings = await CmsService.getSettings();
    return ok(settings);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole("admin");
    const body = await request.json();
    const input = websiteSettingsSchema.parse(body);
    const settings = await CmsService.updateSettings(input);
    return ok(settings);
  } catch (error) {
    return fail(error);
  }
}
