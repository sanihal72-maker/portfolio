import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, validateFields } from "@/lib/api-helpers";
import { verifyPassword, signToken, setAdminCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; until: number }>();

export async function POST(req: Request) {
  const body = await parseBody<Record<string, string>>(req);
  if (!body) return jsonError(400, "Invalid request body");
  const err = validateFields(body, ["email", "password"]);
  if (err) return jsonError(400, err);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now < rec.until && rec.count >= 8) {
    return jsonError(429, "Too many login attempts. Please try again later.");
  }

  const admin = await db.admin.findUnique({ where: { email: body.email.trim().toLowerCase() } });
  if (!admin) {
    bumpAttempt(attempts, ip, now);
    return jsonError(401, "Invalid credentials");
  }
  const ok = await verifyPassword(body.password, admin.password);
  if (!ok) {
    bumpAttempt(attempts, ip, now);
    return jsonError(401, "Invalid credentials");
  }

  attempts.delete(ip);
  const token = signToken(admin.id, admin.email);
  await setAdminCookie(token);
  return jsonOk({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
}

function bumpAttempt(map: Map<string, { count: number; until: number }>, ip: string, now: number) {
  const rec = map.get(ip) || { count: 0, until: now + 15 * 60 * 1000 };
  rec.count += 1;
  rec.until = now + 15 * 60 * 1000;
  map.set(ip, rec);
}
