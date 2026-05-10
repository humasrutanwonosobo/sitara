import { NextResponse } from "next/server";
import { CHANGELOG_DATA } from "@/lib/static";

// GET — public: published changelog (static)
export async function GET() {
  const rows = CHANGELOG_DATA.filter((c) => c.isPublished);
  return NextResponse.json(rows);
}
