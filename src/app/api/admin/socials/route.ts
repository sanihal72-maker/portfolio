import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const socials = await db.socialLink.findMany({ orderBy: { order: "asc" } });
  return jsonOk({ socials });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.platform || !body.url) return jsonError(400, "Platform and url are required");
  const platform = String(body.platform);
  if (await db.socialLink.findUnique({ where: { platform } })) {
    return jsonError(409, "Platform already exists");
  }
  const social = await db.socialLink.create({
    data: {
      platform,
      label: String(body.label ?? platform),
      url: String(body.url),
      icon: String(body.icon ?? "Link"),
      enabled: body.enabled !== false,
      order: Number(body.order ?? 0),
    },
  });
  return jsonOk({ social });
}
