import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

// POST /api/verify-payment - Verify Stripe session and update booking
export async function POST(request: NextRequest) {
  try {
    const { sessionId, bookingRef } = await request.json();

    if (!sessionId && !bookingRef) {
      return NextResponse.json(
        { error: "Session ID or booking reference required" },
        { status: 400 }
      );
    }

    // If we have a Stripe session ID, verify with Stripe
    if (sessionId && process.env.STRIPE_SECRET_KEY) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
          const bookingId = session.metadata?.bookingId;
          const ref = session.metadata?.bookingRef || bookingRef;

          if (bookingId) {
            // Update payment record
            const payment = await prisma.payment.findFirst({
              where: { stripeSessionId: sessionId },
            });

            if (payment && payment.status !== "COMPLETED") {
              await prisma.payment.update({
                where: { id: payment.id },
                data: {
                  status: "COMPLETED",
                  stripePaymentId: session.payment_intent as string,
                },
              });
            }

            // Update booking to CONFIRMED
            const booking = await prisma.booking.update({
              where: { id: bookingId },
              data: { status: "CONFIRMED" },
              include: {
                style: true,
                payments: true,
              },
            });

            // Calculate totals
            const totalPaid = booking.payments
              .filter((p) => p.status === "COMPLETED")
              .reduce((sum, p) => sum + Number(p.amount), 0);

            const balanceDue = Number(booking.totalPrice) - totalPaid;

            // Email is sent by the webhook handler (/api/webhook/stripe)
            // No need to send here to avoid duplicates

            return NextResponse.json({
              success: true,
              verified: true,
              booking: {
                ...booking,
                totalPrice: Number(booking.totalPrice),
                totalPaid,
                balanceDue,
                style: {
                  ...booking.style,
                  price: Number(booking.style.price),
                },
              },
            });
          }
        }
      } catch (stripeError: any) {
        console.error("Stripe verification error:", stripeError.message);
        // Fall through to booking ref lookup
      }
    }

    // Fallback: Look up booking by reference
    if (bookingRef) {
      const booking = await prisma.booking.findUnique({
        where: { bookingRef: bookingRef.toUpperCase() },
        include: {
          style: true,
          payments: true,
        },
      });

      if (booking) {
        const totalPaid = booking.payments
          .filter((p) => p.status === "COMPLETED")
          .reduce((sum, p) => sum + Number(p.amount), 0);

        return NextResponse.json({
          success: true,
          verified: booking.status === "CONFIRMED",
          booking: {
            ...booking,
            totalPrice: Number(booking.totalPrice),
            totalPaid,
            balanceDue: Number(booking.totalPrice) - totalPaid,
            style: {
              ...booking.style,
              price: Number(booking.style.price),
            },
          },
        });
      }
    }

    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
