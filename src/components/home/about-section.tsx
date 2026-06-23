"use client";

import { motion } from "framer-motion";
import { Award, Sparkles, Users2 } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOTEL_MEDIA } from "@/lib/constants/media";

const stats = [
  { icon: Award, label: "4.8 Rated", value: "Guest Experience" },
  { icon: Sparkles, label: "Premium Suites", value: "Modern Luxury" },
  { icon: Users2, label: "92+ Reviews", value: "Trusted by Travellers" },
];

export function AboutSection() {
  return (
    <section className="section-padding">
      <div className="container-luxury grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative grid grid-cols-2 gap-4"
        >
          <div className="relative col-span-2 h-72 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.lobby[0]} alt="Hotel Nirvana Nest lobby" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.exterior[1]} alt="Hotel Nirvana Nest entrance" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.restaurant[0]} alt="Hotel Nirvana Nest restaurant" fill sizes="25vw" className="object-cover" />
          </div>
        </motion.div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About the Hotel"
            title="Where Modern Comfort Meets Timeless Hospitality"
            description="Nestled in the upscale heart of Gomti Nagar, Lucknow, Hotel Nirvana Nest brings together elegant interiors, attentive service and a celebrated in-house dining experience — crafted for travellers who expect more from a stay."
          />

          <div className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-4 text-left"
              >
                <stat.icon className="size-5 text-primary" />
                <p className="mt-3 font-heading text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
