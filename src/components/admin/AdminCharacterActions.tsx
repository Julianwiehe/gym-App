"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function AdminCharacterActions({ characterId }: { characterId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(action: "APPROVE" | "REJECT") {
    setLoading(action === "APPROVE" ? "approve" : "reject");
    await fetch("/api/admin/approve-character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, action }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        onClick={() => handleAction("APPROVE")}
        disabled={loading !== null}
        className="gap-1"
      >
        <Check className="h-3.5 w-3.5" />
        {loading === "approve" ? "Approving..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("REJECT")}
        disabled={loading !== null}
        className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
      >
        <X className="h-3.5 w-3.5" />
        {loading === "reject" ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}
