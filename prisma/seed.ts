import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = [
    { name: "Fashion", slug: "fashion", icon: "Shirt" },
    { name: "Tech", slug: "tech", icon: "Cpu" },
    { name: "Lifestyle", slug: "lifestyle", icon: "Smile" },
    { name: "Gaming", slug: "gaming", icon: "Gamepad2" },
    { name: "Beauty", slug: "beauty", icon: "Sparkles" },
    { name: "Fitness", slug: "fitness", icon: "Dumbbell" },
    { name: "Food", slug: "food", icon: "UtensilsCrossed" },
    { name: "Travel", slug: "travel", icon: "Plane" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categories seeded");

  // Capabilities
  const capabilities = [
    "Social Media Posts",
    "Video Ads",
    "Product Reviews",
    "Live Streams",
    "Newsletter Features",
    "Podcast Appearances",
    "Blog Posts",
    "Event Appearances",
  ];

  for (const cap of capabilities) {
    await prisma.capability.upsert({
      where: { name: cap },
      update: {},
      create: { name: cap },
    });
  }

  console.log("✅ Capabilities seeded");

  // Admin user (only if ADMIN_EMAIL is set and not a placeholder)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && adminEmail !== "admin@example.com") {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        supabaseId: `seed-admin-${adminEmail}`,
        email: adminEmail,
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
