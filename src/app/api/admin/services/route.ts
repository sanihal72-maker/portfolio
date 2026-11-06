import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const services = await db.service.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });
  return jsonOk({ services });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.title) return jsonError(400, "Title is required");
  const title = String(body.title);
  const slug = String(body.slug || slugify(title));
  if (await db.service.findUnique({ where: { slug } })) {
    return jsonError(409, "Slug already exists");
  }
  const service = await db.service.create({
    data: {
      title,
      slug,
      number: Number(body.number ?? 0),
      icon: String(body.icon ?? "Sparkles"),
      summary: String(body.summary ?? ""),
      content: body.content ? String(body.content) : null,
      features: body.features ? String(body.features) : null,
      featured: Boolean(body.featured),
      order: Number(body.order ?? 0),
      visible: body.visible !== false,
      categoryId: body.categoryId ? String(body.categoryId) : null,
    },
  });
  return jsonOk({ service });
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
