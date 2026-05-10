import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";

function generateKodeTracking(jenisLayanan: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const kode = jenisLayanan === "ASIMILASI" ? "AS" : jenisLayanan;
  return `SITARA-${kode}-${random}`;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const existing = await db.select().from(wbpTable).where(eq(wbpTable.id, id)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: "WBP tidak ditemukan" }, { status: 404 });
    const newKode = generateKodeTracking(existing[0].jenisLayanan);
    const [updated] = await db.update(wbpTable).set({ kodeTracking: newKode, updatedAt: new Date() }).where(eq(wbpTable.id, id)).returning();
    return NextResponse.json({ data: updated });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
