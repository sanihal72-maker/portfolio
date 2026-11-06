import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return jsonOk({ skills });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.name) return jsonError(400, "Name is required");
  const skill = await db.skill.create({
    data: {
      name: String(body.name),
      category: String(body.category ?? "Core PHP Stack"),
      icon: body.icon ? String(body.icon) : null,
      color: body.color ? String(body.color) : null,
      order: Number(body.order ?? 0),
      visible: body.visible !== false,
    },
  });
  return jsonOk({ skill });
}
