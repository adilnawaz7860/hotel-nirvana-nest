"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useWebsiteSettings, useUpdateWebsiteSettings } from "@/hooks/admin/use-admin-settings";
import type { WebsiteSettingsInput } from "@/lib/validations/cms.validation";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();

  const { register, handleSubmit, reset } = useForm<WebsiteSettingsInput>();

  useEffect(() => {
    if (settings) {
      reset({
        checkInTime: settings.checkInTime,
        checkOutTime: settings.checkOutTime,
        taxConfig: settings.taxConfig,
        cancellationPolicy: settings.cancellationPolicy,
      });
    }
  }, [settings, reset]);

  async function onSubmit(values: WebsiteSettingsInput) {
    try {
      await updateSettings.mutateAsync(values);
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  if (isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl font-bold text-foreground">Settings</h2>
      <p className="mt-1 text-muted-foreground">Configure hotel policies and operating hours.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="checkInTime">Check-in Time</FieldLabel>
              <Input id="checkInTime" type="time" {...register("checkInTime")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkOutTime">Check-out Time</FieldLabel>
              <Input id="checkOutTime" type="time" {...register("checkOutTime")} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="gstPercent">GST / Tax Percentage</FieldLabel>
            <Input id="gstPercent" type="number" {...register("taxConfig.gstPercent")} />
          </Field>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Cancellation Policy</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="fullRefundHoursBefore">Full Refund (hrs before)</FieldLabel>
                <Input id="fullRefundHoursBefore" type="number" {...register("cancellationPolicy.fullRefundHoursBefore")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="partialRefundHoursBefore">Partial Refund (hrs before)</FieldLabel>
                <Input id="partialRefundHoursBefore" type="number" {...register("cancellationPolicy.partialRefundHoursBefore")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="partialRefundPercent">Partial Refund %</FieldLabel>
                <Input id="partialRefundPercent" type="number" {...register("cancellationPolicy.partialRefundPercent")} />
              </Field>
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateSettings.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold sm:w-auto"
          >
            {updateSettings.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Settings"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
