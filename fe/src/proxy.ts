// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("__hisaabKitaab__")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  // 🔒 Protect admin routes only
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/signin", origin));
  }

  // 🔁 Prevent logged-in users from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  // ✅ Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/signin", "/signup"],
};
