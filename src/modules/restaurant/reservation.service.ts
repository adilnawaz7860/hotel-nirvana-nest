import { connectMongo } from "@/lib/db/connect";
import { withTransaction } from "@/lib/db/transaction";
import { RestaurantReservation } from "@/models/RestaurantReservation";
import { allocateTable, isSpecificTableAvailable } from "@/modules/restaurant/reservation.algorithm";
import { generateReservationCode } from "@/lib/utils/codes";
import { timeStringToMinutes, startOfUtcDay } from "@/lib/utils/dates";
import { SEATING_BUFFER_MIN, SEATING_DURATION_MIN, minSufficientTableType } from "@/lib/constants";
import { ConflictError, ForbiddenError, NotFoundError, AppError } from "@/lib/utils/api-response";
import type { CreateReservationInput } from "@/lib/validations/reservation.validation";

export const ReservationService = {
  async createReservation(userId: string, input: CreateReservationInput) {
    await connectMongo();

    const startMinutes = timeStringToMinutes(input.time);
    const date = startOfUtcDay(input.date);
    const blockedEnd = startMinutes + SEATING_DURATION_MIN + SEATING_BUFFER_MIN;

    return withTransaction(async (session) => {
      let tableId: string;
      let tableType = minSufficientTableType(input.partySize);

      if (input.tableId) {
        const available = await isSpecificTableAvailable(input.tableId, date, startMinutes, session);
        if (!available) {
          throw new ConflictError("TABLE_NOT_AVAILABLE", "This table is already reserved for the selected time");
        }
        tableId = input.tableId;
      } else {
        const table = await allocateTable({ date, startMinutes, partySize: input.partySize, session });
        if (!table) {
          throw new ConflictError("NO_TABLE_AVAILABLE", "No tables are available for the selected time and party size");
        }
        tableId = String(table._id);
        tableType = table.tableType;
      }

      const [reservation] = await RestaurantReservation.create(
        [
          {
            reservationCode: generateReservationCode(),
            user: userId,
            table: tableId,
            tableType,
            date,
            timeSlot: { start: startMinutes, end: startMinutes + SEATING_DURATION_MIN },
            blockedEnd,
            partySize: input.partySize,
            guestDetails: input.guestDetails,
            specialRequests: input.specialRequests,
            status: "confirmed",
          },
        ],
        { session }
      );

      return reservation;
    });
  },

  async getById(id: string) {
    await connectMongo();
    const reservation = await RestaurantReservation.findById(id).populate("table");
    if (!reservation) throw new NotFoundError("Reservation not found");
    return reservation;
  },

  async listForUser(userId: string, page = 1, limit = 10) {
    await connectMongo();
    const filter = { user: userId };
    const [reservations, total] = await Promise.all([
      RestaurantReservation.find(filter)
        .populate("table")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      RestaurantReservation.countDocuments(filter),
    ]);
    return { reservations, total };
  },

  async listAll(params: { status?: string; date?: Date; page?: number; limit?: number }) {
    await connectMongo();
    const { status, date, page = 1, limit = 20 } = params;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (date) filter.date = startOfUtcDay(date);

    const [reservations, total] = await Promise.all([
      RestaurantReservation.find(filter)
        .populate("table")
        .populate("user", "name email phone")
        .sort({ date: 1, "timeSlot.start": 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      RestaurantReservation.countDocuments(filter),
    ]);
    return { reservations, total };
  },

  async cancel(id: string, requestedBy: { userId: string; role: string }, reason?: string) {
    await connectMongo();
    const reservation = await RestaurantReservation.findById(id);
    if (!reservation) throw new NotFoundError("Reservation not found");

    const isOwner = String(reservation.user) === requestedBy.userId;
    const isStaff = requestedBy.role === "admin" || requestedBy.role === "staff";
    if (!isOwner && !isStaff) throw new ForbiddenError("You cannot cancel this reservation");

    if (!["pending", "confirmed"].includes(reservation.status)) {
      throw new AppError("INVALID_STATUS", "This reservation cannot be cancelled", 400);
    }

    reservation.status = "cancelled";
    reservation.cancellation = { reason, cancelledAt: new Date() };
    await reservation.save();
    return reservation;
  },

  async markSeated(id: string) {
    await connectMongo();
    const reservation = await RestaurantReservation.findById(id);
    if (!reservation) throw new NotFoundError("Reservation not found");
    reservation.status = "seated";
    await reservation.save();
    return reservation;
  },

  async markCompleted(id: string) {
    await connectMongo();
    const reservation = await RestaurantReservation.findById(id);
    if (!reservation) throw new NotFoundError("Reservation not found");
    reservation.status = "completed";
    await reservation.save();
    return reservation;
  },
};
