"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { GalleryItem } from "@/types";
import type { GalleryItemInput } from "@/lib/validations/cms.validation";

export function useAdminGallery(category?: string) {
  return useQuery({
    queryKey: ["admin", "gallery", category],
    queryFn: async () =>
      (await apiFetch<GalleryItem[]>(`/api/gallery${category ? `?category=${category}` : ""}`)).data,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GalleryItemInput) =>
      (await apiFetch<GalleryItem>("/api/gallery", { method: "POST", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] }),
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiFetch<GalleryItem>(`/api/gallery/${id}`, { method: "DELETE" })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] }),
  });
}
