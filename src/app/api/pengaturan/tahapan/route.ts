import { staticJson } from "@/lib/static-response";
import { TAHAPAN_DATA } from "@/lib/static";

// GET — public: active tahapan items (static)
export async function GET() {
  const rows = TAHAPAN_DATA.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return staticJson(rows);
}
