import { Schema, model, models, type Document, type Model } from "mongoose";

export interface IWebsiteSettings extends Document {
  seo: { title?: string; description?: string };
  socialLinks: { facebook?: string; instagram?: string; twitter?: string };
  businessHours: string;
  taxConfig: { gstPercent: number };
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: {
    fullRefundHoursBefore: number;
    partialRefundHoursBefore: number;
    partialRefundPercent: number;
  };
  heroMedia?: { url: string; type: "image" | "video" };
  updatedAt: Date;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    seo: {
      title: { type: String, default: "Hotel Nirvana Nest | Luxury Stay in Gomti Nagar, Lucknow" },
      description: { type: String, default: "" },
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    businessHours: { type: String, default: "24x7 Front Desk · Restaurant 12:00 PM - 11:00 PM" },
    taxConfig: { gstPercent: { type: Number, default: 12 } },
    checkInTime: { type: String, default: "12:00" },
    checkOutTime: { type: String, default: "11:00" },
    cancellationPolicy: {
      fullRefundHoursBefore: { type: Number, default: 72 },
      partialRefundHoursBefore: { type: Number, default: 24 },
      partialRefundPercent: { type: Number, default: 50 },
    },
    heroMedia: {
      url: String,
      type: { type: String, enum: ["image", "video"] },
    },
  },
  { timestamps: true }
);

export const WebsiteSettings: Model<IWebsiteSettings> =
  models.WebsiteSettings || model<IWebsiteSettings>("WebsiteSettings", WebsiteSettingsSchema);
