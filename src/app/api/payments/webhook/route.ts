import { type NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/connect";
import { Payment } from "@/models/Payment";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  await connectMongo();

  try {
    if (event.event === "payment.failed") {
      const orderId = event.payload?.payment?.entity?.order_id;
      if (orderId) {
        await Payment.findOneAndUpdate({ razorpayOrderId: orderId }, { status: "failed" });
      }
    }

    if (event.event === "refund.processed") {
      const paymentEntityId = event.payload?.refund?.entity?.payment_id;
      if (paymentEntityId) {
        await Payment.findOneAndUpdate({ razorpayPaymentId: paymentEntityId }, { status: "refunded" });
      }
    }
  } catch (error) {
    console.error("[razorpay webhook] failed to process event", error);
  }

  return NextResponse.json({ success: true });
}
