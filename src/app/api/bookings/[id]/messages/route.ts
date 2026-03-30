import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const messages = await prisma.bookingMessage.findMany({
    where: { bookingId: id },
    include: {
      sender: {
        include: {
          characterProfile: { select: { name: true } },
          companyProfile: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verify user has access to this booking
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { character: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isCompany = booking.companyId === session.id;
  const isCharacter = booking.character.userId === session.id;
  const isAdmin = session.role === "ADMIN";

  if (!isCompany && !isCharacter && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.bookingMessage.create({
    data: {
      bookingId: id,
      senderId: session.id,
      content: parsed.data.content,
    },
    include: {
      sender: {
        include: {
          characterProfile: { select: { name: true } },
          companyProfile: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
