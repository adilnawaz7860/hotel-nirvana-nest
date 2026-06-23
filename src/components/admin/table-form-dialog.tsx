"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTableSchema, type CreateTableInput } from "@/lib/validations/reservation.validation";
import { TABLE_TYPES, TABLE_TYPE_LABELS } from "@/lib/constants";
import { useCreateTable, useUpdateTable } from "@/hooks/admin/use-admin-tables";
import type { RestaurantTable } from "@/types";

export function TableFormDialog({
  open,
  onOpenChange,
  table,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: RestaurantTable | null;
}) {
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTableInput>({
    resolver: zodResolver(createTableSchema),
    defaultValues: { tableNumber: "", tableType: "4_seater", capacity: 4, location: "indoor", isActive: true },
  });

  useEffect(() => {
    if (table) {
      reset(table);
    } else {
      reset({ tableNumber: "", tableType: "4_seater", capacity: 4, location: "indoor", isActive: true });
    }
  }, [table, reset, open]);

  async function onSubmit(values: CreateTableInput) {
    try {
      if (table) {
        await updateTable.mutateAsync({ id: table._id, payload: values });
        toast.success("Table updated");
      } else {
        await createTable.mutateAsync(values);
        toast.success("Table created");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save table");
    }
  }

  const isSubmitting = createTable.isPending || updateTable.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{table ? "Edit Table" : "Add New Table"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tableNumber">Table Number</FieldLabel>
              <Input id="tableNumber" {...register("tableNumber")} />
              <FieldError errors={[errors.tableNumber]} />
            </Field>
            <Field>
              <FieldLabel>Table Type</FieldLabel>
              <Controller
                control={control}
                name="tableType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{(v: keyof typeof TABLE_TYPE_LABELS) => TABLE_TYPE_LABELS[v]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TABLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {TABLE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
              <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} />
              <FieldError errors={[errors.capacity]} />
            </Field>
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(v: string) => ({ indoor: "Indoor", outdoor: "Outdoor", private: "Private" })[v] ?? v}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : table ? "Update Table" : "Create Table"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
