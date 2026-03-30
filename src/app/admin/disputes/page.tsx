import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default async function AdminDisputesPage() {
  await requireRole("ADMIN");

  const disputes = await prisma.booking.findMany({
    where: { status: "DISPUTED" },
    include: {
      character: { select: { name: true } },
      company: { include: { companyProfile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disputes</h1>
        <p className="text-slate-500">{disputes.length} active disputes</p>
      </div>

      {disputes.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No active disputes" description="All bookings are running smoothly." />
      ) : (
        <div className="space-y-4">
          {disputes.map((booking) => (
            <Card key={booking.id} className="border-red-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{booking.title}</h3>
                    <p className="text-sm text-slate-500">
                      {booking.company.companyProfile?.name ?? booking.company.email} → {booking.character.name}
                    </p>
                    <p className="text-sm font-medium mt-2">{formatCurrency(Number(booking.budgetAmount))}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className="text-xs text-slate-400">Manual resolution required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
