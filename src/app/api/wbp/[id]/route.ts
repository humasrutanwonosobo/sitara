import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable, riwayatStatusTable } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "@/lib/auth/session";
import { z } from "zod";
import { sanitizeWbpData } from "@/lib/utils/sanitize-wbp";
import { mapWbp } from "@/lib/utils/wbp-helpers";

const TAHAP_VALUES = ["verifikasi_rutan","pengusulan_litmas","sidang_tpp_upt","upload_sdp","verifikasi_kanwil","proses_ditjen_pas","sk_terbit","turun_sk"] as const;
type TahapValue = typeof TAHAP_VALUES[number];

const updateWbpSchema = z.object({
  nama: z.string().min(1).optional(),
  nomorRegistrasi: z.string().min(1).optional(),
  jenisKelamin: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  nomorHpKeluarga: z.string().optional(),
  namaKontakKeluarga: z.string().optional(),
  perkara: z.string().optional(),
  alamat: z.string().optional(),
  tanggalPelaksanaan: z.string().optional(),
  jenisLayanan: z.enum(["PB","CB","CMB","ASIMILASI"]).optional(),
  tahapSaatIni: z.enum(TAHAP_VALUES).optional(),
  status: z.enum(["aktif","selesai","ditolak"]).optional(),
  catatan: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const rows = await db.select().from(wbpTable).where(eq(wbpTable.id, id)).limit(1);
    if (!rows[0]) return NextResponse.json({ error: "Warga Binaan tidak ditemukan" }, { status: 404 });
    const riwayat = await db.select().from(riwayatStatusTable).where(eq(riwayatStatusTable.wbpId, rows[0].id)).orderBy(desc(riwayatStatusTable.createdAt));
    return NextResponse.json({ data: mapWbp(rows[0]), riwayat });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const parsed = updateWbpSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    const existing = await db.select().from(wbpTable).where(eq(wbpTable.id, id)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: "Warga Binaan tidak ditemukan" }, { status: 404 });
    const sanitized = sanitizeWbpData(parsed.data);
    const [updated] = await db.update(wbpTable).set({ ...sanitized, updatedAt: new Date() }).where(eq(wbpTable.id, id)).returning();
    if (sanitized.tahapSaatIni) await db.insert(riwayatStatusTable).values({ wbpId: id, tahap: sanitized.tahapSaatIni as TahapValue, keterangan: `Tahap diubah ke ${sanitized.tahapSaatIni}` });
    return NextResponse.json({ data: mapWbp(updated!) });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("super_admin", "admin");
    const { id } = await params;
    const existing = await db.select().from(wbpTable).where(eq(wbpTable.id, id)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: "Warga Binaan tidak ditemukan" }, { status: 404 });
    await db.delete(riwayatStatusTable).where(eq(riwayatStatusTable.wbpId, id));
    await db.delete(wbpTable).where(eq(wbpTable.id, id));
    return NextResponse.json({ message: "Warga Binaan berhasil dihapus" });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
