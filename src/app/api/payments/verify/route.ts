import { type NextRequest } from "next/server";
import { z } from "zod";
import { PaymentService } from "@/modules/payments/payment.service";
import { requireUser } from "@/lib/auth/rbac";
import { ok, fail } from "@/lib/utils/api-response";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const input = schema.parse(body);

    const booking = await PaymentService.verifyAndConfirmBooking({
      razorpayOrderId: input.razorpay_order_id,
      razorpayPaymentId: input.razorpay_payment_id,
      razorpaySignature: input.razorpay_signature,
      userId: user.sub,
    });

    return ok(booking);
  } catch (error) {
    return fail(error);
  }
}
