"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "../lib";
import { ImageUpload } from "../image-upload";
import { FieldRow, PageHeader, SaveButton } from "../shared";
import type { SiteSetting } from "@/lib/types";

type SettingsForm = {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  contactEmail: string;
  whatsappNumber: string;
  footerContent: string;
};

const EMPTY: SettingsForm = {
  siteName: "Arya Dev",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#8B5CF6",
  contactEmail: "",
  whatsappNumber: "",
  footerContent: "",
};

export function SettingsModule() {
  const [form, setForm] = React.useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJson<{ settings: SiteSetting | null }>("/api/admin/settings")
      .then(({ settings }) => {
        if (!alive) return;
        if (settings) {
          setForm({
            siteName: settings.siteName ?? "",
            logoUrl: settings.logoUrl ?? null,
            faviconUrl: settings.faviconUrl ?? null,
            primaryColor: settings.primaryColor ?? "#8B5CF6",
            contactEmail: settings.contactEmail ?? "",
            whatsappNumber: settings.whatsappNumber ?? "",
            footerContent: settings.footerContent ?? "",
          });
        }
      })
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load settings")
      )
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetchJson<{ settings: SiteSetting }>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Website Settings" description="Global site configuration." />
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Website Settings"
        description="Global site configuration applied across your portfolio."
        action={<SaveButton saving={saving} onClick={handleSave} label="Save settings" />}
      />

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Branding</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FieldRow label="Site name">
            <Input
              value={form.siteName}
              onChange={(e) => update("siteName", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Primary color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="size-9 rounded border border-border bg-transparent"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
              />
            </div>
          </FieldRow>
          <FieldRow label="Logo" className="md:col-span-2">
            <ImageUpload
              value={form.logoUrl}
              onChange={(v) => update("logoUrl", v)}
              label="Site logo"
            />
          </FieldRow>
          <FieldRow label="Favicon" className="md:col-span-2">
            <ImageUpload
              value={form.faviconUrl}
              onChange={(v) => update("faviconUrl", v)}
              label="Favicon"
            />
          </FieldRow>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <FieldRow label="Contact email">
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="WhatsApp number">
            <Input
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder="+1 555 555 5555"
            />
          </FieldRow>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base">Footer</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6">
          <FieldRow label="Footer content" hint="Plain text or simple HTML shown in the footer.">
            <Textarea
              rows={4}
              value={form.footerContent}
              onChange={(e) => update("footerContent", e.target.value)}
            />
          </FieldRow>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SaveButton saving={saving} onClick={handleSave} label="Save settings" />
      </div>
    </div>
  );
}
