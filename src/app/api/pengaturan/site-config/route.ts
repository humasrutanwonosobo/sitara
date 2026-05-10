import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/static";

// GET /api/pengaturan/site-config — public: get all config (static)
export async function GET() {
  return NextResponse.json(SITE_CONFIG);
}
