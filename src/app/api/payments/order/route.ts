import { type NextRequest } from "next/server";
import { z } from "zod";
import { PaymentService } from "@/modules/payments/payment.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

const schema = z.object({ bookingId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { bookingId } = schema.parse(body);

    const { order, booking } = await PaymentService.createOrderForBooking(bookingId, user.sub);
    return ok({ order, booking, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
  } catch (error) {
    return fail(error);
  }
}
