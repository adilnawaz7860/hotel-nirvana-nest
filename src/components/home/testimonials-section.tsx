"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { RatingStars } from "@/components/shared/rating-stars";
import { useReviews } from "@/hooks/use-reviews";

const FALLBACK_REVIEWS = [
  {
    _id: "1",
    rating: 5,
    comment: "Located on the main road, pleasant and roomy rooms, well lit, neat and clean.",
    user: { name: "FarAway", avatarUrl: undefined },
  },
  {
    _id: "2",
    rating: 5,
    comment: "Beautiful interiors and an amazing dining experience at Nirvana Foodhall.",
    user: { name: "Aditi S.", avatarUrl: undefined },
  },
  {
    _id: "3",
    rating: 4,
    comment: "Great service, comfortable beds, and a very convenient Gomti Nagar location.",
    user: { name: "Rohit K.", avatarUrl: undefined },
  },
];

export function TestimonialsSection() {
  const { data } = useReviews({ targetType: "general" });
  const reviews = data?.data && data.data.length > 0 ? data.data : FALLBACK_REVIEWS;

  return (
    <section className="section-padding bg-card/30">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Guests Say"
          description="Real experiences from travellers who chose Hotel Nirvana Nest for their stay in Lucknow."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="size-6 text-primary/40" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{review.user.name}</span>
                <RatingStars rating={review.rating} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
