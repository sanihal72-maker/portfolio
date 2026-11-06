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
  if (body.name !== undefined) {
    data.name = String(body.name);
    if (body.slug) data.slug = String(body.slug);
  }
  if (body.type !== undefined) data.type = String(body.type);
  if (body.order !== undefined) data.order = Number(body.order);
  try {
    const category = await db.category.update({ where: { id }, data });
    return jsonOk({ category });
  } catch {
    return jsonError(404, "Category not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.category.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Category not found");
  }
}
