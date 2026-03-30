import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Params = { characterId: string };
type SearchParams = { bookingId?: string };

export default async function BookingConfirmPage({
  params, searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [, sp] = await Promise.all([params, searchParams]);
  await requireRole("COMPANY");

  if (!sp.bookingId) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: sp.bookingId },
    include: {
      character: { select: { name: true, slug: true } },
    },
  });

  if (!booking) notFound();

  const commission = Number(booking.platformCommission);
  const budget = Number(booking.budgetAmount);
  const characterPayout = budget * (1 - commission);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Booking Request Sent!</h1>
          <p className="text-slate-500 mt-1">
            Your request has been sent to {booking.character.name}. They&apos;ll respond shortly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Character</span>
                <span className="font-medium">{booking.character.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campaign</span>
                <span className="font-medium truncate max-w-[60%] text-right">{booking.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timeline</span>
                <span>{booking.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge variant="warning">Pending Review</Badge>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Budget</span>
                <span>{formatCurrency(budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform fee ({Math.round(commission * 100)}%)</span>
                <span>{formatCurrency(budget * commission)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Character receives</span>
                <span>{formatCurrency(characterPayout)}</span>
              </div>
              <p className="text-xs text-slate-400">
                Payment is held in escrow and released only when you approve the deliverables.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild>
            <Link href="/dashboard/company/bookings">View My Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/marketplace">Continue Browsing</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
