import { NextRequest, NextResponse } from "next/server";
import { db, wbpTable } from "@/lib/db";
import { ilike } from "drizzle-orm";
import { mapWbpPublic } from "@/lib/utils/wbp-helpers";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limit = rateLimit(request, "tracking", { limit: 20, windowMs: 60_000 });
  if (!limit.success) return rateLimitResponse(limit);

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ error: "Parameter q diperlukan" }, { status: 400 });
  const rows = await db
    .select()
    .from(wbpTable)
    .where(ilike(wbpTable.kodeTracking, q))
    .limit(1);
  return NextResponse.json({ data: rows.map(mapWbpPublic), total: rows.length });
}
