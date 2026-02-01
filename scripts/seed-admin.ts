import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const adminEmail = "admin@layohair.com";
  const adminPassword = "LayoHair2025!";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "Layo",
        phone: "+447350167537",
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: "Layo",
        role: "ADMIN",
        phone: "+447350167537",
      },
    });

    console.log("Admin user created/updated:", user.email);
    console.log("Login with:");
    console.log("  Email:", adminEmail);
    console.log("  Password:", adminPassword);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
