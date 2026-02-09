import Stripe from "stripe";

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!(
    key &&
    key !== "sk_test_your_secret_key_here" &&
    (key.startsWith("sk_test_") || key.startsWith("sk_live_"))
  );
}

// Server-side Stripe instance
// Only create if properly configured to avoid initialization errors
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

// Format amount to pence (Stripe requires amounts in smallest currency unit)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

// Format amount from pence to pounds for display
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
