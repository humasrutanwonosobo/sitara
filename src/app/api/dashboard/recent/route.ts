import { NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();

    const rows = await db
      .select({
        id: wbpTable.id,
        nama: wbpTable.nama,
        nomorRegistrasi: wbpTable.nomorRegistrasi,
        jenisLayanan: wbpTable.jenisLayanan,
        tahapSaatIni: wbpTable.tahapSaatIni,
        status: wbpTable.status,
        updatedAt: wbpTable.updatedAt,
      })
      .from(wbpTable)
      .orderBy(desc(wbpTable.updatedAt))
      .limit(10);

    return NextResponse.json({
      data: rows.map((r) => ({
        id: r.id,
        nama: r.nama,
        nomorRegistrasi: r.nomorRegistrasi,
        jenisLayanan: r.jenisLayanan,
        tahapSaatIni: r.tahapSaatIni,
        status: r.status,
        updatedAt: r.updatedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
