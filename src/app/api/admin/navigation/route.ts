import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const navigation = await db.navigationItem.findMany({ orderBy: { order: "asc" } });
  return jsonOk({ navigation });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.label || !body.href) return jsonError(400, "Label and href are required");
  const item = await db.navigationItem.create({
    data: {
      label: String(body.label),
      href: String(body.href),
      icon: body.icon ? String(body.icon) : null,
      order: Number(body.order ?? 0),
      enabled: body.enabled !== false,
    },
  });
  return jsonOk({ item });
}
