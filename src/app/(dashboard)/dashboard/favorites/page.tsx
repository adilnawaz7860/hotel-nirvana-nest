"use client";

import { RoomCard } from "@/components/rooms/room-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Favorites</h2>
      <p className="mt-1 text-muted-foreground">Rooms you&apos;ve saved for later.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
        {favorites?.length === 0 && (
          <p className="col-span-full rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            You haven&apos;t saved any rooms yet.
          </p>
        )}
        {favorites?.map((room, i) => <RoomCard key={room._id} room={room} index={i} />)}
      </div>
    </div>
  );
}
