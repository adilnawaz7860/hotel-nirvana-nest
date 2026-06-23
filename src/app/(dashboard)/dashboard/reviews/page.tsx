"use client";

import { Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { useMyReviews } from "@/hooks/use-my-reviews";

export default function MyReviewsPage() {
  const { data, isLoading } = useMyReviews();

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">My Reviews</h2>
      <p className="mt-1 text-muted-foreground">Reviews you&apos;ve submitted.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {isLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        {data?.data.length === 0 && (
          <p className="col-span-full rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            You haven&apos;t submitted any reviews yet.
          </p>
        )}
        {data?.data.map((review) => (
          <div key={review._id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <Quote className="size-5 text-primary/40" />
              <Badge variant={review.isApproved ? "default" : "outline"} className={review.isApproved ? "bg-emerald-500/15 text-emerald-400 border-none" : ""}>
                {review.isApproved ? "Published" : "Pending Approval"}
              </Badge>
            </div>
            {review.title && <h3 className="mt-3 font-heading text-base font-semibold text-foreground">{review.title}</h3>}
            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
            <RatingStars rating={review.rating} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
