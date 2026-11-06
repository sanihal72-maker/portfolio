import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  const data: Record<string, unknown> = {};
  if (body.label !== undefined) data.label = String(body.label);
  if (body.href !== undefined) data.href = String(body.href);
  if (body.icon !== undefined) data.icon = body.icon ? String(body.icon) : null;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.enabled !== undefined) data.enabled = Boolean(body.enabled);
  try {
    const item = await db.navigationItem.update({ where: { id }, data });
    return jsonOk({ item });
  } catch {
    return jsonError(404, "Item not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.navigationItem.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Item not found");
  }
}
