"use client";

import Link from "next/link";
import { BedDouble, UtensilsCrossed, Heart, ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMyBookings } from "@/hooks/use-bookings";
import { useMyReservations } from "@/hooks/use-reservations";
import { useFavorites } from "@/hooks/use-favorites";
import { formatINR } from "@/lib/utils/pricing";

export default function DashboardOverviewPage() {
  const { data: user } = useCurrentUser();
  const { data: bookings } = useMyBookings();
  const { data: reservations } = useMyReservations();
  const { data: favorites } = useFavorites();

  const upcomingBooking = bookings?.data.find((b) => b.status === "confirmed");

  const cards = [
    { icon: BedDouble, label: "Room Bookings", value: bookings?.meta?.total ?? 0, href: "/dashboard/bookings" },
    { icon: UtensilsCrossed, label: "Table Reservations", value: reservations?.meta?.total ?? 0, href: "/dashboard/reservations" },
    { icon: Heart, label: "Favorites", value: favorites?.length ?? 0, href: "/dashboard/favorites" },
  ];

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Welcome back, {user?.name?.split(" ")[0] ?? "Guest"}
      </h2>
      <p className="mt-1 text-muted-foreground">Here&apos;s a summary of your account.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <card.icon className="size-6 text-primary" />
            <p className="mt-4 font-heading text-2xl font-bold text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      {upcomingBooking && (
        <div className="mt-8 rounded-2xl border border-primary/30 bg-card p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground">Upcoming Stay</h3>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground">{upcomingBooking.room.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(upcomingBooking.checkIn).toLocaleDateString()} -{" "}
                {new Date(upcomingBooking.checkOut).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-heading font-semibold text-gradient-gold">
                {formatINR(upcomingBooking.totalAmount)}
              </span>
              <Link href="/dashboard/bookings" className="flex items-center gap-1 text-sm text-primary hover:underline">
                View <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
