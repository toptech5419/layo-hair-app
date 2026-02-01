import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/styles/[id] - Get a single style
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const style = await prisma.style.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
    });

    if (!style) {
      return NextResponse.json(
        { error: "Style not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...style,
      price: Number(style.price),
    });
  } catch (error) {
    console.error("Error fetching style:", error);
    return NextResponse.json(
      { error: "Failed to fetch style" },
      { status: 500 }
    );
  }
}

// Helper function to update style
async function updateStyle(id: string, body: any) {
  const {
    name,
    slug,
    description,
    price,
    duration,
    category,
    images,
    isFeatured,
    isActive,
  } = body;

  // Check if style exists
  const existingStyle = await prisma.style.findUnique({
    where: { id },
  });

  if (!existingStyle) {
    return { error: "Style not found", status: 404 };
  }

  // Check if new slug conflicts with another style
  if (slug && slug !== existingStyle.slug) {
    const slugConflict = await prisma.style.findUnique({
      where: { slug },
    });
    if (slugConflict) {
      return { error: "A style with this slug already exists", status: 409 };
    }
  }

  const style = await prisma.style.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(duration !== undefined && { duration }),
      ...(category !== undefined && { category }),
      ...(images !== undefined && { images }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return { style };
}

// PUT /api/admin/styles/[id] - Update a style (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await updateStyle(id, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ...result.style,
      price: Number(result.style!.price),
    });
  } catch (error) {
    console.error("Error updating style:", error);
    return NextResponse.json(
      { error: "Failed to update style" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/styles/[id] - Update a style (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await updateStyle(id, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ...result.style,
      price: Number(result.style!.price),
    });
  } catch (error) {
    console.error("Error updating style:", error);
    return NextResponse.json(
      { error: "Failed to update style" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/styles/[id] - Delete a style
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if style exists
    const style = await prisma.style.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!style) {
      return NextResponse.json(
        { error: "Style not found" },
        { status: 404 }
      );
    }

    // Prevent deletion if style has bookings
    if (style._count.bookings > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete style with ${style._count.bookings} existing bookings. Hide it instead.`,
        },
        { status: 409 }
      );
    }

    await prisma.style.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Style deleted" });
  } catch (error) {
    console.error("Error deleting style:", error);
    return NextResponse.json(
      { error: "Failed to delete style" },
      { status: 500 }
    );
  }
}
