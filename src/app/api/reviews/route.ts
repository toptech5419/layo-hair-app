import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews - Get approved reviews (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const styleId = searchParams.get("styleId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const reviews = await prisma.review.findMany({
      where: {
        isApproved: true,
        ...(styleId && { styleId }),
      },
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
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Format reviews for public display
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      customerName: review.customer?.name || "Anonymous",
      styleName: review.style?.name,
      createdAt: review.createdAt,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, styleId, bookingRef, customerName, customerEmail } = body;

    // Validate required fields
    if (!rating || !styleId) {
      return NextResponse.json(
        { error: "Rating and styleId are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if style exists
    const style = await prisma.style.findUnique({
      where: { id: styleId },
    });

    if (!style) {
      return NextResponse.json(
        { error: "Style not found" },
        { status: 404 }
      );
    }

    // If booking reference provided, verify it exists and get customer info
    let customerId: string | null = null;
    let verifiedCustomerName = customerName;

    if (bookingRef) {
      const booking = await prisma.booking.findUnique({
        where: { bookingRef: bookingRef.toUpperCase() },
      });

      if (booking) {
        verifiedCustomerName = booking.guestName;

        // Check if this booking already has a review
        // Note: This would require adding bookingId to Review model
        // For now, we'll allow reviews without booking verification
      }
    }

    // Try to find customer by email
    if (customerEmail) {
      const customer = await prisma.user.findUnique({
        where: { email: customerEmail },
      });
      if (customer) {
        customerId = customer.id;
        verifiedCustomerName = customer.name || verifiedCustomerName;
      }
    }

    // Create a temporary customer if none exists
    if (!customerId && customerEmail) {
      const newCustomer = await prisma.user.create({
        data: {
          email: customerEmail,
          name: verifiedCustomerName || "Guest",
          role: "CUSTOMER",
        },
      });
      customerId = newCustomer.id;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer email is required to submit a review" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        styleId,
        customerId,
        isApproved: false, // Reviews need admin approval
      },
      include: {
        style: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your review! It will be visible after approval.",
      review: {
        id: review.id,
        rating: review.rating,
        styleName: review.style?.name,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
