import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/styles - Fetch all active styles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const styles = await prisma.style.findMany({
      where: {
        isActive: true,
        ...(category && category !== "All" ? { category: category as any } : {}),
        ...(featured === "true" ? { isFeatured: true } : {}),
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Convert Decimal to number for JSON serialization
    const serializedStyles = styles.map((style) => ({
      ...style,
      price: Number(style.price),
    }));

    return NextResponse.json(serializedStyles);
  } catch (error) {
    console.error("Error fetching styles:", error);
    return NextResponse.json(
      { error: "Failed to fetch styles" },
      { status: 500 }
    );
  }
}
