import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/RatingStars";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Users, TrendingUp, Circle, CheckCircle2, DollarSign,
} from "lucide-react";

type Params = { slug: string };

async function getCharacter(slug: string) {
  return prisma.characterProfile.findFirst({
    where: { slug, status: "APPROVED" },
    include: {
      user: true,
      categories: { include: { category: true } },
      capabilities: { include: { capability: true } },
      pricingTiers: { orderBy: { price: "asc" } },
      portfolioItems: { orderBy: { order: "asc" } },
      bookings: {
        where: { reviews: { some: {} } },
        include: {
          reviews: {
            include: { reviewer: { include: { companyProfile: true } } },
          },
        },
        take: 5,
        orderBy: { completedAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCharacter(slug);
  if (!c) return {};
  return {
    title: `${c.name} — CharacterX`,
    description: c.tagline,
    openGraph: { images: c.avatarUrl ? [c.avatarUrl] : [] },
  };
}

export default async function CharacterProfilePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [character, session] = await Promise.all([getCharacter(slug), getSession()]);

  if (!character) notFound();

  const reviews = character.bookings.flatMap((b) => b.reviews);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const canBook = session?.role === "COMPANY";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile header */}
            <div className="flex gap-6">
              <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-violet-100">
                {character.avatarUrl ? (
                  <Image src={character.avatarUrl} alt={character.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-violet-300">
                    {character.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{character.name}</h1>
                    <p className="text-slate-500">{character.tagline}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${character.isAvailable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    <Circle className="h-1.5 w-1.5 fill-current" />
                    {character.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{formatNumber(character.followerCount)}</span>
                    <span className="text-slate-400">followers</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{character.engagementRate.toFixed(1)}%</span>
                    <span className="text-slate-400">engagement</span>
                  </div>
                  {avgRating !== null && (
                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={Math.round(avgRating)} />
                      <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {character.categories.map(({ category }) => (
                    <Badge key={category.id} variant="secondary">{category.name}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            {character.bio && (
              <div>
                <h2 className="font-semibold text-lg mb-2">About</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{character.bio}</p>
              </div>
            )}

            {/* Capabilities */}
            {character.capabilities.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-3">What I Can Do</h2>
                <div className="grid grid-cols-2 gap-2">
                  {character.capabilities.map(({ capability }) => (
                    <div key={capability.id} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" />
                      {capability.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {character.portfolioItems.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-3">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {character.portfolioItems.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.caption ?? "Portfolio item"}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-3">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <RatingStars rating={review.rating} />
                        <span className="text-sm text-slate-500">
                          {review.reviewer.companyProfile?.name ?? review.reviewer.email}
                        </span>
                      </div>
                      {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="space-y-4">
            <div className="sticky top-24">
              {/* Pricing */}
              {character.pricingTiers.length > 0 && (
                <div className="space-y-3 mb-4">
                  {character.pricingTiers.map((tier) => (
                    <Card key={tier.id} className="border-2 hover:border-violet-400 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{tier.label}</p>
                            <p className="text-xs text-slate-500 capitalize">{tier.type.toLowerCase().replace("_", " ")}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-violet-600">{formatCurrency(Number(tier.price))}</p>
                          </div>
                        </div>
                        {tier.description && (
                          <p className="text-sm text-slate-500 mb-3">{tier.description}</p>
                        )}
                        {tier.includes.length > 0 && (
                          <ul className="space-y-1 mb-3">
                            {tier.includes.map((item, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {canBook ? (
                          <Button className="w-full" asChild>
                            <Link href={`/booking/${character.id}?tier=${tier.id}`}>Book This Package</Link>
                          </Button>
                        ) : (
                          <Button className="w-full" variant="outline" asChild>
                            <Link href="/register">Sign Up to Book</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {canBook && character.isAvailable && character.pricingTiers.length === 0 && (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/booking/${character.id}`}>Book Now</Link>
                </Button>
              )}

              {!canBook && !session && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-violet-400 mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Ready to work with {character.name}?</p>
                    <p className="text-xs text-slate-500 mb-3">Create a company account to book</p>
                    <Button className="w-full" asChild>
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
