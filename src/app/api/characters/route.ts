import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  tagline: z.string().min(5).max(200).optional(),
  bio: z.string().max(3000).optional(),
  followerCount: z.number().min(0).optional(),
  engagementRate: z.number().min(0).max(100).optional(),
  isAvailable: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  capabilityIds: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "CHARACTER" || !session.characterProfile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { categoryIds, capabilityIds, ...profileData } = parsed.data;
  const characterId = session.characterProfile.id;

  const updated = await prisma.characterProfile.update({
    where: { id: characterId },
    data: {
      ...profileData,
      ...(categoryIds !== undefined && {
        categories: {
          deleteMany: {},
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      }),
      ...(capabilityIds !== undefined && {
        capabilities: {
          deleteMany: {},
          create: capabilityIds.map((id) => ({ capabilityId: id })),
        },
      }),
    },
  });

  return NextResponse.json({ profile: updated });
}
