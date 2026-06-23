"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useReservationAvailability, useCreateReservation } from "@/hooks/use-reservations";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  specialRequests: z.string().max(300).optional(),
});

type GuestDetailsForm = z.infer<typeof guestDetailsSchema>;

export function ReservationWidget() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [date, setDate] = useState<Date | undefined>();
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const dateParam = date ? format(date, "yyyy-MM-dd") : undefined;
  const { data: slots, isLoading } = useReservationAvailability(dateParam, partySize);
  const createReservation = useCreateReservation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetailsForm>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" },
  });

  function handleSlotClick(time: string) {
    if (!user) {
      toast.error("Please log in to reserve a table");
      router.push("/login?next=/restaurant");
      return;
    }
    setSelectedTime(time);
    setDetailsOpen(true);
  }

  async function onConfirm(values: GuestDetailsForm) {
    if (!dateParam || !selectedTime) return;

    try {
      const reservation = await createReservation.mutateAsync({
        date: dateParam,
        time: selectedTime,
        partySize,
        guestDetails: { name: values.name, email: values.email, phone: values.phone },
        specialRequests: values.specialRequests,
      });

      toast.success(`Table reserved! Confirmation code: ${reservation.reservationCode}`);
      setDetailsOpen(false);
      router.push("/dashboard/reservations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete reservation");
    }
  }

  return (
    <div className="glass glass-gold-border rounded-2xl p-6">
      <h3 className="font-heading text-xl font-semibold text-foreground">Reserve a Table</h3>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Popover>
          <PopoverTrigger
            render={
              <button className="flex flex-col items-start gap-1 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-left">
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Date
                </span>
                <span className="text-sm font-medium text-foreground">
                  {date ? format(date, "dd MMM yyyy") : "Select date"}
                </span>
              </button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
          </PopoverContent>
        </Popover>

        <div className="rounded-xl border border-border bg-foreground/5 px-4 py-3">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Users className="size-3.5" /> Guests
          </span>
          <Select value={String(partySize)} onValueChange={(v) => setPartySize(Number(v))}>
            <SelectTrigger className="h-auto w-full border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0">
              <SelectValue>{(v: string) => `${v} Guest${Number(v) > 1 ? "s" : ""}`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1} Guest{i > 0 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <Clock className="size-3.5" /> Available Slots
        </span>

        {!date && <p className="mt-3 text-sm text-muted-foreground">Select a date to see available times.</p>}
        {date && isLoading && <p className="mt-3 text-sm text-muted-foreground">Checking availability...</p>}

        {date && slots && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => handleSlotClick(slot.time)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  slot.available
                    ? "border-border bg-foreground/5 text-foreground hover:border-primary hover:text-primary"
                    : "cursor-not-allowed border-border bg-white/[0.02] text-muted-foreground/40 line-through"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Reservation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onConfirm)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="r-name">Full Name</FieldLabel>
                <Input id="r-name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="r-email">Email</FieldLabel>
                <Input id="r-email" type="email" {...register("email")} />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="r-phone">Phone</FieldLabel>
                <Input id="r-phone" {...register("phone")} />
                <FieldError errors={[errors.phone]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="r-requests">Special Requests (optional)</FieldLabel>
                <Input id="r-requests" {...register("specialRequests")} />
              </Field>
              <Button
                type="submit"
                disabled={createReservation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
              >
                {createReservation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Confirm Reservation"
                )}
              </Button>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
