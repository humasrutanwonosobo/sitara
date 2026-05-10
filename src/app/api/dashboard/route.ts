import { NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { count, eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();
    const [totalResult, aktifResult, selesaiResult, ditolakResult, jenisResult, recentResult] = await Promise.all([
      db.select({ count: count() }).from(wbpTable),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "aktif")),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "selesai")),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "ditolak")),
      db.select({ jenisLayanan: wbpTable.jenisLayanan, count: count() }).from(wbpTable).groupBy(wbpTable.jenisLayanan),
      db.select().from(wbpTable).orderBy(desc(wbpTable.updatedAt)).limit(5),
    ]);
    return NextResponse.json({
      data: {
        total: Number(totalResult[0]?.count ?? 0),
        aktif: Number(aktifResult[0]?.count ?? 0),
        selesai: Number(selesaiResult[0]?.count ?? 0),
        ditolak: Number(ditolakResult[0]?.count ?? 0),
        byJenisLayanan: Object.fromEntries(jenisResult.map(r => [r.jenisLayanan, Number(r.count)])),
        recentUpdates: recentResult,
      },
    });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
