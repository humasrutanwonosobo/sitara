import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable, logNotifikasiTable } from "@/lib/db";
import { eq, count, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/session";
import { kirimWhatsApp, buatPesan } from "@/lib/whatsapp";
import { z } from "zod";

const sendNotifSchema = z.object({
  wbpId: z.string().uuid(),
  nomorTujuan: z.string().optional(),
  pesan: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const parsed = sendNotifSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    const { wbpId, nomorTujuan, pesan } = parsed.data;
    const wbps = await db.select().from(wbpTable).where(eq(wbpTable.id, wbpId)).limit(1);
    if (!wbps[0]) return NextResponse.json({ error: "Warga Binaan tidak ditemukan" }, { status: 404 });
    const target = nomorTujuan || wbps[0].nomorHpKeluarga;
    if (!target) return NextResponse.json({ error: "Nomor HP keluarga belum diisi" }, { status: 400 });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const message = pesan ?? buatPesan(wbps[0].nama, wbps[0].jenisLayanan, wbps[0].tahapSaatIni, `${baseUrl}/tracking/${wbps[0].kodeTracking}`);
    const result = await kirimWhatsApp({ target, message });
    await db.insert(logNotifikasiTable).values({
      wbpId, nomorHp: target, pesan: message, statusKirim: result.status ? "terkirim" : "gagal",
    });
    return NextResponse.json({ data: { success: result.status, message: result.status ? "Notifikasi terkirim" : "Gagal mengirim notifikasi" } });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const offset = (page - 1) * limit;
    const [logs, countResult] = await Promise.all([
      db.select().from(logNotifikasiTable).orderBy(desc(logNotifikasiTable.sentAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(logNotifikasiTable),
    ]);
    return NextResponse.json({ data: logs, total: Number(countResult[0]?.count ?? 0), page, limit });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
