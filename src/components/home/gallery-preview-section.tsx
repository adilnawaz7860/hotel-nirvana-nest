"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { useGallery } from "@/hooks/use-gallery";
import { HOTEL_MEDIA } from "@/lib/constants/media";

const fallbackImages = [
  ...HOTEL_MEDIA.exterior,
  ...HOTEL_MEDIA.restaurant,
  ...HOTEL_MEDIA.rooms,
].slice(0, 6);

export function GalleryPreviewSection() {
  const { data: gallery } = useGallery();
  const images = gallery && gallery.length > 0 ? gallery.slice(0, 6).map((g) => g.imageUrl) : fallbackImages;

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Gallery"
          title="A Glimpse Into Nirvana Nest"
          description="Step inside our rooms, restaurant and lobby through the lens of our guests and photographers."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:auto-rows-[11rem]">
          {images.map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-xl border border-border ${
                i === 0 ? "col-span-2 row-span-2 h-72 sm:h-full" : "h-36 sm:h-44"
              }`}
            >
              <SafeImage
                src={src}
                alt="Hotel Nirvana Nest"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="border-primary/40 hover:bg-primary/10"
            render={<Link href="/gallery">Explore Full Gallery</Link>}
          />
        </div>
      </div>
    </section>
  );
}
