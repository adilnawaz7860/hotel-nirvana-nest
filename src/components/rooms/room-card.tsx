"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Maximize, Heart } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/shared/safe-image";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { formatINR } from "@/lib/utils/pricing";
import { PLACEHOLDER_IMAGE } from "@/lib/constants/media";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFavorites, useToggleFavorite } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import type { Room } from "@/types";

export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  const image = room.images[0]?.url ?? PLACEHOLDER_IMAGE;
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: favorites } = useFavorites(!!user);
  const toggleFavorite = useToggleFavorite();
  const isFavorited = favorites?.some((f) => f._id === room._id) ?? false;

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to save favorites");
      router.push("/login");
      return;
    }
    toggleFavorite.mutate(room._id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card glass-gold-border"
    >
      <Link href={`/rooms/${room.slug}`} className="block">
        <div className="relative h-64 w-full overflow-hidden">
          <SafeImage
            src={image}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
          <Badge className="absolute left-4 top-4 bg-primary/90 text-primary-foreground">
            {ROOM_TYPE_LABELS[room.roomType]}
          </Badge>
          <button
            type="button"
            aria-label="Save to favorites"
            onClick={handleFavoriteClick}
            className={cn(
              "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/40 backdrop-blur transition-colors hover:bg-background/70",
              isFavorited ? "text-primary" : "text-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("size-4", isFavorited && "fill-primary")} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-semibold text-foreground">{room.name}</h3>
            {room.ratingCount > 0 && <RatingStars rating={room.ratingAvg} />}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {room.capacity.adults + room.capacity.children} Guests
            </span>
            {room.size && (
              <span className="flex items-center gap-1.5">
                <Maximize className="size-3.5" />
                {room.size} sq.ft
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-heading text-xl font-bold text-gradient-gold">
                {formatINR(room.pricePerNight)}
              </span>
              <span className="text-xs text-muted-foreground"> / night</span>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-gold-light">
              View Room
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
