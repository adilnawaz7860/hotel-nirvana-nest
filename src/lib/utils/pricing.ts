import { DEFAULT_GST_PERCENT } from "@/lib/constants";

export function calculateRoomBookingTotal(params: {
  nights: number;
  ratePerNight: number;
  discountPercent?: number;
  gstPercent?: number;
}) {
  const { nights, ratePerNight, discountPercent = 0, gstPercent = DEFAULT_GST_PERCENT } = params;
  const subtotal = nights * ratePerNight;
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (gstPercent / 100);
  const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

  return { subtotal, discountAmount, taxAmount, totalAmount };
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
