import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable, riwayatStatusTable, insertWbpSchema } from "@/lib/db";
import { eq, ilike, or, and, desc, count } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { sanitizeWbpData } from "@/lib/utils/sanitize-wbp";
import { generateKodeTracking, mapWbp } from "@/lib/utils/wbp-helpers";

const TAHAP_VALUES = ["verifikasi_rutan","pengusulan_litmas","sidang_tpp_upt","upload_sdp","verifikasi_kanwil","proses_ditjen_pas","sk_terbit","turun_sk"] as const;
type TahapValue = typeof TAHAP_VALUES[number];

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const offset = (page - 1) * limit;
    const status = searchParams.get("status") ?? undefined;
    const jenisLayanan = searchParams.get("jenisLayanan") ?? undefined;
    const tahap = searchParams.get("tahap") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const conditions = [];
    if (status && ["aktif","selesai","ditolak"].includes(status)) conditions.push(eq(wbpTable.status, status as "aktif"|"selesai"|"ditolak"));
    if (jenisLayanan && ["PB","CB","CMB","ASIMILASI"].includes(jenisLayanan)) conditions.push(eq(wbpTable.jenisLayanan, jenisLayanan as "PB"|"CB"|"CMB"|"ASIMILASI"));
    if (tahap && TAHAP_VALUES.includes(tahap as TahapValue)) conditions.push(eq(wbpTable.tahapSaatIni, tahap as TahapValue));
    if (search) conditions.push(or(ilike(wbpTable.nama,`%${search}%`), ilike(wbpTable.nomorRegistrasi,`%${search}%`), ilike(wbpTable.kodeTracking,`%${search}%`)));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const [rows, countResult, summaryResult] = await Promise.all([
      db.select().from(wbpTable).where(where).orderBy(desc(wbpTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(wbpTable).where(where),
      db.select({ status: wbpTable.status, count: count() }).from(wbpTable).where(where).groupBy(wbpTable.status),
    ]);
    const summaryMap: Record<string, number> = {};
    for (const row of summaryResult) summaryMap[row.status] = Number(row.count);
    return NextResponse.json({ data: rows.map(mapWbp), total: Number(countResult[0]?.count ?? 0), page, limit,
      summary: { aktif: summaryMap["aktif"]??0, selesai: summaryMap["selesai"]??0, ditolak: summaryMap["ditolak"]??0 } });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const parsed = insertWbpSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    const sanitized = sanitizeWbpData(parsed.data);
    const kodeTracking = generateKodeTracking(sanitized.jenisLayanan);
    const [created] = await db.insert(wbpTable).values({ ...sanitized, kodeTracking }).returning();
    if (sanitized.tahapSaatIni) await db.insert(riwayatStatusTable).values({ wbpId: created!.id, tahap: sanitized.tahapSaatIni as TahapValue, keterangan: "Data Warga Binaan dibuat" });
    return NextResponse.json({ data: mapWbp(created!) }, { status: 201 });
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? "";
    if (msg.includes("unique")) return NextResponse.json({ error: "Nomor registrasi sudah digunakan" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
