import { Schema, model, models, type Document, type Model, Types } from "mongoose";
import { TABLE_TYPES, type TableType } from "@/lib/constants";

export interface IRestaurantTable extends Document {
  _id: Types.ObjectId;
  tableNumber: string;
  tableType: TableType;
  capacity: number;
  location: "indoor" | "outdoor" | "private";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantTableSchema = new Schema<IRestaurantTable>(
  {
    tableNumber: { type: String, required: true, unique: true, trim: true },
    tableType: { type: String, enum: TABLE_TYPES, required: true, index: true },
    capacity: { type: Number, required: true, min: 1, max: 20 },
    location: { type: String, enum: ["indoor", "outdoor", "private"], default: "indoor" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RestaurantTable: Model<IRestaurantTable> =
  models.RestaurantTable || model<IRestaurantTable>("RestaurantTable", RestaurantTableSchema);
