import { staticJson } from "@/lib/static-response";
import { SITE_CONFIG } from "@/lib/static";

// GET /api/pengaturan/site-config — public: get all config (static)
export async function GET() {
  return staticJson(SITE_CONFIG);
}
