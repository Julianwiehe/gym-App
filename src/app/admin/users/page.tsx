import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    include: {
      characterProfile: { select: { name: true, status: true } },
      companyProfile: { select: { name: true } },
      _count: { select: { bookingsAsCompany: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const roleColors = {
    CHARACTER: "bg-violet-100 text-violet-700",
    COMPANY: "bg-blue-100 text-blue-700",
    ADMIN: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-slate-500">{users.length} total users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {user.characterProfile?.name ?? user.companyProfile?.name ?? user.email}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user.email} · Joined {formatDate(new Date(user.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {user.suspended && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Suspended</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                  {user.role === "CHARACTER" && user.characterProfile && (
                    <span className="text-xs text-slate-400">{user.characterProfile.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
