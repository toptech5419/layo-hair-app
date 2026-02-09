import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { Resend } from "resend";

async function main() {
  console.log("🔍 Testing Resend Email Configuration\n");

  // Check API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("❌ RESEND_API_KEY is not set!");
    return;
  }
  console.log("✅ RESEND_API_KEY is set:", apiKey.substring(0, 10) + "...");

  const resend = new Resend(apiKey);

  // Test sending email
  const testEmail = "okefunmilayo34@gmail.com"; // Your email
  console.log(`\n📧 Attempting to send test email to: ${testEmail}`);

  try {
    const { data, error } = await resend.emails.send({
      from: "Layo Hair <onboarding@resend.dev>",
      to: testEmail,
      subject: "Test Email from Layo Hair",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #FFD700;">Test Email</h1>
          <p>This is a test email from Layo Hair booking system.</p>
          <p>If you received this, email is working!</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (error) {
      console.log("\n❌ Email sending failed:");
      console.log("   Error:", error);
      console.log("\n💡 Common issues:");
      console.log("   - Using onboarding@resend.dev can only send to YOUR verified email");
      console.log("   - To send to any email, add a custom domain in Resend");
    } else {
      console.log("\n✅ Email sent successfully!");
      console.log("   Email ID:", data?.id);
      console.log("\n📬 Check your inbox at:", testEmail);
    }
  } catch (err) {
    console.log("\n❌ Exception occurred:", err);
  }

  // Also check domains
  console.log("\n📋 Checking Resend account domains...");
  try {
    const { data: domains } = await resend.domains.list();
    if (domains && domains.length > 0) {
      console.log("   Domains configured:");
      domains.forEach((d: any) => {
        console.log(`   - ${d.name} (${d.status})`);
      });
    } else {
      console.log("   No custom domains configured (using onboarding@resend.dev)");
    }
  } catch (err) {
    console.log("   Could not fetch domains");
  }
}

main();
