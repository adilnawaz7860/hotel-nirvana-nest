import { z } from "zod";

export const createBookingSchema = z
  .object({
    roomId: z.string().min(1),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.object({
      adults: z.coerce.number().int().min(1).max(10),
      children: z.coerce.number().int().min(0).max(10).default(0),
    }),
    guestDetails: z.object({
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().toLowerCase().email(),
      phone: z.string().trim().min(10).max(15),
      idProofType: z.string().optional(),
      idProofNumber: z.string().optional(),
    }),
    specialRequests: z.string().max(500).optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  reason: z.string().trim().min(3).max(300).optional(),
});
