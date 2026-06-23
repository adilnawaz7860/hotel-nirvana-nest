"use client";

import { Button } from "@/components/ui/button";
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RoomFilters({
  value,
  onChange,
}: {
  value?: string;
  onChange: (roomType?: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={!value ? "default" : "outline"}
        className={cn(!value && "bg-primary text-primary-foreground")}
        onClick={() => onChange(undefined)}
      >
        All Rooms
      </Button>
      {ROOM_TYPES.map((type) => (
        <Button
          key={type}
          size="sm"
          variant={value === type ? "default" : "outline"}
          className={cn(value === type && "bg-primary text-primary-foreground")}
          onClick={() => onChange(type)}
        >
          {ROOM_TYPE_LABELS[type]}
        </Button>
      ))}
    </div>
  );
}
