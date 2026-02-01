import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/availability/blocked - Get all blocked dates
export async function GET() {
  try {
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(blockedDates);
  } catch (error: any) {
    console.error("Error fetching blocked dates:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blocked dates" },
      { status: 500 }
    );
  }
}

// POST /api/availability/blocked - Add a blocked date
export async function POST(request: NextRequest) {
  try {
    const { date, reason } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        date: new Date(date),
        reason: reason || null,
      },
    });

    return NextResponse.json({ id: blockedDate.id, success: true });
  } catch (error: any) {
    console.error("Error creating blocked date:", error);
    return NextResponse.json(
      { error: error.message || "Failed to block date" },
      { status: 500 }
    );
  }
}

// DELETE /api/availability/blocked - Remove a blocked date
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.blockedDate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blocked date:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unblock date" },
      { status: 500 }
    );
  }
}
