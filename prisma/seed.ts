import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // ---------- ADMIN ----------
  const existing = await db.admin.count();
  if (existing === 0) {
    const password = await bcrypt.hash("admin123", 12);
    await db.admin.create({
      data: {
        email: "admin@aryadev.com",
        name: "Arya Dev",
        password,
        role: "owner",
      },
    });
    console.log("✓ Created default admin → admin@aryadev.com / admin123");
  }

  // ---------- PROFILE ----------
  await db.profile.upsert({
    where: { id: "profile-main" },
    update: {},
    create: {
      id: "profile-main",
      name: "Arya Dev",
      title: "Full-Stack Developer & Business Solutions Specialist",
      bio: "I build premium digital products — from custom websites and e-commerce platforms to advanced POS/ERP systems and AI-driven search visibility. Turning business problems into reliable software.",
      about: `I'm a Full-Stack Developer and Business Solutions Specialist with hands-on experience building production software used by real businesses. My work spans custom websites, e-commerce platforms, and advanced POS/ERP systems built on a solid PHP + MySQL foundation, alongside modern React + Node.js applications.

Over the years I've shipped complete business management software for retail, pharmacy, fashion, grocery and restaurant industries — software that handles real sales, real inventory, and real money.`,
      approach:
        "Business-first development: I start from the actual workflow a business runs every day, then design software that removes friction instead of adding it. Clean architecture, real validation, and interfaces that people can actually use.",
      values:
        "Build for real businesses, not demos.\nShip reliable software that runs in production.\nKeep interfaces minimal and fast.\nSupport what I build.\nNever fake results or testimonials.",
      email: "hello@aryadev.com",
      phone: "+8801300000000",
      location: "Dhaka, Bangladesh",
      photoUrl: "/images/about-portrait.jpg",
      available: true,
      yearsExperience: 6,
      projectsDone: 42,
      clientsServed: 28,
    },
  });

  // ---------- SKILLS ----------
  const coreSkills = [
    { name: "HTML5", color: "#E34F26" },
    { name: "CSS3", color: "#1572B6" },
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "Bootstrap", color: "#7952B3" },
    { name: "Tailwind CSS", color: "#06B6D4" },
    { name: "Pure PHP", color: "#777BB4" },
    { name: "MySQL", color: "#4479A1" },
  ];
  const modernSkills = [
    { name: "React.js", color: "#61DAFB" },
    { name: "Node.js", color: "#339933" },
    { name: "Express.js", color: "#888888" },
    { name: "PostgreSQL", color: "#4169E1" },
  ];

  for (const [i, s] of coreSkills.entries()) {
    await db.skill.upsert({
      where: { id: `skill-core-${i}` },
      update: {},
      create: {
        id: `skill-core-${i}`,
        name: s.name,
        category: "Core PHP Stack",
        color: s.color,
        order: i,
        visible: true,
      },
    });
  }
  for (const [i, s] of modernSkills.entries()) {
    await db.skill.upsert({
      where: { id: `skill-modern-${i}` },
      update: {},
      create: {
        id: `skill-modern-${i}`,
        name: s.name,
        category: "Modern JavaScript Stack",
        color: s.color,
        order: i,
        visible: true,
      },
    });
  }

  // ---------- CATEGORIES ----------
  const categories = [
    { name: "Web Development", slug: "web-development", type: "service" },
    { name: "E-commerce", slug: "ecommerce", type: "service" },
    { name: "Business Software", slug: "business-software", type: "service" },
    { name: "Marketing", slug: "marketing", type: "service" },
    { name: "Support", slug: "support", type: "service" },
    { name: "Custom", slug: "custom", type: "service" },
    { name: "E-commerce", slug: "proj-ecommerce", type: "project" },
    { name: "POS / ERP", slug: "proj-pos-erp", type: "project" },
    { name: "Management System", slug: "proj-management", type: "project" },
    { name: "Dashboard", slug: "proj-dashboard", type: "project" },
  ];
  for (const [i, c] of categories.entries()) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, order: i },
    });
  }

  // ---------- SERVICES ----------
  const services = [
    {
      number: 1,
      title: "Website Development",
      slug: "website-development",
      icon: "Globe",
      summary:
        "Custom websites for businesses, organizations, and individuals — fast, responsive, and built to convert.",
      content:
        "End-to-end website development covering design, frontend build, backend integration, and deployment. Every site is responsive, SEO-ready, and optimized for performance.",
      features:
        "Responsive design\nSemantic, accessible HTML\nSEO-ready structure\nPerformance optimization\nCMS integration\nDeployment & setup",
      featured: true,
      order: 1,
    },
    {
      number: 2,
      title: "E-commerce Development",
      slug: "ecommerce-development",
      icon: "ShoppingBag",
      summary:
        "Custom online stores with product, order, customer, and inventory management built for real retail.",
      content:
        "Complete e-commerce platforms with admin dashboards, multiple templates, payment integration, order tracking, and inventory control.",
      features:
        "Product & category management\nOrder management\nCustomer accounts\nInventory tracking\nMultiple templates\nPayment gateway integration",
      featured: true,
      order: 2,
    },
    {
      number: 3,
      title: "POS & ERP Solutions",
      slug: "pos-erp-solutions",
      icon: "MonitorSmartphone",
      summary:
        "Business management software for different industries — sales, inventory, accounts, and reporting.",
      content:
        "Advanced POS and ERP systems tailored to industries like pharmacy, fashion, electronics, grocery, and restaurant. Barcode/QR search, multi-branch, multi-payment support.",
      features:
        "POS sales & billing\nPurchase management\nInventory & suppliers\nCustomer management\nBranch management\nAccounts & reports",
      featured: true,
      order: 3,
    },
    {
      number: 4,
      title: "AI SEO & Search Visibility",
      slug: "ai-seo-search-visibility",
      icon: "Search",
      summary:
        "Technical SEO, content optimization, search visibility, and Generative Engine Optimization.",
      content:
        "Technical SEO audits, on-page optimization, structured data, and Generative Engine Optimization to help content surface in AI-powered search experiences.",
      features:
        "Technical SEO audit\nOn-page optimization\nStructured data\nContent optimization\nGenerative Engine Optimization\nSearch visibility reports",
      featured: true,
      order: 4,
    },
    {
      number: 5,
      title: "Website Maintenance",
      slug: "website-maintenance",
      icon: "Wrench",
      summary:
        "Website updates, bug fixes, performance optimization, and ongoing support.",
      content:
        "Ongoing maintenance plans covering security updates, content changes, performance tuning, and reliable support.",
      features:
        "Security updates\nBug fixes\nPerformance optimization\nContent updates\nBackup management\nPriority support",
      featured: false,
      order: 5,
    },
    {
      number: 6,
      title: "Custom Business Solutions",
      slug: "custom-business-solutions",
      icon: "Boxes",
      summary:
        "Custom software and digital solutions built around your specific business requirements.",
      content:
        "Bespoke software designed from your actual workflows — dashboards, automation, integrations, and internal tools.",
      features:
        "Requirement analysis\nCustom dashboards\nWorkflow automation\nThird-party integrations\nInternal tools\nLong-term partnership",
      featured: false,
      order: 6,
    },
  ];
  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, visible: true },
    });
  }

  // ---------- SOLUTIONS ----------
  const ecommerceSolution = await db.solution.upsert({
    where: { slug: "ecommerce-solution" },
    update: {},
    create: {
      name: "E-commerce Solution",
      slug: "ecommerce-solution",
      tagline: "Complete online store platform with full business management",
      technology: "Pure PHP + MySQL",
      status: "Live",
      summary:
        "A production e-commerce platform with product, category, order, customer, and inventory management. Multiple templates, customizable design, and a complete admin dashboard.",
      description:
        "Built on a solid Pure PHP + MySQL foundation, this e-commerce solution powers real online stores. It handles product catalogs, variants, orders, customers, inventory, and reporting — all from one admin panel. Multiple storefront templates and customizable design let businesses launch fast.",
      demoUrl: "#",
      industries: "Fashion\nElectronics\nGrocery\nGeneral Retail",
      pricingNote: "One-time license + optional maintenance",
      order: 1,
      visible: true,
    },
  });
  const ecommerceFeatures = [
    "Product management",
    "Category management",
    "Order management",
    "Customer management",
    "Inventory management",
    "Multiple templates",
    "Customizable design",
    "Business management dashboard",
  ];
  for (const [i, f] of ecommerceFeatures.entries()) {
    await db.solutionFeature.upsert({
      where: { id: `sf-ecom-${i}` },
      update: {},
      create: {
        id: `sf-ecom-${i}`,
        solutionId: ecommerceSolution.id,
        title: f,
        order: i,
      },
    });
  }

  const posSolution = await db.solution.upsert({
    where: { slug: "advanced-pos-erp" },
    update: {},
    create: {
      name: "Advanced POS & ERP",
      slug: "advanced-pos-erp",
      tagline: "Industry-ready point of sale and enterprise resource planning",
      technology: "Pure PHP + MySQL",
      status: "Live",
      summary:
        "A full POS & ERP system for retail businesses — sales, purchase, inventory, suppliers, customers, branches, accounts, and reports. Barcode/QR search and multiple payment methods.",
      description:
        "Built on Pure PHP + MySQL, this POS & ERP system is deployed across multiple industries including pharmacy, fashion, electronics, grocery, and restaurant. It supports multi-branch operations, barcode and QR search, multiple payment methods, and detailed financial reporting.",
      demoUrl: "#",
      industries:
        "Pharmacy\nFashion\nElectronics\nGrocery\nRestaurant\nGeneral Retail",
      pricingNote: "One-time license + per-branch add-ons",
      order: 2,
      visible: true,
    },
  });
  const posFeatures = [
    "POS sales & billing",
    "Purchase management",
    "Inventory management",
    "Supplier management",
    "Customer management",
    "Branch management",
    "Accounts",
    "Reports & analytics",
    "Barcode and QR search",
    "Multiple payment methods",
    "Industry-specific functionality",
  ];
  for (const [i, f] of posFeatures.entries()) {
    await db.solutionFeature.upsert({
      where: { id: `sf-pos-${i}` },
      update: {},
      create: {
        id: `sf-pos-${i}`,
        solutionId: posSolution.id,
        title: f,
        order: i,
      },
    });
  }

  // ---------- PROJECTS ----------
  const projects = [
    {
      title: "E-commerce Website",
      slug: "ecommerce-website",
      categoryName: "E-commerce",
      technology: "Pure PHP + MySQL",
      status: "Live",
      summary:
        "A live e-commerce website built on Pure PHP + MySQL, handling real products, orders, and customers.",
      objectives:
        "Deliver a fast, reliable online store with complete admin control, multiple templates, and inventory management for a real retail business.",
      features:
        "Product catalog\nOrder management\nCustomer accounts\nInventory tracking\nAdmin dashboard\nResponsive storefront",
      devDetails:
        "Built with Pure PHP and MySQL. Server-side rendering, modular admin panel, and a customizable storefront layer supporting multiple templates.",
      demoUrl: "#",
      githubUrl: null,
      featured: true,
      order: 1,
    },
    {
      title: "Advanced POS & ERP",
      slug: "advanced-pos-erp-project",
      categoryName: "POS / ERP",
      technology: "Pure PHP + MySQL",
      status: "Live",
      summary:
        "A live multi-industry POS & ERP system handling real sales, inventory, and reporting.",
      objectives:
        "Provide a single system for sales, purchases, inventory, suppliers, customers, branches, accounts, and reporting across multiple retail industries.",
      features:
        "POS billing\nPurchase management\nInventory & suppliers\nMulti-branch\nAccounts & reports\nBarcode/QR search",
      devDetails:
        "Built with Pure PHP and MySQL. Modular architecture for industry-specific functionality, multi-branch support, and detailed financial reporting.",
      demoUrl: "#",
      githubUrl: null,
      featured: true,
      order: 2,
    },
    {
      title: "Institute Management System",
      slug: "institute-management-system",
      categoryName: "Management System",
      technology: "React + Node.js",
      status: "Coming Soon",
      summary:
        "A modern institute management system for students, teachers, courses, attendance, and fees.",
      objectives:
        "Modernize institute operations with a React + Node.js platform covering admissions, attendance, scheduling, fees, and reporting.",
      features:
        "Student management\nAttendance\nCourse scheduling\nFees & payments\nTeacher management\nReports",
      devDetails:
        "In development using React.js, Node.js, Express.js, and PostgreSQL. Designed as a modern, responsive SaaS-style platform.",
      demoUrl: null,
      githubUrl: null,
      featured: true,
      order: 3,
    },
    {
      title: "Modern Business Dashboard",
      slug: "modern-business-dashboard",
      categoryName: "Dashboard",
      technology: "React + Node.js",
      status: "Coming Soon",
      summary:
        "A modern analytics dashboard for business owners to track sales, inventory, and performance.",
      objectives:
        "Give business owners a single, modern dashboard to monitor sales, inventory, customers, and key performance indicators in real time.",
      features:
        "Real-time analytics\nSales tracking\nInventory overview\nCustomer insights\nCustom widgets\nExport reports",
      devDetails:
        "Planned with React.js, Node.js, and PostgreSQL. Component-driven UI with reusable chart widgets.",
      demoUrl: null,
      githubUrl: null,
      featured: true,
      order: 4,
    },
  ];
  for (const p of projects) {
    await db.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, visible: true },
    });
  }

  // ---------- TESTIMONIALS ----------
  const testimonials = [
    {
      clientName: "Imran Hossain",
      designation: "Owner",
      business: "Fashion Retail Store",
      review:
        "The POS system Arya built transformed our daily operations. Sales, inventory, and reports all in one place. It just works.",
      rating: 5,
      projectRef: "Advanced POS & ERP",
    },
    {
      clientName: "Nadia Rahman",
      designation: "Founder",
      business: "Online Boutique",
      review:
        "Our e-commerce site launched smoothly and we started getting orders from day one. The admin panel is easy to manage on our own.",
      rating: 5,
      projectRef: "E-commerce Website",
    },
    {
      clientName: "Tanvir Ahmed",
      designation: "Pharmacist",
      business: "City Pharmacy",
      review:
        "Industry-specific features for pharmacy were exactly what we needed. Barcode search and inventory tracking are flawless.",
      rating: 5,
      projectRef: "Advanced POS & ERP",
    },
  ];
  for (const [i, t] of testimonials.entries()) {
    await db.testimonial.upsert({
      where: { id: `testimonial-${i}` },
      update: {},
      create: {
        id: `testimonial-${i}`,
        clientName: t.clientName,
        designation: t.designation,
        business: t.business,
        review: t.review,
        rating: t.rating,
        projectRef: t.projectRef,
        date: new Date(),
        visible: true,
        order: i,
      },
    });
  }

  // ---------- SOCIAL LINKS ----------
  const socials = [
    { platform: "whatsapp", label: "WhatsApp", url: "https://wa.me/8801300000000", icon: "MessageCircle", order: 1 },
    { platform: "email", label: "Email", url: "mailto:hello@aryadev.com", icon: "Mail", order: 2 },
    { platform: "facebook", label: "Facebook", url: "https://facebook.com", icon: "Facebook", order: 3 },
    { platform: "instagram", label: "Instagram", url: "https://instagram.com", icon: "Instagram", order: 4 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 5 },
    { platform: "github", label: "GitHub", url: "https://github.com", icon: "Github", order: 6 },
    { platform: "x", label: "X", url: "https://x.com", icon: "Twitter", order: 7 },
  ];
  for (const s of socials) {
    await db.socialLink.upsert({
      where: { platform: s.platform },
      update: {},
      create: { ...s, enabled: true },
    });
  }

  // ---------- NAVIGATION ----------
  const navItems = [
    { label: "Home", href: "#home", order: 1 },
    { label: "About", href: "#about", order: 2 },
    { label: "Services", href: "#services", order: 3 },
    { label: "Solutions", href: "#solutions", order: 4 },
    { label: "Projects", href: "#projects", order: 5 },
    { label: "Contact", href: "#contact", order: 6 },
  ];
  for (const [i, n] of navItems.entries()) {
    await db.navigationItem.upsert({
      where: { id: `nav-${i}` },
      update: {},
      create: { id: `nav-${i}`, ...n, enabled: true },
    });
  }

  // ---------- SITE SETTINGS ----------
  await db.siteSetting.upsert({
    where: { id: "settings-main" },
    update: {},
    create: {
      id: "settings-main",
      siteName: "Arya Dev",
      primaryColor: "#8B5CF6",
      contactEmail: "hello@aryadev.com",
      whatsappNumber: "+8801300000000",
      footerContent: "Building digital experiences for real businesses.",
    },
  });

  // ---------- SEO ----------
  const seoPages = [
    {
      page: "home",
      metaTitle: "Arya Dev — Full-Stack Developer & Business Solutions Specialist",
      metaDescription:
        "Premium portfolio: websites, e-commerce, POS/ERP, AI SEO and custom business solutions.",
    },
    {
      page: "services",
      metaTitle: "Services — Arya Dev",
      metaDescription: "Website development, e-commerce, POS/ERP, AI SEO, maintenance, custom solutions.",
    },
    {
      page: "projects",
      metaTitle: "Projects — Arya Dev",
      metaDescription: "Featured projects including e-commerce, POS/ERP, and upcoming React + Node.js builds.",
    },
  ];
  for (const s of seoPages) {
    await db.seoSetting.upsert({
      where: { page: s.page },
      update: {},
      create: { ...s },
    });
  }

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
