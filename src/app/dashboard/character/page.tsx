import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  BookOpen, DollarSign, Star, AlertCircle,
} from "lucide-react";

export default async function CharacterOverviewPage() {
  const session = await requireRole("CHARACTER");
  const characterId = session.characterProfile?.id;

  if (!characterId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500">Complete your profile to get started.</p>
        <Button asChild><Link href="/dashboard/character/profile">Complete Profile</Link></Button>
      </div>
    );
  }

  const [pendingCount, activeCount, completedEarnings, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { characterId, status: "PENDING" } }),
    prisma.booking.count({ where: { characterId, status: { in: ["ACCEPTED", "PAYMENT_HELD", "IN_PROGRESS"] } } }),
    prisma.booking.aggregate({
      where: { characterId, status: "APPROVED" },
      _sum: { budgetAmount: true },
    }),
    prisma.booking.findMany({
      where: { characterId },
      include: { company: { include: { companyProfile: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = Number(completedEarnings._sum.budgetAmount ?? 0) * 0.85;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session.characterProfile?.name}!</h1>
        <p className="text-slate-500">Here&apos;s what&apos;s happening with your bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: AlertCircle, label: "Pending Requests", value: pendingCount, color: "text-yellow-600", bg: "bg-yellow-50" },
          { icon: BookOpen, label: "Active Bookings", value: activeCount, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: DollarSign, label: "Total Earnings", value: formatCurrency(totalRevenue), color: "text-green-600", bg: "bg-green-50" },
          { icon: Star, label: "Profile Status", value: session.characterProfile?.status === "APPROVED" ? "Active" : "Pending", color: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg} mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/character/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No bookings yet. Make sure your profile is approved and visible!</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/dashboard/character/bookings/${booking.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{booking.title}</p>
                    <p className="text-xs text-slate-500">{booking.company.companyProfile?.name ?? booking.company.email}</p>
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
