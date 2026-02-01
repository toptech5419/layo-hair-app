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

  const styles = await prisma.style.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      isActive: true,
      isFeatured: true,
      images: true,
    },
    orderBy: { name: "asc" },
  });

  console.log("\n📊 All Styles in Database:\n");
  console.log("Total styles:", styles.length);
  console.log("\n");

  styles.forEach((s) => {
    const featured = s.isFeatured ? "⭐" : "  ";
    const active = s.isActive ? "✅" : "❌";
    const imgCount = s.images?.length || 0;
    const hasCloudinary = s.images?.[0]?.includes("cloudinary") ? "☁️" : "🔗";
    console.log(
      `${featured} ${active} ${hasCloudinary} ${s.name.padEnd(30)} | ${s.category.padEnd(10)} | ${imgCount} images`
    );
  });

  // Count by category
  console.log("\n📁 Categories breakdown:");
  const categoryCount: Record<string, number> = {};
  styles.forEach((s) => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  });
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} styles`);
  });

  await prisma.$disconnect();
  await pool.end();
}
main();
