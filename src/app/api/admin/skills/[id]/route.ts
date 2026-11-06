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
  if (body.name !== undefined) data.name = String(body.name);
  if (body.category !== undefined) data.category = String(body.category);
  if (body.icon !== undefined) data.icon = body.icon ? String(body.icon) : null;
  if (body.color !== undefined) data.color = body.color ? String(body.color) : null;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);
  try {
    const skill = await db.skill.update({ where: { id }, data });
    return jsonOk({ skill });
  } catch {
    return jsonError(404, "Skill not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.skill.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Skill not found");
  }
}
