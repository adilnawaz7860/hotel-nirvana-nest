"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";

const attractions = [
  { name: "Ambedkar Park", distance: "1.2 km", desc: "Iconic elephant statues & memorial gardens" },
  { name: "JP Narayan Museum", distance: "2.5 km", desc: "Culture and history of Uttar Pradesh" },
  { name: "Phoenix Palassio Mall", distance: "3 km", desc: "Premium shopping & entertainment" },
  { name: "Lucknow Airport", distance: "12 km", desc: "Chaudhary Charan Singh International Airport" },
];

export function NearbyAttractionsSection() {
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Explore Lucknow"
          title="Nearby Attractions"
          description="Hotel Nirvana Nest sits in the upscale Gomti Nagar neighbourhood, minutes from the city's best landmarks."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {attractions.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <MapPin className="size-5 text-primary" />
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">{a.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-primary">{a.distance}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
