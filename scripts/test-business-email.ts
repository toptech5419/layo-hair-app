import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { Resend } from "resend";

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("📧 Sending test email to layohair5@gmail.com...\n");

  const { data, error } = await resend.emails.send({
    from: "Layo Hair <onboarding@resend.dev>",
    to: "layohair5@gmail.com",
    subject: "🎉 Test: New Booking Notification!",
    html: `
      <div style="font-family: Arial; padding: 20px; background: #111; color: #fff;">
        <h1 style="color: #FFD700;">✅ Email Working!</h1>
        <p>This is a test booking notification.</p>
        <div style="background: #222; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Customer:</strong> Test Customer</p>
          <p><strong>Email:</strong> customer@example.com</p>
          <p><strong>Phone:</strong> +44 7350 167537</p>
          <p><strong>Style:</strong> Fulani Braids</p>
          <p><strong>Date:</strong> Monday, February 10, 2026</p>
          <p><strong>Amount Paid:</strong> £45 (deposit)</p>
        </div>
        <p style="color: #999;">If you received this, emails are working!</p>
      </div>
    `,
  });

  if (error) {
    console.log("❌ Error:", error);
  } else {
    console.log("✅ Email sent successfully!");
    console.log("   ID:", data?.id);
    console.log("\n📬 Check layohair5@gmail.com inbox!");
  }
}

main();
