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
  if (body.clientName !== undefined) data.clientName = String(body.clientName);
  if (body.designation !== undefined) data.designation = String(body.designation);
  if (body.business !== undefined) data.business = body.business ? String(body.business) : null;
  if (body.review !== undefined) data.review = String(body.review);
  if (body.rating !== undefined) data.rating = Math.min(5, Math.max(1, Number(body.rating)));
  if (body.date !== undefined) data.date = body.date ? new Date(String(body.date)) : null;
  if (body.projectRef !== undefined) data.projectRef = body.projectRef ? String(body.projectRef) : null;
  if (body.screenshotUrl !== undefined) data.screenshotUrl = body.screenshotUrl ? String(body.screenshotUrl) : null;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl ? String(body.photoUrl) : null;
  if (body.visible !== undefined) data.visible = Boolean(body.visible);
  if (body.order !== undefined) data.order = Number(body.order);
  try {
    const testimonial = await db.testimonial.update({ where: { id }, data });
    return jsonOk({ testimonial });
  } catch {
    return jsonError(404, "Testimonial not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.testimonial.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Testimonial not found");
  }
}
