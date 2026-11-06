import { db } from "@/lib/db";
import { jsonOk, jsonError, adminGuard } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if ("error" in guard) return guard.error;

  const [inquiries, projects, services, testimonials, solutions, skills, unreadInquiries] =
    await Promise.all([
      db.inquiry.count(),
      db.project.count(),
      db.service.count(),
      db.testimonial.count(),
      db.solution.count(),
      db.skill.count(),
      db.inquiry.count({ where: { status: "new" } }),
    ]);

  const recentInquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return jsonOk({
    stats: {
      inquiries,
      projects,
      services,
      testimonials,
      solutions,
      skills,
      unreadInquiries,
    },
    recentInquiries,
  });
}
