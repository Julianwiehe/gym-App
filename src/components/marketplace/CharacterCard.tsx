import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Users, TrendingUp, Circle } from "lucide-react";

interface CharacterCardProps {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  avatarUrl?: string | null;
  followerCount: number;
  engagementRate: number;
  isAvailable: boolean;
  categories: { category: { name: string } }[];
  pricingTiers: { price: number | string | { toNumber?: () => number; toString: () => string }; type: string }[];
}

export function CharacterCard({
  slug, name, tagline, avatarUrl, followerCount, engagementRate,
  isAvailable, categories, pricingTiers,
}: CharacterCardProps) {
  const minPrice = pricingTiers.length > 0
    ? Math.min(...pricingTiers.map((t) => {
        const p = t.price;
        if (typeof p === "object" && p !== null && "toNumber" in p && typeof p.toNumber === "function") return p.toNumber();
        return Number(p);
      }))
    : null;

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 to-slate-100 overflow-hidden">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-violet-200">{name.slice(0, 1)}</span>
          </div>
        )}
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isAvailable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
            <Circle className={`h-1.5 w-1.5 fill-current`} />
            {isAvailable ? "Available" : "Busy"}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Name + tagline */}
        <div className="mb-3">
          <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
          <p className="text-sm text-slate-500 truncate">{tagline}</p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 2).map(({ category }) => (
              <Badge key={category.name} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="text-xs">+{categories.length - 2}</Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatNumber(followerCount)}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {engagementRate.toFixed(1)}% eng.
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          {minPrice !== null ? (
            <div>
              <span className="text-xs text-slate-400">From </span>
              <span className="font-semibold text-slate-900">{formatCurrency(minPrice)}</span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">Custom pricing</span>
          )}
          <Button size="sm" asChild>
            <Link href={`/marketplace/${slug}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
