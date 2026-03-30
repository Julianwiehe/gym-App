import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    include: {
      characterProfile: {
        select: { id: true, slug: true, status: true, name: true, avatarUrl: true },
      },
      companyProfile: {
        select: { id: true, name: true, logoUrl: true },
      },
    },
  });

  return dbUser;
});
