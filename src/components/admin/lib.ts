"use client";

/**
 * Shared helpers for the Admin panel:
 *  - fetchJson: typed fetch with JSON + FormData support and error extraction
 *  - admin-side types that mirror the API payloads but aren't in @/lib/types
 */

export type Admin = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  details: string;
  status: string; // new | read | contacted | completed | archived
  createdAt: string;
  updatedAt: string;
};

export type SeoSetting = {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  robots: string;
};

export type DashboardStats = {
  inquiries: number;
  projects: number;
  services: number;
  testimonials: number;
  solutions: number;
  skills: number;
  unreadInquiries: number;
};

export type DashboardData = {
  stats: DashboardStats;
  recentInquiries: Inquiry[];
};

export type UploadResponse = {
  url: string;
  name: string;
  size: number;
};

export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;

  const headers = new Headers(init?.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(input, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "include",
  });
  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // ignore parse errors
    }
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const INQUIRY_STATUSES = [
  "new",
  "read",
  "contacted",
  "completed",
  "archived",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const SOLUTION_PROJECT_STATUSES = ["Live", "Development", "Coming Soon"] as const;
