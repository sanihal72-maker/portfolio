"use client";

import * as React from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
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
import type { SocialLink } from "@/lib/types";

type SocialForm = {
  platform: string;
  label: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
};

const EMPTY_FORM: SocialForm = {
  platform: "",
  label: "",
  url: "",
  icon: "Link",
  enabled: true,
  order: 0,
};

export function SocialsModule() {
  const [socials, setSocials] = React.useState<SocialLink[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SocialLink | null>(null);
  const [form, setForm] = React.useState<SocialForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ socials: SocialLink[] }>("/api/admin/socials")
      .then(({ socials }) => setSocials(socials))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load social links")
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

  function openEdit(s: SocialLink) {
    setEditing(s);
    setForm({
      platform: s.platform,
      label: s.label,
      url: s.url,
      icon: s.icon,
      enabled: s.enabled,
      order: s.order,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.platform.trim() || !form.url.trim()) {
      toast.error("Platform and URL are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await fetchJson<{ social: SocialLink }>(`/api/admin/socials/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Social link updated");
      } else {
        await fetchJson<{ social: SocialLink }>("/api/admin/socials", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Social link created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(s: SocialLink) {
    const next = !s.enabled;
    setSocials((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled: next } : x)));
    try {
      await fetchJson(`/api/admin/socials/${s.id}`, {
        method: "PUT",
        body: JSON.stringify({ enabled: next }),
      });
    } catch (err) {
      setSocials((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled: !next } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/socials/${deleteId}`, { method: "DELETE" });
      toast.success("Social link deleted");
      setSocials((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Social Links"
        description="Manage the social platforms linked from your site."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add link
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={4} />
          ) : socials.length === 0 ? (
            <EmptyState
              title="No social links yet"
              description="Add your social profiles."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add link
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Platform</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[100px]">Enabled</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socials.map((s) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell className="font-medium capitalize">{s.platform}</TableCell>
                    <TableCell className="text-muted-foreground">{s.label}</TableCell>
                    <TableCell>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <span className="max-w-[200px] truncate">{s.url}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.order}</TableCell>
                    <TableCell>
                      <Switch checked={s.enabled} onCheckedChange={() => toggleEnabled(s)} />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit social link" : "Add social link"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the social link details." : "Create a new social link."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Platform">
                <Input
                  value={form.platform}
                  onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                  placeholder="github"
                  disabled={!!editing}
                />
              </FieldRow>
              <FieldRow label="Label">
                <Input
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </FieldRow>
            </div>
            <FieldRow label="URL">
              <Input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://github.com/username"
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
              <Label htmlFor="social-enabled">Enabled</Label>
              <Switch
                id="social-enabled"
                checked={form.enabled}
                onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Create link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete social link?"
        description="This social link will be permanently removed."
      />
    </div>
  );
}
