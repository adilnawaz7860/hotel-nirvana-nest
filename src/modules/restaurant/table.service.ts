import { connectMongo } from "@/lib/db/connect";
import { RestaurantTable } from "@/models/RestaurantTable";
import { ConflictError, NotFoundError } from "@/lib/utils/api-response";
import type { CreateTableInput, UpdateTableInput } from "@/lib/validations/reservation.validation";

export const TableService = {
  async create(input: CreateTableInput) {
    await connectMongo();
    const existing = await RestaurantTable.findOne({ tableNumber: input.tableNumber });
    if (existing) throw new ConflictError("TABLE_EXISTS", "A table with this number already exists");
    return RestaurantTable.create(input);
  },

  async update(id: string, input: UpdateTableInput) {
    await connectMongo();
    const table = await RestaurantTable.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!table) throw new NotFoundError("Table not found");
    return table;
  },

  async remove(id: string) {
    await connectMongo();
    const table = await RestaurantTable.findByIdAndUpdate(id, { isActive: false }, { returnDocument: "after" });
    if (!table) throw new NotFoundError("Table not found");
    return table;
  },

  async list(params: { tableType?: string; isActive?: boolean } = {}) {
    await connectMongo();
    const filter: Record<string, unknown> = {};
    if (params.tableType) filter.tableType = params.tableType;
    if (params.isActive !== undefined) filter.isActive = params.isActive;
    return RestaurantTable.find(filter).sort({ tableNumber: 1 });
  },
};
