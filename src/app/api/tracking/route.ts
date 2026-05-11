import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ error: "Parameter q diperlukan" }, { status: 400 });
  const rows = await db
    .select()
    .from(wbpTable)
    .where(ilike(wbpTable.kodeTracking, q))
    .limit(1);
  return NextResponse.json({ data: rows, total: rows.length });
}
