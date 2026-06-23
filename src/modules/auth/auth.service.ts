import crypto from "crypto";
import { connectMongo } from "@/lib/db/connect";
import { User } from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { AppError, ConflictError, UnauthorizedError } from "@/lib/utils/api-response";
import { EmailService } from "@/modules/notifications/email.service";
import type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from "@/lib/validations/auth.validation";

export const AuthService = {
  async register(input: RegisterInput) {
    await connectMongo();

    const existing = await User.findOne({ $or: [{ email: input.email }, { phone: input.phone }] });
    if (existing) {
      throw new ConflictError("USER_EXISTS", "An account with this email or phone already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "customer",
    });

    return user;
  },

  async login(input: LoginInput) {
    await connectMongo();

    const user = await User.findOne({ email: input.email }).select("+passwordHash");
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    return user;
  },

  async refresh(refreshToken: string) {
    await connectMongo();

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Session expired, please log in again");
    }

    const user = await User.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError("Session expired, please log in again");
    }

    return user;
  },

  async invalidateAllSessions(userId: string) {
    await connectMongo();
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  },

  async forgotPassword(input: ForgotPasswordInput) {
    await connectMongo();
    const user = await User.findOne({ email: input.email });
    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${token}`;
    await EmailService.sendPasswordReset(user.email, { guestName: user.name, resetUrl });
  },

  async resetPassword(input: ResetPasswordInput) {
    await connectMongo();
    const tokenHash = crypto.createHash("sha256").update(input.token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) throw new AppError("INVALID_TOKEN", "Reset link is invalid or has expired", 400);

    user.passwordHash = await hashPassword(input.password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion += 1;
    await user.save();
  },
};
