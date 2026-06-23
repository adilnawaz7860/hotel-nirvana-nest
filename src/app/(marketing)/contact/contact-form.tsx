"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { contactQuerySchema, type ContactQueryInput } from "@/lib/validations/contact.validation";
import { apiFetch } from "@/lib/api-client";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactQueryInput>({ resolver: zodResolver(contactQuerySchema) });

  async function onSubmit(values: ContactQueryInput) {
    try {
      await apiFetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
      toast.success("Thank you! We'll get back to you shortly.");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send your message");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
          <Input id="phone" {...register("phone")} />
          <FieldError errors={[errors.phone]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="subject">Subject</FieldLabel>
          <Input id="subject" {...register("subject")} />
          <FieldError errors={[errors.subject]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" rows={5} {...register("message")} />
          <FieldError errors={[errors.message]} />
        </Field>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Send Message"}
        </Button>
      </FieldGroup>
    </form>
  );
}
