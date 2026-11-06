"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchJson } from "../lib";
import {
  ConfirmDeleteDialog,
  EmptyState,
  FieldRow,
  LoadingState,
  PageHeader,
  ScrollArea,
} from "../shared";
import type { NavigationItem } from "@/lib/types";

type NavForm = {
  label: string;
  href: string;
  icon: string;
  order: number;
  enabled: boolean;
};

const EMPTY_FORM: NavForm = {
  label: "",
  href: "#",
  icon: "",
  order: 0,
  enabled: true,
};

export function NavigationModule() {
  const [items, setItems] = React.useState<NavigationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NavigationItem | null>(null);
  const [form, setForm] = React.useState<NavForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ navigation: NavigationItem[] }>("/api/admin/navigation")
      .then(({ navigation }) => setItems(navigation))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load navigation items")
      )
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item: NavigationItem) {
    setEditing(item);
    setForm({
      label: item.label,
      href: item.href,
      icon: item.icon ?? "",
      order: item.order,
      enabled: item.enabled,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim() || !form.href.trim()) {
      toast.error("Label and href are required");
      return;
    }
    setSaving(true);
    const payload = {
      label: form.label,
      href: form.href,
      icon: form.icon || null,
      order: form.order,
      enabled: form.enabled,
    };
    try {
      if (editing) {
        await fetchJson<{ item: NavigationItem }>(`/api/admin/navigation/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Navigation item updated");
      } else {
        await fetchJson<{ item: NavigationItem }>("/api/admin/navigation", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Navigation item created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(item: NavigationItem) {
    const next = !item.enabled;
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, enabled: next } : x)));
    try {
      await fetchJson(`/api/admin/navigation/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ enabled: next }),
      });
    } catch (err) {
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, enabled: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/navigation/${deleteId}`, { method: "DELETE" });
      toast.success("Navigation item deleted");
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Navigation"
        description="Manage the navigation links shown in your site header."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add item
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={4} />
          ) : items.length === 0 ? (
            <EmptyState
              title="No navigation items yet"
              description="Add your first navigation link."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add item
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Label</TableHead>
                  <TableHead>Href</TableHead>
                  <TableHead className="hidden md:table-cell">Icon</TableHead>
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[100px]">Enabled</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((i) => (
                  <TableRow key={i.id} className="border-border">
                    <TableCell className="font-medium">{i.label}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i.href}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {i.icon ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{i.order}</TableCell>
                    <TableCell>
                      <Switch checked={i.enabled} onCheckedChange={() => toggleEnabled(i)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(i)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(i.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit navigation item" : "Add navigation item"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the navigation item." : "Create a new navigation item."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldRow label="Label">
              <Input
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Href" hint="Anchor or path, e.g. #home or /contact">
              <Input
                value={form.href}
                onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Icon (Lucide name)">
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Order">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
                  }
                />
              </FieldRow>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label htmlFor="nav-enabled">Enabled</Label>
              <Switch
                id="nav-enabled"
                checked={form.enabled}
                onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Create item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete navigation item?"
        description="This navigation item will be permanently removed."
      />
    </div>
  );
}
