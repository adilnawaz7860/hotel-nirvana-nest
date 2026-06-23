import { connectMongo } from "@/lib/db/connect";
import { RoomBooking } from "@/models/RoomBooking";
import { RestaurantReservation } from "@/models/RestaurantReservation";
import { Room } from "@/models/Room";
import { User } from "@/models/User";

export const AnalyticsService = {
  async overview(rangeDays = 30) {
    await connectMongo();
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

    const [
      totalRevenueAgg,
      bookingsCount,
      reservationsCount,
      activeRoomsCount,
      customersCount,
      bookingsByStatus,
      revenueByDay,
      topRooms,
    ] = await Promise.all([
      RoomBooking.aggregate([
        { $match: { status: { $in: ["confirmed", "checked_in", "checked_out"] }, createdAt: { $gte: since } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      RoomBooking.countDocuments({ createdAt: { $gte: since } }),
      RestaurantReservation.countDocuments({ createdAt: { $gte: since } }),
      Room.countDocuments({ isActive: true }),
      User.countDocuments({ role: "customer" }),
      RoomBooking.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      RoomBooking.aggregate([
        {
          $match: {
            status: { $in: ["confirmed", "checked_in", "checked_out"] },
            createdAt: { $gte: since },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      RoomBooking.aggregate([
        { $match: { status: { $in: ["confirmed", "checked_in", "checked_out"] } } },
        { $group: { _id: "$room", bookings: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: "rooms", localField: "_id", foreignField: "_id", as: "room" } },
        { $unwind: "$room" },
      ]),
    ]);

    return {
      totalRevenue: totalRevenueAgg[0]?.total ?? 0,
      bookingsCount,
      reservationsCount,
      activeRoomsCount,
      customersCount,
      bookingsByStatus,
      revenueByDay,
      topRooms,
    };
  },
};
