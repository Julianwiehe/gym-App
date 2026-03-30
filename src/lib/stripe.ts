import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export function calculateCommission(amountUSD: number): {
  platformFeeCents: number;
  characterPayoutCents: number;
  totalCents: number;
} {
  const rate = Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.15);
  const totalCents = Math.round(amountUSD * 100);
  const platformFeeCents = Math.round(totalCents * rate);
  const characterPayoutCents = totalCents - platformFeeCents;
  return { platformFeeCents, characterPayoutCents, totalCents };
}
