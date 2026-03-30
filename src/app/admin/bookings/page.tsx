import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "date-fns";

export default async function AdminBookingsPage() {
  await requireRole("ADMIN");

  const bookings = await prisma.booking.findMany({
    include: {
      character: { select: { name: true } },
      company: { include: { companyProfile: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <p className="text-slate-500">{bookings.length} most recent</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{booking.title}</p>
                  <p className="text-xs text-slate-500">
                    {booking.company.companyProfile?.name ?? booking.company.email} → {booking.character.name}
                    {" · "}{formatDate(new Date(booking.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium">{formatCurrency(Number(booking.budgetAmount))}</span>
                  <BookingStatusBadge status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
