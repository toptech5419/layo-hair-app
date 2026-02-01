import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if this is an admin route (except login page)
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // Check if this is a protected API route
  const isProtectedApi =
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/availability") ||
    pathname.startsWith("/api/payments");

  if (isAdminRoute || isProtectedApi) {
    // Check for session cookie (NextAuth session token)
    const sessionToken = req.cookies.get("authjs.session-token") ||
                         req.cookies.get("__Secure-authjs.session-token") ||
                         req.cookies.get("next-auth.session-token") ||
                         req.cookies.get("__Secure-next-auth.session-token");

    // Check if user has a session
    if (!sessionToken) {
      // Redirect to login for pages, return 401 for APIs
      if (isProtectedApi) {
        return NextResponse.json(
          { error: "Unauthorized - Please login" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes
    "/admin/:path*",
    // Match protected API routes
    "/api/admin/:path*",
    "/api/availability/:path*",
    "/api/payments/:path*",
  ],
};
