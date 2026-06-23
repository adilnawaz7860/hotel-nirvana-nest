import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export interface IAmenity extends Document {
  _id: Types.ObjectId;
  name: string;
  icon: string;
  description?: string;
  category: "room" | "hotel" | "restaurant";
  createdAt: Date;
  updatedAt: Date;
}

const AmenitySchema = new Schema<IAmenity>(
  {
    name: { type: String, required: true, maxlength: 80 },
    icon: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 300 },
    category: { type: String, enum: ["room", "hotel", "restaurant"], required: true, index: true },
  },
  { timestamps: true }
);

export const Amenity: Model<IAmenity> = models.Amenity || model<IAmenity>("Amenity", AmenitySchema);
