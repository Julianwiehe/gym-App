import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CharacterCard } from "@/components/marketplace/CharacterCard";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import {
  Zap, Search, CreditCard, Rocket,
  Shirt, Cpu, Smile, Gamepad2, Sparkles, Dumbbell, UtensilsCrossed, Plane,
  ArrowRight,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Shirt, Cpu, Smile, Gamepad2, Sparkles, Dumbbell, UtensilsCrossed, Plane,
};

async function getFeaturedCharacters() {
  return prisma.characterProfile.findMany({
    where: { status: "APPROVED" },
    include: {
      categories: { include: { category: true } },
      pricingTiers: { take: 1, orderBy: { price: "asc" } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

export default async function LandingPage() {
  const featured = await getFeaturedCharacters().catch(() => []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-900 text-white py-24 px-4">
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-violet-700 text-violet-100 border-0">
            The AI Character Marketplace
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Book AI Characters
            <br />
            <span className="text-violet-300">for Your Brand</span>
          </h1>
          <p className="text-xl text-violet-200 mb-10 max-w-2xl mx-auto">
            Virtual influencers, models, and agents ready for social media, ads, product launches, and more — available 24/7, infinitely scalable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-violet-900 hover:bg-violet-50 font-semibold" asChild>
              <Link href="/marketplace">Browse Characters <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-violet-400 text-white hover:bg-violet-800" asChild>
              <Link href="/register">List Your AI Character</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-center mb-2">Browse by Category</h2>
          <p className="text-slate-500 text-center mb-8">Find the perfect AI character for your niche</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] ?? Zap;
              return (
                <Link
                  key={cat.slug}
                  href={`/marketplace?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-violet-400 hover:bg-violet-50 transition-colors group text-center"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-slate-600 group-hover:text-violet-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Characters */}
      {featured.length > 0 && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Characters</h2>
                <p className="text-slate-500">Top AI characters on the platform</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/marketplace">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((c) => (
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
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-2">How It Works</h2>
          <p className="text-slate-500 text-center mb-12">From discovery to launch in three steps</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, step: "1", title: "Browse & Discover", desc: "Explore hundreds of AI characters by niche, price, and capabilities. Filter to find your perfect match." },
              { icon: CreditCard, step: "2", title: "Book & Brief", desc: "Submit your campaign brief and budget. Our escrow system holds payment until you approve the deliverables." },
              { icon: Rocket, step: "3", title: "Launch & Scale", desc: "Receive content, approve it, and launch. Rate the character and rebook for future campaigns." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-violet-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Are You an AI Character?</h2>
          <p className="text-violet-200 mb-8 text-lg">
            List your AI persona, showcase your portfolio, and get discovered by brands looking for the next generation of influencers.
          </p>
          <Button size="lg" className="bg-white text-violet-900 hover:bg-violet-50 font-semibold" asChild>
            <Link href="/register">Join as AI Character — It&apos;s Free</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
