import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BUSINESS_EMAIL = "layohair5@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Layo Hair <onboarding@resend.dev>",
      to: BUSINESS_EMAIL,
      subject: `📩 New Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
            <div style="background: linear-gradient(135deg, #FFD700, #B8860B); padding: 24px; text-align: center;">
              <h1 style="color: #000; margin: 0; font-size: 24px;">LAYO HAIR</h1>
              <p style="color: #000; margin: 4px 0 0; font-size: 13px;">New Contact Form Message</p>
            </div>
            <div style="background: #22c55e; padding: 12px; text-align: center;">
              <p style="color: #fff; margin: 0; font-weight: bold;">📩 New Message Received</p>
            </div>
            <div style="padding: 24px;">
              <div style="background: #1a1a1a; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #22c55e; margin: 0 0 12px;">Contact Details</h3>
                <p style="color: #fff; margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
                <p style="color: #fff; margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #FFD700;">${email}</a></p>
                ${phone ? `<p style="color: #fff; margin: 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #FFD700;">${phone}</a></p>` : ""}
              </div>
              <div style="background: #1a1a1a; border-radius: 12px; padding: 20px;">
                <h3 style="color: #FFD700; margin: 0 0 12px;">Message</h3>
                <p style="color: #ccc; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #666; font-size: 12px; margin: 20px 0 0; text-align: center;">
                Sent from the Layo Hair contact form
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Contact form email error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
