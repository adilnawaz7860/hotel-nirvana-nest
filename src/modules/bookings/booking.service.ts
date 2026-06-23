import { connectMongo } from "@/lib/db/connect";
import { withTransaction } from "@/lib/db/transaction";
import { Room } from "@/models/Room";
import { RoomBooking } from "@/models/RoomBooking";
import { isRoomAvailable } from "@/modules/bookings/availability.algorithm";
import { generateBookingCode } from "@/lib/utils/codes";
import { nightsBetween, hoursUntil } from "@/lib/utils/dates";
import { calculateRoomBookingTotal } from "@/lib/utils/pricing";
import { ConflictError, NotFoundError, ForbiddenError, AppError } from "@/lib/utils/api-response";
import { BOOKING_HOLD_MINUTES, CANCELLATION_POLICY } from "@/lib/constants";
import type { CreateBookingInput } from "@/lib/validations/booking.validation";

export const BookingService = {
  async createBooking(userId: string, input: CreateBookingInput) {
    await connectMongo();

    return withTransaction(async (session) => {
      const room = await Room.findOne({ _id: input.roomId, isActive: true }).session(session);
      if (!room) throw new NotFoundError("Room not found or not available for booking");

      const available = await isRoomAvailable(input.roomId, input.checkIn, input.checkOut, session);
      if (!available) {
        throw new ConflictError("ROOM_NOT_AVAILABLE", "This room is no longer available for the selected dates");
      }

      const nights = nightsBetween(input.checkIn, input.checkOut);
      const { subtotal, discountAmount, taxAmount, totalAmount } = calculateRoomBookingTotal({
        nights,
        ratePerNight: room.pricePerNight,
        discountPercent: room.discountPercent,
      });

      const [booking] = await RoomBooking.create(
        [
          {
            bookingCode: generateBookingCode(),
            user: userId,
            room: room._id,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
            nights,
            guests: input.guests,
            guestDetails: input.guestDetails,
            ratePerNight: room.pricePerNight,
            subtotal,
            discountAmount,
            taxAmount,
            totalAmount,
            status: "pending_payment",
            expiresAt: new Date(Date.now() + BOOKING_HOLD_MINUTES * 60 * 1000),
            specialRequests: input.specialRequests,
          },
        ],
        { session }
      );

      return booking;
    });
  },

  async getById(bookingId: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId).populate("room");
    if (!booking) throw new NotFoundError("Booking not found");
    return booking;
  },

  async listForUser(userId: string, page = 1, limit = 10) {
    await connectMongo();
    const filter = { user: userId };
    const [bookings, total] = await Promise.all([
      RoomBooking.find(filter)
        .populate("room")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      RoomBooking.countDocuments(filter),
    ]);
    return { bookings, total };
  },

  async listAll(params: { status?: string; page?: number; limit?: number }) {
    await connectMongo();
    const { status, page = 1, limit = 20 } = params;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      RoomBooking.find(filter)
        .populate("room")
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      RoomBooking.countDocuments(filter),
    ]);
    return { bookings, total };
  },

  async cancel(bookingId: string, requestedBy: { userId: string; role: string }, reason?: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found");

    const isOwner = String(booking.user) === requestedBy.userId;
    const isStaff = requestedBy.role === "admin" || requestedBy.role === "staff";
    if (!isOwner && !isStaff) throw new ForbiddenError("You cannot cancel this booking");

    if (!["pending_payment", "confirmed"].includes(booking.status)) {
      throw new AppError("INVALID_STATUS", "This booking cannot be cancelled", 400);
    }

    const hoursBeforeCheckIn = hoursUntil(booking.checkIn);
    let refundAmount = 0;
    if (booking.status === "confirmed") {
      if (hoursBeforeCheckIn >= CANCELLATION_POLICY.fullRefundHoursBefore) {
        refundAmount = booking.totalAmount;
      } else if (hoursBeforeCheckIn >= CANCELLATION_POLICY.partialRefundHoursBefore) {
        refundAmount = Math.round(
          booking.totalAmount * (CANCELLATION_POLICY.partialRefundPercent / 100)
        );
      }
    }

    booking.status = "cancelled";
    booking.cancellation = { reason, cancelledAt: new Date(), refundAmount };
    await booking.save();

    return booking;
  },

  async checkIn(bookingId: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.status !== "confirmed") {
      throw new AppError("INVALID_STATUS", "Only confirmed bookings can be checked in", 400);
    }
    booking.status = "checked_in";
    await booking.save();
    return booking;
  },

  async checkOut(bookingId: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.status !== "checked_in") {
      throw new AppError("INVALID_STATUS", "Only checked-in bookings can be checked out", 400);
    }
    booking.status = "checked_out";
    await booking.save();
    return booking;
  },
};
