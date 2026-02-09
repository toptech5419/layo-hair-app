import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";
import { stripe, isStripeConfigured } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      console.log("Stripe webhook received but Stripe is not configured");
      return NextResponse.json({ received: true, mode: "mock" });
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  const bookingRef = session.metadata?.bookingRef;

  console.log(`Checkout completed for booking: ${bookingRef} (${bookingId})`);

  if (!bookingId) {
    console.error("No bookingId in session metadata");
    return;
  }

  try {
    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          stripePaymentId: session.payment_intent as string || null,
        },
      });
      console.log(`Payment ${payment.id} marked as COMPLETED`);
    }

    // Update booking status to CONFIRMED and get booking details
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
      },
      include: {
        style: true,
        payments: {
          where: { status: "COMPLETED" },
        },
      },
    });
    console.log(`Booking ${bookingRef} confirmed`);

    // Send confirmation email (only if not already sent)
    if (booking.confirmationSent) {
      console.log(`Confirmation email already sent for ${bookingRef} - skipping`);
      return;
    }

    const amountPaid = booking.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const totalPrice = Number(booking.totalPrice);
    const balanceDue = totalPrice - amountPaid;

    const emailResult = await sendBookingConfirmation({
      customerName: booking.guestName || "Customer",
      customerEmail: booking.guestEmail || "",
      customerPhone: booking.guestPhone || undefined,
      bookingRef: booking.bookingRef,
      styleName: booking.style.name,
      date: booking.date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: booking.startTime,
      totalPrice,
      amountPaid,
      balanceDue,
      paymentType: booking.payments[0]?.paymentType === "FULL" ? "full" : "deposit",
    });

    if (emailResult.success) {
      // Update booking to mark confirmation as sent
      await prisma.booking.update({
        where: { id: bookingId },
        data: { confirmationSent: true },
      });
      console.log(`Confirmation email sent for ${bookingRef}`);
    } else {
      console.error(`Failed to send confirmation email: ${emailResult.error}`);
    }

  } catch (error) {
    console.error("Error updating booking after checkout:", error);
    throw error;
  }
}

// Handle expired checkout session
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  const bookingRef = session.metadata?.bookingRef;

  console.log(`Checkout expired for booking: ${bookingRef}`);

  if (!bookingId) {
    return;
  }

  try {
    // Update payment status to FAILED
    const payment = await prisma.payment.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
    }

    // Keep booking as PENDING or mark as CANCELLED
    // For now, we'll keep it as PENDING so the customer can try again
    console.log(`Booking ${bookingRef} checkout expired - keeping as PENDING`);

  } catch (error) {
    console.error("Error handling expired checkout:", error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment failed: ${paymentIntent.id}`);

  try {
    // Find payment by Stripe payment ID
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      console.log(`Payment ${payment.id} marked as FAILED`);
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
    throw error;
  }
}
