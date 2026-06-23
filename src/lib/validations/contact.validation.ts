import { z } from "zod";

export const contactQuerySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(10).max(15).optional(),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(2000),
});
export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
