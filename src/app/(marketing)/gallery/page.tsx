import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { GalleryGrid } from "./gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photos of rooms, restaurant, and interiors at Hotel Nirvana Nest, Gomti Nagar, Lucknow.",
};

export default function GalleryPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Gallery"
          title="A Visual Tour of Nirvana Nest"
          description="Explore our rooms, restaurant, exteriors and event spaces."
        />
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </div>
    </div>
  );
}
