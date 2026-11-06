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
  if (body.page !== undefined) data.page = String(body.page);
  if (body.metaTitle !== undefined) data.metaTitle = String(body.metaTitle);
  if (body.metaDescription !== undefined) data.metaDescription = String(body.metaDescription);
  if (body.canonicalUrl !== undefined) data.canonicalUrl = body.canonicalUrl ? String(body.canonicalUrl) : null;
  if (body.ogImageUrl !== undefined) data.ogImageUrl = body.ogImageUrl ? String(body.ogImageUrl) : null;
  if (body.robots !== undefined) data.robots = String(body.robots);
  try {
    const seo = await db.seoSetting.update({ where: { id }, data });
    return jsonOk({ seo });
  } catch {
    return jsonError(404, "SEO setting not found");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.seoSetting.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "SEO setting not found");
  }
}
