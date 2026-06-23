import { Suspense } from "react";
import type { Metadata } from "next";
import { RoomsPageContent } from "./rooms-page-content";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Explore Deluxe Rooms, Executive Rooms, Family Rooms and Premium Suites at Hotel Nirvana Nest, Gomti Nagar, Lucknow.",
};

export default function RoomsPage() {
  return (
    <Suspense fallback={null}>
      <RoomsPageContent />
    </Suspense>
  );
}
