import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
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
