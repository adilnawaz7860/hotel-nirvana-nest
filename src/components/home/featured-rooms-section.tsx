"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { RoomCard } from "@/components/rooms/room-card";
import { Button } from "@/components/ui/button";
import { useFeaturedRooms } from "@/hooks/use-rooms";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedRoomsSection() {
  const { data: rooms, isLoading } = useFeaturedRooms();

  return (
    <section className="section-padding bg-card/30">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Accommodation"
          title="Featured Rooms & Suites"
          description="From elegant Deluxe Rooms to expansive Premium Suites, every space is designed for rest, work and indulgence."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          {rooms?.map((room, i) => <RoomCard key={room._id} room={room} index={i} />)}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="border-primary/40 hover:bg-primary/10"
            render={<Link href="/rooms">View All Rooms</Link>}
          />
        </div>
      </div>
    </section>
  );
}
