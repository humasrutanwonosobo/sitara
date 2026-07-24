import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const buckets = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now > entry.resetTime) buckets.delete(key);
  }
}

export function rateLimit(
  request: NextRequest,
  namespace: string,
  options: RateLimitOptions,
): RateLimitResult {
  const ip = getClientIdentifier(request);
  const key = `${namespace}:${ip}`;
  const now = Date.now();

  if (buckets.size > 10000) cleanupExpired();

  const existing = buckets.get(key);

  if (!existing || now > existing.resetTime) {
    const entry: RateLimitEntry = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    buckets.set(key, entry);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetTime: entry.resetTime,
    };
  }

  existing.count++;
  const remaining = Math.max(0, options.limit - existing.count);
  const success = existing.count <= options.limit;

  return {
    success,
    limit: options.limit,
    remaining,
    resetTime: existing.resetTime,
  };
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { error: "Terlalu banyak permintaan. Coba lagi nanti." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((result.resetTime - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetTime),
      },
    },
  );
}
