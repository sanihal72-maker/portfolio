import { db } from "@/lib/db";
import { jsonOk } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// Aggregate public portfolio payload in one request
export async function GET() {
  const [
    profile,
    skills,
    services,
    solutions,
    projects,
    testimonials,
    socials,
    navigation,
    settings,
  ] = await Promise.all([
    db.profile.findFirst(),
    db.skill.findMany({ where: { visible: true }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
    db.service.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { category: true },
    }),
    db.solution.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { features: { orderBy: { order: "asc" } }, images: { orderBy: { order: "asc" } } },
    }),
    db.project.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    db.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.socialLink.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }),
    db.navigationItem.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }),
    db.siteSetting.findFirst(),
  ]);

  return jsonOk({
    profile,
    skills,
    services,
    solutions,
    projects,
    testimonials,
    socials,
    navigation,
    settings,
  });
}
