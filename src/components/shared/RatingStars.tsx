import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
    </div>
  );
}
