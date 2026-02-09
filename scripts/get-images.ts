import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
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

  const style = await prisma.style.findFirst({
    where: { slug: "lemonade-braids" },
    select: { name: true, images: true }
  });

  if (style) {
    console.log("Style:", style.name);
    console.log("Images:");
    style.images.forEach((img, i) => console.log(`  ${i + 1}: ${img}`));
  } else {
    console.log("Lemonade braids style not found");
    // List all styles
    const all = await prisma.style.findMany({ select: { slug: true, name: true } });
    console.log("\nAll styles:");
    all.forEach(s => console.log(`  - ${s.slug}: ${s.name}`));
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
