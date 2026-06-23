"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Room } from "@/types";
import type { CreateRoomInput, UpdateRoomInput } from "@/lib/validations/room.validation";

export function useAdminRooms(page = 1) {
  return useQuery({
    queryKey: ["admin", "rooms", page],
    queryFn: async () => apiFetch<Room[]>(`/api/rooms?page=${page}&limit=50`),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRoomInput) =>
      (await apiFetch<Room>("/api/rooms", { method: "POST", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] }),
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateRoomInput }) =>
      (await apiFetch<Room>(`/api/rooms/${id}`, { method: "PATCH", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] }),
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<Room>(`/api/rooms/${id}`, { method: "DELETE" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] }),
  });
}
