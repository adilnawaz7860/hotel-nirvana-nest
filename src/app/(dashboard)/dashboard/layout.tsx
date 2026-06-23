"use client";

import { LayoutDashboard, User, BedDouble, UtensilsCrossed, Heart, Star } from "lucide-react";
import { DashboardShell, type ShellNavItem } from "@/components/layout/dashboard-shell";

const navItems: ShellNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/bookings", label: "Room Bookings", icon: BedDouble },
  { href: "/dashboard/reservations", label: "Table Reservations", icon: UtensilsCrossed },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} title="My Account">
      {children}
    </DashboardShell>
  );
}
