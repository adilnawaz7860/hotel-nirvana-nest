"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGallery } from "@/hooks/use-gallery";
import { HOTEL_MEDIA } from "@/lib/constants/media";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: undefined, label: "All" },
  { value: "exterior", label: "Exterior" },
  { value: "rooms", label: "Rooms" },
  { value: "restaurant", label: "Restaurant" },
  { value: "events", label: "Events" },
  { value: "amenities", label: "Amenities" },
] as const;

const FALLBACK = [
  ...HOTEL_MEDIA.exterior.map((url) => ({ url, category: "exterior" })),
  ...HOTEL_MEDIA.restaurant.map((url) => ({ url, category: "restaurant" })),
  ...HOTEL_MEDIA.rooms.map((url) => ({ url, category: "rooms" })),
  ...HOTEL_MEDIA.bathrooms.map((url) => ({ url, category: "rooms" })),
  ...HOTEL_MEDIA.lobby.map((url) => ({ url, category: "amenities" })),
];

export function GalleryGrid() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data, isLoading } = useGallery(category);

  const items =
    data && data.length > 0
      ? data
      : FALLBACK.filter((f) => !category || f.category === category).map((f, i) => ({
          _id: String(i),
          imageUrl: f.url,
          title: "Hotel Nirvana Nest",
        }));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.label}
            size="sm"
            variant={category === cat.value ? "default" : "outline"}
            className={cn(category === cat.value && "bg-primary text-primary-foreground")}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        {items.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            className="relative h-48 overflow-hidden rounded-xl border border-border"
          >
            <SafeImage
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
