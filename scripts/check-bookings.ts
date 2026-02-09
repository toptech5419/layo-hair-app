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

  console.log("📋 Recent Bookings:\n");

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      style: { select: { name: true } },
      payments: true,
    },
  });

  if (bookings.length === 0) {
    console.log("No bookings found.");
  } else {
    bookings.forEach((b) => {
      console.log(`📌 ${b.bookingRef}`);
      console.log(`   Style: ${b.style.name}`);
      console.log(`   Guest: ${b.guestName} (${b.guestEmail})`);
      console.log(`   Date: ${b.date.toDateString()} at ${b.startTime}`);
      console.log(`   Status: ${b.status}`);
      console.log(`   Total: £${Number(b.totalPrice)}`);
      console.log(`   Confirmation Sent: ${b.confirmationSent ? "Yes" : "No"}`);
      console.log(`   Payments:`);
      if (b.payments.length === 0) {
        console.log(`      (none)`);
      } else {
        b.payments.forEach((p) => {
          console.log(`      - £${Number(p.amount)} | ${p.paymentType} | ${p.status}`);
          console.log(`        Stripe Session: ${p.stripeSessionId || "N/A"}`);
        });
      }
      console.log(`   Created: ${b.createdAt.toISOString()}`);
      console.log("");
    });
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
