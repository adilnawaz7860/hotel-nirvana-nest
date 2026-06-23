import { connectMongo } from "@/lib/db/connect";
import { Payment } from "@/models/Payment";
import { RoomBooking } from "@/models/RoomBooking";
import { createRazorpayOrder, verifyRazorpaySignature, refundRazorpayPayment } from "@/lib/payments/razorpay";
import { rupeesToPaise } from "@/lib/utils/pricing";
import { EmailService } from "@/modules/notifications/email.service";
import { AppError, NotFoundError, ForbiddenError } from "@/lib/utils/api-response";

export const PaymentService = {
  async createOrderForBooking(bookingId: string, userId: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId).populate("room");
    if (!booking) throw new NotFoundError("Booking not found");
    if (String(booking.user) !== userId) throw new ForbiddenError("This booking does not belong to you");
    if (booking.status !== "pending_payment") {
      throw new AppError("INVALID_STATUS", "This booking is not awaiting payment", 400);
    }

    const amountInPaise = rupeesToPaise(booking.totalAmount);
    const order = await createRazorpayOrder({
      amountInPaise,
      receipt: booking.bookingCode,
      notes: { bookingId: String(booking._id), purpose: "room_booking" },
    });

    await Payment.create({
      user: userId,
      purpose: "room_booking",
      referenceId: booking._id,
      razorpayOrderId: order.id,
      amount: amountInPaise,
      status: "created",
    });

    return { order, booking };
  },

  async verifyAndConfirmBooking(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    userId: string;
  }) {
    await connectMongo();

    const valid = verifyRazorpaySignature({
      orderId: params.razorpayOrderId,
      paymentId: params.razorpayPaymentId,
      signature: params.razorpaySignature,
    });
    if (!valid) throw new AppError("INVALID_SIGNATURE", "Payment verification failed", 400);

    const payment = await Payment.findOne({ razorpayOrderId: params.razorpayOrderId });
    if (!payment) throw new NotFoundError("Payment record not found");

    payment.razorpayPaymentId = params.razorpayPaymentId;
    payment.razorpaySignature = params.razorpaySignature;
    payment.status = "captured";
    await payment.save();

    const booking = await RoomBooking.findById(payment.referenceId).populate("room").populate("user");
    if (!booking) throw new NotFoundError("Booking not found");

    booking.status = "confirmed";
    booking.payment = payment._id;
    booking.expiresAt = undefined;
    await booking.save();

    const room = booking.room as unknown as { name: string };
    const user = booking.user as unknown as { email: string; name: string };

    await EmailService.sendBookingConfirmation(booking.guestDetails.email || user.email, {
      guestName: booking.guestDetails.name,
      bookingCode: booking.bookingCode,
      roomName: room.name,
      checkIn: booking.checkIn.toDateString(),
      checkOut: booking.checkOut.toDateString(),
      nights: booking.nights,
      totalAmount: booking.totalAmount,
    });

    await EmailService.sendPaymentReceipt(booking.guestDetails.email || user.email, {
      guestName: booking.guestDetails.name,
      paymentId: payment.razorpayPaymentId!,
      amount: booking.totalAmount,
      purpose: `Room Booking ${booking.bookingCode}`,
    });

    return booking;
  },

  async refundBooking(bookingId: string, amount: number, reason?: string) {
    await connectMongo();
    const booking = await RoomBooking.findById(bookingId);
    if (!booking || !booking.payment) throw new NotFoundError("Booking or payment not found");

    const payment = await Payment.findById(booking.payment);
    if (!payment?.razorpayPaymentId) throw new NotFoundError("Payment not found");

    const amountInPaise = rupeesToPaise(amount);
    const refund = await refundRazorpayPayment(payment.razorpayPaymentId, amountInPaise);

    payment.refunds.push({
      razorpayRefundId: refund.id,
      amount: amountInPaise,
      reason,
      createdAt: new Date(),
    });
    payment.status = amount >= booking.totalAmount ? "refunded" : "partially_refunded";
    await payment.save();

    return payment;
  },

  async historyForUser(userId: string, page = 1, limit = 10) {
    await connectMongo();
    const filter = { user: userId };
    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Payment.countDocuments(filter),
    ]);
    return { payments, total };
  },
};
