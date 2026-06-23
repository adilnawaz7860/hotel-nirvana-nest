"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, Users, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { useBookingDraftStore } from "@/store/booking-draft.store";
import { cn } from "@/lib/utils";

export function BookingSearchWidget({ className }: { className?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { adults, children, setGuests } = useBookingDraftStore();
  const [range, setRange] = useState<DateRange | undefined>();

  function handleSearch() {
    const params = new URLSearchParams();
    if (range?.from) params.set("checkIn", format(range.from, "yyyy-MM-dd"));
    if (range?.to) params.set("checkOut", format(range.to, "yyyy-MM-dd"));
    params.set("adults", String(adults));
    params.set("children", String(children));
    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        "glass glass-gold-border grid w-full gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:p-3",
        className
      )}
    >
      <Popover>
        <PopoverTrigger
          render={
            <button className="flex flex-col items-start gap-1 rounded-xl bg-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/10">
              <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="size-3.5" /> {t.hero.checkIn}
              </span>
              <span className="text-sm font-medium text-foreground">
                {range?.from ? format(range.from, "dd MMM yyyy") : "Select date"}
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

      <Popover>
        <PopoverTrigger
          render={
            <button className="flex flex-col items-start gap-1 rounded-xl bg-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/10">
              <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="size-3.5" /> {t.hero.checkOut}
              </span>
              <span className="text-sm font-medium text-foreground">
                {range?.to ? format(range.to, "dd MMM yyyy") : "Select date"}
              </span>
            </button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: range?.from ?? new Date() }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      <div className="flex flex-col items-start gap-1 rounded-xl bg-foreground/5 px-4 py-3">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <Users className="size-3.5" /> {t.hero.guests}
        </span>
        <Select value={String(adults)} onValueChange={(v) => setGuests(Number(v), children)}>
          <SelectTrigger className="h-auto w-full border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0">
            <SelectValue>{(v: string) => `${v} Adult${Number(v) > 1 ? "s" : ""}`}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} Adult{n > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSearch}
        size="lg"
        className="h-full bg-primary text-primary-foreground font-semibold hover:bg-gold-light"
      >
        <Search className="size-4" />
        {t.hero.checkAvailability}
      </Button>
    </div>
  );
}
