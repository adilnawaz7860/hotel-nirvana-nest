"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Room } from "@/types";

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => (await apiFetch<Room[]>("/api/users/favorites")).data,
    enabled,
    retry: false,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roomId: string) =>
      (await apiFetch<string[]>("/api/users/favorites", { method: "POST", body: JSON.stringify({ roomId }) })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
