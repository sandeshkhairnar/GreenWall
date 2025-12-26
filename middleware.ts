import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 🔹 Skip Next.js internals & API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    searchParams.has("_rsc")
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* ===============================
     ROUTE RULES
  =============================== */

  // ✅ Logged in user visiting "/" → go to /garden
  if (user && pathname === "/") {
    return NextResponse.redirect(new URL("/garden", request.url));
  }

  // ❌ Not logged in user visiting /garden → go to /
  if (!user && pathname.startsWith("/garden")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
