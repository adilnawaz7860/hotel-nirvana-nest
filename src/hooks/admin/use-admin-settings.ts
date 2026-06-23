"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { WebsiteSettingsInput } from "@/lib/validations/cms.validation";

export type WebsiteSettings = {
  _id: string;
  seo: { title?: string; description?: string };
  socialLinks: { facebook?: string; instagram?: string; twitter?: string };
  businessHours: string;
  taxConfig: { gstPercent: number };
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: {
    fullRefundHoursBefore: number;
    partialRefundHoursBefore: number;
    partialRefundPercent: number;
  };
};

export function useWebsiteSettings() {
  return useQuery({
    queryKey: ["cms-settings"],
    queryFn: async () => (await apiFetch<WebsiteSettings>("/api/cms/settings")).data,
  });
}

export function useUpdateWebsiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: WebsiteSettingsInput) =>
      (await apiFetch<WebsiteSettings>("/api/cms/settings", { method: "PATCH", body: JSON.stringify(payload) })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cms-settings"] }),
  });
}
