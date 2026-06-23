import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { ReviewsContent } from "./reviews-content";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description: "Read what our guests say about their stay at Hotel Nirvana Nest, Gomti Nagar, Lucknow.",
};

export default function ReviewsPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Reviews"
          title="Guest Experiences"
          description="92+ reviews, 4.8 average rating. Here's what our guests are saying."
        />
        <div className="mt-12">
          <ReviewsContent />
        </div>
      </div>
    </div>
  );
}
