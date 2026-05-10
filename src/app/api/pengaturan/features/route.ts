import { NextRequest, NextResponse } from "next/server";
import { FEATURES_DATA } from "@/lib/static";

// GET /api/pengaturan/features?section=keunggulan — public: active features (static)
export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");
  let rows = FEATURES_DATA.filter((f) => f.isActive);
  if (section) rows = rows.filter((f) => f.section === section);
  rows.sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json(rows);
}
