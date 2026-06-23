import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export type ContactQueryStatus = "new" | "in_progress" | "resolved";

export interface IContactQuery extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactQueryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactQuerySchema = new Schema<IContactQuery>(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new", index: true },
  },
  { timestamps: true }
);

export const ContactQuery: Model<IContactQuery> =
  models.ContactQuery || model<IContactQuery>("ContactQuery", ContactQuerySchema);
