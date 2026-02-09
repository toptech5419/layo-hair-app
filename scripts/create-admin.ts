import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL not found in environment");
  }
  console.log("Using database:", dbUrl.substring(0, 50) + "...");
  const url = new URL(dbUrl);
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

  console.log("🔍 Checking admin user in database...\n");

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@layohair.com" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user found:");
    console.log(`   ID: ${existingAdmin.id}`);
    console.log(`   Email: ${existingAdmin.email}`);
    console.log(`   Name: ${existingAdmin.name}`);
    console.log(`   Role: ${existingAdmin.role}`);
    console.log(`   Has Password: ${existingAdmin.password ? "Yes" : "No"}`);
  } else {
    console.log("❌ Admin user NOT found in database!");
  }

  // Create/update admin with new password
  const newPassword = "LayoHair2025!";
  const hashedPassword = await hash(newPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@layohair.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: "admin@layohair.com",
      name: "Layo",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+447350167537",
    },
  });

  console.log("\n✅ Admin user created/updated:");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${newPassword}`);
  console.log(`   Role: ${admin.role}`);

  // List all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  console.log("\n📋 All users in database:");
  allUsers.forEach((u) => {
    console.log(`   ${u.email} - ${u.role}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
