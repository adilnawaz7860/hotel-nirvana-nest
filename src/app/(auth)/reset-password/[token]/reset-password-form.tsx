"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth.validation";
import { apiFetch } from "@/lib/api-client";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(values: ResetPasswordInput) {
    try {
      await apiFetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify(values) });
      toast.success("Password reset successful. Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed. The link may have expired.");
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Reset Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <FieldGroup>
          <input type="hidden" {...register("token")} />
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <Input id="password" type="password" {...register("password")} />
            <FieldError errors={[errors.password]} />
          </Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Reset Password"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
