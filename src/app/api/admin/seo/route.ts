import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const seo = await db.seoSetting.findMany({ orderBy: { page: "asc" } });
  return jsonOk({ seo });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.page) return jsonError(400, "Page is required");
  const page = String(body.page);
  if (await db.seoSetting.findUnique({ where: { page } })) {
    return jsonError(409, "Page already exists");
  }
  const seo = await db.seoSetting.create({
    data: {
      page,
      metaTitle: String(body.metaTitle ?? ""),
      metaDescription: String(body.metaDescription ?? ""),
      canonicalUrl: body.canonicalUrl ? String(body.canonicalUrl) : null,
      ogImageUrl: body.ogImageUrl ? String(body.ogImageUrl) : null,
      robots: String(body.robots ?? "index, follow"),
    },
  });
  return jsonOk({ seo });
}
