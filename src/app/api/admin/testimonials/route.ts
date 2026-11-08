import { db } from "@/lib/db";
import { jsonOk, jsonError, parseBody, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return jsonOk({ testimonials });
}

export async function POST(req: Request) {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;
  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return jsonError(400, "Invalid body");
  if (!body.clientName || !body.review) return jsonError(400, "Client name and review are required");
  const testimonial = await db.testimonial.create({
    data: {
      clientName: String(body.clientName),
      designation: String(body.designation ?? ""),
      business: body.business ? String(body.business) : null,
      review: String(body.review),
      rating: Math.min(5, Math.max(1, Number(body.rating ?? 5))),
      date: body.date ? new Date(String(body.date)) : null,
      projectRef: body.projectRef ? String(body.projectRef) : null,
      screenshotUrl: body.screenshotUrl ? String(body.screenshotUrl) : null,
      proofUrl: body.proofUrl ? String(body.proofUrl) : null,
      photoUrl: body.photoUrl ? String(body.photoUrl) : null,
      visible: body.visible !== false,
      order: Number(body.order ?? 0),
    },
  });
  return jsonOk({ testimonial });
}
