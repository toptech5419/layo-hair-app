import { Pool } from "pg";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  console.log("Testing database connection...");
  console.log("URL:", connectionString?.replace(/:[^:@]+@/, ":****@"));

  if (!connectionString) {
    console.error("DATABASE_URL not set!");
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', ['admin@layohair.com']);

    if (result.rows.length > 0) {
      console.log("\n✅ SUCCESS! Admin user found:");
      console.log("  ID:", result.rows[0].id);
      console.log("  Email:", result.rows[0].email);
      console.log("  Name:", result.rows[0].name);
      console.log("  Role:", result.rows[0].role);
      console.log("  Password hash exists:", !!result.rows[0].password);
    } else {
      console.log("\n❌ Admin user NOT found in database!");

      // Check if User table exists and has any users
      const countResult = await pool.query('SELECT COUNT(*) FROM "User"');
      console.log("  Total users in database:", countResult.rows[0].count);
    }
  } catch (error) {
    console.error("\n❌ Database error:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
