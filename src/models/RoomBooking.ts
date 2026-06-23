import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { ROOM_BOOKING_STATUSES, type RoomBookingStatus } from "@/lib/constants";

export interface IRoomBooking extends Document {
  _id: Types.ObjectId;
  bookingCode: string;
  user: Types.ObjectId;
  room: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: { adults: number; children: number };
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    idProofType?: string;
    idProofNumber?: string;
  };
  ratePerNight: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: RoomBookingStatus;
  payment?: Types.ObjectId;
  expiresAt?: Date;
  cancellation?: { reason?: string; cancelledAt?: Date; refundAmount?: number };
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomBookingSchema = new Schema<IRoomBooking>(
  {
    bookingCode: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    guests: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0 },
    },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      idProofType: { type: String },
      idProofNumber: { type: String },
    },
    ratePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ROOM_BOOKING_STATUSES,
      default: "pending_payment",
      index: true,
    },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    expiresAt: { type: Date },
    cancellation: {
      reason: String,
      cancelledAt: Date,
      refundAmount: Number,
    },
    specialRequests: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

RoomBookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });
RoomBookingSchema.index({ user: 1, createdAt: -1 });
RoomBookingSchema.index({ status: 1, checkIn: 1 });
RoomBookingSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: "pending_payment" } }
);

export const RoomBooking: Model<IRoomBooking> =
  models.RoomBooking || model<IRoomBooking>("RoomBooking", RoomBookingSchema);
