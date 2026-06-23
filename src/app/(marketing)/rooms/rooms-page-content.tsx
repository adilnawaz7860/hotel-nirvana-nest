"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomFilters } from "@/components/rooms/room-filters";
import { BookingSearchWidget } from "@/components/rooms/booking-search-widget";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoomAvailability, useRooms } from "@/hooks/use-rooms";

export function RoomsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomType, setRoomType] = useState<string | undefined>(undefined);

  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const adults = Number(searchParams.get("adults") ?? 1);
  const children = Number(searchParams.get("children") ?? 0);
  const isSearching = Boolean(checkIn && checkOut);

  const availability = useRoomAvailability({ checkIn, checkOut, adults, children, roomType });
  const allRooms = useRooms({ roomType });

  const { data, isLoading } = isSearching ? availability : allRooms;
  const rooms = data?.data ?? [];

  function handleFilterChange(type?: string) {
    setRoomType(type);
  }

  function clearSearch() {
    router.push("/rooms");
  }

  return (
    <div className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Accommodation"
          title="Rooms & Suites"
          description="Choose from Deluxe Rooms, Executive Rooms, Family Rooms and Premium Suites — each crafted for comfort and elegance."
        />

        <div className="mt-10">
          <BookingSearchWidget />
          {isSearching && (
            <button
              onClick={clearSearch}
              className="mt-3 text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Clear dates &amp; view all rooms
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <RoomFilters value={roomType} onChange={handleFilterChange} />

          {isSearching && !isLoading && rooms.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No rooms are available for the selected dates. Try adjusting your search.
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
            {rooms.map((room, i) => (
              <RoomCard key={room._id} room={room} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
