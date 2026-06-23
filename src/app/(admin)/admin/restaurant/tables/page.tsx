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
import { Skeleton } from "@/components/ui/skeleton";
import { TableFormDialog } from "@/components/admin/table-form-dialog";
import { useAdminTables, useDeleteTable } from "@/hooks/admin/use-admin-tables";
import { TABLE_TYPE_LABELS } from "@/lib/constants";
import type { RestaurantTable } from "@/types";

export default function AdminTablesPage() {
  const { data: tables, isLoading } = useAdminTables();
  const deleteTable = useDeleteTable();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);

  function handleAdd() {
    setEditingTable(null);
    setFormOpen(true);
  }

  function handleEdit(table: RestaurantTable) {
    setEditingTable(table);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await deleteTable.mutateAsync(id);
      toast.success("Table removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove table");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Table Management</h2>
          <p className="mt-1 text-muted-foreground">Manage restaurant seating and table types.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold">
          <Plus className="size-4" /> Add Table
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
                <TableHead>Table No.</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables?.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.tableNumber}</TableCell>
                  <TableCell>{TABLE_TYPE_LABELS[t.tableType]}</TableCell>
                  <TableCell>{t.capacity}</TableCell>
                  <TableCell className="capitalize">{t.location}</TableCell>
                  <TableCell>
                    <Badge className={t.isActive ? "bg-emerald-500/15 text-emerald-400 border-none" : "bg-muted text-muted-foreground border-none"}>
                      {t.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(t)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(t._id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <TableFormDialog open={formOpen} onOpenChange={setFormOpen} table={editingTable} />
    </div>
  );
}
