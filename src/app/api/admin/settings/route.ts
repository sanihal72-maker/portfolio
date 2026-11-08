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
  let settings;
  if (existing) {
    settings = await db.siteSetting.update({ where: { id: existing.id }, data });
  } else {
    settings = await db.siteSetting.create({ data });
  }

  // Keep social links and profile in sync with settings
  if (data.contactEmail) {
    await db.socialLink.updateMany({
      where: { platform: "email" },
      data: { url: `mailto:${data.contactEmail}` },
    }).catch(() => {});
    await db.profile.updateMany({
      data: { email: data.contactEmail },
    }).catch(() => {});
  }

  if (data.whatsappNumber) {
    const cleanNum = data.whatsappNumber.replace(/[^0-9]/g, "");
    await db.socialLink.updateMany({
      where: { platform: "whatsapp" },
      data: { url: `https://wa.me/${cleanNum}` },
    }).catch(() => {});
    await db.profile.updateMany({
      data: { phone: data.whatsappNumber },
    }).catch(() => {});
  }

  return jsonOk({ settings });
}
