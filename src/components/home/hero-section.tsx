"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import { BookingSearchWidget } from "@/components/rooms/booking-search-widget";
import { useTranslation } from "@/hooks/use-translation";
import { HOTEL_MEDIA } from "@/lib/constants/media";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden">
      <SafeImage
        src={HOTEL_MEDIA.heroImage}
        alt="Hotel Nirvana Nest"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      <div className="container-luxury relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t.hero.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-4xl"
        >
          <BookingSearchWidget />
        </motion.div>
      </div>
    </section>
  );
}
