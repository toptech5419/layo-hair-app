import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";

// Generate booking reference like LAYO-ABC123
function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "LAYO-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the base URL from the request or environment
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "https://layo-hair-app.vercel.app";
    const {
      styleId,
      styleName,
      stylePrice,
      styleSlug,
      customerName,
      customerEmail,
      customerPhone,
      appointmentDate,
      appointmentTime,
      notes,
      paymentType, // 'deposit' or 'full'
    } = body;

    // Calculate amount based on payment type
    const depositPercentage = 0.3; // 30% deposit
    const amount = paymentType === "deposit"
      ? stylePrice * depositPercentage
      : stylePrice;

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

    // Find style ID if not provided
    let resolvedStyleId = styleId;
    if (!resolvedStyleId && styleSlug) {
      const style = await prisma.style.findUnique({
        where: { slug: styleSlug },
      });
      resolvedStyleId = style?.id;
    }

    if (!resolvedStyleId) {
      return NextResponse.json(
        { error: "Style not found" },
        { status: 400 }
      );
    }

    // Calculate end time (add duration to start time)
    const style = await prisma.style.findUnique({
      where: { id: resolvedStyleId },
    });
    const durationMinutes = style?.duration || 240;
    const [hours, minutes] = appointmentTime.split(/[:\s]/);
    const isPM = appointmentTime.toLowerCase().includes("pm");
    let startHour = parseInt(hours);
    if (isPM && startHour !== 12) startHour += 12;
    if (!isPM && startHour === 12) startHour = 0;
    const startMinutes = parseInt(minutes) || 0;
    const totalMinutes = startHour * 60 + startMinutes + durationMinutes;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMin = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
    const startTime24 = `${startHour.toString().padStart(2, "0")}:${startMinutes.toString().padStart(2, "0")}`;

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        styleId: resolvedStyleId,
        date: new Date(appointmentDate),
        startTime: startTime24,
        endTime,
        guestName: customerName,
        guestEmail: customerEmail,
        guestPhone: customerPhone,
        notes: notes || null,
        totalPrice: stylePrice,
        status: "PENDING",
      },
    });

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_your_secret_key_here") {
      // Create mock payment record
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          currency: "gbp",
          paymentType: paymentType === "deposit" ? "DEPOSIT" : "FULL",
          status: "COMPLETED",
          customerEmail,
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" },
      });

      // Send confirmation email (even in mock mode)
      const balanceDue = paymentType === "deposit" ? stylePrice - amount : 0;
      await sendBookingConfirmation({
        customerName,
        customerEmail,
        bookingRef,
        styleName,
        date: appointmentDate,
        time: appointmentTime,
        totalPrice: stylePrice,
        amountPaid: amount,
        balanceDue,
        paymentType: paymentType as "deposit" | "full",
      });

      // Return mock response for development
      return NextResponse.json({
        success: true,
        mockMode: true,
        message: "Stripe not configured - using mock mode",
        bookingReference: bookingRef,
        redirectUrl: `/book/success?mock=true&ref=${bookingRef}&style=${styleSlug}&name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(customerEmail)}&date=${appointmentDate}&time=${encodeURIComponent(appointmentTime)}&amount=${amount}&paymentType=${paymentType}`,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: styleName,
              description: `${paymentType === "deposit" ? "30% Deposit for " : ""}${styleName} - ${appointmentDate} at ${appointmentTime}`,
            },
            unit_amount: formatAmountForStripe(amount),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        bookingRef,
        styleName,
        styleSlug,
        stylePrice: stylePrice.toString(),
        customerName,
        customerEmail,
        customerPhone,
        appointmentDate,
        appointmentTime,
        notes: notes || "",
        paymentType,
        amountPaid: amount.toString(),
      },
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}&ref=${bookingRef}`,
      cancel_url: `${origin}/book?cancelled=true`,
    });

    // Create pending payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripeSessionId: session.id,
        amount,
        currency: "gbp",
        paymentType: paymentType === "deposit" ? "DEPOSIT" : "FULL",
        status: "PENDING",
        customerEmail,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      bookingReference: bookingRef,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
