"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type AnalyticsOverview = {
  totalRevenue: number;
  bookingsCount: number;
  reservationsCount: number;
  activeRoomsCount: number;
  customersCount: number;
  bookingsByStatus: { _id: string; count: number }[];
  revenueByDay: { _id: string; revenue: number; bookings: number }[];
  topRooms: { _id: string; bookings: number; revenue: number; room: { name: string } }[];
};

export function useAdminAnalytics(range = 30) {
  return useQuery({
    queryKey: ["admin", "analytics", range],
    queryFn: async () => (await apiFetch<AnalyticsOverview>(`/api/admin/analytics?range=${range}`)).data,
  });
}
