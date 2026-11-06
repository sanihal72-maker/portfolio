"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "../lib";
import { ImageUpload } from "../image-upload";
import { FieldRow, PageHeader, SaveButton } from "../shared";
import type { Profile } from "@/lib/types";

type ProfileForm = {
  name: string;
  title: string;
  bio: string;
  about: string;
  approach: string;
  values: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string | null;
  available: boolean;
  yearsExperience: number;
  projectsDone: number;
  clientsServed: number;
};

const EMPTY: ProfileForm = {
  name: "",
  title: "",
  bio: "",
  about: "",
  approach: "",
  values: "",
  email: "",
  phone: "",
  location: "",
  photoUrl: null,
  available: true,
  yearsExperience: 0,
  projectsDone: 0,
  clientsServed: 0,
};

export function ProfileModule() {
  const [form, setForm] = React.useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJson<{ profile: Profile | null }>("/api/admin/profile")
      .then(({ profile }) => {
        if (!alive) return;
        if (profile) {
          setForm({
            name: profile.name ?? "",
            title: profile.title ?? "",
            bio: profile.bio ?? "",
            about: profile.about ?? "",
            approach: profile.approach ?? "",
            values: profile.values ?? "",
            email: profile.email ?? "",
            phone: profile.phone ?? "",
            location: profile.location ?? "",
            photoUrl: profile.photoUrl ?? null,
            available: profile.available ?? true,
            yearsExperience: profile.yearsExperience ?? 0,
            projectsDone: profile.projectsDone ?? 0,
            clientsServed: profile.clientsServed ?? 0,
          });
        }
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetchJson<{ profile: Profile }>("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Profile" description="Manage your public profile information." />
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Manage your public profile information shown across the site."
        action={
          <SaveButton saving={saving} onClick={handleSave} label="Save changes" />
        }
      />

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FieldRow label="Name">
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </FieldRow>
          <FieldRow label="Title / Role">
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
          </FieldRow>
          <FieldRow label="Email" className="md:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </FieldRow>
          <FieldRow label="Phone / WhatsApp">
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </FieldRow>
          <FieldRow label="Location">
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} />
          </FieldRow>
          <FieldRow label="Profile Photo" className="md:col-span-2">
            <ImageUpload value={form.photoUrl} onChange={(v) => update("photoUrl", v)} label="Profile photo" />
          </FieldRow>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Bio & About</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6">
          <FieldRow label="Short Bio (hero intro)">
            <Textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          </FieldRow>
          <FieldRow label="About (long form)">
            <Textarea rows={8} value={form.about} onChange={(e) => update("about", e.target.value)} />
          </FieldRow>
          <FieldRow label="Approach" hint="How you work / development approach.">
            <Textarea rows={4} value={form.approach} onChange={(e) => update("approach", e.target.value)} />
          </FieldRow>
          <FieldRow label="Values" hint="One per line.">
            <Textarea rows={5} value={form.values} onChange={(e) => update("values", e.target.value)} />
          </FieldRow>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Stats & Availability</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FieldRow label="Years of Experience">
            <Input
              type="number"
              value={form.yearsExperience}
              onChange={(e) => update("yearsExperience", Number(e.target.value) || 0)}
            />
          </FieldRow>
          <FieldRow label="Projects Done">
            <Input
              type="number"
              value={form.projectsDone}
              onChange={(e) => update("projectsDone", Number(e.target.value) || 0)}
            />
          </FieldRow>
          <FieldRow label="Clients Served">
            <Input
              type="number"
              value={form.clientsServed}
              onChange={(e) => update("clientsServed", Number(e.target.value) || 0)}
            />
          </FieldRow>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="available">Available for work</Label>
              <span className="text-xs text-muted-foreground">
                Shown as a badge on your site.
              </span>
            </div>
            <Switch
              id="available"
              checked={form.available}
              onCheckedChange={(v) => update("available", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SaveButton saving={saving} onClick={handleSave} label="Save changes" />
      </div>
    </div>
  );
}
