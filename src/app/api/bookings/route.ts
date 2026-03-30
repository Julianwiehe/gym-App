import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations/booking";
import { PLATFORM_COMMISSION } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "COMPANY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { characterId, title, description, requirements, timeline, budgetAmount } = parsed.data;

  const character = await prisma.characterProfile.findUnique({
    where: { id: characterId, status: "APPROVED" },
  });

  if (!character) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      companyId: session.id,
      characterId,
      title,
      description,
      requirements,
      timeline,
      budgetAmount,
      platformCommission: PLATFORM_COMMISSION,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let where: Record<string, unknown> = {};
  if (session.role === "COMPANY") {
    where.companyId = session.id;
  } else if (session.role === "CHARACTER" && session.characterProfile) {
    where.characterId = session.characterProfile.id;
  } else if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      character: { select: { name: true, slug: true, avatarUrl: true } },
      company: { include: { companyProfile: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
