"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Review } from "@/types";

export function useAdminReviews(params: { isApproved?: boolean; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  searchParams.set("moderation", "1");
  if (params.isApproved !== undefined) searchParams.set("isApproved", params.isApproved ? "1" : "0");
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "20");

  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => apiFetch<Review[]>(`/api/reviews?${searchParams.toString()}`),
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { isApproved?: boolean; reply?: string } }) =>
      (await apiFetch<Review>(`/api/reviews/${id}/moderate`, { method: "PATCH", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}
