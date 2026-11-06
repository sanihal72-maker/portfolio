"use client";

import * as React from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchJson, type UploadResponse } from "./lib";

export type ImageUploadProps = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
  /** Hide the raw URL text input (still shows preview + buttons). */
  hideUrlField?: boolean;
  /** Preview thumbnail size in pixels. */
  size?: number;
};

/**
 * ImageUpload — posts a file to /api/admin/upload and returns the URL string
 * to the parent via onChange. Renders a preview thumbnail, upload button,
 * remove button and an optional editable URL field.
 */
export function ImageUpload({
  value,
  onChange,
  label = "Image",
  className,
  hideUrlField = false,
  size = 64,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetchJson<UploadResponse>("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      onChange(res.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const px = `${size}px`;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label>{label}</Label> : null}
      <div className="flex items-start gap-3">
        <div
          className="relative shrink-0 overflow-hidden rounded-md border border-border bg-muted/30"
          style={{ width: px, height: px }}
        >
          {value ? (
            <img
              src={value}
              alt={label}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImagePlus className="size-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading
              ? "Uploading..."
              : value
                ? "Change"
                : "Upload"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      {!hideUrlField ? (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="Image URL or upload above"
          className="font-mono text-xs"
        />
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
