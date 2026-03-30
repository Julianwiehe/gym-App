import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function CharacterBookingsPage() {
  const session = await requireRole("CHARACTER");
  const characterId = session.characterProfile?.id;
  if (!characterId) return <p>Profile not found</p>;

  const bookings = await prisma.booking.findMany({
    where: { characterId },
    include: {
      company: { include: { companyProfile: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState icon={BookOpen} title="No bookings yet" description="Once companies book you, they'll appear here." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/dashboard/character/bookings/${booking.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{booking.title}</p>
                    <p className="text-xs text-slate-500">
                      {booking.company.companyProfile?.name ?? booking.company.email} ·{" "}
                      {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-semibold">{formatCurrency(Number(booking.budgetAmount))}</span>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
