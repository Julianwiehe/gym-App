import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CharacterCard } from "@/components/marketplace/CharacterCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";

// ── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_CHARACTERS = [
  {
    id: "1", slug: "nova-ai",
    name: "Nova AI",
    tagline: "Futuristic fashion icon with a cosmic aesthetic",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    followerCount: 2400000, engagementRate: 4.8, isAvailable: true,
    categories: [{ category: { name: "Fashion" } }, { category: { name: "Lifestyle" } }],
    pricingTiers: [{ price: 1200, type: "PER_POST" }],
  },
  {
    id: "2", slug: "byte-queen",
    name: "Byte Queen",
    tagline: "Tech reviews & gadget unboxings that actually make sense",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    followerCount: 890000, engagementRate: 6.2, isAvailable: true,
    categories: [{ category: { name: "Tech" } }, { category: { name: "Gaming" } }],
    pricingTiers: [{ price: 800, type: "PER_POST" }],
  },
  {
    id: "3", slug: "aria-bloom",
    name: "Aria Bloom",
    tagline: "Sustainable beauty & skincare for the conscious consumer",
    avatarUrl: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=400&fit=crop",
    followerCount: 1700000, engagementRate: 5.4, isAvailable: true,
    categories: [{ category: { name: "Beauty" } }, { category: { name: "Lifestyle" } }],
    pricingTiers: [{ price: 950, type: "PER_POST" }],
  },
  {
    id: "4", slug: "iron-atlas",
    name: "Iron Atlas",
    tagline: "Elite fitness coaching & supplement reviews",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop",
    followerCount: 650000, engagementRate: 7.1, isAvailable: false,
    categories: [{ category: { name: "Fitness" } }],
    pricingTiers: [{ price: 600, type: "PER_POST" }],
  },
  {
    id: "5", slug: "kai-eats",
    name: "Kai Eats",
    tagline: "Food adventures from street food to Michelin stars",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    followerCount: 3100000, engagementRate: 3.9, isAvailable: true,
    categories: [{ category: { name: "Food" } }, { category: { name: "Travel" } }],
    pricingTiers: [{ price: 1800, type: "PER_POST" }],
  },
  {
    id: "6", slug: "lumi-world",
    name: "Lumi World",
    tagline: "Luxury travel content for aspirational brands",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    followerCount: 1200000, engagementRate: 5.8, isAvailable: true,
    categories: [{ category: { name: "Travel" } }, { category: { name: "Lifestyle" } }],
    pricingTiers: [{ price: 2200, type: "PER_CAMPAIGN" }],
  },
  {
    id: "7", slug: "pixel-kai",
    name: "Pixel Kai",
    tagline: "Esports & gaming content with massive Gen Z reach",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    followerCount: 4500000, engagementRate: 8.3, isAvailable: true,
    categories: [{ category: { name: "Gaming" } }, { category: { name: "Tech" } }],
    pricingTiers: [{ price: 3500, type: "PER_CAMPAIGN" }],
  },
  {
    id: "8", slug: "soleil-fit",
    name: "Soleil Fit",
    tagline: "Holistic wellness, yoga, and mindful living",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    followerCount: 980000, engagementRate: 6.7, isAvailable: true,
    categories: [{ category: { name: "Fitness" } }, { category: { name: "Lifestyle" } }],
    pricingTiers: [{ price: 750, type: "PER_POST" }],
  },
  {
    id: "9", slug: "zara-luxe",
    name: "Zara Luxe",
    tagline: "High fashion editorials and luxury brand collaborations",
    avatarUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
    followerCount: 5200000, engagementRate: 3.2, isAvailable: true,
    categories: [{ category: { name: "Fashion" } }],
    pricingTiers: [{ price: 5000, type: "PER_CAMPAIGN" }],
  },
];

const DEMO_CATEGORIES = [
  { id: "1", name: "Fashion", slug: "fashion" },
  { id: "2", name: "Tech", slug: "tech" },
  { id: "3", name: "Beauty", slug: "beauty" },
  { id: "4", name: "Gaming", slug: "gaming" },
  { id: "5", name: "Fitness", slug: "fitness" },
  { id: "6", name: "Food", slug: "food" },
  { id: "7", name: "Travel", slug: "travel" },
  { id: "8", name: "Lifestyle", slug: "lifestyle" },
];
// ─────────────────────────────────────────────────────────────────────────────

interface SearchParams {
  category?: string;
  q?: string;
  available?: string;
  sort?: string;
  [key: string]: string | undefined;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let characters = [...DEMO_CHARACTERS];

  if (params.available === "true") {
    characters = characters.filter((c) => c.isAvailable);
  }
  if (params.category) {
    characters = characters.filter((c) =>
      c.categories.some((cat) => cat.category.name.toLowerCase() === params.category?.toLowerCase() ||
        DEMO_CATEGORIES.find((d) => d.slug === params.category)?.name === cat.category.name)
    );
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    characters = characters.filter(
      (c) => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
    );
  }
  if (params.sort === "engagement") {
    characters.sort((a, b) => b.engagementRate - a.engagementRate);
  } else if (params.sort === "followers") {
    characters.sort((a, b) => b.followerCount - a.followerCount);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Browse AI Characters</h1>
          <p className="text-slate-500 mt-1">{characters.length} characters available</p>
        </div>

        <div className="flex gap-8">
          <FilterSidebar categories={DEMO_CATEGORIES} currentParams={params} />

          <div className="flex-1 min-w-0">
            <MarketplaceSearch currentParams={params} />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {characters.map((c) => (
                <CharacterCard key={c.id} {...c} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
