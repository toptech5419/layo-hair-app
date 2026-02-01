import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaClient, Category } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Style definitions matching local folders
const styleDefinitions = [
  {
    folder: "knotless-braids",
    name: "Knotless Braids",
    slug: "knotless-braids",
    description:
      "Lightweight, natural-looking braids that start with your natural hair. Knotless braids are a protective style that reduces tension on your scalp and edges. Perfect for those who want a seamless, natural look that lasts 6-8 weeks.",
    category: Category.BRAIDS,
    price: 120,
    duration: 240,
    isFeatured: true,
  },
  {
    folder: "fulani-braids",
    name: "Fulani Braids",
    slug: "fulani-braids",
    description:
      "Traditional African style with beads and unique patterns. Fulani braids are inspired by the Fulani people of West Africa and feature intricate designs with beads and cowrie shells. A statement style that celebrates African heritage.",
    category: Category.BRAIDS,
    price: 150,
    duration: 300,
    isFeatured: true,
  },
  {
    folder: "short-boho-braids",
    name: "Short Boho Braids",
    slug: "short-boho-braids",
    description:
      "Trendy bohemian style with curly ends for a carefree look. Perfect for those who want the beauty of braids with a playful, effortless vibe. Low-maintenance and stylish.",
    category: Category.BRAIDS,
    price: 140,
    duration: 270,
    isFeatured: true,
  },
  {
    folder: "french-curls",
    name: "French Curls",
    slug: "french-curls",
    description:
      "Elegant curly braids with a sophisticated French twist. This style combines the elegance of French braiding techniques with beautiful curly extensions for a romantic, sophisticated look.",
    category: Category.BRAIDS,
    price: 160,
    duration: 300,
    isFeatured: true,
  },
  {
    folder: "all-back-cornrows",
    name: "All-Back Cornrows",
    slug: "all-back-cornrows",
    description:
      "Classic straight-back cornrows braided close to the scalp. Timeless and versatile, perfect for any occasion. A clean, professional look that showcases beautiful braiding patterns.",
    category: Category.CORNROWS,
    price: 80,
    duration: 180,
    isFeatured: false,
  },
  {
    folder: "double-cornrows",
    name: "Double Cornrows",
    slug: "double-cornrows",
    description:
      "Two sleek cornrows running from front to back. A bold, athletic-inspired style that's both practical and fashionable. Perfect for an active lifestyle while looking stylish.",
    category: Category.CORNROWS,
    price: 60,
    duration: 120,
    isFeatured: false,
  },
  {
    folder: "half-cornrows",
    name: "Half Cornrows",
    slug: "half-cornrows",
    description:
      "Cornrows on top with loose hair or extensions at the back. A versatile half-up half-down style that combines the elegance of cornrows with flowing hair for a beautiful contrast.",
    category: Category.CORNROWS,
    price: 100,
    duration: 180,
    isFeatured: true,
  },
  {
    folder: "stitch-braids",
    name: "Stitch Braids",
    slug: "stitch-braids",
    description:
      "Neat, precise cornrows with visible stitch patterns. This modern technique creates clean, defined parts that look like stitching. A trendy take on traditional cornrows.",
    category: Category.CORNROWS,
    price: 90,
    duration: 210,
    isFeatured: true,
  },
  {
    folder: "lemonade-braids",
    name: "Lemonade Braids",
    slug: "lemonade-braids",
    description:
      "Side-swept cornrows made famous by Beyoncé. These stunning braids sweep to one side for a dramatic, glamorous look. Perfect for special occasions or everyday glam.",
    category: Category.CORNROWS,
    price: 110,
    duration: 240,
    isFeatured: true,
  },
  {
    folder: "invisible-locs",
    name: "Invisible Locs",
    slug: "invisible-locs",
    description:
      "Lightweight faux locs with a natural, seamless appearance. These locs are installed with a technique that hides the attachment point, giving a realistic look as if the locs are growing from your scalp.",
    category: Category.LOCS,
    price: 170,
    duration: 330,
    isFeatured: true,
  },
  {
    folder: "island-twists",
    name: "Island Twists",
    slug: "island-twists",
    description:
      "Tropical-inspired twists with a carefree, beachy vibe. These beautiful twists are perfect for vacation or bringing island vibes to your everyday look. Lightweight and stylish.",
    category: Category.TWISTS,
    price: 130,
    duration: 240,
    isFeatured: false,
  },
  {
    folder: "bantu-knots",
    name: "Bantu Knots",
    slug: "bantu-knots",
    description:
      "Traditional African hairstyle with hair twisted into small knots. Bantu knots are a beautiful protective style that celebrates African heritage. Can be worn as-is or unraveled for gorgeous curls.",
    category: Category.NATURAL,
    price: 70,
    duration: 150,
    isFeatured: false,
  },
];

async function uploadImage(
  filePath: string,
  folder: string
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `layo-hair/styles/${folder}`,
      resource_type: "image",
      transformation: [
        { width: 800, height: 1000, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
}

async function getImagesFromFolder(folderPath: string): Promise<string[]> {
  const files = fs.readdirSync(folderPath);
  return files.filter((file) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(
      path.extname(file).toLowerCase()
    )
  );
}

async function main() {
  console.log("🚀 Starting image upload and database seeding...\n");

  // Setup database connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  let poolConfig: any;
  try {
    const url = new URL(connectionString);
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      user: url.username,
      password: decodeURIComponent(url.password),
      ssl: { rejectUnauthorized: false },
    };
  } catch {
    poolConfig = {
      connectionString,
      ssl: { rejectUnauthorized: false },
    };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const stylesDir = path.join(process.cwd(), "styles");

  try {
    for (const styleDef of styleDefinitions) {
      const folderPath = path.join(stylesDir, styleDef.folder);

      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder not found: ${styleDef.folder}, skipping...`);
        continue;
      }

      console.log(`\n📁 Processing: ${styleDef.name}`);

      // Get all images in folder
      const imageFiles = await getImagesFromFolder(folderPath);
      console.log(`   Found ${imageFiles.length} images`);

      // Upload ALL images per style
      const uploadedUrls: string[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imagePath = path.join(folderPath, imageFiles[i]);
        console.log(`   Uploading: ${imageFiles[i]}...`);

        const url = await uploadImage(imagePath, styleDef.folder);
        if (url) {
          uploadedUrls.push(url);
          console.log(`   ✅ Uploaded successfully`);
        }
      }

      if (uploadedUrls.length === 0) {
        console.log(`   ❌ No images uploaded for ${styleDef.name}`);
        continue;
      }

      // Upsert style in database
      const { folder, ...styleData } = styleDef;
      await prisma.style.upsert({
        where: { slug: styleDef.slug },
        update: {
          ...styleData,
          images: uploadedUrls,
        },
        create: {
          ...styleData,
          images: uploadedUrls,
        },
      });

      console.log(
        `   ✅ Style "${styleDef.name}" saved with ${uploadedUrls.length} images`
      );
    }

    console.log("\n🎉 All styles uploaded and saved successfully!");
    console.log("\n📊 Summary:");

    const styles = await prisma.style.findMany({
      select: { name: true, images: true, isFeatured: true },
    });

    styles.forEach((style) => {
      const featured = style.isFeatured ? "⭐" : "  ";
      console.log(
        `   ${featured} ${style.name}: ${style.images.length} images`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
