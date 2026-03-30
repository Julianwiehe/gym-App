import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { MessageThread } from "@/components/booking/MessageThread";
import { BookingActions } from "@/components/booking/BookingActions";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "date-fns";

type Params = { id: string };

export default async function CharacterBookingDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const session = await requireRole("CHARACTER");
  const characterId = session.characterProfile?.id;

  const booking = await prisma.booking.findUnique({
    where: { id, characterId },
    include: {
      company: { include: { companyProfile: true } },
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
            {booking.company.companyProfile?.name ?? booking.company.email} ·{" "}
            {formatDate(new Date(booking.createdAt), "MMM d, yyyy")}
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
          <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Budget</span>
              <span className="font-medium">{formatCurrency(Number(booking.budgetAmount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Your payout</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(Number(booking.budgetAmount) * (1 - Number(booking.platformCommission)))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timeline</span>
              <span>{booking.timeline}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <BookingActions booking={{ id: booking.id, status: booking.status }} role="CHARACTER" />

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
