import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type ImageIn = { url: string; caption?: string; order?: number };

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
  if (body.categoryName !== undefined) data.categoryName = String(body.categoryName);
  if (body.technology !== undefined) data.technology = String(body.technology);
  if (body.status !== undefined) data.status = String(body.status);
  if (body.summary !== undefined) data.summary = String(body.summary);
  if (body.objectives !== undefined) data.objectives = body.objectives ? String(body.objectives) : null;
  if (body.features !== undefined) data.features = body.features ? String(body.features) : null;
  if (body.devDetails !== undefined) data.devDetails = body.devDetails ? String(body.devDetails) : null;
  if (body.demoUrl !== undefined) data.demoUrl = body.demoUrl ? String(body.demoUrl) : null;
  if (body.githubUrl !== undefined) data.githubUrl = body.githubUrl ? String(body.githubUrl) : null;
  if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail ? String(body.thumbnail) : null;
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);

  const images = Array.isArray(body.images) ? (body.images as ImageIn[]) : null;

  try {
    const project = await db.$transaction(async (tx) => {
      if (images !== null) {
        await tx.projectImage.deleteMany({ where: { projectId: id } });
        if (images.length) {
          await tx.projectImage.createMany({
            data: images.map((img, i) => ({
              projectId: id,
              url: img.url,
              caption: img.caption ?? null,
              order: img.order ?? i,
            })),
          });
        }
      }
      return tx.project.update({
        where: { id },
        data,
        include: { images: { orderBy: { order: "asc" } } },
      });
    });
    return jsonOk({ project });
  } catch {
    return jsonError(404, "Project not found or update failed");
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  try {
    await db.project.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError(404, "Project not found");
  }
}
