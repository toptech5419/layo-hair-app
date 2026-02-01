import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/slots?date=2026-02-01
// Returns booked time slots for a specific date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const queryDate = new Date(dateParam);
    if (isNaN(queryDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Set date range for the query (entire day)
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all bookings for this date that are not cancelled
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ["CANCELLED"],
        },
      },
      select: {
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    // Extract booked time slots
    const bookedSlots = bookings.map((booking) => ({
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    }));

    // Check if date is blocked
    const blockedDate = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Get availability for this day of week
    const dayOfWeek = queryDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const availability = await prisma.availability.findFirst({
      where: {
        dayOfWeek: dayOfWeek,
        stylistId: null, // Salon-wide default
      },
    });

    return NextResponse.json({
      date: dateParam,
      bookedSlots,
      isBlocked: !!blockedDate,
      blockReason: blockedDate?.reason || null,
      isOpen: availability?.isAvailable ?? true,
      openTime: availability?.startTime || "09:00",
      closeTime: availability?.endTime || "17:00",
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
