import { createAdminClient } from "@/lib/supabase/server";
import { db, profileTable } from "@/lib/db";
import { eq } from "drizzle-orm";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "operator";
}

export async function getSession(): Promise<UserSession | null> {
  const supabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch role from profiles table
  const [profile] = await db.select({
    name: profileTable.name,
    role: profileTable.role,
  }).from(profileTable).where(eq(profileTable.id, user.id)).limit(1);

  return {
    userId: user.id,
    email: user.email ?? "",
    name: profile?.name ?? user.user_metadata?.name ?? user.email ?? "",
    role: profile?.role ?? "operator",
  };
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(...roles: UserSession["role"][]): Promise<UserSession> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    throw new Error("Forbidden");
  }
  return session;
}
