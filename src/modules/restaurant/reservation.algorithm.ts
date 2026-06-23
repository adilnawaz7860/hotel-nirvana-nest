import type mongoose from "mongoose";
import { Types } from "mongoose";
import { RestaurantTable, type IRestaurantTable } from "@/models/RestaurantTable";
import { RestaurantReservation } from "@/models/RestaurantReservation";
import {
  BLOCKING_RESERVATION_STATUSES,
  SEATING_BUFFER_MIN,
  SEATING_DURATION_MIN,
  TABLE_TYPE_RANK,
  minSufficientTableType,
} from "@/lib/constants";
import { startOfUtcDay } from "@/lib/utils/dates";

function blockedWindow(startMinutes: number) {
  return {
    start: startMinutes,
    end: startMinutes + SEATING_DURATION_MIN + SEATING_BUFFER_MIN,
  };
}

async function findBusyTableIds(
  date: Date,
  startMinutes: number,
  session?: mongoose.ClientSession
): Promise<Set<string>> {
  const window = blockedWindow(startMinutes);

  const busy = await RestaurantReservation.find({
    date: startOfUtcDay(date),
    status: { $in: BLOCKING_RESERVATION_STATUSES },
    "timeSlot.start": { $lt: window.end },
    blockedEnd: { $gt: window.start },
  })
    .session(session ?? null)
    .select("table")
    .lean();

  return new Set(busy.map((r) => String(r.table)));
}

export async function allocateTable(params: {
  date: Date;
  startMinutes: number;
  partySize: number;
  session?: mongoose.ClientSession;
}): Promise<IRestaurantTable | null> {
  const { date, startMinutes, partySize, session } = params;
  const busyTableIds = await findBusyTableIds(date, startMinutes, session);

  const minType = minSufficientTableType(partySize);
  const candidateTypes = TABLE_TYPE_RANK.slice(TABLE_TYPE_RANK.indexOf(minType));

  for (const tableType of candidateTypes) {
    const tables = await RestaurantTable.find({ tableType, isActive: true })
      .session(session ?? null)
      .lean();
    if (!tables.length) continue;

    const free = tables.filter((t) => !busyTableIds.has(String(t._id)));
    if (!free.length) continue;

    const counts = await Promise.all(
      free.map((t) =>
        RestaurantReservation.countDocuments({
          table: t._id,
          date: startOfUtcDay(date),
          status: { $in: BLOCKING_RESERVATION_STATUSES },
        }).session(session ?? null)
      )
    );

    const ranked = free
      .map((t, i) => ({ table: t, count: counts[i] }))
      .sort((a, b) => a.count - b.count || a.table.tableNumber.localeCompare(b.table.tableNumber));

    return ranked[0].table as IRestaurantTable;
  }

  return null;
}

export async function isSpecificTableAvailable(
  tableId: string,
  date: Date,
  startMinutes: number,
  session?: mongoose.ClientSession
): Promise<boolean> {
  const busyTableIds = await findBusyTableIds(date, startMinutes, session);
  return !busyTableIds.has(new Types.ObjectId(tableId).toString());
}

export async function getAvailableSlotsForDay(params: {
  date: Date;
  partySize: number;
  slots: number[];
}): Promise<{ start: number; available: boolean }[]> {
  const { date, partySize, slots } = params;
  const minType = minSufficientTableType(partySize);
  const candidateTypes = TABLE_TYPE_RANK.slice(TABLE_TYPE_RANK.indexOf(minType));

  const tables = await RestaurantTable.find({ tableType: { $in: candidateTypes }, isActive: true }).lean();
  if (!tables.length) return slots.map((start) => ({ start, available: false }));

  const results: { start: number; available: boolean }[] = [];
  for (const start of slots) {
    const busyTableIds = await findBusyTableIds(date, start);
    const hasFreeTable = tables.some((t) => !busyTableIds.has(String(t._id)));
    results.push({ start, available: hasFreeTable });
  }
  return results;
}
