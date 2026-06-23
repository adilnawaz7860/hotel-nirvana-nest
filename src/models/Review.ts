import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export type ReviewTargetType = "room" | "restaurant" | "general";

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  targetType: ReviewTargetType;
  targetId?: Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images: { url: string; publicId: string }[];
  isApproved: boolean;
  reply?: { text: string; repliedBy?: Types.ObjectId; repliedAt?: Date };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["room", "restaurant", "general"], required: true },
    targetId: { type: Schema.Types.ObjectId, refPath: "targetType" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    comment: { type: String, required: true, minlength: 5, maxlength: 1000 },
    images: [{ url: String, publicId: String }],
    isApproved: { type: Boolean, default: false, index: true },
    reply: {
      text: { type: String, maxlength: 500 },
      repliedBy: { type: Schema.Types.ObjectId, ref: "User" },
      repliedAt: Date,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ targetType: 1, targetId: 1, isApproved: 1 });
ReviewSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Review: Model<IReview> = models.Review || model<IReview>("Review", ReviewSchema);
