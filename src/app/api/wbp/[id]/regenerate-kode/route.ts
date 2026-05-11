import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { generateKodeTracking } from "@/lib/utils/wbp-helpers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const existing = await db.select().from(wbpTable).where(eq(wbpTable.id, id)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: "Warga Binaan tidak ditemukan" }, { status: 404 });
    const newKode = generateKodeTracking(existing[0].jenisLayanan);
    const [updated] = await db.update(wbpTable).set({ kodeTracking: newKode, updatedAt: new Date() }).where(eq(wbpTable.id, id)).returning();
    return NextResponse.json({ data: updated });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
