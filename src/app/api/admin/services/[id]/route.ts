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
  if (body.title !== undefined) {
    data.title = String(body.title);
    if (body.slug) data.slug = String(body.slug);
  }
  if (body.number !== undefined) data.number = Number(body.number);
  if (body.icon !== undefined) data.icon = String(body.icon);
  if (body.summary !== undefined) data.summary = String(body.summary);
  if (body.content !== undefined) data.content = body.content ? String(body.content) : null;
  if (body.features !== undefined) data.features = body.features ? String(body.features) : null;
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);
  if (body.categoryId !== undefined) data.categoryId = body.categoryId ? String(body.categoryId) : null;
  try {
    const service = await db.service.update({ where: { id }, data });
    return jsonOk({ service });
  } catch {
    return jsonError(404, "Service not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.service.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Service not found");
  }
}
