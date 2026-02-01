import "dotenv/config";
import { PrismaClient, Category, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...\n");

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Parse the connection URL to properly handle encoded passwords
  let poolConfig: any;

  try {
    const url = new URL(connectionString);
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      user: url.username,
      password: decodeURIComponent(url.password),
      ssl: {
        rejectUnauthorized: false,
      },
    };
  } catch {
    poolConfig = {
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Create admin user
    const adminPassword = await hash("LayoHair2025!", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@layohair.com" },
      update: {
        password: adminPassword,
        name: "Layo",
        phone: "+447350167537",
      },
      create: {
        email: "admin@layohair.com",
        name: "Layo",
        password: adminPassword,
        role: Role.ADMIN,
        phone: "+447350167537",
      },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create styles (prices in GBP)
    const styles = [
      {
        name: "Knotless Braids",
        slug: "knotless-braids",
        description:
          "Lightweight, natural-looking braids that start with your natural hair. Knotless braids are a protective style that reduces tension on your scalp and edges. Perfect for those who want a seamless, natural look that lasts 6-8 weeks.",
        category: Category.BRAIDS,
        price: 120,
        duration: 240,
        images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "Fulani Braids",
        slug: "fulani-braids",
        description:
          "Traditional African style with beads and unique patterns. Fulani braids are inspired by the Fulani people of West Africa and feature intricate designs with beads and cowrie shells. A statement style that celebrates African heritage.",
        category: Category.BRAIDS,
        price: 150,
        duration: 300,
        images: ["https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "Short Boho Braids",
        slug: "short-boho-braids",
        description:
          "Trendy bohemian style with curly ends for a carefree look. Perfect for those who want the beauty of braids with a playful, effortless vibe. Low-maintenance and stylish.",
        category: Category.BRAIDS,
        price: 140,
        duration: 270,
        images: ["https://images.unsplash.com/photo-1594369908155-60ced2a37e59?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "French Curls",
        slug: "french-curls",
        description:
          "Elegant curly braids with a sophisticated French twist. This style combines the elegance of French braiding techniques with beautiful curly extensions for a romantic, sophisticated look.",
        category: Category.BRAIDS,
        price: 160,
        duration: 300,
        images: ["https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "Classic Cornrows",
        slug: "classic-cornrows",
        description:
          "Timeless cornrow patterns that never go out of style. Classic cornrows are braided close to the scalp in straight lines or intricate designs. Versatile and perfect for any occasion.",
        category: Category.CORNROWS,
        price: 80,
        duration: 180,
        images: ["https://images.unsplash.com/photo-1611077544695-e0e15a56077f?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
      {
        name: "Goddess Locs",
        slug: "goddess-locs",
        description:
          "Beautiful faux locs with curly accents for a goddess look. These locs feature soft, wavy hair wrapped around for a romantic, bohemian aesthetic. Stunning for any occasion.",
        category: Category.LOCS,
        price: 180,
        duration: 360,
        images: ["https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "Passion Twists",
        slug: "passion-twists",
        description:
          "Soft, romantic twists perfect for any occasion. Passion twists use water wave hair for a fluffy, textured look that's both stylish and protective.",
        category: Category.TWISTS,
        price: 135,
        duration: 240,
        images: ["https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
      {
        name: "Butterfly Locs",
        slug: "butterfly-locs",
        description:
          "Distressed locs with a unique, textured appearance. Butterfly locs have a naturally distressed look that gives them character and dimension. A trendy statement style.",
        category: Category.LOCS,
        price: 165,
        duration: 300,
        images: ["https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=800&h=1000&fit=crop"],
        isFeatured: true,
      },
      {
        name: "Box Braids",
        slug: "box-braids",
        description:
          "Classic box braids in various lengths and sizes. A timeless protective style that has been popular for generations. Versatile and can be styled in countless ways.",
        category: Category.BRAIDS,
        price: 130,
        duration: 300,
        images: ["https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
      {
        name: "Senegalese Twists",
        slug: "senegalese-twists",
        description:
          "Sleek, rope-like twists for a polished appearance. These twists are smooth and shiny, giving a sophisticated and put-together look. Easy to maintain.",
        category: Category.TWISTS,
        price: 125,
        duration: 270,
        images: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
      {
        name: "Tribal Braids",
        slug: "tribal-braids",
        description:
          "Bold patterns inspired by traditional African designs. These braids feature creative patterns that make a statement and celebrate African heritage.",
        category: Category.BRAIDS,
        price: 140,
        duration: 240,
        images: ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
      {
        name: "Soft Locs",
        slug: "soft-locs",
        description:
          "Lightweight, natural-looking faux locs. Soft locs offer the look of traditional locs without the commitment or weight. Comfortable to wear and beautiful to see.",
        category: Category.LOCS,
        price: 150,
        duration: 300,
        images: ["https://images.unsplash.com/photo-1580501170888-80668882ca0c?w=800&h=1000&fit=crop"],
        isFeatured: false,
      },
    ];

    for (const style of styles) {
      await prisma.style.upsert({
        where: { slug: style.slug },
        update: {
          price: style.price,
          images: style.images,
        },
        create: {
          ...style,
          price: style.price,
        },
      });
    }
    console.log(`✅ ${styles.length} styles created`);

    // Create default availability (9am-7pm daily, including Sunday)
    const daysOfWeek = [
      { day: 0, name: "Sunday", available: true },
      { day: 1, name: "Monday", available: true },
      { day: 2, name: "Tuesday", available: true },
      { day: 3, name: "Wednesday", available: true },
      { day: 4, name: "Thursday", available: true },
      { day: 5, name: "Friday", available: true },
      { day: 6, name: "Saturday", available: true },
    ];

    for (const { day, available } of daysOfWeek) {
      // Check if availability exists for this day (salon-wide, no specific stylist)
      const existing = await prisma.availability.findFirst({
        where: {
          dayOfWeek: day,
          stylistId: null,
        },
      });

      if (existing) {
        await prisma.availability.update({
          where: { id: existing.id },
          data: {
            startTime: "09:00",
            endTime: "19:00",
            isAvailable: available,
          },
        });
      } else {
        await prisma.availability.create({
          data: {
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "19:00",
            isAvailable: available,
          },
        });
      }
    }
    console.log("✅ Default availability set (9am-7pm daily)");

    // Create default settings
    await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        salonPhone: "+447350167537",
        salonAddress: "Lincoln, LN1 1RP, UK",
      },
      create: {
        id: "default",
        salonName: "LAYO HAIR",
        salonEmail: "hello@layohair.com",
        salonPhone: "+447350167537",
        salonAddress: "Lincoln, LN1 1RP, UK",
        bookingBuffer: 30,
        maxAdvanceBooking: 30,
        minAdvanceBooking: 2,
      },
    });
    console.log("✅ Salon settings configured");

    console.log("\n🎉 Database seeding completed!");
    console.log("\n📋 Admin Login:");
    console.log("   Email: admin@layohair.com");
    console.log("   Password: LayoHair2025!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
