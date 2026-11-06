import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const VALID = ["new", "read", "contacted", "completed", "archived"];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  const data: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!VALID.includes(String(body.status))) return jsonError(400, "Invalid status");
    data.status = String(body.status);
  }
  try {
    const inquiry = await db.inquiry.update({ where: { id }, data });
    return jsonOk({ inquiry });
  } catch {
    return jsonError(404, "Inquiry not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.inquiry.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Inquiry not found");
  }
}
