import { HOTEL_INFO } from "@/lib/constants";
import { formatINR } from "@/lib/utils/pricing";

function wrapper(title: string, bodyHtml: string): string {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#0d0d0e; padding:32px; color:#f5f0e6;">
    <div style="max-width:560px;margin:0 auto;background:#16161a;border:1px solid rgba(212,175,55,0.35);border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#caa24b,#8a6a23);padding:24px 32px;">
        <h1 style="margin:0;font-size:20px;letter-spacing:1px;color:#16161a;">${HOTEL_INFO.name}</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#e8c878;font-size:18px;margin-top:0;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;background:#101012;font-size:12px;color:#9a9a9a;">
        ${HOTEL_INFO.address}<br/>${HOTEL_INFO.phone} · ${HOTEL_INFO.email}
      </div>
    </div>
  </div>`;
}

export function bookingConfirmationEmail(params: {
  guestName: string;
  bookingCode: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
}) {
  return wrapper(
    "Your Booking is Confirmed",
    `<p>Dear ${params.guestName},</p>
     <p>Thank you for choosing ${HOTEL_INFO.name}. Your reservation is confirmed.</p>
     <table style="width:100%;font-size:14px;margin-top:16px;">
       <tr><td style="color:#9a9a9a;padding:4px 0;">Booking Code</td><td style="text-align:right;">${params.bookingCode}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Room</td><td style="text-align:right;">${params.roomName}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Check-in</td><td style="text-align:right;">${params.checkIn} (${HOTEL_INFO.checkInTime})</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Check-out</td><td style="text-align:right;">${params.checkOut} (${HOTEL_INFO.checkOutTime})</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Nights</td><td style="text-align:right;">${params.nights}</td></tr>
       <tr><td style="color:#e8c878;padding:8px 0;font-weight:bold;">Total Paid</td><td style="text-align:right;color:#e8c878;font-weight:bold;">${formatINR(params.totalAmount)}</td></tr>
     </table>`
  );
}

export function reservationConfirmationEmail(params: {
  guestName: string;
  reservationCode: string;
  date: string;
  time: string;
  partySize: number;
  tableType: string;
}) {
  return wrapper(
    "Your Table Reservation is Confirmed",
    `<p>Dear ${params.guestName},</p>
     <p>We look forward to welcoming you for dining at ${HOTEL_INFO.name}.</p>
     <table style="width:100%;font-size:14px;margin-top:16px;">
       <tr><td style="color:#9a9a9a;padding:4px 0;">Reservation Code</td><td style="text-align:right;">${params.reservationCode}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Date</td><td style="text-align:right;">${params.date}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Time</td><td style="text-align:right;">${params.time}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Party Size</td><td style="text-align:right;">${params.partySize}</td></tr>
       <tr><td style="color:#9a9a9a;padding:4px 0;">Table Type</td><td style="text-align:right;">${params.tableType}</td></tr>
     </table>`
  );
}

export function cancellationEmail(params: { guestName: string; code: string; refundAmount?: number }) {
  return wrapper(
    "Your Booking Has Been Cancelled",
    `<p>Dear ${params.guestName},</p>
     <p>Your reservation <strong>${params.code}</strong> has been cancelled as requested.</p>
     ${
       params.refundAmount
         ? `<p>A refund of <strong>${formatINR(params.refundAmount)}</strong> will be credited to your original payment method within 5-7 business days.</p>`
         : ""
     }`
  );
}

export function paymentReceiptEmail(params: {
  guestName: string;
  paymentId: string;
  amount: number;
  purpose: string;
}) {
  return wrapper(
    "Payment Receipt",
    `<p>Dear ${params.guestName},</p>
     <p>We have received your payment for ${params.purpose}.</p>
     <table style="width:100%;font-size:14px;margin-top:16px;">
       <tr><td style="color:#9a9a9a;padding:4px 0;">Payment ID</td><td style="text-align:right;">${params.paymentId}</td></tr>
       <tr><td style="color:#e8c878;padding:8px 0;font-weight:bold;">Amount</td><td style="text-align:right;color:#e8c878;font-weight:bold;">${formatINR(params.amount)}</td></tr>
     </table>`
  );
}

export function passwordResetEmail(params: { guestName: string; resetUrl: string }) {
  return wrapper(
    "Reset Your Password",
    `<p>Dear ${params.guestName},</p>
     <p>We received a request to reset your password. This link expires in 15 minutes.</p>
     <p style="margin-top:24px;"><a href="${params.resetUrl}" style="background:#e8c878;color:#16161a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a></p>
     <p style="font-size:12px;color:#9a9a9a;">If you did not request this, you can safely ignore this email.</p>`
  );
}
