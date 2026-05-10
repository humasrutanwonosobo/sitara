import { NextRequest, NextResponse } from "next/server";
import { db, tahapanTable, insertTahapanSchema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("super_admin", "admin");
    const { id } = await params;
    const body = await req.json();
    const data = insertTahapanSchema.parse(body);
    const [row] = await db.update(tahapanTable).set({ ...data, updatedAt: new Date() }).where(eq(tahapanTable.id, id)).returning();
    if (!row) return NextResponse.json({ error: "Tahapan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e: unknown) {
    if (e instanceof Error && (e.message === "Unauthorized" || e.message === "Forbidden")) return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
    return NextResponse.json({ error: "Gagal memperbarui tahapan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("super_admin");
    const { id } = await params;
    const [row] = await db.delete(tahapanTable).where(eq(tahapanTable.id, id)).returning();
    if (!row) return NextResponse.json({ error: "Tahapan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && (e.message === "Unauthorized" || e.message === "Forbidden")) return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
    return NextResponse.json({ error: "Gagal menghapus tahapan" }, { status: 400 });
  }
}
