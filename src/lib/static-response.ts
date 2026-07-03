import { NextResponse } from "next/server";

const STATIC_JSON_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

export function staticJson<T>(body: T) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": STATIC_JSON_CACHE,
    },
  });
}
