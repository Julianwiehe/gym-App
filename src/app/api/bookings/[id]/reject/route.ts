import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "CHARACTER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { character: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.character.userId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status !== "PENDING") {
    return NextResponse.json({ error: "Booking is not pending" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "REJECTED", cancelledAt: new Date() },
  });

  return NextResponse.json({ booking: updated });
}
