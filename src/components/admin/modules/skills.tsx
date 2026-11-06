"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { Skill } from "@/lib/types";

type SkillForm = {
  name: string;
  category: string;
  icon: string;
  color: string;
  order: number;
  visible: boolean;
};

const EMPTY_FORM: SkillForm = {
  name: "",
  category: "Core PHP Stack",
  icon: "",
  color: "#8B5CF6",
  order: 0,
  visible: true,
};

export function SkillsModule() {
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Skill | null>(null);
  const [form, setForm] = React.useState<SkillForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    fetchJson<{ skills: Skill[] }>("/api/admin/skills")
      .then(({ skills }) => setSkills(skills))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load skills"))
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

  function openEdit(skill: Skill) {
    setEditing(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon ?? "",
      color: skill.color ?? "#8B5CF6",
      order: skill.order,
      visible: skill.visible,
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
    try {
      if (editing) {
        await fetchJson<{ skill: Skill }>(`/api/admin/skills/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Skill updated");
      } else {
        await fetchJson<{ skill: Skill }>("/api/admin/skills", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Skill created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(skill: Skill) {
    const next = !skill.visible;
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, visible: next } : s))
    );
    try {
      await fetchJson(`/api/admin/skills/${skill.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: next }),
      });
    } catch (err) {
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, visible: !next } : s))
      );
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetchJson(`/api/admin/skills/${deleteId}`, { method: "DELETE" });
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Skills & Technologies"
        description="Manage the technologies displayed in your skills section."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add skill
          </Button>
        }
      />

      <Card className="rounded-xl">
        <ScrollArea>
          {loading ? (
            <LoadingState rows={5} />
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills yet"
              description="Add your first skill to display it on your portfolio."
              action={
                <Button onClick={openCreate} variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add skill
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[100px]">Visible</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.name}</span>
                        {s.icon ? (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {s.icon}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-4 rounded border border-border"
                          style={{ backgroundColor: s.color ?? "transparent" }}
                        />
                        <span className="text-xs text-muted-foreground">{s.color ?? "—"}</span>
                      </div>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(s.id)}
                        >
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
            <DialogTitle>{editing ? "Edit skill" : "Add skill"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the skill details."
                : "Create a new skill entry to display on your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldRow label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Next.js"
              />
            </FieldRow>
            <FieldRow label="Category">
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Modern JavaScript Stack"
              />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Icon (Lucide name)">
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="Code"
                />
              </FieldRow>
              <FieldRow label="Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="size-9 rounded border border-border bg-transparent"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  />
                </div>
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
                <Label htmlFor="skill-visible">Visible</Label>
                <Switch
                  id="skill-visible"
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
                {saving ? "Saving..." : editing ? "Save changes" : "Create skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete skill?"
        description="This skill will be permanently removed from your portfolio."
      />
    </div>
  );
}
