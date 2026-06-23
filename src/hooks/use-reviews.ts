"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Review } from "@/types";

export function useReviews(params: { targetType?: string; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.targetType) searchParams.set("targetType", params.targetType);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "9");

  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async () => apiFetch<Review[]>(`/api/reviews?${searchParams.toString()}`),
  });
}
