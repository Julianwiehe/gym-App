import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createUserSchema = z.object({
  role: z.enum(["CHARACTER", "COMPANY"]),
  name: z.string().min(2).max(100),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();

  if (!supabaseUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { role, name } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const user = await prisma.user.create({
    data: {
      supabaseId: supabaseUser.id,
      email: supabaseUser.email!,
      role,
      ...(role === "CHARACTER" && {
        characterProfile: {
          create: {
            name,
            slug: `${name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-${Date.now()}`,
            tagline: "AI Character — profile coming soon",
            bio: "",
          },
        },
      }),
      ...(role === "COMPANY" && {
        companyProfile: {
          create: {
            name,
          },
        },
      }),
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
