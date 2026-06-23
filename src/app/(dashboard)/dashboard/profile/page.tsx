"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/use-current-user";
import { apiFetch } from "@/lib/api-client";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
});
type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: { name: "", phone: "" } });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone });
  }, [user, reset]);

  async function onSubmit(values: ProfileInput) {
    try {
      await apiFetch("/api/users/me", { method: "PATCH", body: JSON.stringify(values) });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="font-heading text-2xl font-bold text-foreground">Profile</h2>
      <p className="mt-1 text-muted-foreground">Manage your personal information.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input value={user?.email ?? ""} disabled />
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" {...register("name")} />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" {...register("phone")} />
            <FieldError errors={[errors.phone]} />
          </Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
