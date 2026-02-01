import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  // Use DATABASE_URL (pooler) for connection - works with IPv4 networks
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
      database: url.pathname.slice(1), // Remove leading /
      user: url.username,
      password: decodeURIComponent(url.password), // Decode URL-encoded password
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
      },
    };
  } catch (e) {
    // If URL parsing fails, use the connection string directly
    poolConfig = {
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  const pool = globalForPrisma.pool ?? new Pool(poolConfig);
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
