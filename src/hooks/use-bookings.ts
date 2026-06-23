"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RoomBooking } from "@/types";

export type CreateBookingPayload = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number };
  guestDetails: { name: string; email: string; phone: string };
  specialRequests?: string;
};

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) =>
      (
        await apiFetch<RoomBooking>("/api/bookings", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      ).data,
  });
}

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: async (bookingId: string) =>
      (
        await apiFetch<{
          order: { id: string; amount: number };
          booking: RoomBooking;
          keyId: string;
        }>("/api/payments/order", {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        })
      ).data,
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) =>
      (
        await apiFetch<RoomBooking>("/api/payments/verify", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      ).data,
  });
}

export function useMyBookings(page = 1) {
  return useQuery({
    queryKey: ["bookings", "mine", page],
    queryFn: async () => apiFetch<RoomBooking[]>(`/api/bookings?page=${page}`),
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      (
        await apiFetch<RoomBooking>(`/api/bookings/${id}/cancel`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        })
      ).data,
  });
}
