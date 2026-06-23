"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createRoomSchema, type CreateRoomInput } from "@/lib/validations/room.validation";
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/lib/constants";
import { useCreateRoom, useUpdateRoom } from "@/hooks/admin/use-admin-rooms";
import { uploadToCloudinary } from "@/lib/storage/upload-client";
import { SafeImage } from "@/components/shared/safe-image";
import type { Room } from "@/types";

export function RoomFormDialog({
  open,
  onOpenChange,
  room,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
}) {
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      roomNumber: "",
      roomType: "deluxe",
      description: "",
      capacity: { adults: 2, children: 0 },
      pricePerNight: 0,
      discountPercent: 0,
      images: [],
      amenities: [],
      isActive: true,
    },
  });

  const images = watch("images");

  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        description: room.description,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        discountPercent: room.discountPercent,
        size: room.size,
        floor: room.floor,
        images: room.images,
        amenities: room.amenities.map((a) => a._id),
        isActive: room.isActive,
      });
    } else {
      reset({
        name: "",
        roomNumber: "",
        roomType: "deluxe",
        description: "",
        capacity: { adults: 2, children: 0 },
        pricePerNight: 0,
        discountPercent: 0,
        images: [],
        amenities: [],
        isActive: true,
      });
    }
  }, [room, reset, open]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file, "nirvana-nest/rooms"))
      );
      setValue("images", [...(images ?? []), ...uploaded.map((u) => ({ ...u, alt: "" }))]);
    } catch {
      toast.error("Image upload failed. Check Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setValue("images", images?.filter((_, i) => i !== index) ?? []);
  }

  async function onSubmit(values: CreateRoomInput) {
    try {
      if (room) {
        await updateRoom.mutateAsync({ id: room._id, payload: values });
        toast.success("Room updated");
      } else {
        await createRoom.mutateAsync(values);
        toast.success("Room created");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save room");
    }
  }

  const isSubmitting = createRoom.isPending || updateRoom.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Room Name</FieldLabel>
                <Input id="name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="roomNumber">Room Number</FieldLabel>
                <Input id="roomNumber" {...register("roomNumber")} />
                <FieldError errors={[errors.roomNumber]} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Room Type</FieldLabel>
                <Controller
                  control={control}
                  name="roomType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>{(v: keyof typeof ROOM_TYPE_LABELS) => ROOM_TYPE_LABELS[v]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {ROOM_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="pricePerNight">Price Per Night (INR)</FieldLabel>
                <Input id="pricePerNight" type="number" {...register("pricePerNight", { valueAsNumber: true })} />
                <FieldError errors={[errors.pricePerNight]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" rows={3} {...register("description")} />
              <FieldError errors={[errors.description]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="adults">Adults</FieldLabel>
                <Input id="adults" type="number" {...register("capacity.adults", { valueAsNumber: true })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="childrenCap">Children</FieldLabel>
                <Input id="childrenCap" type="number" {...register("capacity.children", { valueAsNumber: true })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="size">Size (sq.ft)</FieldLabel>
                <Input id="size" type="number" {...register("size", { valueAsNumber: true })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="discountPercent">Discount %</FieldLabel>
                <Input id="discountPercent" type="number" {...register("discountPercent", { valueAsNumber: true })} />
              </Field>
            </div>

            <Field>
              <FieldLabel>Images</FieldLabel>
              <div className="flex flex-wrap gap-3">
                {images?.map((img, i) => (
                  <div key={img.publicId || i} className="relative size-20 overflow-hidden rounded-lg border border-border">
                    <SafeImage src={img.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-0.5 top-0.5 rounded-full bg-background/80 p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  <span className="text-[10px]">Upload</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor="isActive">Active (visible for booking)</FieldLabel>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting || uploading}
              className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : room ? "Update Room" : "Create Room"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
