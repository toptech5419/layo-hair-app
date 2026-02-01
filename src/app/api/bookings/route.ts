import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate booking reference like LAYO-ABC123
function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "LAYO-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// GET /api/bookings - Fetch bookings (admin) or single booking by ref
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    if (ref) {
      // Fetch single booking by reference
      const booking = await prisma.booking.findUnique({
        where: { bookingRef: ref.toUpperCase() },
        include: {
          style: true,
          payments: true,
        },
      });

      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      // Calculate payment totals
      const totalPaid = booking.payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + Number(p.amount), 0);

      return NextResponse.json({
        ...booking,
        totalPrice: Number(booking.totalPrice),
        totalPaid,
        balanceDue: Number(booking.totalPrice) - totalPaid,
        style: {
          ...booking.style,
          price: Number(booking.style.price),
        },
      });
    }

    // Fetch all bookings (for admin)
    const bookings = await prisma.booking.findMany({
      include: {
        style: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const serializedBookings = bookings.map((booking) => ({
      ...booking,
      totalPrice: Number(booking.totalPrice),
      style: {
        ...booking.style,
        price: Number(booking.style.price),
      },
    }));

    return NextResponse.json(serializedBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      styleId,
      date,
      startTime,
      endTime,
      guestName,
      guestEmail,
      guestPhone,
      notes,
      totalPrice,
    } = body;

    // Validate required fields
    if (!styleId || !date || !startTime || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for slot availability (prevent double booking)
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if date is blocked
    const blockedDate = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (blockedDate) {
      return NextResponse.json(
        { error: `This date is not available: ${blockedDate.reason || "Salon closed"}` },
        { status: 409 }
      );
    }

    // Check for existing booking at the same time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        startTime: startTime,
        status: {
          notIn: ["CANCELLED"],
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    // Generate unique booking reference
    let bookingRef = generateBookingRef();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.booking.findUnique({
        where: { bookingRef },
      });
      if (!existing) break;
      bookingRef = generateBookingRef();
      attempts++;
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        styleId,
        date: new Date(date),
        startTime,
        endTime: endTime || startTime,
        guestName,
        guestEmail,
        guestPhone,
        notes,
        totalPrice,
        status: "PENDING",
      },
      include: {
        style: true,
      },
    });

    return NextResponse.json({
      ...booking,
      totalPrice: Number(booking.totalPrice),
      style: {
        ...booking.style,
        price: Number(booking.style.price),
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingRef, status } = body;

    if (!bookingRef || !status) {
      return NextResponse.json(
        { error: "Missing bookingRef or status" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: { bookingRef },
      data: { status },
      include: { style: true },
    });

    return NextResponse.json({
      ...booking,
      totalPrice: Number(booking.totalPrice),
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
