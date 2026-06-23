"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateBooking, useCreatePaymentOrder, useVerifyPayment } from "@/hooks/use-bookings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { openRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { formatINR } from "@/lib/utils/pricing";
import { calculateRoomBookingTotal } from "@/lib/utils/pricing";
import type { Room } from "@/types";

const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
});

type GuestDetailsForm = z.infer<typeof guestDetailsSchema>;

export function RoomBookingPanel({ room }: { room: Room }) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const createBooking = useCreateBooking();
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestDetailsForm>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, phone: user.phone });
  }, [user, reset]);

  const nights =
    range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;

  const pricing = nights
    ? calculateRoomBookingTotal({
        nights,
        ratePerNight: room.pricePerNight,
        discountPercent: room.discountPercent,
      })
    : null;

  function handleReserveClick() {
    if (!user) {
      toast.error("Please log in to book this room");
      router.push("/login?next=/rooms/" + room.slug);
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (range.to.getTime() <= range.from.getTime()) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    setDetailsOpen(true);
  }

  async function onConfirm(values: GuestDetailsForm) {
    if (!range?.from || !range?.to) return;

    try {
      const booking = await createBooking.mutateAsync({
        roomId: room._id,
        checkIn: format(range.from, "yyyy-MM-dd"),
        checkOut: format(range.to, "yyyy-MM-dd"),
        guests: { adults, children },
        guestDetails: values,
      });

      const orderData = await createOrder.mutateAsync(booking._id);

      await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.order.id,
        amount: orderData.order.amount,
        name: "Hotel Nirvana Nest",
        description: `Booking ${booking.bookingCode}`,
        prefill: { name: values.name, email: values.email, contact: values.phone },
        onSuccess: async (response) => {
          await verifyPayment.mutateAsync({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success("Booking confirmed! Check your email for details.");
          router.push("/dashboard/bookings");
        },
        onDismiss: () => {
          toast.info("Payment cancelled. Your room is held for a few minutes.");
        },
      });

      setDetailsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  const isSubmitting = createBooking.isPending || createOrder.isPending;

  return (
    <div className="glass glass-gold-border sticky top-28 rounded-2xl p-6">
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-2xl font-bold text-gradient-gold">
          {formatINR(room.pricePerNight)}
        </span>
        <span className="text-xs text-muted-foreground">/ night</span>
      </div>

      <div className="mt-6 grid gap-3">
        <Popover>
          <PopoverTrigger
            render={
              <button className="flex flex-col items-start gap-1 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-left">
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Check-in &mdash; Check-out
                </span>
                <span className="text-sm font-medium text-foreground">
                  {range?.from && range?.to
                    ? `${format(range.from, "dd MMM")} - ${format(range.to, "dd MMM yyyy")}`
                    : "Select your dates"}
                </span>
              </button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={{ before: new Date() }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-foreground/5 px-4 py-3">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Users className="size-3.5" /> Adults
            </span>
            <Select value={String(adults)} onValueChange={(v) => setAdults(Number(v))}>
              <SelectTrigger className="h-auto w-full border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: room.capacity.adults }).map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-border bg-foreground/5 px-4 py-3">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Users className="size-3.5" /> Children
            </span>
            <Select value={String(children)} onValueChange={(v) => setChildren(Number(v))}>
              <SelectTrigger className="h-auto w-full border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: room.capacity.children + 1 }).map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {pricing && (
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              {formatINR(room.pricePerNight)} x {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>{formatINR(pricing.subtotal)}</span>
          </div>
          {pricing.discountAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span>- {formatINR(pricing.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Taxes</span>
            <span>{formatINR(pricing.taxAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
            <span>Total</span>
            <span className="text-gradient-gold">{formatINR(pricing.totalAmount)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleReserveClick}
        size="lg"
        className="mt-5 w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
      >
        Reserve Now
      </Button>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Guest Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onConfirm)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" {...register("phone")} />
                <FieldError errors={[errors.phone]} />
              </Field>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Proceed to Payment"}
              </Button>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
