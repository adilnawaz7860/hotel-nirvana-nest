import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { PAYMENT_STATUSES, type PaymentStatus } from "@/lib/constants";

export type PaymentPurpose = "room_booking" | "restaurant_reservation";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  purpose: PaymentPurpose;
  referenceId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refunds: { razorpayRefundId: string; amount: number; reason?: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    purpose: { type: String, enum: ["room_booking", "restaurant_reservation"], required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: PAYMENT_STATUSES, default: "created", index: true },
    refunds: [
      {
        razorpayRefundId: String,
        amount: Number,
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

PaymentSchema.index({ user: 1, createdAt: -1 });

export const Payment: Model<IPayment> = models.Payment || model<IPayment>("Payment", PaymentSchema);
