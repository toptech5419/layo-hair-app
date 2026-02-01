import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const styles = [
  {
    name: "Knotless Braids",
    slug: "knotless-braids",
    description: "Gentle, lightweight braids that start with your natural hair for a seamless, pain-free look.",
    price: 120,
    duration: 240,
    category: "BRAIDS",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"],
    isFeatured: true,
  },
  {
    name: "Fulani Braids",
    slug: "fulani-braids",
    description: "Traditional African style with unique patterns and beautiful beaded accessories.",
    price: 150,
    duration: 300,
    category: "BRAIDS",
    images: ["https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=500&fit=crop"],
    isFeatured: true,
  },
  {
    name: "Boho Braids",
    slug: "boho-braids",
    description: "Bohemian-inspired braids with loose curly ends for a carefree, stylish look.",
    price: 140,
    duration: 270,
    category: "BRAIDS",
    images: ["https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&h=500&fit=crop"],
    isFeatured: false,
  },
  {
    name: "French Curl Braids",
    slug: "french-curls",
    description: "Elegant braids with bouncy French curls for a sophisticated finish.",
    price: 160,
    duration: 300,
    category: "BRAIDS",
    images: ["https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=400&h=500&fit=crop"],
    isFeatured: true,
  },
  {
    name: "Classic Cornrows",
    slug: "cornrows",
    description: "Timeless cornrow styles in various patterns - straight back, designs, or custom.",
    price: 80,
    duration: 180,
    category: "CORNROWS",
    images: ["https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=400&h=500&fit=crop"],
    isFeatured: false,
  },
  {
    name: "Goddess Locs",
    slug: "goddess-locs",
    description: "Soft, flowy faux locs with curly accents for a divine, goddess-like appearance.",
    price: 180,
    duration: 360,
    category: "LOCS",
    images: ["https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=500&fit=crop"],
    isFeatured: true,
  },
  {
    name: "Passion Twists",
    slug: "passion-twists",
    description: "Trendy, fluffy twists with a natural texture that's lightweight and versatile.",
    price: 135,
    duration: 240,
    category: "TWISTS",
    images: ["https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=400&h=500&fit=crop"],
    isFeatured: false,
  },
  {
    name: "Butterfly Locs",
    slug: "butterfly-locs",
    description: "Distressed faux locs with a bohemian, effortlessly messy aesthetic.",
    price: 165,
    duration: 300,
    category: "LOCS",
    images: ["https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=400&h=500&fit=crop"],
    isFeatured: false,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding styles...\n");

  for (const style of styles) {
    try {
      const created = await prisma.style.upsert({
        where: { slug: style.slug },
        update: {
          name: style.name,
          description: style.description,
          price: style.price,
          duration: style.duration,
          category: style.category as any,
          images: style.images,
          isFeatured: style.isFeatured,
        },
        create: {
          name: style.name,
          slug: style.slug,
          description: style.description,
          price: style.price,
          duration: style.duration,
          category: style.category as any,
          images: style.images,
          isFeatured: style.isFeatured,
        },
      });
      console.log(`✓ ${created.name} (${created.slug})`);
    } catch (error) {
      console.error(`✗ Failed to seed ${style.name}:`, error);
    }
  }

  console.log("\nStyles seeded successfully!");

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
