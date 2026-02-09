import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log("Uploading hero image...");

  const result = await cloudinary.uploader.upload(
    "styles/lemonade-braids/download (47).jpg",
    {
      folder: "layo-hair/hero",
      public_id: "lemonade-braids-hero",
      overwrite: true,
      transformation: [
        { quality: "auto:best", fetch_format: "auto" }
      ]
    }
  );

  console.log("\n✅ Hero image uploaded!");
  console.log("URL:", result.secure_url);
  console.log("Dimensions:", result.width, "x", result.height);
}

main().catch(console.error);
