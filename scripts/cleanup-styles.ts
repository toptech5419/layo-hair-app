import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const url = new URL(process.env.DATABASE_URL!);
  const pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🧹 Cleaning up styles database...\n");

  // Delete the "you" style
  try {
    await prisma.style.deleteMany({ where: { name: "you" } });
    console.log("✅ Deleted 'you' style");
  } catch (e) {
    console.log("⚠️  Could not delete 'you' style");
  }

  // Delete duplicate Classic Cornrows (keep one with most images)
  const classicCornrows = await prisma.style.findMany({
    where: { name: "Classic Cornrows" },
  });
  if (classicCornrows.length > 1) {
    // Sort by images count, keep the one with most
    classicCornrows.sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
    for (let i = 1; i < classicCornrows.length; i++) {
      await prisma.style.delete({ where: { id: classicCornrows[i].id } });
      console.log("✅ Deleted duplicate Classic Cornrows");
    }
  }

  // Delete old styles that only have Unsplash URLs and aren't our uploaded ones
  const oldStyles = [
    "Boho Braids",
    "Box Braids",
    "Butterfly Locs",
    "Deep Conditioning Treatment",
    "Goddess Locs",
    "Natural Hair Styling",
    "Passion Twists",
    "Senegalese Twists",
    "Soft Locs",
    "Tribal Braids",
    "Classic Cornrows",
  ];

  for (const styleName of oldStyles) {
    const style = await prisma.style.findFirst({
      where: { name: styleName },
      include: { _count: { select: { bookings: true } } },
    });

    if (style && style._count.bookings === 0) {
      // Check if it has Unsplash images (not Cloudinary)
      const hasUnsplash = style.images?.[0]?.includes("unsplash");
      if (hasUnsplash || (style.images?.length || 0) <= 1) {
        await prisma.style.delete({ where: { id: style.id } });
        console.log(`✅ Deleted old style: ${styleName}`);
      }
    }
  }

  // Show remaining styles
  const remaining = await prisma.style.findMany({
    select: { name: true, category: true, images: true, isFeatured: true },
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  console.log("\n📊 Remaining active styles:", remaining.length);
  remaining.forEach((s) => {
    const featured = s.isFeatured ? "⭐" : "  ";
    console.log(`${featured} ${s.name} (${s.category}) - ${s.images?.length || 0} images`);
  });

  await prisma.$disconnect();
  await pool.end();
}
main();
