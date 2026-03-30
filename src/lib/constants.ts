export const PLATFORM_COMMISSION = Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.15);

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  ACCEPTED: "Accepted",
  PAYMENT_HELD: "Payment Secured",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  APPROVED: "Completed",
  DISPUTED: "Disputed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  PAYMENT_HELD: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-cyan-100 text-cyan-800",
  APPROVED: "bg-green-100 text-green-800",
  DISPUTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const CATEGORIES = [
  { name: "Fashion", slug: "fashion", icon: "Shirt" },
  { name: "Tech", slug: "tech", icon: "Cpu" },
  { name: "Lifestyle", slug: "lifestyle", icon: "Smile" },
  { name: "Gaming", slug: "gaming", icon: "Gamepad2" },
  { name: "Beauty", slug: "beauty", icon: "Sparkles" },
  { name: "Fitness", slug: "fitness", icon: "Dumbbell" },
  { name: "Food", slug: "food", icon: "UtensilsCrossed" },
  { name: "Travel", slug: "travel", icon: "Plane" },
];

export const CAPABILITIES = [
  "Social Media Posts",
  "Video Ads",
  "Product Reviews",
  "Live Streams",
  "Newsletter Features",
  "Podcast Appearances",
  "Blog Posts",
  "Event Appearances",
];

export const TIMELINES = [
  "3 days",
  "1 week",
  "2 weeks",
  "1 month",
  "Custom",
];
