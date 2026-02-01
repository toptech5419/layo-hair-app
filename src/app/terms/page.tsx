import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${siteConfig.name}`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Terms of <span className="text-[#FFD700]">Service</span>
          </h1>

          <div className="prose prose-invert prose-gold max-w-none space-y-8">
            <p className="text-white/70 text-lg">
              Last updated: February 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Booking Policy</h2>
              <p className="text-white/70">
                By booking an appointment with {siteConfig.name}, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>All bookings require a deposit or full payment at the time of booking</li>
                <li>Appointments are confirmed once payment is received</li>
                <li>Please arrive on time for your appointment</li>
                <li>Late arrivals may result in reduced service time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Cancellation Policy</h2>
              <p className="text-white/70">
                We understand that plans change. Our cancellation policy is as follows:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li><strong>48+ hours notice:</strong> Full refund or reschedule</li>
                <li><strong>24-48 hours notice:</strong> 50% refund or reschedule with fee</li>
                <li><strong>Less than 24 hours:</strong> No refund (deposit forfeited)</li>
                <li><strong>No-show:</strong> No refund and may require prepayment for future bookings</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Service Pricing</h2>
              <p className="text-white/70">
                All prices displayed on our website are in British Pounds (GBP). Prices may vary
                based on hair length, thickness, and style complexity. A consultation may be
                required for accurate pricing. We reserve the right to adjust prices if the
                actual service differs significantly from what was booked.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Hair Preparation</h2>
              <p className="text-white/70">
                To ensure the best results, please:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Arrive with clean, detangled hair (unless otherwise instructed)</li>
                <li>Inform us of any scalp conditions or sensitivities</li>
                <li>Discuss your desired style beforehand</li>
                <li>Bring reference photos if possible</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Aftercare</h2>
              <p className="text-white/70">
                We provide aftercare instructions for all styles. Following these instructions
                helps maintain your style and hair health. {siteConfig.name} is not responsible
                for damage caused by improper aftercare or failure to follow instructions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Satisfaction Guarantee</h2>
              <p className="text-white/70">
                Your satisfaction is our priority. If you are not happy with your style,
                please let us know within 7 days of your appointment. We will work with
                you to make adjustments where possible.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Contact</h2>
              <p className="text-white/70">
                For questions about these terms, please contact us:
              </p>
              <ul className="list-none text-white/70 space-y-2">
                <li>Email: {siteConfig.contact.email}</li>
                <li>Phone: {siteConfig.contact.phone}</li>
                <li>WhatsApp: {siteConfig.contact.phone}</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
