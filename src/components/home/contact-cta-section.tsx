"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOTEL_INFO } from "@/lib/constants";

export function ContactCtaSection() {
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary via-card to-secondary p-10 text-center sm:p-16"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Reach out to our reservations team for personalised assistance, group bookings or
            special occasion arrangements.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              nativeButton={false}
              className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
              render={<Link href="/rooms">Book Your Stay</Link>}
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="border-primary/40 hover:bg-primary/10"
              render={
                <a href={`tel:${HOTEL_INFO.phone}`}>
                  <Phone className="size-4" />
                  Call Us
                </a>
              }
            />
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            {HOTEL_INFO.address}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
