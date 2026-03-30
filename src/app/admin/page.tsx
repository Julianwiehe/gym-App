import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Users, BookOpen, DollarSign, ShieldAlert } from "lucide-react";

export default async function AdminOverviewPage() {
  await requireRole("ADMIN");

  const [totalUsers, totalBookings, revenueResult, pendingCount, recentBookings] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: "APPROVED" },
      _sum: { budgetAmount: true },
    }),
    prisma.characterProfile.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.booking.findMany({
      include: {
        character: { select: { name: true } },
        company: { include: { companyProfile: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalRevenue = Number(revenueResult._sum.budgetAmount ?? 0);
  const platformRevenue = totalRevenue * 0.15;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and management</p>
      </div>

      {pendingCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3">
          <ShieldAlert className="h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800 flex-1">
            <span className="font-semibold">{pendingCount} character profiles</span> awaiting approval
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/characters">Review Now</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Users", value: totalUsers, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: BookOpen, label: "Total Bookings", value: totalBookings, color: "text-violet-600", bg: "bg-violet-50" },
          { icon: DollarSign, label: "GMV", value: formatCurrency(totalRevenue), color: "text-green-600", bg: "bg-green-50" },
          { icon: DollarSign, label: "Platform Revenue (15%)", value: formatCurrency(platformRevenue), color: "text-emerald-600", bg: "bg-emerald-50" },
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{booking.title}</p>
                  <p className="text-xs text-slate-500">
                    {booking.company.companyProfile?.name ?? booking.company.email} → {booking.character.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm">{formatCurrency(Number(booking.budgetAmount))}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
