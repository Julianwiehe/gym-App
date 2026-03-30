import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { MessageThread } from "@/components/booking/MessageThread";
import { BookingActions } from "@/components/booking/BookingActions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { formatDate } from "date-fns";

type Params = { id: string };

export default async function CompanyBookingDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const session = await requireRole("COMPANY");

  const booking = await prisma.booking.findUnique({
    where: { id, companyId: session.id },
    include: {
      character: { select: { name: true, slug: true } },
      messages: {
        include: {
          sender: {
            include: {
              characterProfile: { select: { name: true } },
              companyProfile: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!booking) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{booking.title}</h1>
          <p className="text-slate-500">
            <Link href={`/marketplace/${booking.character.slug}`} className="hover:underline text-violet-600">
              {booking.character.name}
            </Link>
            {" · "}{formatDate(new Date(booking.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Brief</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{booking.description}</p>
            {booking.requirements && (
              <>
                <p className="text-sm font-medium mt-3 mb-1">Requirements</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{booking.requirements}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Payment</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Budget</span>
              <span className="font-semibold">{formatCurrency(Number(booking.budgetAmount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Platform fee</span>
              <span>{formatCurrency(Number(booking.budgetAmount) * Number(booking.platformCommission))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timeline</span>
              <span>{booking.timeline}</span>
            </div>
            {booking.status === "ACCEPTED" && (
              <Button className="w-full mt-2" size="sm" asChild>
                <Link href={`/booking/${booking.characterId}/confirm?bookingId=${booking.id}`}>
                  Make Payment
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <BookingActions booking={{ id: booking.id, status: booking.status }} role="COMPANY" />

      {/* Messages */}
      <Card>
        <CardContent className="p-6">
          <MessageThread
            bookingId={booking.id}
            currentUserId={session.id}
            initialMessages={booking.messages.map((m) => ({
              ...m,
              createdAt: m.createdAt.toISOString(),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
