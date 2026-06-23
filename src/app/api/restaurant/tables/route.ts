import { type NextRequest } from "next/server";
import { TableService } from "@/modules/restaurant/table.service";
import { createTableSchema } from "@/lib/validations/reservation.validation";
import { requireRole } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const tableType = request.nextUrl.searchParams.get("tableType") ?? undefined;
    const tables = await TableService.list({ tableType });
    return ok(tables);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("admin", "staff");
    const body = await request.json();
    const input = createTableSchema.parse(body);
    const table = await TableService.create(input);
    return ok(table, undefined, 201);
  } catch (error) {
    return fail(error);
  }
}
