import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/availability - Get all availability slots
export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(availability);
  } catch (error: any) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST /api/availability - Save weekly schedule
export async function POST(request: NextRequest) {
  try {
    const { schedule } = await request.json();

    if (!schedule || !Array.isArray(schedule)) {
      return NextResponse.json(
        { error: "Invalid schedule data" },
        { status: 400 }
      );
    }

    // Update or create availability for each day (salon-wide, no stylist)
    for (const item of schedule) {
      // First try to find existing availability
      const existing = await prisma.availability.findFirst({
        where: {
          stylistId: null,
          dayOfWeek: item.dayOfWeek,
        },
      });

      if (existing) {
        await prisma.availability.update({
          where: { id: existing.id },
          data: {
            isAvailable: item.isOpen,
            startTime: item.start,
            endTime: item.end,
          },
        });
      } else {
        await prisma.availability.create({
          data: {
            dayOfWeek: item.dayOfWeek,
            isAvailable: item.isOpen,
            startTime: item.start,
            endTime: item.end,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving availability:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save availability" },
      { status: 500 }
    );
  }
}
