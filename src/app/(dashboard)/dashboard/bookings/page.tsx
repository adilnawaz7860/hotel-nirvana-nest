"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMyBookings, useCancelBooking } from "@/hooks/use-bookings";
import { formatINR } from "@/lib/utils/pricing";

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyBookings(page);
  const cancelBooking = useCancelBooking();
  const queryClient = useQueryClient();

  async function handleCancel(id: string) {
    try {
      await cancelBooking.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel booking");
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Room Bookings</h2>
      <p className="mt-1 text-muted-foreground">View and manage your room bookings.</p>

      <div className="mt-6 space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        {data?.data.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            You have no bookings yet.
          </p>
        )}
        {data?.data.map((booking) => (
          <div key={booking._id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">{booking.room.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{booking.bookingCode}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  {" "}({booking.nights} night{booking.nights > 1 ? "s" : ""})
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={booking.status} />
                <p className="mt-2 font-heading font-semibold text-gradient-gold">
                  {formatINR(booking.totalAmount)}
                </p>
              </div>
            </div>

            {["pending_payment", "confirmed"].includes(booking.status) && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelBooking.isPending}
                  onClick={() => handleCancel(booking._id)}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  {cancelBooking.isPending ? <Loader2 className="size-3.5 animate-spin" /> : "Cancel Booking"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.meta.totalPages }).map((_, i) => (
            <Button key={i} size="sm" variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
