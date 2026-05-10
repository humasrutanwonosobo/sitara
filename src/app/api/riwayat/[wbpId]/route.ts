import { NextRequest, NextResponse } from "next/server";
import { db, riwayatStatusTable } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ wbpId: string }> }) {
  try {
    await requireAuth();
    const { wbpId } = await params;
    const riwayat = await db.select().from(riwayatStatusTable)
      .where(eq(riwayatStatusTable.wbpId, wbpId))
      .orderBy(desc(riwayatStatusTable.createdAt));
    return NextResponse.json({ data: riwayat });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
