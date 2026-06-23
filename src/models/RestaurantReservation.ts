import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { RESERVATION_STATUSES, TABLE_TYPES, type ReservationStatus, type TableType } from "@/lib/constants";

export interface IRestaurantReservation extends Document {
  _id: Types.ObjectId;
  reservationCode: string;
  user: Types.ObjectId;
  table?: Types.ObjectId;
  tableType: TableType;
  date: Date;
  timeSlot: { start: number; end: number };
  blockedEnd: number;
  partySize: number;
  guestDetails: { name: string; email: string; phone: string };
  status: ReservationStatus;
  specialRequests?: string;
  cancellation?: { reason?: string; cancelledAt?: Date };
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantReservationSchema = new Schema<IRestaurantReservation>(
  {
    reservationCode: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    table: { type: Schema.Types.ObjectId, ref: "RestaurantTable" },
    tableType: { type: String, enum: TABLE_TYPES, required: true },
    date: { type: Date, required: true, index: true },
    timeSlot: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
    blockedEnd: { type: Number, required: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: { type: String, enum: RESERVATION_STATUSES, default: "pending", index: true },
    specialRequests: { type: String, maxlength: 500 },
    cancellation: { reason: String, cancelledAt: Date },
  },
  { timestamps: true }
);

RestaurantReservationSchema.index({ table: 1, date: 1, blockedEnd: 1, "timeSlot.start": 1 });
RestaurantReservationSchema.index({ date: 1, tableType: 1 });
RestaurantReservationSchema.index({ user: 1, createdAt: -1 });
RestaurantReservationSchema.index(
  { table: 1, date: 1, "timeSlot.start": 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed", "seated"] } },
  }
);

export const RestaurantReservation: Model<IRestaurantReservation> =
  models.RestaurantReservation ||
  model<IRestaurantReservation>("RestaurantReservation", RestaurantReservationSchema);
