"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { AuthUser } from "@/types";

export function useAdminCustomers(params: { search?: string; page?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", "20");

  return useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: async () => apiFetch<AuthUser[]>(`/api/admin/customers?${searchParams.toString()}`),
  });
}
