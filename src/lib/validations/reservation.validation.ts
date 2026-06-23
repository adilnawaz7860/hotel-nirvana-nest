import { z } from "zod";
import { TABLE_TYPES } from "@/lib/constants";

export const createTableSchema = z.object({
  tableNumber: z.string().trim().min(1).max(20),
  tableType: z.enum(TABLE_TYPES),
  capacity: z.number().int().min(1).max(20),
  location: z.enum(["indoor", "outdoor", "private"]).optional(),
  isActive: z.boolean().optional(),
});
export type CreateTableInput = z.infer<typeof createTableSchema>;

export const updateTableSchema = createTableSchema.partial();
export type UpdateTableInput = z.infer<typeof updateTableSchema>;

export const createReservationSchema = z.object({
  date: z.coerce.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
  partySize: z.coerce.number().int().min(1).max(20),
  tableId: z.string().optional(),
  guestDetails: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(10).max(15),
  }),
  specialRequests: z.string().max(500).optional(),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const reservationAvailabilityQuerySchema = z.object({
  date: z.coerce.date(),
  partySize: z.coerce.number().int().min(1).default(2),
});

export const cancelReservationSchema = z.object({
  reason: z.string().trim().min(3).max(300).optional(),
});
