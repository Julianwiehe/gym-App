import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BookingForm } from "@/components/booking/BookingForm";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";

type Params = { characterId: string };
type SearchParams = { tier?: string };

export default async function BookingRequestPage({
  params, searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ characterId }, sp] = await Promise.all([params, searchParams]);

  const session = await requireRole("COMPANY");

  const character = await prisma.characterProfile.findUnique({
    where: { id: characterId, status: "APPROVED" },
    include: {
      pricingTiers: { orderBy: { price: "asc" } },
    },
  });

  if (!character) notFound();
  if (!character.isAvailable) redirect(`/marketplace/${character.slug}`);

  const selectedTier = sp.tier
    ? character.pricingTiers.find((t) => t.id === sp.tier)
    : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Book {character.name}</h1>
          <p className="text-slate-500">Fill in your campaign brief below</p>
        </div>
        <BookingForm
          character={{ id: character.id, name: character.name }}
          selectedTier={selectedTier ? { id: selectedTier.id, label: selectedTier.label, price: Number(selectedTier.price) } : undefined}
          companyId={session.id}
        />
      </main>
    </div>
  );
}
