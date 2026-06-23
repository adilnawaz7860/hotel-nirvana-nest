"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Amenity } from "@/types";
import type { AmenityInput } from "@/lib/validations/cms.validation";

export function useAdminAmenities(category?: string) {
  return useQuery({
    queryKey: ["admin", "amenities", category],
    queryFn: async () =>
      (await apiFetch<Amenity[]>(`/api/amenities${category ? `?category=${category}` : ""}`)).data,
  });
}

export function useCreateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AmenityInput) =>
      (await apiFetch<Amenity>("/api/amenities", { method: "POST", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "amenities"] }),
  });
}

export function useUpdateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AmenityInput> }) =>
      (await apiFetch<Amenity>(`/api/amenities/${id}`, { method: "PATCH", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "amenities"] }),
  });
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiFetch<Amenity>(`/api/amenities/${id}`, { method: "DELETE" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "amenities"] }),
  });
}
