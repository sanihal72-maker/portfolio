const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  const data = {
    admin: await prisma.admin.findMany(),
    profile: await prisma.profile.findMany(),
    skill: await prisma.skill.findMany(),
    category: await prisma.category.findMany(),
    service: await prisma.service.findMany(),
    solution: await prisma.solution.findMany({ include: { features: true, images: true } }),
    project: await prisma.project.findMany({ include: { images: true } }),
    testimonial: await prisma.testimonial.findMany(),
    socialLink: await prisma.socialLink.findMany(),
    inquiry: await prisma.inquiry.findMany(),
    seoSetting: await prisma.seoSetting.findMany(),
    navigationItem: await prisma.navigationItem.findMany(),
    siteSetting: await prisma.siteSetting.findMany(),
  };

  fs.writeFileSync("backup-data.json", JSON.stringify(data, null, 2));
  console.log("Successfully backed up SQLite database to backup-data.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
