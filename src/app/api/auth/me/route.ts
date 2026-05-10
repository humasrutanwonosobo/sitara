import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await requireAuth();
    return NextResponse.json({ id: session.userId, email: session.email, name: session.name, role: session.role });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
