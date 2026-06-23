"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Review } from "@/types";

export function useMyReviews(page = 1) {
  return useQuery({
    queryKey: ["reviews", "mine", page],
    queryFn: async () => apiFetch<Review[]>(`/api/reviews?mine=1&page=${page}`),
  });
}
