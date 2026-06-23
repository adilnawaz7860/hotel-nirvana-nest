"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Amenity } from "@/types";

export function useAmenities(category?: string) {
  return useQuery({
    queryKey: ["amenities", category],
    queryFn: async () =>
      (await apiFetch<Amenity[]>(`/api/amenities${category ? `?category=${category}` : ""}`)).data,
  });
}
