import { cache } from "react";
import { db, wbpTable, riwayatStatusTable } from "@/lib/db";
import { eq, ilike, desc } from "drizzle-orm";

/**
 * Cached query: get Warga Binaan by kode tracking (public tracking page).
 * React `cache()` deduplicates within the same server request,
 * so generateMetadata and the API route won't double-query.
 */
export const getWbpByKodeTracking = cache(async (kode: string) => {
  const rows = await db
    .select()
    .from(wbpTable)
    .where(ilike(wbpTable.kodeTracking, kode.toUpperCase()))
    .limit(1);
  return rows[0] ?? null;
});

/**
 * Cached query: get Warga Binaan by ID (admin pages).
 */
export const getWbpById = cache(async (id: string) => {
  const rows = await db
    .select()
    .from(wbpTable)
    .where(eq(wbpTable.id, id))
    .limit(1);
  return rows[0] ?? null;
});

/**
 * Get riwayat status for a Warga Binaan.
 */
export async function getRiwayatByWbpId(wbpId: string) {
  return db
    .select()
    .from(riwayatStatusTable)
    .where(eq(riwayatStatusTable.wbpId, wbpId))
    .orderBy(desc(riwayatStatusTable.createdAt));
}
