"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/shared/rating-stars";
import { useReviews } from "@/hooks/use-reviews";
import { useCreateReview } from "@/hooks/use-create-review";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createReviewSchema, type CreateReviewInput } from "@/lib/validations/review.validation";
import { cn } from "@/lib/utils";

export function ReviewsContent() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useReviews({ page });
  const createReview = useCreateReview();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { targetType: "general", rating: 5, comment: "", images: [] },
  });

  function handleWriteReview() {
    if (!user) {
      toast.error("Please log in to write a review");
      router.push("/login?next=/reviews");
      return;
    }
    setOpen(true);
  }

  async function onSubmit(values: CreateReviewInput) {
    try {
      await createReview.mutateAsync(values);
      toast.success("Thank you! Your review will appear once approved.");
      reset({ targetType: "general", rating: 5, comment: "", images: [] });
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit review");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button onClick={handleWriteReview} className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold">
                Write a Review
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Rating</FieldLabel>
                  <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => field.onChange(star)}>
                            <Star
                              className={cn(
                                "size-7",
                                star <= field.value
                                  ? "fill-primary text-primary"
                                  : "fill-transparent text-muted-foreground/40"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="title">Title (optional)</FieldLabel>
                  <Input id="title" {...register("title")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="comment">Your Review</FieldLabel>
                  <Textarea id="comment" rows={4} {...register("comment")} />
                  <FieldError errors={[errors.comment]} />
                </Field>
                <Button
                  type="submit"
                  disabled={createReview.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
                >
                  {createReview.isPending ? <Loader2 className="size-4 animate-spin" /> : "Submit Review"}
                </Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        {data?.data.map((review) => (
          <div key={review._id} className="rounded-2xl border border-border bg-card p-6">
            <Quote className="size-6 text-primary/40" />
            {review.title && <h3 className="mt-3 font-heading text-base font-semibold text-foreground">{review.title}</h3>}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{review.user.name}</span>
              <RatingStars rating={review.rating} />
            </div>
          </div>
        ))}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: data.meta.totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              className={cn(page === i + 1 && "bg-primary text-primary-foreground")}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
