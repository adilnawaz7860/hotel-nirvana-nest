export const ROOM_TYPES = ["deluxe", "executive", "family", "premium_suite"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  deluxe: "Deluxe Room",
  executive: "Executive Room",
  family: "Family Room",
  premium_suite: "Premium Suite",
};

export const TABLE_TYPES = ["2_seater", "4_seater", "6_seater", "family_table"] as const;
export type TableType = (typeof TABLE_TYPES)[number];

export const TABLE_TYPE_LABELS: Record<TableType, string> = {
  "2_seater": "2 Seater",
  "4_seater": "4 Seater",
  "6_seater": "6 Seater",
  family_table: "Family Table",
};

export const TABLE_TYPE_CAPACITY: Record<TableType, number> = {
  "2_seater": 2,
  "4_seater": 4,
  "6_seater": 6,
  family_table: 10,
};

export const ROOM_BOOKING_STATUSES = [
  "pending_payment",
  "confirmed",
  "cancelled",
  "checked_in",
  "checked_out",
  "no_show",
] as const;
export type RoomBookingStatus = (typeof ROOM_BOOKING_STATUSES)[number];

export const BLOCKING_BOOKING_STATUSES: RoomBookingStatus[] = ["confirmed", "checked_in"];

export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "seated",
  "completed",
  "cancelled",
  "no_show",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const BLOCKING_RESERVATION_STATUSES: ReservationStatus[] = ["pending", "confirmed", "seated"];

export const USER_ROLES = ["customer", "staff", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PAYMENT_STATUSES = [
  "created",
  "authorized",
  "captured",
  "failed",
  "refunded",
  "partially_refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BOOKING_HOLD_MINUTES = 10;
export const SEATING_DURATION_MIN = 90;
export const SEATING_BUFFER_MIN = 15;

export const TABLE_TYPE_RANK: TableType[] = ["2_seater", "4_seater", "6_seater", "family_table"];

export function minSufficientTableType(partySize: number): TableType {
  if (partySize <= TABLE_TYPE_CAPACITY["2_seater"]) return "2_seater";
  if (partySize <= TABLE_TYPE_CAPACITY["4_seater"]) return "4_seater";
  if (partySize <= TABLE_TYPE_CAPACITY["6_seater"]) return "6_seater";
  return "family_table";
}

export const CANCELLATION_POLICY = {
  fullRefundHoursBefore: 72,
  partialRefundHoursBefore: 24,
  partialRefundPercent: 50,
};

export const DEFAULT_GST_PERCENT = 12;

export const HOTEL_INFO = {
  name: "Hotel Nirvana Nest",
  address: "B-4/103, Vishesh Khand 2, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
  phone: "+91 91510 41301",
  email: "reservations@hotelnirvananest.com",
  checkInTime: "12:00",
  checkOutTime: "11:00",
  restaurantOpenTime: "12:00",
  restaurantCloseTime: "23:00",
};
