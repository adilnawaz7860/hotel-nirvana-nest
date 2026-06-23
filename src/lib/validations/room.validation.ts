import { z } from "zod";
import { ROOM_TYPES } from "@/lib/constants";

export const roomImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  alt: z.string().optional(),
});

export const createRoomSchema = z.object({
  name: z.string().trim().min(2).max(100),
  roomNumber: z.string().trim().min(1).max(20),
  roomType: z.enum(ROOM_TYPES),
  description: z.string().trim().min(10).max(2000),
  capacity: z.object({
    adults: z.number().int().min(1).max(10),
    children: z.number().int().min(0).max(10).optional(),
  }),
  pricePerNight: z.number().positive(),
  discountPercent: z.number().min(0).max(90).optional(),
  size: z.number().positive().optional(),
  floor: z.number().int().min(0).optional(),
  images: z.array(roomImageSchema).optional(),
  amenities: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

export const roomAvailabilityQuerySchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  roomType: z.enum(ROOM_TYPES).optional(),
  adults: z.coerce.number().int().min(1).default(1),
  children: z.coerce.number().int().min(0).default(0),
});
