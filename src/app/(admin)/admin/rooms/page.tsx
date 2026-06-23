"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { RoomFormDialog } from "@/components/admin/room-form-dialog";
import { useAdminRooms, useDeleteRoom } from "@/hooks/admin/use-admin-rooms";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { formatINR } from "@/lib/utils/pricing";
import type { Room } from "@/types";

export default function AdminRoomsPage() {
  const { data, isLoading } = useAdminRooms();
  const deleteRoom = useDeleteRoom();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleAdd() {
    setEditingRoom(null);
    setFormOpen(true);
  }

  function handleEdit(room: Room) {
    setEditingRoom(room);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteRoom.mutateAsync(deleteId);
      toast.success("Room removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove room");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Room Management</h2>
          <p className="mt-1 text-muted-foreground">Add, edit and manage hotel rooms.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold">
          <Plus className="size-4" /> Add Room
        </Button>
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
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{room.name}</p>
                    <p className="text-xs text-muted-foreground">No. {room.roomNumber}</p>
                  </TableCell>
                  <TableCell>{ROOM_TYPE_LABELS[room.roomType]}</TableCell>
                  <TableCell>{formatINR(room.pricePerNight)}</TableCell>
                  <TableCell>
                    {room.capacity.adults} Adults, {room.capacity.children} Children
                  </TableCell>
                  <TableCell>
                    <Badge className={room.isActive ? "bg-emerald-500/15 text-emerald-400 border-none" : "bg-muted text-muted-foreground border-none"}>
                      {room.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(room)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(room._id)} className="text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <RoomFormDialog open={formOpen} onOpenChange={setFormOpen} room={editingRoom} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this room?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the room as inactive and remove it from public listings. Existing bookings are not affected.
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
