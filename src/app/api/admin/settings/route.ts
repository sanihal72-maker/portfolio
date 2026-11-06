import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const settings = await db.siteSetting.findFirst();
  return jsonOk({ settings });
}

export async function PUT(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");

  const data = {
    siteName: String(body.siteName ?? ""),
    logoUrl: body.logoUrl ? String(body.logoUrl) : null,
    faviconUrl: body.faviconUrl ? String(body.faviconUrl) : null,
    primaryColor: String(body.primaryColor ?? "#8B5CF6"),
    contactEmail: String(body.contactEmail ?? ""),
    whatsappNumber: String(body.whatsappNumber ?? ""),
    footerContent: body.footerContent ? String(body.footerContent) : null,
  };

  const existing = await db.siteSetting.findFirst();
  if (existing) {
    const settings = await db.siteSetting.update({ where: { id: existing.id }, data });
    return jsonOk({ settings });
  }
  const settings = await db.siteSetting.create({ data });
  return jsonOk({ settings });
}
