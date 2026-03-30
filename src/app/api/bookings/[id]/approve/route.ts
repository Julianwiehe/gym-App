import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { stripe, calculateCommission } from "@/lib/stripe";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { character: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.companyId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status !== "DELIVERED") {
    return NextResponse.json({ error: "Booking has not been delivered yet" }, { status: 400 });
  }

  let stripeTransferId: string | undefined;

  // If Stripe is configured and character has a Connect account, release payment
  if (
    booking.stripePaymentIntentId &&
    booking.character.stripeAccountId &&
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder")
  ) {
    try {
      const { characterPayoutCents } = calculateCommission(Number(booking.budgetAmount));

      // Capture the held payment intent
      await stripe.paymentIntents.capture(booking.stripePaymentIntentId);

      // Transfer character's portion to their Connect account
      const transfer = await stripe.transfers.create({
        amount: characterPayoutCents,
        currency: booking.currency.toLowerCase(),
        destination: booking.character.stripeAccountId,
        transfer_group: booking.id,
      });
      stripeTransferId = transfer.id;
    } catch (err) {
      console.error("Stripe release error:", err);
      // Continue anyway — payment can be handled manually
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: "APPROVED",
      completedAt: new Date(),
      ...(stripeTransferId && { stripeTransferId }),
    },
  });

  return NextResponse.json({ booking: updated });
}
