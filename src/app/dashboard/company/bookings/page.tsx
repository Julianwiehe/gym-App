import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default async function CompanyBookingsPage() {
  const session = await requireRole("COMPANY");

  const bookings = await prisma.booking.findMany({
    where: { companyId: session.id },
    include: { character: { select: { name: true, slug: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link href="/marketplace">Book a Character</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings yet"
          description="Find an AI character and send your first booking request."
          actionLabel="Browse Characters"
          actionHref="/marketplace"
        />
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
                  href={`/dashboard/company/bookings/${booking.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{booking.title}</p>
                    <p className="text-xs text-slate-500">
                      {booking.character.name} ·{" "}
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
