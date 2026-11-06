import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const profile = await db.profile.findFirst();
  return jsonOk({ profile });
}

export async function PUT(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");

  const existing = await db.profile.findFirst();
  const data = {
    name: String(body.name ?? ""),
    title: String(body.title ?? ""),
    bio: String(body.bio ?? ""),
    about: String(body.about ?? ""),
    approach: body.approach ? String(body.approach) : null,
    values: body.values ? String(body.values) : null,
    email: String(body.email ?? ""),
    phone: body.phone ? String(body.phone) : null,
    location: body.location ? String(body.location) : null,
    photoUrl: body.photoUrl ? String(body.photoUrl) : null,
    available: Boolean(body.available),
    yearsExperience: Number(body.yearsExperience ?? 0),
    projectsDone: Number(body.projectsDone ?? 0),
    clientsServed: Number(body.clientsServed ?? 0),
  };

  if (existing) {
    const profile = await db.profile.update({ where: { id: existing.id }, data });
    return jsonOk({ profile });
  }
  const profile = await db.profile.create({ data });
  return jsonOk({ profile });
}
