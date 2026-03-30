import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CharacterCard } from "@/components/marketplace/CharacterCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { EmptyState } from "@/components/shared/EmptyState";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

interface SearchParams {
  category?: string;
  q?: string;
  available?: string;
  sort?: string;
  page?: string;
  [key: string]: string | undefined;
}

const PAGE_SIZE = 12;

async function getCharacters(params: SearchParams) {
  const page = Number(params.page ?? 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = { status: "APPROVED" };

  if (params.available === "true") {
    where.isAvailable = true;
  }

  if (params.category) {
    where.categories = {
      some: { category: { slug: params.category } },
    };
  }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { tagline: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    params.sort === "engagement" ? { engagementRate: "desc" as const } :
    params.sort === "followers" ? { followerCount: "desc" as const } :
    { createdAt: "desc" as const };

  const [characters, total] = await Promise.all([
    prisma.characterProfile.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        pricingTiers: { orderBy: { price: "asc" }, take: 1 },
      },
      orderBy,
      take: PAGE_SIZE,
      skip,
    }),
    prisma.characterProfile.count({ where }),
  ]);

  return { characters, total, pages: Math.ceil(total / PAGE_SIZE), page };
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ characters, total, pages, page }, categories] = await Promise.all([
    getCharacters(params),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Browse AI Characters</h1>
          <p className="text-slate-500 mt-1">{total} characters available</p>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <FilterSidebar categories={categories} currentParams={params} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <MarketplaceSearch currentParams={params} />

            {characters.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No characters found"
                description="Try adjusting your filters or search query."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                  {characters.map((c) => (
                    <CharacterCard
                      key={c.id}
                      id={c.id}
                      slug={c.slug}
                      name={c.name}
                      tagline={c.tagline}
                      avatarUrl={c.avatarUrl}
                      followerCount={c.followerCount}
                      engagementRate={c.engagementRate}
                      isAvailable={c.isAvailable}
                      categories={c.categories}
                      pricingTiers={c.pricingTiers}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pages }).map((_, i) => {
                      const p = i + 1;
                      const sp = new URLSearchParams(params as Record<string, string>);
                      sp.set("page", String(p));
                      return (
                        <a
                          key={p}
                          href={`/marketplace?${sp.toString()}`}
                          className={`h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-violet-600 text-white"
                              : "border hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
