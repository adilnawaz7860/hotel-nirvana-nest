"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { amenitySchema, type AmenityInput } from "@/lib/validations/cms.validation";
import { ICON_OPTIONS, resolveIcon } from "@/lib/icon-map";
import { useCreateAmenity, useUpdateAmenity } from "@/hooks/admin/use-admin-amenities";
import type { Amenity } from "@/types";

export function AmenityFormDialog({
  open,
  onOpenChange,
  amenity,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenity?: Amenity | null;
}) {
  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AmenityInput>({
    resolver: zodResolver(amenitySchema),
    defaultValues: { name: "", icon: "sparkles", category: "hotel", description: "" },
  });

  const selectedIcon = watch("icon");
  const PreviewIcon = resolveIcon(selectedIcon);

  useEffect(() => {
    if (amenity) {
      reset({
        name: amenity.name,
        icon: amenity.icon,
        category: amenity.category,
        description: amenity.description ?? "",
      });
    } else {
      reset({ name: "", icon: "sparkles", category: "hotel", description: "" });
    }
  }, [amenity, reset, open]);

  async function onSubmit(values: AmenityInput) {
    try {
      if (amenity) {
        await updateAmenity.mutateAsync({ id: amenity._id, payload: values });
        toast.success("Amenity updated");
      } else {
        await createAmenity.mutateAsync(values);
        toast.success("Amenity created");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save amenity");
    }
  }

  const isSubmitting = createAmenity.isPending || updateAmenity.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{amenity ? "Edit Amenity" : "Add New Amenity"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" placeholder="e.g. Free Wi-Fi" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(v: string) => ({ hotel: "Hotel", room: "Room", restaurant: "Restaurant" })[v] ?? v}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Icon</FieldLabel>
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PreviewIcon className="size-5" />
                </span>
                <Controller
                  control={control}
                  name="icon"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value: string) =>
                            ICON_OPTIONS.find((opt) => opt.value === value)?.label ?? "Select an icon"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <FieldError errors={[errors.icon]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
              <Textarea id="description" rows={2} {...register("description")} />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : amenity ? "Update Amenity" : "Create Amenity"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
