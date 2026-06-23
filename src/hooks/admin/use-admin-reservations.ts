"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RestaurantReservation } from "@/types";

export function useAdminReservations(params: { status?: string; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "20");

  return useQuery({
    queryKey: ["admin", "reservations", params],
    queryFn: async () => apiFetch<RestaurantReservation[]>(`/api/restaurant/reservations?${searchParams.toString()}`),
  });
}

export function useAdminSeatReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<RestaurantReservation>(`/api/restaurant/reservations/${id}/seat`, { method: "POST" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });
}

export function useAdminCompleteReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<RestaurantReservation>(`/api/restaurant/reservations/${id}/complete`, { method: "POST" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });
}

export function useAdminCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<RestaurantReservation>(`/api/restaurant/reservations/${id}/cancel`, { method: "POST", body: JSON.stringify({}) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });
}
