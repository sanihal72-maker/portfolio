import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type FeatureIn = { title: string; order?: number };
type ImageIn = { url: string; caption?: string; order?: number };

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
  if (body.tagline !== undefined) data.tagline = String(body.tagline);
  if (body.technology !== undefined) data.technology = String(body.technology);
  if (body.status !== undefined) data.status = String(body.status);
  if (body.summary !== undefined) data.summary = String(body.summary);
  if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body.demoUrl !== undefined) data.demoUrl = body.demoUrl ? String(body.demoUrl) : null;
  if (body.industries !== undefined) data.industries = body.industries ? String(body.industries) : null;
  if (body.pricingNote !== undefined) data.pricingNote = body.pricingNote ? String(body.pricingNote) : null;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);

  // nested: replace features and images wholesale when provided
  const features = Array.isArray(body.features) ? (body.features as FeatureIn[]) : null;
  const images = Array.isArray(body.images) ? (body.images as ImageIn[]) : null;

  try {
    const solution = await db.$transaction(async (tx) => {
      if (features !== null) {
        await tx.solutionFeature.deleteMany({ where: { solutionId: id } });
        if (features.length) {
          await tx.solutionFeature.createMany({
            data: features.map((f, i) => ({
              solutionId: id,
              title: f.title,
              order: f.order ?? i,
            })),
          });
        }
      }
      if (images !== null) {
        await tx.solutionImage.deleteMany({ where: { solutionId: id } });
        if (images.length) {
          await tx.solutionImage.createMany({
            data: images.map((img, i) => ({
              solutionId: id,
              url: img.url,
              caption: img.caption ?? null,
              order: img.order ?? i,
            })),
          });
        }
      }
      return tx.solution.update({ where: { id }, data, include: { features: { orderBy: { order: "asc" } }, images: { orderBy: { order: "asc" } } } });
    });
    return jsonOk({ solution });
  } catch (e) {
    return jsonError(404, "Solution not found or update failed");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.solution.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Solution not found");
  }
}
