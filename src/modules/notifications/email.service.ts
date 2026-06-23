import { sendMail } from "@/lib/email/client";
import {
  bookingConfirmationEmail,
  cancellationEmail,
  paymentReceiptEmail,
  reservationConfirmationEmail,
  passwordResetEmail,
} from "@/lib/email/templates";

export const EmailService = {
  async sendBookingConfirmation(to: string, params: Parameters<typeof bookingConfirmationEmail>[0]) {
    await sendMail({
      to,
      subject: `Booking Confirmed - ${params.bookingCode}`,
      html: bookingConfirmationEmail(params),
    });
  },

  async sendReservationConfirmation(
    to: string,
    params: Parameters<typeof reservationConfirmationEmail>[0]
  ) {
    await sendMail({
      to,
      subject: `Table Reservation Confirmed - ${params.reservationCode}`,
      html: reservationConfirmationEmail(params),
    });
  },

  async sendCancellation(to: string, params: Parameters<typeof cancellationEmail>[0]) {
    await sendMail({
      to,
      subject: `Cancellation Confirmed - ${params.code}`,
      html: cancellationEmail(params),
    });
  },

  async sendPaymentReceipt(to: string, params: Parameters<typeof paymentReceiptEmail>[0]) {
    await sendMail({
      to,
      subject: "Payment Receipt - Hotel Nirvana Nest",
      html: paymentReceiptEmail(params),
    });
  },

  async sendPasswordReset(to: string, params: Parameters<typeof passwordResetEmail>[0]) {
    await sendMail({
      to,
      subject: "Reset Your Password - Hotel Nirvana Nest",
      html: passwordResetEmail(params),
    });
  },
};
