import { type NextRequest } from "next/server";
import { z } from "zod";
import { CmsService } from "@/modules/cms/cms.service";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

const schema = z.object({ status: z.enum(["new", "in_progress", "resolved"]) });

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const { status } = schema.parse(body);
    const query = await CmsService.updateContactQueryStatus(id, status);
    return ok(query);
  } catch (error) {
    return fail(error);
  }
}
