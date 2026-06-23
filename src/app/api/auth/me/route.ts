import { connectMongo } from "@/lib/db/connect";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth/session";
import { ok, fail, UnauthorizedError } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) throw new UnauthorizedError();

    await connectMongo();
    const user = await User.findById(session.sub);
    if (!user) throw new UnauthorizedError();

    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
