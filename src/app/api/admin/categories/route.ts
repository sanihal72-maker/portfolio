import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });
  return jsonOk({ categories });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.name) return jsonError(400, "Name is required");
  const name = String(body.name);
  const slug = String(body.slug || slugify(name));
  if (await db.category.findUnique({ where: { slug } })) {
    return jsonError(409, "Slug already exists");
  }
  const category = await db.category.create({
    data: {
      name,
      slug,
      type: String(body.type ?? "service"),
      order: Number(body.order ?? 0),
    },
  });
  return jsonOk({ category });
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
