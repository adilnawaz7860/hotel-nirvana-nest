"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RoomBooking } from "@/types";

export function useAdminBookings(params: { status?: string; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "20");

  return useQuery({
    queryKey: ["admin", "bookings", params],
    queryFn: async () => apiFetch<RoomBooking[]>(`/api/bookings?${searchParams.toString()}`),
  });
}

export function useAdminCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiFetch<RoomBooking>(`/api/bookings/${id}/check-in`, { method: "POST" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}

export function useAdminCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiFetch<RoomBooking>(`/api/bookings/${id}/check-out`, { method: "POST" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}

export function useAdminCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<RoomBooking>(`/api/bookings/${id}/cancel`, { method: "POST", body: JSON.stringify({}) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}
