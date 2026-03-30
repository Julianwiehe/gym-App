import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "CHARACTER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.characterProfile) {
    return NextResponse.json({ error: "Character profile not found" }, { status: 404 });
  }

  // Create Stripe Express account if not already connected
  let stripeAccountId = session.characterProfile ? await prisma.characterProfile
    .findUnique({ where: { id: session.characterProfile.id }, select: { stripeAccountId: true } })
    .then((p) => p?.stripeAccountId ?? null) : null;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: session.email,
      metadata: { userId: session.id },
    });
    stripeAccountId = account.id;

    await prisma.characterProfile.update({
      where: { id: session.characterProfile.id },
      data: { stripeAccountId },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${appUrl}/dashboard/character/profile`,
    return_url: `${appUrl}/dashboard/character/profile?stripe=connected`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
