import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type FeatureIn = { title: string; order?: number };
type ImageIn = { url: string; caption?: string; order?: number };

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const solutions = await db.solution.findMany({
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } }, images: { orderBy: { order: "asc" } } },
  });
  return jsonOk({ solutions });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.name) return jsonError(400, "Name is required");
  const name = String(body.name);
  const slug = String(body.slug || slugify(name));
  if (await db.solution.findUnique({ where: { slug } })) {
    return jsonError(409, "Slug already exists");
  }
  const features = Array.isArray(body.features) ? (body.features as FeatureIn[]) : [];
  const images = Array.isArray(body.images) ? (body.images as ImageIn[]) : [];

  const solution = await db.solution.create({
    data: {
      name,
      slug,
      tagline: String(body.tagline ?? ""),
      technology: String(body.technology ?? ""),
      status: String(body.status ?? "Live"),
      summary: String(body.summary ?? ""),
      description: body.description ? String(body.description) : null,
      demoUrl: body.demoUrl ? String(body.demoUrl) : null,
      industries: body.industries ? String(body.industries) : null,
      pricingNote: body.pricingNote ? String(body.pricingNote) : null,
      order: Number(body.order ?? 0),
      visible: body.visible !== false,
      features: {
        create: features.map((f, i) => ({ title: f.title, order: f.order ?? i })),
      },
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          caption: img.caption ?? null,
          order: img.order ?? i,
        })),
      },
    },
    include: { features: true, images: true },
  });
  return jsonOk({ solution });
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
