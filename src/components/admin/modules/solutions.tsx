"use client";

import * as React from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
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
import { fetchJson, SOLUTION_PROJECT_STATUSES } from "../lib";
import { ImageUpload } from "../image-upload";
import {
  ConfirmDeleteDialog,
  EmptyState,
  FieldRow,
  LoadingState,
  PageHeader,
  ScrollArea,
} from "../shared";
import type { Solution, SolutionFeature, SolutionImage } from "@/lib/types";

type FeatureDraft = { title: string };
type ImageDraft = { url: string; caption: string };

type SolutionForm = {
  name: string;
  slug: string;
  tagline: string;
  technology: string;
  status: string;
  summary: string;
  description: string;
  demoUrl: string;
  industries: string;
  pricingNote: string;
  order: number;
  visible: boolean;
  features: FeatureDraft[];
  images: ImageDraft[];
};

const EMPTY_FORM: SolutionForm = {
  name: "",
  slug: "",
  tagline: "",
  technology: "",
  status: "Live",
  summary: "",
  description: "",
  demoUrl: "",
  industries: "",
  pricingNote: "",
  order: 0,
  visible: true,
  features: [],
  images: [],
};

const STATUS_STYLES: Record<string, string> = {
  Live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Development: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Coming Soon": "border-primary/30 bg-primary/10 text-primary",
};

export function SolutionsModule() {
  const [solutions, setSolutions] = React.useState<Solution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Solution | null>(null);
  const [form, setForm] = React.useState<SolutionForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ solutions: Solution[] }>("/api/admin/solutions")
      .then(({ solutions }) => setSolutions(solutions))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load solutions")
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

  function openEdit(s: Solution) {
    setEditing(s);
    setForm({
      name: s.name,
      slug: s.slug,
      tagline: s.tagline,
      technology: s.technology,
      status: s.status,
      summary: s.summary,
      description: s.description ?? "",
      demoUrl: s.demoUrl ?? "",
      industries: s.industries ?? "",
      pricingNote: s.pricingNote ?? "",
      order: s.order,
      visible: s.visible,
      features: (s.features ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((f) => ({ title: f.title })),
      images: (s.images ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((img) => ({ url: img.url, caption: img.caption ?? "" })),
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      tagline: form.tagline,
      technology: form.technology,
      status: form.status,
      summary: form.summary,
      description: form.description || null,
      demoUrl: form.demoUrl || null,
      industries: form.industries || null,
      pricingNote: form.pricingNote || null,
      order: form.order,
      visible: form.visible,
      features: form.features.filter((f) => f.title.trim() !== ""),
      images: form.images.filter((i) => i.url.trim() !== ""),
    };
    try {
      if (editing) {
        await fetchJson<{ solution: Solution }>(`/api/admin/solutions/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Solution updated");
      } else {
        await fetchJson<{ solution: Solution }>("/api/admin/solutions", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Solution created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(s: Solution) {
    const next = !s.visible;
    setSolutions((prev) => prev.map((x) => (x.id === s.id ? { ...x, visible: next } : x)));
    try {
      await fetchJson(`/api/admin/solutions/${s.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: next }),
      });
    } catch (err) {
      setSolutions((prev) => prev.map((x) => (x.id === s.id ? { ...x, visible: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/solutions/${deleteId}`, { method: "DELETE" });
      toast.success("Solution deleted");
      setSolutions((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  // feature + image editors
  function addFeature() {
    setForm((f) => ({ ...f, features: [...f.features, { title: "" }] }));
  }
  function updateFeature(i: number, title: string) {
    setForm((f) => ({
      ...f,
      features: f.features.map((x, idx) => (idx === i ? { title } : x)),
    }));
  }
  function removeFeature(i: number) {
    setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  }

  function addImage() {
    setForm((f) => ({ ...f, images: [...f.images, { url: "", caption: "" }] }));
  }
  function updateImage(i: number, patch: Partial<ImageDraft>) {
    setForm((f) => ({
      ...f,
      images: f.images.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    }));
  }
  function removeImage(i: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Solutions"
        description="Manage your ready-made software products and solutions."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add solution
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={5} />
          ) : solutions.length === 0 ? (
            <EmptyState
              title="No solutions yet"
              description="Add your first solution to showcase it on your portfolio."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add solution
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Technology</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[100px]">Visible</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.map((s) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.tagline}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.technology}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[s.status] ?? STATUS_STYLES.Live}
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.order}</TableCell>
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
            <DialogTitle>{editing ? "Edit solution" : "Add solution"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the solution details." : "Create a new ready-made solution."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Name">
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Slug">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated from name"
                />
              </FieldRow>
            </div>
            <FieldRow label="Tagline">
              <Input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Technology">
                <Input
                  value={form.technology}
                  onChange={(e) => setForm((f) => ({ ...f, technology: e.target.value }))}
                  placeholder="Pure PHP + MySQL"
                />
              </FieldRow>
              <FieldRow label="Status">
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOLUTION_PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
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
            <FieldRow label="Description">
              <Textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Demo URL">
                <Input
                  value={form.demoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Pricing note">
                <Input
                  value={form.pricingNote}
                  onChange={(e) => setForm((f) => ({ ...f, pricingNote: e.target.value }))}
                />
              </FieldRow>
            </div>
            <FieldRow label="Industries" hint="One per line.">
              <Textarea
                rows={3}
                value={form.industries}
                onChange={(e) => setForm((f) => ({ ...f, industries: e.target.value }))}
              />
            </FieldRow>

            {/* Features editor */}
            <div className="flex flex-col gap-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" size="sm" variant="outline" onClick={addFeature}>
                  <Plus className="size-4" /> Add feature
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.features.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No features yet.</p>
                ) : (
                  form.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={feat.title}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        placeholder="Feature title"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(i)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Images editor */}
            <div className="flex flex-col gap-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <Label>Images</Label>
                <Button type="button" size="sm" variant="outline" onClick={addImage}>
                  <Plus className="size-4" /> Add image
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {form.images.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No images yet.</p>
                ) : (
                  form.images.map((img, i) => (
                    <div key={i} className="flex flex-col gap-2 rounded-md border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <ImageUpload
                          value={img.url || null}
                          onChange={(v) => updateImage(i, { url: v ?? "" })}
                          label={`Image ${i + 1}`}
                          hideUrlField
                          size={56}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(i)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        value={img.caption}
                        onChange={(e) => updateImage(i, { caption: e.target.value })}
                        placeholder="Caption (optional)"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

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
                <Label htmlFor="solution-visible">Visible</Label>
                <Switch
                  id="solution-visible"
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
                {saving ? "Saving..." : editing ? "Save changes" : "Create solution"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete solution?"
        description="This solution along with its features and images will be permanently removed."
      />
    </div>
  );
}

// Re-exported types for type-only usage elsewhere if needed
export type { SolutionFeature, SolutionImage };
