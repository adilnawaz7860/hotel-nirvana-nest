"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock4, HeartHandshake, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Premium Comfort",
    desc: "Thoughtfully designed rooms with modern amenities for a relaxing stay.",
  },
  {
    icon: HeartHandshake,
    title: "Attentive Service",
    desc: "A dedicated team committed to making every visit memorable.",
  },
  {
    icon: Clock4,
    title: "24x7 Availability",
    desc: "Round-the-clock front desk, room service and concierge support.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Secure premises with CCTV surveillance and trained security staff.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Why Nirvana Nest"
          title="Designed Around Your Comfort"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <reason.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
