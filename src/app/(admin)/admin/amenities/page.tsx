"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AmenityFormDialog } from "@/components/admin/amenity-form-dialog";
import { useAdminAmenities, useDeleteAmenity } from "@/hooks/admin/use-admin-amenities";
import { resolveIcon } from "@/lib/icon-map";
import type { Amenity } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  hotel: "Hotel",
  room: "Room",
  restaurant: "Restaurant",
};

export default function AdminAmenitiesPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: amenities, isLoading } = useAdminAmenities(category);
  const deleteAmenity = useDeleteAmenity();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleAdd() {
    setEditingAmenity(null);
    setFormOpen(true);
  }

  function handleEdit(amenity: Amenity) {
    setEditingAmenity(amenity);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteAmenity.mutateAsync(deleteId);
      toast.success("Amenity removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove amenity");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Amenities Management</h2>
          <p className="mt-1 text-muted-foreground">
            Manage the amenities shown on the homepage and room detail pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={category ?? "all"} onValueChange={(v) => setCategory(!v || v === "all" ? undefined : v)}>
            <SelectTrigger className="w-40">
              <SelectValue>{(v: string) => (v === "all" ? "All Categories" : CATEGORY_LABELS[v] ?? v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold">
            <Plus className="size-4" /> Add Amenity
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amenities?.map((a) => {
                const Icon = resolveIcon(a.icon);
                return (
                  <TableRow key={a._id}>
                    <TableCell>
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>
                      <Badge className="border-none bg-muted text-muted-foreground">
                        {CATEGORY_LABELS[a.category] ?? a.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {a.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(a)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => setDeleteId(a._id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {amenities?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No amenities yet. Click &ldquo;Add Amenity&rdquo; to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AmenityFormDialog open={formOpen} onOpenChange={setFormOpen} amenity={editingAmenity} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this amenity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove it from the homepage and any rooms it&apos;s attached to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
