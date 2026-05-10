import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refresh the session so it doesn't expire
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes: /dashboard/* and /api/* (except public APIs)
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isPublicApi =
    request.nextUrl.pathname.startsWith("/api/tracking") ||
    request.nextUrl.pathname.startsWith("/api/healthz") ||
    request.nextUrl.pathname.startsWith("/api/auth/login") ||
    (request.nextUrl.pathname.startsWith("/api/pengaturan/") && request.method === "GET");
  const isProtectedApi =
    request.nextUrl.pathname.startsWith("/api") && !isPublicApi;

  if (!user && (isDashboardRoute || isProtectedApi)) {
    if (isDashboardRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // For protected API routes, return 401
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return supabaseResponse;
}
