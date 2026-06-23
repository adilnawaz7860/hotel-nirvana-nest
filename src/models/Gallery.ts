import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export type GalleryCategory = "rooms" | "restaurant" | "exterior" | "events" | "amenities";

export interface IGallery extends Document {
  _id: Types.ObjectId;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  publicId: string;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, maxlength: 120 },
    category: {
      type: String,
      enum: ["rooms", "restaurant", "exterior", "events", "amenities"],
      required: true,
      index: true,
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1, order: 1 });

export const Gallery: Model<IGallery> = models.Gallery || model<IGallery>("Gallery", GallerySchema);
