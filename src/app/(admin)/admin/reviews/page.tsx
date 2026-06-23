"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/shared/rating-stars";
import { useAdminReviews, useModerateReview } from "@/hooks/admin/use-admin-reviews";

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<string>("pending");
  const isApproved = filter === "approved" ? true : filter === "pending" ? false : undefined;
  const { data, isLoading } = useAdminReviews({ isApproved });
  const moderate = useModerateReview();

  async function handleModerate(id: string, approve: boolean) {
    try {
      await moderate.mutateAsync({ id, payload: { isApproved: approve } });
      toast.success(approve ? "Review approved" : "Review rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Reviews Management</h2>
          <p className="mt-1 text-muted-foreground">Moderate guest reviews before they go public.</p>
        </div>
        <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
          <SelectTrigger className="w-44">
            <SelectValue>
              {(v: string) =>
                ({ pending: "Pending Approval", approved: "Approved", all: "All Reviews" })[v] ?? v
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="all">All Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        {data?.data.length === 0 && (
          <p className="col-span-full rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No reviews found.
          </p>
        )}
        {data?.data.map((review) => (
          <div key={review._id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{review.user.name}</p>
                <RatingStars rating={review.rating} className="mt-1" />
              </div>
              <Badge className={review.isApproved ? "bg-emerald-500/15 text-emerald-400 border-none" : "bg-amber-500/15 text-amber-400 border-none"}>
                {review.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
            {review.title && <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">{review.title}</h3>}
            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>

            <div className="mt-4 flex justify-end gap-2">
              {!review.isApproved && (
                <Button size="sm" onClick={() => handleModerate(review._id, true)} className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
                  <Check className="size-4" /> Approve
                </Button>
              )}
              {review.isApproved && (
                <Button size="sm" variant="outline" onClick={() => handleModerate(review._id, false)} className="border-destructive/40 text-destructive hover:bg-destructive/10">
                  <X className="size-4" /> Unpublish
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
