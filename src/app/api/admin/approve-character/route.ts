import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  characterId: z.string(),
  action: z.enum(["APPROVE", "REJECT"]),
});

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { characterId, action } = parsed.data;

  const updated = await prisma.characterProfile.update({
    where: { id: characterId },
    data: {
      status: action === "APPROVE" ? "APPROVED" : "REJECTED",
    },
  });

  return NextResponse.json({ profile: updated });
}
