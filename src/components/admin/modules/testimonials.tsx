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
import { fetchJson, formatDate } from "../lib";
import { ImageUpload } from "../image-upload";
import {
  ConfirmDeleteDialog,
  EmptyState,
  FieldRow,
  LoadingState,
  PageHeader,
  ScrollArea,
} from "../shared";
import type { Testimonial } from "@/lib/types";

type TestimonialForm = {
  clientName: string;
  designation: string;
  business: string;
  review: string;
  rating: number;
  date: string;
  projectRef: string;
  screenshotUrl: string | null;
  photoUrl: string | null;
  visible: boolean;
  order: number;
};

const EMPTY_FORM: TestimonialForm = {
  clientName: "",
  designation: "",
  business: "",
  review: "",
  rating: 5,
  date: "",
  projectRef: "",
  screenshotUrl: null,
  photoUrl: null,
  visible: true,
  order: 0,
};

function toDateInput(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function TestimonialsModule() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [form, setForm] = React.useState<TestimonialForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ testimonials: Testimonial[] }>("/api/admin/testimonials")
      .then(({ testimonials }) => setTestimonials(testimonials))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load testimonials")
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

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      designation: t.designation,
      business: t.business ?? "",
      review: t.review,
      rating: t.rating,
      date: toDateInput(t.date),
      projectRef: t.projectRef ?? "",
      screenshotUrl: t.screenshotUrl ?? null,
      photoUrl: t.photoUrl ?? null,
      visible: t.visible,
      order: t.order,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.review.trim()) {
      toast.error("Client name and review are required");
      return;
    }
    setSaving(true);
    const payload = {
      clientName: form.clientName,
      designation: form.designation,
      business: form.business || null,
      review: form.review,
      rating: form.rating,
      date: form.date || null,
      projectRef: form.projectRef || null,
      screenshotUrl: form.screenshotUrl,
      photoUrl: form.photoUrl,
      visible: form.visible,
      order: form.order,
    };
    try {
      if (editing) {
        await fetchJson<{ testimonial: Testimonial }>(
          `/api/admin/testimonials/${editing.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        toast.success("Testimonial updated");
      } else {
        await fetchJson<{ testimonial: Testimonial }>("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Testimonial created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(t: Testimonial) {
    const next = !t.visible;
    setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, visible: next } : x)));
    try {
      await fetchJson(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: next }),
      });
    } catch (err) {
      setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, visible: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      toast.success("Testimonial deleted");
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimonials"
        description="Manage client reviews and testimonials shown on your site."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add testimonial
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={5} />
          ) : testimonials.length === 0 ? (
            <EmptyState
              title="No testimonials yet"
              description="Add your first testimonial to build social proof."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add testimonial
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Designation</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="w-[100px]">Visible</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {t.photoUrl ? (
                          <img
                            src={t.photoUrl}
                            alt={t.clientName}
                            className="size-8 rounded-full border border-border object-cover"
                          />
                        ) : null}
                        <div className="flex flex-col">
                          <span className="font-medium">{t.clientName}</span>
                          {t.business ? (
                            <span className="text-xs text-muted-foreground">{t.business}</span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {t.designation}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        <Star className="size-3" /> {t.rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {t.projectRef ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(t.date)}
                    </TableCell>
                    <TableCell>
                      <Switch checked={t.visible} onCheckedChange={() => toggleVisible(t)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}>
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
            <DialogTitle>{editing ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the testimonial details." : "Create a new testimonial."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Client name">
                <Input
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Designation">
                <Input
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Business">
                <Input
                  value={form.business}
                  onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Project reference">
                <Input
                  value={form.projectRef}
                  onChange={(e) => setForm((f) => ({ ...f, projectRef: e.target.value }))}
                  placeholder="Related project title"
                />
              </FieldRow>
            </div>
            <FieldRow label="Review">
              <Textarea
                rows={4}
                value={form.review}
                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Rating">
                <Select
                  value={String(form.rating)}
                  onValueChange={(v) => setForm((f) => ({ ...f, rating: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} star{r > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Date">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Client photo">
                <ImageUpload
                  value={form.photoUrl}
                  onChange={(v) => setForm((f) => ({ ...f, photoUrl: v }))}
                  label="Photo"
                  size={64}
                />
              </FieldRow>
              <FieldRow label="Screenshot (original review)">
                <ImageUpload
                  value={form.screenshotUrl}
                  onChange={(v) => setForm((f) => ({ ...f, screenshotUrl: v }))}
                  label="Screenshot"
                  size={64}
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="testimonial-visible">Visible</Label>
                <Switch
                  id="testimonial-visible"
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
                {saving ? "Saving..." : editing ? "Save changes" : "Create testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete testimonial?"
        description="This testimonial will be permanently removed."
      />
    </div>
  );
}
