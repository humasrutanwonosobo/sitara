import { staticJson } from "@/lib/static-response";
import { DOCS_DATA } from "@/lib/static";

// GET — public: active docs (static)
export async function GET() {
  const rows = DOCS_DATA.filter((d) => d.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return staticJson(rows);
}
