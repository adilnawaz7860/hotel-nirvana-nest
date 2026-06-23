"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Room } from "@/types";

export function useFeaturedRooms() {
  return useQuery({
    queryKey: ["rooms", "featured"],
    queryFn: async () => (await apiFetch<Room[]>("/api/rooms?limit=6")).data,
  });
}

export function useRooms(params: { roomType?: string; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.roomType) searchParams.set("roomType", params.roomType);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "9");

  return useQuery({
    queryKey: ["rooms", params],
    queryFn: async () => apiFetch<Room[]>(`/api/rooms?${searchParams.toString()}`),
  });
}

export function useRoomAvailability(params: {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  roomType?: string;
  page?: number;
}) {
  const enabled = Boolean(params.checkIn && params.checkOut);
  const searchParams = new URLSearchParams();
  if (params.checkIn) searchParams.set("checkIn", params.checkIn);
  if (params.checkOut) searchParams.set("checkOut", params.checkOut);
  if (params.adults) searchParams.set("adults", String(params.adults));
  if (params.children) searchParams.set("children", String(params.children));
  if (params.roomType) searchParams.set("roomType", params.roomType);
  searchParams.set("page", String(params.page ?? 1));

  return useQuery({
    queryKey: ["rooms", "availability", params],
    queryFn: async () => apiFetch<Room[]>(`/api/rooms/availability?${searchParams.toString()}`),
    enabled,
  });
}

export function useRoomBySlug(slug: string) {
  return useQuery({
    queryKey: ["room", slug],
    queryFn: async () => (await apiFetch<Room>(`/api/rooms/slug/${slug}`)).data,
    enabled: Boolean(slug),
  });
}
