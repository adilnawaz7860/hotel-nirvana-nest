import { connectMongo } from "@/lib/db/connect";
import { Review } from "@/models/Review";
import { ConflictError, NotFoundError } from "@/lib/utils/api-response";
import type { CreateReviewInput } from "@/lib/validations/review.validation";

export const ReviewService = {
  async create(userId: string, input: CreateReviewInput) {
    await connectMongo();

    const existing = await Review.findOne({
      user: userId,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
    });
    if (existing) throw new ConflictError("REVIEW_EXISTS", "You have already submitted a review for this");

    return Review.create({ ...input, user: userId });
  },

  async listApproved(params: { targetType?: string; targetId?: string; page?: number; limit?: number }) {
    await connectMongo();
    const { targetType, targetId, page = 1, limit = 10 } = params;
    const filter: Record<string, unknown> = { isApproved: true };
    if (targetType) filter.targetType = targetType;
    if (targetId) filter.targetId = targetId;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name avatarUrl")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(filter),
    ]);
    return { reviews, total };
  },

  async listMine(userId: string, page = 1, limit = 20) {
    await connectMongo();
    const filter = { user: userId };
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(filter),
    ]);
    return { reviews, total };
  },

  async listAllForModeration(params: { isApproved?: boolean; page?: number; limit?: number }) {
    await connectMongo();
    const { isApproved, page = 1, limit = 20 } = params;
    const filter: Record<string, unknown> = {};
    if (isApproved !== undefined) filter.isApproved = isApproved;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name email avatarUrl")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(filter),
    ]);
    return { reviews, total };
  },

  async moderate(id: string, adminId: string, input: { isApproved?: boolean; reply?: string }) {
    await connectMongo();
    const review = await Review.findById(id);
    if (!review) throw new NotFoundError("Review not found");

    if (input.isApproved !== undefined) review.isApproved = input.isApproved;
    if (input.reply) review.reply = { text: input.reply, repliedBy: adminId as never, repliedAt: new Date() };

    await review.save();
    return review;
  },
};
