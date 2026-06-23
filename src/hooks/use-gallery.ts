"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { GalleryItem } from "@/types";

export function useGallery(category?: string) {
  return useQuery({
    queryKey: ["gallery", category],
    queryFn: async () =>
      (await apiFetch<GalleryItem[]>(`/api/gallery${category ? `?category=${category}` : ""}`)).data,
  });
}
