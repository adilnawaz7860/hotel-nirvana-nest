import { connectMongo } from "@/lib/db/connect";
import { User } from "@/models/User";
import { NotFoundError } from "@/lib/utils/api-response";

export const UserService = {
  async getProfile(userId: string) {
    await connectMongo();
    const user = await User.findById(userId).populate("favorites");
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  async updateProfile(userId: string, input: { name?: string; phone?: string; avatarUrl?: string }) {
    await connectMongo();
    const user = await User.findByIdAndUpdate(userId, input, { returnDocument: "after" });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  async toggleFavorite(userId: string, roomId: string) {
    await connectMongo();
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const index = user.favorites.findIndex((id) => String(id) === roomId);
    if (index >= 0) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(roomId as never);
    }
    await user.save();
    return user;
  },

  async listAll(params: { page?: number; limit?: number; search?: string }) {
    await connectMongo();
    const { page = 1, limit = 20, search } = params;
    const filter: Record<string, unknown> = { role: "customer" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);
    return { users, total };
  },
};
