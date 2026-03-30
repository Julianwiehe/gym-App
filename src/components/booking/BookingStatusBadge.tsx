import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        BOOKING_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {BOOKING_STATUS_LABELS[status] ?? status}
    </span>
  );
}
