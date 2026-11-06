"use client";

import * as React from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Category, Service } from "@/lib/types";

type ServiceForm = {
  number: number;
  title: string;
  slug: string;
  icon: string;
  summary: string;
  content: string;
  features: string;
  featured: boolean;
  order: number;
  visible: boolean;
  categoryId: string;
};

const EMPTY_FORM: ServiceForm = {
  number: 0,
  title: "",
  slug: "",
  icon: "Sparkles",
  summary: "",
  content: "",
  features: "",
  featured: false,
  order: 0,
  visible: true,
  categoryId: "",
};

export function ServicesModule() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [form, setForm] = React.useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchJson<{ services: Service[] }>("/api/admin/services"),
      fetchJson<{ categories: Category[] }>("/api/admin/categories"),
    ])
      .then(([s, c]) => {
        setServices(s.services);
        setCategories(c.categories);
      })
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load services")
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

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      number: s.number,
      title: s.title,
      slug: s.slug,
      icon: s.icon,
      summary: s.summary,
      content: s.content ?? "",
      features: s.features ?? "",
      featured: s.featured,
      order: s.order,
      visible: s.visible,
      categoryId: s.categoryId ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = { ...form, categoryId: form.categoryId || null };
    try {
      if (editing) {
        await fetchJson<{ service: Service }>(`/api/admin/services/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Service updated");
      } else {
        await fetchJson<{ service: Service }>("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Service created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(s: Service) {
    const next = !s.visible;
    setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, visible: next } : x)));
    try {
      await fetchJson(`/api/admin/services/${s.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: next }),
      });
    } catch (err) {
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, visible: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/services/${deleteId}`, { method: "DELETE" });
      toast.success("Service deleted");
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  const categoryLabel = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Services"
        description="Manage the services you offer to clients."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add service
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={5} />
          ) : services.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Add your first service to showcase what you offer."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add service
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Featured</TableHead>
                  <TableHead className="w-[100px]">Visible</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {String(s.number).padStart(2, "0")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{s.title}</span>
                        <span className="text-xs text-muted-foreground">{s.icon}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.slug}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {categoryLabel(s.categoryId)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {s.featured ? (
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                          <Star className="size-3" /> Featured
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch checked={s.visible} onCheckedChange={() => toggleVisible(s)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the service details."
                : "Create a new service entry."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Number">
                <Input
                  type="number"
                  value={form.number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, number: Number(e.target.value) || 0 }))
                  }
                />
              </FieldRow>
              <FieldRow label="Icon (Lucide)">
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                />
              </FieldRow>
            </div>
            <FieldRow label="Title">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Slug">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated from title"
                />
              </FieldRow>
              <FieldRow label="Category">
                <Select
                  value={form.categoryId || "__none"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, categoryId: v === "__none" ? "" : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
            <FieldRow label="Summary">
              <Textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Content (detailed)">
              <Textarea
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Features" hint="One feature per line.">
              <Textarea
                rows={4}
                value={form.features}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-3 gap-4">
              <FieldRow label="Order">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
                  }
                />
              </FieldRow>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="service-featured">Featured</Label>
                <Switch
                  id="service-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="service-visible">Visible</Label>
                <Switch
                  id="service-visible"
                  checked={form.visible}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, visible: v }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Create service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete service?"
        description="This service will be permanently removed."
      />
    </div>
  );
}
