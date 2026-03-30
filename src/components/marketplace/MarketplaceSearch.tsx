"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MarketplaceSearchProps {
  currentParams: Record<string, string | undefined>;
}

export function MarketplaceSearch({ currentParams }: MarketplaceSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState(currentParams.q ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams(
      Object.fromEntries(
        Object.entries(currentParams).filter(([, v]) => v !== undefined) as [string, string][]
      )
    );
    sp.delete("page");
    if (q.trim()) sp.set("q", q.trim());
    else sp.delete("q");
    router.push(`/marketplace?${sp.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or niche..."
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="outline">Search</Button>
    </form>
  );
}
