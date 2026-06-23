"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LogIn, LogOut, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAdminBookings,
  useAdminCheckIn,
  useAdminCheckOut,
  useAdminCancelBooking,
} from "@/hooks/admin/use-admin-bookings";
import { ROOM_BOOKING_STATUSES } from "@/lib/constants";
import { formatINR } from "@/lib/utils/pricing";

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAdminBookings({ status });
  const checkIn = useAdminCheckIn();
  const checkOut = useAdminCheckOut();
  const cancelBooking = useAdminCancelBooking();

  async function handleAction(fn: () => Promise<unknown>, successMsg: string) {
    try {
      await fn();
      toast.success(successMsg);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Booking Management</h2>
          <p className="mt-1 text-muted-foreground">Manage room bookings, check-ins and check-outs.</p>
        </div>
        <Select value={status ?? "all"} onValueChange={(v) => setStatus(!v || v === "all" ? undefined : v)}>
          <SelectTrigger className="w-48">
            <SelectValue className="capitalize">
              {(v: string) => (v === "all" ? "All Statuses" : v.replace(/_/g, " "))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ROOM_BOOKING_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-mono text-xs">{booking.bookingCode}</TableCell>
                  <TableCell>
                    <p className="text-sm">{booking.guestDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.guestDetails.phone}</p>
                  </TableCell>
                  <TableCell>{booking.room?.name}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatINR(booking.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "confirmed" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Check In"
                        onClick={() => handleAction(() => checkIn.mutateAsync(booking._id), "Checked in")}
                      >
                        <LogIn className="size-4" />
                      </Button>
                    )}
                    {booking.status === "checked_in" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Check Out"
                        onClick={() => handleAction(() => checkOut.mutateAsync(booking._id), "Checked out")}
                      >
                        <LogOut className="size-4" />
                      </Button>
                    )}
                    {["pending_payment", "confirmed"].includes(booking.status) && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Cancel"
                        className="text-destructive"
                        onClick={() => handleAction(() => cancelBooking.mutateAsync(booking._id), "Booking cancelled")}
                      >
                        <Ban className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
