import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Privacy <span className="text-[#FFD700]">Policy</span>
          </h1>

          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            <p className="text-white/70 text-lg">
              Last updated: February 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
              <p className="text-white/70">
                When you book an appointment with {siteConfig.name}, we collect the following information:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Your name and contact details (email, phone number)</li>
                <li>Appointment preferences and booking history</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Any notes or special requests you provide</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
              <p className="text-white/70">We use your information to:</p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Process and manage your appointments</li>
                <li>Send booking confirmations and reminders</li>
                <li>Process payments securely</li>
                <li>Improve our services</li>
                <li>Communicate with you about your bookings</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
              <p className="text-white/70">
                We take the security of your personal information seriously. All payment
                information is processed through Stripe&apos;s secure payment system and is
                never stored on our servers. Your personal data is protected using
                industry-standard encryption.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Sharing Your Information</h2>
              <p className="text-white/70">
                We do not sell or share your personal information with third parties
                except as necessary to provide our services (e.g., payment processing
                through Stripe).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
              <p className="text-white/70">You have the right to:</p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
              <p className="text-white/70">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none text-white/70 space-y-2">
                <li>Email: {siteConfig.contact.email}</li>
                <li>Phone: {siteConfig.contact.phone}</li>
                <li>Address: {siteConfig.contact.fullAddress}</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
