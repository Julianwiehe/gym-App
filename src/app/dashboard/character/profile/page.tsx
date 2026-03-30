import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { CharacterProfileForm } from "@/components/dashboard/CharacterProfileForm";

export default async function CharacterProfilePage() {
  const session = await requireRole("CHARACTER");
  const characterId = session.characterProfile?.id;
  if (!characterId) return <p>Profile not found</p>;

  const [profile, categories, capabilities] = await Promise.all([
    prisma.characterProfile.findUnique({
      where: { id: characterId },
      include: {
        categories: { include: { category: true } },
        capabilities: { include: { capability: true } },
        pricingTiers: true,
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.capability.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-slate-500">Keep your profile up to date to attract more bookings</p>
      </div>
      <CharacterProfileForm
        profile={{
          ...profile,
          engagementRate: profile.engagementRate,
          categoryIds: profile.categories.map((c) => c.categoryId),
          capabilityIds: profile.capabilities.map((c) => c.capabilityId),
          avatarUrl: profile.avatarUrl ?? undefined,
        }}
        categories={categories}
        capabilities={capabilities}
      />
    </div>
  );
}
