import { NextRequest, NextResponse } from "next/server";
import { getWbpByKodeTracking, getRiwayatByWbpId } from "@/lib/db/queries";
import { mapWbpPublic } from "@/lib/utils/wbp-helpers";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limit = rateLimit(request, "tracking-detail", { limit: 30, windowMs: 60_000 });
  if (!limit.success) return rateLimitResponse(limit);

  const { id } = await params;
  const kode = id?.toUpperCase() ?? "";
  if (!kode) {
    return NextResponse.json({ error: "Parameter id diperlukan" }, { status: 400 });
  }

  const wbp = await getWbpByKodeTracking(kode);

  if (!wbp) {
    return NextResponse.json({ error: "Data tracking tidak ditemukan" }, { status: 404 });
  }

  const riwayat = await getRiwayatByWbpId(wbp.id);

  return NextResponse.json({ data: mapWbpPublic(wbp), riwayat });
}
