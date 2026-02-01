import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/styles - Create a new style
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      duration,
      category,
      images,
      isFeatured,
      isHidden,
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !duration || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, price, duration, category" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingStyle = await prisma.style.findUnique({
      where: { slug },
    });

    if (existingStyle) {
      return NextResponse.json(
        { error: "A style with this slug already exists" },
        { status: 409 }
      );
    }

    const style = await prisma.style.create({
      data: {
        name,
        slug,
        description: description || "",
        price,
        duration,
        category,
        images: images || [],
        isFeatured: isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json({
      ...style,
      price: Number(style.price),
    });
  } catch (error) {
    console.error("Error creating style:", error);
    return NextResponse.json(
      { error: "Failed to create style" },
      { status: 500 }
    );
  }
}

// GET /api/admin/styles - Get all styles (including hidden)
export async function GET() {
  try {
    const styles = await prisma.style.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      styles.map((style) => ({
        ...style,
        price: Number(style.price),
        bookingCount: style._count.bookings,
      }))
    );
  } catch (error) {
    console.error("Error fetching styles:", error);
    return NextResponse.json(
      { error: "Failed to fetch styles" },
      { status: 500 }
    );
  }
}
