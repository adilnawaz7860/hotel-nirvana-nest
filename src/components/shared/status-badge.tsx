import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending_payment: "bg-amber-500/15 text-amber-400",
  pending: "bg-amber-500/15 text-amber-400",
  confirmed: "bg-emerald-500/15 text-emerald-400",
  seated: "bg-blue-500/15 text-blue-400",
  checked_in: "bg-blue-500/15 text-blue-400",
  checked_out: "bg-muted text-muted-foreground",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
  no_show: "bg-destructive/15 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  pending: "Pending",
  confirmed: "Confirmed",
  seated: "Seated",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-none font-medium", STATUS_STYLES[status] ?? "bg-muted text-muted-foreground")}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
