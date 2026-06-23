"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMyReservations, useCancelReservation } from "@/hooks/use-reservations";
import { minutesToTimeString } from "@/lib/utils/dates";
import { TABLE_TYPE_LABELS } from "@/lib/constants";

export default function ReservationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyReservations(page);
  const cancelReservation = useCancelReservation();
  const queryClient = useQueryClient();

  async function handleCancel(id: string) {
    try {
      await cancelReservation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["reservations", "mine"] });
      toast.success("Reservation cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel reservation");
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Table Reservations</h2>
      <p className="mt-1 text-muted-foreground">View and manage your restaurant reservations.</p>

      <div className="mt-6 space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        {data?.data.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            You have no reservations yet.
          </p>
        )}
        {data?.data.map((res) => (
          <div key={res._id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  {TABLE_TYPE_LABELS[res.tableType]}
                  {res.table && ` · Table ${res.table.tableNumber}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{res.reservationCode}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {new Date(res.date).toLocaleDateString()} at {minutesToTimeString(res.timeSlot.start)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {res.partySize} Guests
                </p>
              </div>
              <StatusBadge status={res.status} />
            </div>

            {["pending", "confirmed"].includes(res.status) && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelReservation.isPending}
                  onClick={() => handleCancel(res._id)}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  {cancelReservation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : "Cancel Reservation"}
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
