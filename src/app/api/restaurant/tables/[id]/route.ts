import { type NextRequest } from "next/server";
import { TableService } from "@/modules/restaurant/table.service";
import { updateTableSchema } from "@/lib/validations/reservation.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin", "staff");
    const { id } = await params;
    const body = await request.json();
    const input = updateTableSchema.parse(body);
    const table = await TableService.update(id, input);
    return ok(table);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin");
    const { id } = await params;
    const table = await TableService.remove(id);
    return ok(table);
  } catch (error) {
    return fail(error);
  }
}
