import { z } from "zod";

export const galleryItemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.enum(["rooms", "restaurant", "exterior", "events", "amenities"]),
  imageUrl: z.string().url(),
  publicId: z.string(),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

export const amenitySchema = z.object({
  name: z.string().trim().min(1).max(80),
  icon: z.string().trim().min(1).max(50),
  description: z.string().trim().max(300).optional(),
  category: z.enum(["room", "hotel", "restaurant"]),
});
export type AmenityInput = z.infer<typeof amenitySchema>;

export const websiteSettingsSchema = z.object({
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  businessHours: z.string().optional(),
  taxConfig: z.object({ gstPercent: z.coerce.number().min(0).max(28) }).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  cancellationPolicy: z
    .object({
      fullRefundHoursBefore: z.coerce.number().int().min(0),
      partialRefundHoursBefore: z.coerce.number().int().min(0),
      partialRefundPercent: z.coerce.number().min(0).max(100),
    })
    .optional(),
  heroMedia: z.object({ url: z.string().url(), type: z.enum(["image", "video"]) }).optional(),
});
export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>;
