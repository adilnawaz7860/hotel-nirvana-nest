"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UtensilsCrossed, Clock, Soup } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { HOTEL_MEDIA } from "@/lib/constants/media";
import { HOTEL_INFO } from "@/lib/constants";

const highlights = [
  { icon: Soup, label: "Multi-Cuisine Menu" },
  { icon: Clock, label: `Open ${HOTEL_INFO.restaurantOpenTime} - ${HOTEL_INFO.restaurantCloseTime}` },
  { icon: UtensilsCrossed, label: "Private & Family Tables" },
];

export function RestaurantShowcaseSection() {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-luxury grid items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Nirvana Foodhall
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            A Culinary Journey Worth the Visit
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Savour expertly crafted multi-cuisine dishes in an elegant setting. Whether it&apos;s
            an intimate dinner or a family celebration, our restaurant offers the perfect table
            for every occasion.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {highlights.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
              render={<Link href="/restaurant">Reserve a Table</Link>}
            />
            <Button
              variant="outline"
              nativeButton={false}
              className="border-primary/40 hover:bg-primary/10"
              render={<Link href="/restaurant/menu">View Menu</Link>}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.restaurant[3]} alt="Nirvana Foodhall dining area" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.restaurant[0]} alt="Restaurant interior" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
            <SafeImage src={HOTEL_MEDIA.restaurant[1]} alt="Restaurant seating" fill sizes="25vw" className="object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
