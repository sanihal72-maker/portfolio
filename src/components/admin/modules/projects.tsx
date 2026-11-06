"use client";

import * as React from "react";
import { GripVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import type { Project, ProjectImage } from "@/lib/types";

type ImageDraft = { url: string; caption: string };

type ProjectForm = {
  title: string;
  slug: string;
  categoryName: string;
  technology: string;
  status: string;
  summary: string;
  objectives: string;
  features: string;
  devDetails: string;
  demoUrl: string;
  githubUrl: string;
  thumbnail: string | null;
  featured: boolean;
  order: number;
  visible: boolean;
  images: ImageDraft[];
};

const EMPTY_FORM: ProjectForm = {
  title: "",
  slug: "",
  categoryName: "",
  technology: "",
  status: "Live",
  summary: "",
  objectives: "",
  features: "",
  devDetails: "",
  demoUrl: "",
  githubUrl: "",
  thumbnail: null,
  featured: false,
  order: 0,
  visible: true,
  images: [],
};

const STATUS_STYLES: Record<string, string> = {
  Live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Development: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Coming Soon": "border-primary/30 bg-primary/10 text-primary",
};

export function ProjectsModule() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [form, setForm] = React.useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ projects: Project[] }>("/api/admin/projects")
      .then(({ projects }) => setProjects(projects))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load projects")
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

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      categoryName: p.categoryName,
      technology: p.technology,
      status: p.status,
      summary: p.summary,
      objectives: p.objectives ?? "",
      features: p.features ?? "",
      devDetails: p.devDetails ?? "",
      demoUrl: p.demoUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      thumbnail: p.thumbnail ?? null,
      featured: p.featured,
      order: p.order,
      visible: p.visible,
      images: (p.images ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((img) => ({ url: img.url, caption: img.caption ?? "" })),
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
    const payload = {
      title: form.title,
      slug: form.slug,
      categoryName: form.categoryName,
      technology: form.technology,
      status: form.status,
      summary: form.summary,
      objectives: form.objectives || null,
      features: form.features || null,
      devDetails: form.devDetails || null,
      demoUrl: form.demoUrl || null,
      githubUrl: form.githubUrl || null,
      thumbnail: form.thumbnail,
      featured: form.featured,
      order: form.order,
      visible: form.visible,
      images: form.images.filter((i) => i.url.trim() !== ""),
    };
    try {
      if (editing) {
        await fetchJson<{ project: Project }>(`/api/admin/projects/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Project updated");
      } else {
        await fetchJson<{ project: Project }>("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Project created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(p: Project) {
    const next = !p.visible;
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, visible: next } : x)));
    try {
      await fetchJson(`/api/admin/projects/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: next }),
      });
    } catch (err) {
      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, visible: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
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
        title="Projects"
        description="Manage your project showcase and case studies."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add project
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={5} />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Add your first project to showcase your work."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add project
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Technology</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Featured</TableHead>
                  <TableHead className="w-[100px]">Visible</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="size-10 rounded-md border border-border object-cover"
                          />
                        ) : null}
                        <div className="flex flex-col">
                          <span className="font-medium">{p.title}</span>
                          <span className="text-xs text-muted-foreground">{p.slug}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {p.categoryName || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {p.technology || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[p.status] ?? STATUS_STYLES.Live}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {p.featured ? (
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                          <Star className="size-3" /> Featured
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch checked={p.visible} onCheckedChange={() => toggleVisible(p)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}>
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
            <DialogTitle>{editing ? "Edit project" : "Add project"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the project details." : "Create a new project entry."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Title">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="Slug">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated from title"
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Category name">
                <Input
                  value={form.categoryName}
                  onChange={(e) => setForm((f) => ({ ...f, categoryName: e.target.value }))}
                  placeholder="E-commerce"
                />
              </FieldRow>
              <FieldRow label="Technology">
                <Input
                  value={form.technology}
                  onChange={(e) => setForm((f) => ({ ...f, technology: e.target.value }))}
                />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <FieldRow label="Summary">
              <Textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Objectives">
              <Textarea
                rows={3}
                value={form.objectives}
                onChange={(e) => setForm((f) => ({ ...f, objectives: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Features" hint="One feature per line.">
              <Textarea
                rows={4}
                value={form.features}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Development details">
              <Textarea
                rows={3}
                value={form.devDetails}
                onChange={(e) => setForm((f) => ({ ...f, devDetails: e.target.value }))}
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Demo URL">
                <Input
                  value={form.demoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))}
                />
              </FieldRow>
              <FieldRow label="GitHub URL">
                <Input
                  value={form.githubUrl}
                  onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                />
              </FieldRow>
            </div>
            <FieldRow label="Thumbnail">
              <ImageUpload
                value={form.thumbnail}
                onChange={(v) => setForm((f) => ({ ...f, thumbnail: v }))}
                label="Project thumbnail"
              />
            </FieldRow>

            {/* Images editor */}
            <div className="flex flex-col gap-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <Label>Gallery images</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="project-featured">Featured</Label>
                <Switch
                  id="project-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="project-visible">Visible</Label>
                <Switch
                  id="project-visible"
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
                {saving ? "Saving..." : editing ? "Save changes" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete project?"
        description="This project along with its images will be permanently removed."
      />
    </div>
  );
}

export type { ProjectImage };
