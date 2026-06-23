"use client";

import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  UtensilsCrossed,
  Table2,
  ImageIcon,
  Star,
  Users,
  FileEdit,
  Sparkles,
  Settings as SettingsIcon,
} from "lucide-react";
import { DashboardShell, type ShellNavItem } from "@/components/layout/dashboard-shell";

const navItems: ShellNavItem[] = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/restaurant/tables", label: "Tables", icon: Table2 },
  { href: "/admin/restaurant/reservations", label: "Reservations", icon: UtensilsCrossed },
  { href: "/admin/amenities", label: "Amenities", icon: Sparkles },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/cms", label: "Website CMS", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} title="Admin Panel" brandHref="/admin">
      {children}
    </DashboardShell>
  );
}
