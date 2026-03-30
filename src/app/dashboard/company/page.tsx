import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, DollarSign, Search, Clock } from "lucide-react";

export default async function CompanyOverviewPage() {
  const session = await requireRole("COMPANY");

  const [activeCount, totalSpent, pendingDelivery, recentBookings] = await Promise.all([
    prisma.booking.count({
      where: { companyId: session.id, status: { in: ["ACCEPTED", "PAYMENT_HELD", "IN_PROGRESS"] } },
    }),
    prisma.booking.aggregate({
      where: { companyId: session.id, status: "APPROVED" },
      _sum: { budgetAmount: true },
    }),
    prisma.booking.count({
      where: { companyId: session.id, status: "DELIVERED" },
    }),
    prisma.booking.findMany({
      where: { companyId: session.id },
      include: { character: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const companyName = session.companyProfile?.name ?? "Your Company";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {companyName}!</h1>
        <p className="text-slate-500">Manage your AI character bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Active Bookings", value: activeCount, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Clock, label: "Awaiting Approval", value: pendingDelivery, color: "text-orange-600", bg: "bg-orange-50" },
          { icon: DollarSign, label: "Total Spent", value: formatCurrency(Number(totalSpent._sum.budgetAmount ?? 0)), color: "text-green-600", bg: "bg-green-50" },
          { icon: Search, label: "Find Characters", value: "Browse →", color: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className={label === "Find Characters" ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
            {label === "Find Characters" ? (
              <Link href="/marketplace" className="block">
                <CardContent className="p-4">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-3`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-bold text-violet-600">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </CardContent>
              </Link>
            ) : (
              <CardContent className="p-4">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/company/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-3">No bookings yet. Find your first AI character!</p>
              <Button asChild><Link href="/marketplace">Browse Characters</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/dashboard/company/bookings/${booking.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{booking.title}</p>
                    <p className="text-xs text-slate-500">{booking.character.name}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium">{formatCurrency(Number(booking.budgetAmount))}</span>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
