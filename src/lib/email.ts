import { Resend } from "resend";

// Use Resend's test email for now. Replace with your verified domain later.
const FROM_EMAIL = "Layo Hair <onboarding@resend.dev>";

// Business email - receives all booking notifications
// This is the only email we can send to with Resend's test domain
const BUSINESS_EMAIL = "layohair5@gmail.com";

// Lazy initialization to avoid crash when API key is missing
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingRef: string;
  styleName: string;
  date: string;
  time: string;
  totalPrice: number;
  amountPaid: number;
  balanceDue: number;
  paymentType: "deposit" | "full";
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  // Skip if no API key configured
  const resend = getResendClient();
  if (!resend) {
    console.log("Resend API key not configured - skipping email");
    return { success: false, error: "Email not configured" };
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    bookingRef,
    styleName,
    date,
    time,
    totalPrice,
    amountPaid,
    balanceDue,
    paymentType,
  } = data;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);

  try {
    // TEMPORARY: Send to business email only (Resend test domain limitation)
    // TODO: When custom domain is verified, send to customerEmail directly
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: `🎉 New Booking! ${bookingRef} - ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 30px; text-align: center;">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">LAYO HAIR</h1>
              <p style="color: #000; margin: 10px 0 0 0; font-size: 14px;">New Booking Notification</p>
            </div>

            <!-- Alert Banner -->
            <div style="background-color: #22c55e; padding: 15px; text-align: center;">
              <p style="color: #fff; margin: 0; font-size: 16px; font-weight: bold;">💰 New Booking Received!</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: #FFD700; margin: 0 0 20px 0; font-size: 24px;">Booking Confirmed!</h2>

              <!-- Customer Contact Info - Important for business -->
              <div style="background-color: #1a1a1a; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #22c55e; margin: 0 0 15px 0; font-size: 16px;">📞 Customer Contact</h3>
                <p style="color: #fff; margin: 0 0 8px 0;"><strong>Name:</strong> ${customerName}</p>
                <p style="color: #fff; margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #FFD700;">${customerEmail}</a></p>
                ${customerPhone ? `<p style="color: #fff; margin: 0 0 8px 0;"><strong>Phone:</strong> <a href="tel:${customerPhone}" style="color: #FFD700;">${customerPhone}</a></p>` : ""}
                <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">⚠️ Please contact the customer to confirm their booking via WhatsApp/call</p>
              </div>

              <p style="color: #ccc; margin: 0 0 20px 0; line-height: 1.6;">
                ${customerName} has booked an appointment with Layo Hair.
              </p>

              <!-- Booking Reference -->
              <div style="background-color: #1a1a1a; border: 2px solid #FFD700; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                <p style="color: #999; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Booking Reference</p>
                <p style="color: #FFD700; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${bookingRef}</p>
              </div>

              <!-- Appointment Details -->
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 16px;">Appointment Details</h3>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #999; padding: 8px 0; font-size: 14px;">Style</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right; font-weight: bold;">${styleName}</td>
                  </tr>
                  <tr>
                    <td style="color: #999; padding: 8px 0; font-size: 14px;">Date</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right;">${date}</td>
                  </tr>
                  <tr>
                    <td style="color: #999; padding: 8px 0; font-size: 14px;">Time</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right;">${time}</td>
                  </tr>
                </table>
              </div>

              <!-- Payment Summary -->
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 16px;">Payment Summary</h3>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #999; padding: 8px 0; font-size: 14px;">Total Price</td>
                    <td style="color: #fff; padding: 8px 0; font-size: 14px; text-align: right;">${formatPrice(totalPrice)}</td>
                  </tr>
                  <tr>
                    <td style="color: #999; padding: 8px 0; font-size: 14px;">${paymentType === "deposit" ? "Deposit Paid" : "Amount Paid"}</td>
                    <td style="color: #22c55e; padding: 8px 0; font-size: 14px; text-align: right; font-weight: bold;">${formatPrice(amountPaid)}</td>
                  </tr>
                  ${balanceDue > 0 ? `
                  <tr style="border-top: 1px solid #333;">
                    <td style="color: #FFD700; padding: 12px 0 8px 0; font-size: 14px; font-weight: bold;">Balance Due</td>
                    <td style="color: #FFD700; padding: 12px 0 8px 0; font-size: 14px; text-align: right; font-weight: bold;">${formatPrice(balanceDue)}</td>
                  </tr>
                  ` : ""}
                </table>

                ${balanceDue > 0 ? `
                <p style="color: #999; font-size: 12px; margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #333;">
                  * Balance is due at your appointment
                </p>
                ` : ""}
              </div>

              <!-- Important Info -->
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 16px;">Important Information</h3>
                <ul style="color: #999; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
                  <li>Please arrive 5-10 minutes before your appointment</li>
                  <li>If you need to reschedule, contact us at least 24 hours in advance</li>
                  <li>Late arrivals may result in reduced service time</li>
                </ul>
              </div>

              <!-- Track Booking Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/track?ref=${bookingRef}"
                   style="display: inline-block; background-color: #FFD700; color: #000; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                  Track Your Booking
                </a>
              </div>

              <!-- Contact -->
              <p style="color: #666; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                Questions? Contact us via WhatsApp or email at bookings@layohair.com
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Layo Hair. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    console.log("Booking confirmation email sent:", emailData?.id);
    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

export async function sendPaymentReminder(data: {
  customerName: string;
  customerEmail: string;
  bookingRef: string;
  balanceDue: number;
  appointmentDate: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Email not configured" };
  }

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Payment Reminder - ${data.bookingRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FFD700;">Payment Reminder</h2>
          <p>Hi ${data.customerName},</p>
          <p>This is a reminder that you have a balance due of <strong>${formatPrice(data.balanceDue)}</strong> for your upcoming appointment on ${data.appointmentDate}.</p>
          <p>Booking Reference: <strong>${data.bookingRef}</strong></p>
          <p>Please bring this amount to your appointment.</p>
          <p>Thank you for choosing Layo Hair!</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: emailData?.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
