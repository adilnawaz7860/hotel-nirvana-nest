"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RestaurantTable } from "@/types";
import type { CreateTableInput, UpdateTableInput } from "@/lib/validations/reservation.validation";

export function useAdminTables() {
  return useQuery({
    queryKey: ["admin", "tables"],
    queryFn: async () => (await apiFetch<RestaurantTable[]>("/api/restaurant/tables")).data,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTableInput) =>
      (await apiFetch<RestaurantTable>("/api/restaurant/tables", { method: "POST", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tables"] }),
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTableInput }) =>
      (await apiFetch<RestaurantTable>(`/api/restaurant/tables/${id}`, { method: "PATCH", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tables"] }),
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiFetch<RestaurantTable>(`/api/restaurant/tables/${id}`, { method: "DELETE" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "tables"] }),
  });
}
