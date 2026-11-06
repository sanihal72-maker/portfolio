import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, validateFields } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// Basic spam protection: honeypot + simple length checks
export async function POST(req: Request) {
  const body = await parseBody<Record<string, string>>(req);
  if (!body) return jsonError(400, "Invalid request body");

  // honeypot field — bots tend to fill hidden fields
  if (body.website && body.website.trim() !== "") {
    return jsonOk({ ok: true }); // pretend success
  }

  const err = validateFields(body, ["name", "email", "details"]);
  if (err) return jsonError(400, err);

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError(400, "Invalid email address");
  }
  if (body.details.trim().length < 10) {
    return jsonError(400, "Please provide more project details (min 10 characters).");
  }
  if (body.details.length > 5000) {
    return jsonError(400, "Project details too long.");
  }

  const inquiry = await db.inquiry.create({
    data: {
      name: body.name.trim().slice(0, 120),
      email: email.slice(0, 200),
      phone: (body.phone || "").trim().slice(0, 40) || null,
      service: (body.service || "").trim().slice(0, 120) || null,
      budget: (body.budget || "").trim().slice(0, 80) || null,
      details: body.details.trim(),
    },
  });

  return jsonOk({ ok: true, id: inquiry.id });
}
