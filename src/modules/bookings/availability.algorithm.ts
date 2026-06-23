import type mongoose from "mongoose";
import { Room } from "@/models/Room";
import { RoomBooking } from "@/models/RoomBooking";
import { BLOCKING_BOOKING_STATUSES, type RoomType } from "@/lib/constants";

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  session?: mongoose.ClientSession
): Promise<boolean> {
  const overlapFilter = {
    room: roomId,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };

  const confirmedConflict = await RoomBooking.findOne({
    ...overlapFilter,
    status: { $in: BLOCKING_BOOKING_STATUSES },
  }).session(session ?? null);
  if (confirmedConflict) return false;

  const heldConflict = await RoomBooking.findOne({
    ...overlapFilter,
    status: "pending_payment",
    expiresAt: { $gt: new Date() },
  }).session(session ?? null);

  return !heldConflict;
}

export async function findAvailableRooms(params: {
  checkIn: Date;
  checkOut: Date;
  roomType?: RoomType;
  adults?: number;
  children?: number;
  page?: number;
  limit?: number;
}) {
  const { checkIn, checkOut, roomType, adults = 1, children = 0, page = 1, limit = 12 } = params;

  const blockedRoomIds = await RoomBooking.distinct("room", {
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    $or: [
      { status: { $in: BLOCKING_BOOKING_STATUSES } },
      { status: "pending_payment", expiresAt: { $gt: new Date() } },
    ],
  });

  const filter: Record<string, unknown> = {
    _id: { $nin: blockedRoomIds },
    isActive: true,
    "capacity.adults": { $gte: adults },
    "capacity.children": { $gte: children },
  };
  if (roomType) filter.roomType = roomType;

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .sort({ pricePerNight: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("amenities")
      .lean(),
    Room.countDocuments(filter),
  ]);

  return { rooms, total };
}
