/**
 * Script to create an admin user
 * Run with: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/create-admin.ts
 * Or use: npx tsx scripts/create-admin.ts
 */

import bcrypt from "bcryptjs";

async function main() {
  // Default admin credentials - CHANGE THESE IN PRODUCTION!
  const adminEmail = "admin@layohair.com";
  const adminPassword = "Admin123!"; // Change this!
  const adminName = "Admin User";

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  console.log("=".repeat(50));
  console.log("ADMIN USER CREDENTIALS");
  console.log("=".repeat(50));
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Hashed Password: ${hashedPassword}`);
  console.log("=".repeat(50));
  console.log("\nRun this SQL in Supabase to create/update the admin user:\n");
  console.log(`
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin-user-001',
  '${adminEmail}',
  '${hashedPassword}',
  '${adminName}',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  password = '${hashedPassword}',
  role = 'ADMIN',
  "updatedAt" = NOW();
  `);
  console.log("=".repeat(50));
}

main();
