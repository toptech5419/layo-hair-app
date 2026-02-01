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
    where: { isFeatured: true },
    select: { name: true, slug: true, images: true },
    take: 5,
  });

  console.log("\n🖼️  Featured Style Images:\n");
  styles.forEach((s) => {
    console.log(`📌 ${s.name}`);
    console.log(`   ${s.images[0]}`);
    console.log("");
  });

  await prisma.$disconnect();
  await pool.end();
}
main();
