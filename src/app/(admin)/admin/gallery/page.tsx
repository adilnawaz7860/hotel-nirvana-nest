"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/shared/safe-image";
import { useAdminGallery, useCreateGalleryItem, useDeleteGalleryItem } from "@/hooks/admin/use-admin-gallery";
import { uploadToCloudinary } from "@/lib/storage/upload-client";

const CATEGORIES = ["rooms", "restaurant", "exterior", "events", "amenities"] as const;

export default function AdminGalleryPage() {
  const [category, setCategory] = useState<string>("rooms");
  const { data: items, isLoading } = useAdminGallery();
  const createItem = useCreateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadToCloudinary(file, "nirvana-nest/gallery");
        await createItem.mutateAsync({
          title: file.name.split(".")[0] || "Hotel Nirvana Nest",
          category: category as (typeof CATEGORIES)[number],
          imageUrl: uploaded.url,
          publicId: uploaded.publicId,
          isFeatured: false,
          order: 0,
        });
      }
      toast.success("Images uploaded");
    } catch {
      toast.error("Upload failed. Check Cloudinary configuration.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Image removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove image");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Gallery Management</h2>
          <p className="mt-1 text-muted-foreground">Upload and organize photos shown on the public gallery.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="w-40">
              <SelectValue className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label>
            <Button
              className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
              disabled={uploading}
              nativeButton={false}
              render={
                <span>
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload
                </span>
              }
            />
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        {items?.map((item) => (
          <div key={item._id} className="group relative h-40 overflow-hidden rounded-xl border border-border">
            <SafeImage src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover" />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-background/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs text-foreground">{item.category}</span>
              <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(item._id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
