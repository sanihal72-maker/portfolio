"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { fetchJson, type SeoSetting } from "../lib";
import { ImageUpload } from "../image-upload";
import {
  ConfirmDeleteDialog,
  EmptyState,
  FieldRow,
  LoadingState,
  PageHeader,
  ScrollArea,
} from "../shared";

type SeoForm = {
  page: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImageUrl: string | null;
  robots: string;
};

const EMPTY_FORM: SeoForm = {
  page: "",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImageUrl: null,
  robots: "index, follow",
};

export function SeoModule() {
  const [settings, setSettings] = React.useState<SeoSetting[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SeoSetting | null>(null);
  const [form, setForm] = React.useState<SeoForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ seo: SeoSetting[] }>("/api/admin/seo")
      .then(({ seo }) => setSettings(seo))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load SEO settings")
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

  function openEdit(s: SeoSetting) {
    setEditing(s);
    setForm({
      page: s.page,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      canonicalUrl: s.canonicalUrl ?? "",
      ogImageUrl: s.ogImageUrl ?? null,
      robots: s.robots,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.page.trim()) {
      toast.error("Page is required");
      return;
    }
    setSaving(true);
    const payload = {
      page: form.page,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      canonicalUrl: form.canonicalUrl || null,
      ogImageUrl: form.ogImageUrl,
      robots: form.robots,
    };
    try {
      if (editing) {
        await fetchJson<{ seo: SeoSetting }>(`/api/admin/seo/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("SEO setting updated");
      } else {
        await fetchJson<{ seo: SeoSetting }>("/api/admin/seo", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("SEO setting created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/seo/${deleteId}`, { method: "DELETE" });
      toast.success("SEO setting deleted");
      setSettings((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SEO Management"
        description="Manage per-page meta titles, descriptions and Open Graph images."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add SEO setting
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={4} />
          ) : settings.length === 0 ? (
            <EmptyState
              title="No SEO settings yet"
              description="Add SEO metadata for your pages."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add SEO setting
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Page</TableHead>
                  <TableHead>Meta title</TableHead>
                  <TableHead className="hidden md:table-cell">Robots</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((s) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {s.page}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[360px] truncate text-muted-foreground">
                      {s.metaTitle || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.robots}
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
            <DialogTitle>
              {editing ? "Edit SEO setting" : "Add SEO setting"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the page SEO metadata."
                : "Create SEO metadata for a page."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldRow label="Page" hint="A unique key, e.g. home, about, services.">
              <Input
                value={form.page}
                onChange={(e) => setForm((f) => ({ ...f, page: e.target.value }))}
                placeholder="home"
                disabled={!!editing}
              />
            </FieldRow>
            <FieldRow label="Meta title">
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
              />
            </FieldRow>
            <FieldRow label="Meta description">
              <Textarea
                rows={3}
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, metaDescription: e.target.value }))
                }
              />
            </FieldRow>
            <FieldRow label="Canonical URL">
              <Input
                value={form.canonicalUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, canonicalUrl: e.target.value }))
                }
                placeholder="https://aryadev.com/page"
              />
            </FieldRow>
            <FieldRow label="OG image">
              <ImageUpload
                value={form.ogImageUrl}
                onChange={(v) => setForm((f) => ({ ...f, ogImageUrl: v }))}
                label="Open Graph image"
              />
            </FieldRow>
            <FieldRow label="Robots" hint="e.g. index, follow or noindex, nofollow">
              <Input
                value={form.robots}
                onChange={(e) => setForm((f) => ({ ...f, robots: e.target.value }))}
              />
            </FieldRow>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Create setting"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete SEO setting?"
        description="This SEO setting will be permanently removed."
      />
    </div>
  );
}
