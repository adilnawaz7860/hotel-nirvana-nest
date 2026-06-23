"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { Review } from "@/types";
import type { CreateReviewInput } from "@/lib/validations/review.validation";

export function useCreateReview() {
  return useMutation({
    mutationFn: async (payload: CreateReviewInput) =>
      (
        await apiFetch<Review>("/api/reviews", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      ).data,
  });
}
