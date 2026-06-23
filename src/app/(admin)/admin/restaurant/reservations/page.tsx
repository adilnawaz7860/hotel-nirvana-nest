"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Armchair, CheckCircle2, Ban } from "lucide-react";
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
  useAdminReservations,
  useAdminSeatReservation,
  useAdminCompleteReservation,
  useAdminCancelReservation,
} from "@/hooks/admin/use-admin-reservations";
import { RESERVATION_STATUSES, TABLE_TYPE_LABELS } from "@/lib/constants";
import { minutesToTimeString } from "@/lib/utils/dates";

export default function AdminReservationsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAdminReservations({ status });
  const seat = useAdminSeatReservation();
  const complete = useAdminCompleteReservation();
  const cancel = useAdminCancelReservation();

  async function handleAction(fn: () => Promise<unknown>, msg: string) {
    try {
      await fn();
      toast.success(msg);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Reservation Management</h2>
          <p className="mt-1 text-muted-foreground">Manage table reservations and seating.</p>
        </div>
        <Select value={status ?? "all"} onValueChange={(v) => setStatus(!v || v === "all" ? undefined : v)}>
          <SelectTrigger className="w-48">
            <SelectValue className="capitalize">
              {(v: string) => (v === "all" ? "All Statuses" : v.replace(/_/g, " "))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {RESERVATION_STATUSES.map((s) => (
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
                <TableHead>Table</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((res) => (
                <TableRow key={res._id}>
                  <TableCell className="font-mono text-xs">{res.reservationCode}</TableCell>
                  <TableCell>
                    <p className="text-sm">{res.guestDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{res.guestDetails.phone}</p>
                  </TableCell>
                  <TableCell>
                    {res.table?.tableNumber ?? "-"}{" "}
                    <span className="text-xs text-muted-foreground">({TABLE_TYPE_LABELS[res.tableType]})</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(res.date).toLocaleDateString()} at {minutesToTimeString(res.timeSlot.start)}
                  </TableCell>
                  <TableCell>{res.partySize}</TableCell>
                  <TableCell>
                    <StatusBadge status={res.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {res.status === "confirmed" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Mark Seated"
                        onClick={() => handleAction(() => seat.mutateAsync(res._id), "Marked as seated")}
                      >
                        <Armchair className="size-4" />
                      </Button>
                    )}
                    {res.status === "seated" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Mark Completed"
                        onClick={() => handleAction(() => complete.mutateAsync(res._id), "Marked as completed")}
                      >
                        <CheckCircle2 className="size-4" />
                      </Button>
                    )}
                    {["pending", "confirmed"].includes(res.status) && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Cancel"
                        className="text-destructive"
                        onClick={() => handleAction(() => cancel.mutateAsync(res._id), "Reservation cancelled")}
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
