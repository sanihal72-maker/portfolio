import { NextResponse } from "next/server";
import { getCurrentAdmin } from "./auth";

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseBody<T = Record<string, unknown>>(
  req: Request
): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return admin;
}

export async function adminGuard() {
  const admin = await requireAdmin();
  if (!admin) return { error: jsonError(401, "Unauthorized") };
  return { admin };
}

// Simple rate-limit-ish guard: block empty critical fields
export function validateFields(
  data: Record<string, unknown>,
  fields: string[]
): string | null {
  for (const f of fields) {
    const v = data[f];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      return `Missing field: ${f}`;
    }
  }
  return null;
}
