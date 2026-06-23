import { z } from "zod";

export const createReviewSchema = z.object({
  targetType: z.enum(["room", "restaurant", "general"]),
  targetId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(5).max(1000),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string() })).optional(),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const moderateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  reply: z.string().trim().max(500).optional(),
});
