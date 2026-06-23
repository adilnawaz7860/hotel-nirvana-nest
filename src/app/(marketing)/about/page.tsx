import type { Metadata } from "next";
import { Award, HeartHandshake, Sparkles, Users2 } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOTEL_MEDIA } from "@/lib/constants/media";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Hotel Nirvana Nest, a luxury hotel and restaurant in Gomti Nagar, Lucknow.",
};

const values = [
  { icon: Sparkles, title: "Modern Luxury", desc: "Contemporary design paired with timeless comfort." },
  { icon: HeartHandshake, title: "Genuine Hospitality", desc: "Every guest is treated like family." },
  { icon: Award, title: "Excellence", desc: "Rated 4.8 by our guests for service and quality." },
  { icon: Users2, title: "Community", desc: "Proud to be part of Lucknow's vibrant Gomti Nagar." },
];

export default function AboutPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="About Us"
          title="The Story of Hotel Nirvana Nest"
          description="A boutique luxury hotel in the heart of Gomti Nagar, Lucknow, built around the idea that true hospitality begins with genuine care."
        />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-2xl border border-border sm:h-96">
            <SafeImage src={HOTEL_MEDIA.exterior[0]} alt="Hotel Nirvana Nest" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Hotel Nirvana Nest was born from a simple idea — &ldquo;Your Escape, Your Stay, Your
              Nirvana.&rdquo; Located on B-4/103, Vishesh Khand 2, Gomti Nagar, our hotel blends
              modern architecture with warm, attentive service to create a true home away from
              home for every traveller.
            </p>
            <p>
              From elegantly appointed Deluxe Rooms to expansive Premium Suites, every space is
              thoughtfully designed for rest and productivity alike. Our in-house restaurant,
              Nirvana Foodhall, brings together Awadhi classics and multi-cuisine favourites for
              an unforgettable dining experience.
            </p>
            <p>
              Whether you are visiting Lucknow for business, leisure, or a family celebration,
              our team is dedicated to making your stay seamless, comfortable and memorable.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
