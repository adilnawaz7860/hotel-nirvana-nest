"use client";

import { useState } from "react";
import { Users, Maximize, Building2, Check } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { RatingStars } from "@/components/shared/rating-stars";
import { RoomBookingPanel } from "@/components/rooms/room-booking-panel";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { PLACEHOLDER_IMAGE } from "@/lib/constants/media";
import { cn } from "@/lib/utils";
import type { Room } from "@/types";

export function RoomDetailContent({ room }: { room: Room }) {
  const images = room.images.length ? room.images : [{ url: PLACEHOLDER_IMAGE, publicId: "" }];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-[28rem]">
              <SafeImage
                src={images[activeImage]?.url ?? PLACEHOLDER_IMAGE}
                alt={room.name}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.publicId || i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border",
                      activeImage === i ? "border-primary" : "border-border"
                    )}
                  >
                    <SafeImage src={img.url} alt={room.name} fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {ROOM_TYPE_LABELS[room.roomType]}
                </span>
                <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{room.name}</h1>
              </div>
              {room.ratingCount > 0 && (
                <div className="flex items-center gap-2">
                  <RatingStars rating={room.ratingAvg} />
                  <span className="text-sm text-muted-foreground">({room.ratingCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" />
                {room.capacity.adults} Adults, {room.capacity.children} Children
              </span>
              {room.size && (
                <span className="flex items-center gap-1.5">
                  <Maximize className="size-4 text-primary" />
                  {room.size} sq.ft
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-primary" />
                Room No. {room.roomNumber}
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">{room.description}</p>

            {room.amenities.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-semibold text-foreground">Room Amenities</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {room.amenities.map((a) => (
                    <div key={a._id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-primary" />
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <RoomBookingPanel room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}
