import type { Metadata } from "next";
import { MenuTabs } from "./menu-tabs";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Explore the multi-cuisine menu at Nirvana Foodhall, Hotel Nirvana Nest, Lucknow.",
};

export default function MenuPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Nirvana Foodhall"
          title="Our Menu"
          description="A curated selection of Awadhi classics and multi-cuisine favourites, crafted with care."
        />
        <div className="mt-12">
          <MenuTabs />
        </div>
      </div>
    </div>
  );
}
