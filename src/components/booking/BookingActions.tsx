"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Package, ThumbsUp, AlertTriangle } from "lucide-react";

interface BookingActionsProps {
  booking: { id: string; status: string };
  role: "CHARACTER" | "COMPANY";
}

export function BookingActions({ booking, role }: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function callAction(action: string) {
    setLoading(action);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${booking.id}/${action}`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Action failed");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  const { status } = booking;

  if (role === "CHARACTER") {
    if (status === "PENDING") {
      return (
        <div className="flex gap-3">
          <Button onClick={() => callAction("accept")} disabled={loading !== null} className="gap-2">
            <Check className="h-4 w-4" />
            {loading === "accept" ? "Accepting..." : "Accept Booking"}
          </Button>
          <Button variant="outline" onClick={() => callAction("reject")} disabled={loading !== null} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <X className="h-4 w-4" />
            {loading === "reject" ? "Rejecting..." : "Decline"}
          </Button>
          {error && <p className="text-sm text-red-600 self-center">{error}</p>}
        </div>
      );
    }
    if (["PAYMENT_HELD", "IN_PROGRESS"].includes(status)) {
      return (
        <div className="flex gap-3">
          <Button onClick={() => callAction("deliver")} disabled={loading !== null} className="gap-2">
            <Package className="h-4 w-4" />
            {loading === "deliver" ? "Marking..." : "Mark as Delivered"}
          </Button>
          {error && <p className="text-sm text-red-600 self-center">{error}</p>}
        </div>
      );
    }
  }

  if (role === "COMPANY") {
    if (status === "DELIVERED") {
      return (
        <div className="flex gap-3">
          <Button onClick={() => callAction("approve")} disabled={loading !== null} className="gap-2 bg-green-600 hover:bg-green-700">
            <ThumbsUp className="h-4 w-4" />
            {loading === "approve" ? "Releasing payment..." : "Approve & Release Payment"}
          </Button>
          {error && <p className="text-sm text-red-600 self-center">{error}</p>}
        </div>
      );
    }
  }

  return null;
}
