"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export function FilterSidebar({ categories, currentParams }: FilterSidebarProps) {
  const router = useRouter();

  const updateParam = useCallback((key: string, value: string | null) => {
    const sp = new URLSearchParams(
      Object.fromEntries(
        Object.entries(currentParams).filter(([, v]) => v !== undefined) as [string, string][]
      )
    );
    sp.delete("page");
    if (value === null) sp.delete(key);
    else sp.set(key, value);
    router.push(`/marketplace?${sp.toString()}`);
  }, [currentParams, router]);

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Filters</h3>
            {Object.keys(currentParams).some((k) => ["category", "available", "sort"].includes(k)) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-violet-600"
                onClick={() => router.push("/marketplace")}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 block">
            Availability
          </Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentParams.available === "true"}
              onChange={(e) => updateParam("available", e.target.checked ? "true" : null)}
              className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm">Available now</span>
          </label>
        </div>

        <Separator />

        {/* Sort */}
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 block">
            Sort By
          </Label>
          <div className="space-y-1">
            {[
              { label: "Newest", value: "" },
              { label: "Most Followers", value: "followers" },
              { label: "Engagement Rate", value: "engagement" },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => updateParam("sort", value || null)}
                className={cn(
                  "w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                  (currentParams.sort ?? "") === value
                    ? "bg-violet-100 text-violet-700 font-medium"
                    : "hover:bg-slate-100"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 block">
            Category
          </Label>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateParam("category", currentParams.category === cat.slug ? null : cat.slug)}
                className={cn(
                  "w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                  currentParams.category === cat.slug
                    ? "bg-violet-100 text-violet-700 font-medium"
                    : "hover:bg-slate-100"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
