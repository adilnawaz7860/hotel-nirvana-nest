"use client";

import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import { IndianRupee, CalendarCheck, UtensilsCrossed, BedDouble, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/hooks/admin/use-admin-analytics";
import { formatINR } from "@/lib/utils/pricing";

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
};

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useAdminAnalytics(30);

  const kpis = [
    { icon: IndianRupee, label: "Revenue (30d)", value: data ? formatINR(data.totalRevenue) : "-" },
    { icon: CalendarCheck, label: "Room Bookings (30d)", value: data?.bookingsCount ?? "-" },
    { icon: UtensilsCrossed, label: "Reservations (30d)", value: data?.reservationsCount ?? "-" },
    { icon: BedDouble, label: "Active Rooms", value: data?.activeRoomsCount ?? "-" },
    { icon: Users, label: "Customers", value: data?.customersCount ?? "-" },
  ];

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Dashboard Analytics</h2>
      <p className="mt-1 text-muted-foreground">Overview of the last 30 days.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
            <kpi.icon className="size-5 text-primary" />
            <p className="mt-3 font-heading text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">Revenue Trend</h3>
        {isLoading || !data ? (
          <Skeleton className="mt-4 h-64 w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="mt-4 h-64 w-full">
            <AreaChart data={data.revenueByDay}>
              <CartesianGrid vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="_id" tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="revenue" type="monotone" fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" />
            </AreaChart>
          </ChartContainer>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">Top Performing Rooms</h3>
        <div className="mt-4 space-y-3">
          {data?.topRooms.map((tr) => (
            <div key={tr._id} className="flex items-center justify-between border-b border-border pb-3 text-sm">
              <span className="text-foreground">{tr.room.name}</span>
              <span className="text-muted-foreground">{tr.bookings} bookings</span>
              <span className="font-medium text-gradient-gold">{formatINR(tr.revenue)}</span>
            </div>
          ))}
          {data?.topRooms.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
