import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Role } from "@prisma/client";

export async function requireAuth() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: Role) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== role) redirect("/dashboard");
  return user;
}
