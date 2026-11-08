const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync("backup-data.json", "utf8"));
  console.log("Restoring data to Neon PostgreSQL...");

  // 1. Admin
  for (const item of data.admin) {
    await prisma.admin.upsert({
      where: { email: item.email },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Admin users restored (${data.admin.length})`);

  // 2. Profile
  for (const item of data.profile) {
    await prisma.profile.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Profiles restored (${data.profile.length})`);

  // 3. Site Settings
  for (const item of data.siteSetting) {
    await prisma.siteSetting.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Site settings restored (${data.siteSetting.length})`);

  // 4. Categories
  for (const item of data.category) {
    await prisma.category.upsert({
      where: { id: item.id },
      update: { name: item.name, slug: item.slug, type: item.type, order: item.order },
      create: { id: item.id, name: item.name, slug: item.slug, type: item.type, order: item.order },
    });
  }
  console.log(`✓ Categories restored (${data.category.length})`);

  // 5. Skills
  for (const item of data.skill) {
    await prisma.skill.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Skills restored (${data.skill.length})`);

  // 6. Services
  for (const item of data.service) {
    await prisma.service.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Services restored (${data.service.length})`);

  // 7. Solutions + features + images
  for (const s of data.solution) {
    const { features, images, ...solutionFields } = s;
    await prisma.solution.upsert({
      where: { id: s.id },
      update: solutionFields,
      create: solutionFields,
    });
    if (features && features.length > 0) {
      for (const f of features) {
        await prisma.solutionFeature.upsert({
          where: { id: f.id },
          update: f,
          create: f,
        });
      }
    }
    if (images && images.length > 0) {
      for (const img of images) {
        await prisma.solutionImage.upsert({
          where: { id: img.id },
          update: img,
          create: img,
        });
      }
    }
  }
  console.log(`✓ Solutions restored (${data.solution.length})`);

  // 8. Projects + images
  for (const p of data.project) {
    const { images, ...projectFields } = p;
    await prisma.project.upsert({
      where: { id: p.id },
      update: projectFields,
      create: projectFields,
    });
    if (images && images.length > 0) {
      for (const img of images) {
        await prisma.projectImage.upsert({
          where: { id: img.id },
          update: img,
          create: img,
        });
      }
    }
  }
  console.log(`✓ Projects restored (${data.project.length})`);

  // 9. Testimonials
  for (const item of data.testimonial) {
    await prisma.testimonial.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Testimonials restored (${data.testimonial.length})`);

  // 10. Social Links
  for (const item of data.socialLink) {
    await prisma.socialLink.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Social links restored (${data.socialLink.length})`);

  // 11. Navigation Items
  for (const item of data.navigationItem) {
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Navigation items restored (${data.navigationItem.length})`);

  // 12. SEO Settings
  for (const item of data.seoSetting) {
    await prisma.seoSetting.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ SEO settings restored (${data.seoSetting.length})`);

  console.log("All data successfully migrated to Neon PostgreSQL!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
