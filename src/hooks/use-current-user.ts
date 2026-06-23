"use client";

import { useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "staff" | "admin";
  avatarUrl?: string;
};

async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.user ?? null;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 60 * 1000,
  });
}
