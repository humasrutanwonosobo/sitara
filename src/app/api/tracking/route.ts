import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable, riwayatStatusTable } from "@/lib/db";
import { eq, ilike, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kode = searchParams.get("kode") ?? "";
  if (!kode) return NextResponse.json({ error: "Parameter kode diperlukan" }, { status: 400 });
  const rows = await db.select().from(wbpTable).where(ilike(wbpTable.kodeTracking, kode)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Data tracking tidak ditemukan" }, { status: 404 });
  const riwayat = await db.select().from(riwayatStatusTable).where(eq(riwayatStatusTable.wbpId, rows[0].id)).orderBy(desc(riwayatStatusTable.createdAt));
  return NextResponse.json({ data: rows[0], riwayat });
}
