import { NextRequest, NextResponse } from "next/server";
import { getWbpByKodeTracking, getRiwayatByWbpId } from "@/lib/db/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  return NextResponse.json({ data: wbp, riwayat });
}
