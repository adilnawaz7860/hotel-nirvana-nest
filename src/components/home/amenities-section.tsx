"use client";

import {
  Wifi,
  Waves,
  Dumbbell,
  ParkingCircle,
  UtensilsCrossed,
  Wind,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { useAmenities } from "@/hooks/use-amenities";
import { resolveIcon } from "@/lib/icon-map";

const FALLBACK_AMENITIES = [
  { name: "Free High-Speed Wi-Fi", icon: Wifi },
  { name: "Swimming Pool", icon: Waves },
  { name: "Fitness Centre", icon: Dumbbell },
  { name: "Complimentary Parking", icon: ParkingCircle },
  { name: "Fine Dining Restaurant", icon: UtensilsCrossed },
  { name: "Air Conditioned Rooms", icon: Wind },
  { name: "Housekeeping", icon: Sparkles },
  { name: "24x7 Security", icon: ShieldCheck },
];

export function AmenitiesSection() {
  const { data: amenities } = useAmenities("hotel");
  const items = amenities && amenities.length > 0 ? amenities : null;

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Amenities"
          title="Everything You Need for a Perfect Stay"
          description="Thoughtfully curated facilities that bring comfort, convenience and indulgence together under one roof."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items
            ? items.map((a, i) => {
                const Icon = resolveIcon(a.icon);
                return (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                  </motion.div>
                );
              })
            : FALLBACK_AMENITIES.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <a.icon className="size-5" />
                  </span>
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
