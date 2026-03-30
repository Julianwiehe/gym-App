import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { AdminCharacterActions } from "@/components/admin/AdminCharacterActions";
import { ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminCharactersPage() {
  await requireRole("ADMIN");

  const pending = await prisma.characterProfile.findMany({
    where: { status: "PENDING_REVIEW" },
    include: {
      user: true,
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Character Approvals</h1>
        <p className="text-slate-500">{pending.length} pending review</p>
      </div>

      {pending.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="All caught up!" description="No character profiles awaiting review." />
      ) : (
        <div className="space-y-4">
          {pending.map((character) => (
            <Card key={character.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{character.name}</h3>
                      <Badge variant="warning">{character.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">{character.tagline}</p>
                    <p className="text-xs text-slate-400">{character.user.email} · Joined {formatDistanceToNow(new Date(character.createdAt), { addSuffix: true })}</p>
                    {character.bio && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-3">{character.bio}</p>
                    )}
                    {character.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {character.categories.map(({ category }) => (
                          <Badge key={category.id} variant="secondary" className="text-xs">{category.name}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <AdminCharacterActions characterId={character.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
