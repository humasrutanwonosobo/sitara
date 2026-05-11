import { NextResponse } from "next/server";
import { db, wbpTable, logNotifikasiTable } from "@/lib/db";
import { count, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();

    const [
      totalResult,
      aktifResult,
      selesaiResult,
      ditolakResult,
      jenisResult,
      tahapResult,
      notifResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(wbpTable),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "aktif")),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "selesai")),
      db.select({ count: count() }).from(wbpTable).where(eq(wbpTable.status, "ditolak")),
      db.select({ jenisLayanan: wbpTable.jenisLayanan, count: count() }).from(wbpTable).groupBy(wbpTable.jenisLayanan),
      db.select({ tahap: wbpTable.tahapSaatIni, count: count() }).from(wbpTable).groupBy(wbpTable.tahapSaatIni),
      db.select({ count: count() }).from(logNotifikasiTable),
    ]);

    const byJenisLayanan = { PB: 0, CB: 0, CMB: 0, ASIMILASI: 0 };
    for (const r of jenisResult) {
      byJenisLayanan[r.jenisLayanan as keyof typeof byJenisLayanan] = Number(r.count);
    }

    const byTahap = tahapResult.map((r) => ({
      tahap: r.tahap,
      count: Number(r.count),
    }));

    return NextResponse.json({
      totalWbp: Number(totalResult[0]?.count ?? 0),
      aktif: Number(aktifResult[0]?.count ?? 0),
      selesai: Number(selesaiResult[0]?.count ?? 0),
      ditolak: Number(ditolakResult[0]?.count ?? 0),
      byJenisLayanan,
      byTahap,
      notifikasiTerkirim: Number(notifResult[0]?.count ?? 0),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
