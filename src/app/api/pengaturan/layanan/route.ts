import { staticJson } from "@/lib/static-response";
import { LAYANAN_DATA } from "@/lib/static";

// GET — public: active layanan items (static)
export async function GET() {
  const rows = LAYANAN_DATA.filter((l) => l.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return staticJson(rows);
}
