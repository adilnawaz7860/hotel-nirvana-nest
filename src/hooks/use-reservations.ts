"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RestaurantReservation } from "@/types";

export function useReservationAvailability(date?: string, partySize = 2) {
  return useQuery({
    queryKey: ["restaurant-availability", date, partySize],
    queryFn: async () =>
      (
        await apiFetch<{ time: string; available: boolean }[]>(
          `/api/restaurant/availability?date=${date}&partySize=${partySize}`
        )
      ).data,
    enabled: Boolean(date),
  });
}

export type CreateReservationPayload = {
  date: string;
  time: string;
  partySize: number;
  guestDetails: { name: string; email: string; phone: string };
  specialRequests?: string;
};

export function useCreateReservation() {
  return useMutation({
    mutationFn: async (payload: CreateReservationPayload) =>
      (
        await apiFetch<RestaurantReservation>("/api/restaurant/reservations", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      ).data,
  });
}

export function useMyReservations(page = 1) {
  return useQuery({
    queryKey: ["reservations", "mine", page],
    queryFn: async () => apiFetch<RestaurantReservation[]>(`/api/restaurant/reservations?page=${page}`),
  });
}

export function useCancelReservation() {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) =>
      (
        await apiFetch<RestaurantReservation>(`/api/restaurant/reservations/${id}/cancel`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        })
      ).data,
  });
}
