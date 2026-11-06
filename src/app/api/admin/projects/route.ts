import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type ImageIn = { url: string; caption?: string; order?: number };

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const projects = await db.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return jsonOk({ projects });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.title) return jsonError(400, "Title is required");
  const title = String(body.title);
  const slug = String(body.slug || slugify(title));
  if (await db.project.findUnique({ where: { slug } })) {
    return jsonError(409, "Slug already exists");
  }
  const images = Array.isArray(body.images) ? (body.images as ImageIn[]) : [];

  const project = await db.project.create({
    data: {
      title,
      slug,
      categoryName: String(body.categoryName ?? ""),
      technology: String(body.technology ?? ""),
      status: String(body.status ?? "Live"),
      summary: String(body.summary ?? ""),
      objectives: body.objectives ? String(body.objectives) : null,
      features: body.features ? String(body.features) : null,
      devDetails: body.devDetails ? String(body.devDetails) : null,
      demoUrl: body.demoUrl ? String(body.demoUrl) : null,
      githubUrl: body.githubUrl ? String(body.githubUrl) : null,
      thumbnail: body.thumbnail ? String(body.thumbnail) : null,
      featured: Boolean(body.featured),
      order: Number(body.order ?? 0),
      visible: body.visible !== false,
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          caption: img.caption ?? null,
          order: img.order ?? i,
        })),
      },
    },
    include: { images: true },
  });
  return jsonOk({ project });
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
