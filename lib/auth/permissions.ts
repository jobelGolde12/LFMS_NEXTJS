import type { User } from "@/types";
import { getSession } from "@/lib/auth/session";

export function isAdmin(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "admin";
}

export function isUser(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "user";
}

export async function requireAuth(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin(): Promise<User> {
  const session = await requireAuth();
  if (!isAdmin(session)) {
    throw new Error("Forbidden");
  }
  return session;
}
