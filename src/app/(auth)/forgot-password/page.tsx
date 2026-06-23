"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth.validation";
import { apiFetch } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      await apiFetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(values) });
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 font-heading text-xl font-bold text-foreground">Check Your Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a password reset link.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Forgot Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...register("email")} />
            <FieldError errors={[errors.email]} />
          </Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
