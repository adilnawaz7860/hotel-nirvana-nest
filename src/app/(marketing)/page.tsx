import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { FeaturedRoomsSection } from "@/components/home/featured-rooms-section";
import { AmenitiesSection } from "@/components/home/amenities-section";
import { RestaurantShowcaseSection } from "@/components/home/restaurant-showcase-section";
import { GalleryPreviewSection } from "@/components/home/gallery-preview-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NearbyAttractionsSection } from "@/components/home/nearby-attractions-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";

export const metadata: Metadata = {
  title: "Hotel Nirvana Nest | Luxury Stay & Dining in Gomti Nagar, Lucknow",
  description:
    "Book your stay at Hotel Nirvana Nest, a premium luxury hotel in Gomti Nagar, Lucknow, featuring elegant rooms, suites and the celebrated Nirvana Foodhall restaurant.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedRoomsSection />
      <AmenitiesSection />
      <RestaurantShowcaseSection />
      <GalleryPreviewSection />
      <TestimonialsSection />
      <NearbyAttractionsSection />
      <WhyChooseUsSection />
      <ContactCtaSection />
    </>
  );
}
