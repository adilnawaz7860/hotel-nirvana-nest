import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { ROOM_TYPES, type RoomType } from "@/lib/constants";

export interface IRoomImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IRoom extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  roomNumber: string;
  roomType: RoomType;
  description: string;
  capacity: { adults: number; children: number };
  pricePerNight: number;
  discountPercent: number;
  images: IRoomImage[];
  amenities: Types.ObjectId[];
  size?: number;
  floor?: number;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomImageSchema = new Schema<IRoomImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    roomNumber: { type: String, required: true, unique: true, trim: true },
    roomType: { type: String, enum: ROOM_TYPES, required: true, index: true },
    description: { type: String, required: true, maxlength: 2000 },
    capacity: {
      adults: { type: Number, required: true, min: 1, max: 10 },
      children: { type: Number, default: 0, min: 0, max: 10 },
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 90 },
    images: { type: [RoomImageSchema], default: [] },
    amenities: [{ type: Schema.Types.ObjectId, ref: "Amenity" }],
    size: { type: Number, min: 0 },
    floor: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

RoomSchema.index({ roomType: 1, isActive: 1 });
RoomSchema.index({ pricePerNight: 1 });

export const Room: Model<IRoom> = models.Room || model<IRoom>("Room", RoomSchema);
