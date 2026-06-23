"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useWebsiteSettings, useUpdateWebsiteSettings } from "@/hooks/admin/use-admin-settings";
import type { WebsiteSettingsInput } from "@/lib/validations/cms.validation";

export default function AdminCmsPage() {
  const { data: settings, isLoading } = useWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();

  const { register, handleSubmit, reset } = useForm<WebsiteSettingsInput>();

  useEffect(() => {
    if (settings) {
      reset({
        seo: settings.seo,
        socialLinks: settings.socialLinks,
        businessHours: settings.businessHours,
      });
    }
  }, [settings, reset]);

  async function onSubmit(values: WebsiteSettingsInput) {
    try {
      await updateSettings.mutateAsync(values);
      toast.success("Website content updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  if (isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl font-bold text-foreground">Website CMS</h2>
      <p className="mt-1 text-muted-foreground">Manage SEO metadata, social links and business hours text.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="seoTitle">SEO Title</FieldLabel>
            <Input id="seoTitle" {...register("seo.title")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="seoDescription">SEO Description</FieldLabel>
            <Textarea id="seoDescription" rows={3} {...register("seo.description")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="businessHours">Business Hours Text</FieldLabel>
            <Input id="businessHours" {...register("businessHours")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="facebook">Facebook URL</FieldLabel>
            <Input id="facebook" {...register("socialLinks.facebook")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="instagram">Instagram URL</FieldLabel>
            <Input id="instagram" {...register("socialLinks.instagram")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="twitter">Twitter / X URL</FieldLabel>
            <Input id="twitter" {...register("socialLinks.twitter")} />
          </Field>
          <Button
            type="submit"
            disabled={updateSettings.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold sm:w-auto"
          >
            {updateSettings.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
