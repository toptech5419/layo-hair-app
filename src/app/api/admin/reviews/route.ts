import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reviews - Get all reviews (admin)
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        style: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
