import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { stripe, calculateCommission } from "@/lib/stripe";
import { z } from "zod";

const schema = z.object({ bookingId: z.string() });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId, companyId: session.id },
    include: { character: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status !== "ACCEPTED") {
    return NextResponse.json({ error: "Booking is not in accepted state" }, { status: 400 });
  }

  const { totalCents, platformFeeCents } = calculateCommission(Number(booking.budgetAmount));

  const paymentIntentData: Parameters<typeof stripe.paymentIntents.create>[0] = {
    amount: totalCents,
    currency: booking.currency.toLowerCase(),
    capture_method: "manual",
    metadata: { bookingId: booking.id },
  };

  // Add Connect fee if character has Stripe account
  if (booking.character.stripeAccountId) {
    paymentIntentData.application_fee_amount = platformFeeCents;
    paymentIntentData.transfer_data = {
      destination: booking.character.stripeAccountId,
    };
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
