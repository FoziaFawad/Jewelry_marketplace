import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read role from cookie, query parameter (for easy demo testing), or header
  const roleParam = request.nextUrl.searchParams.get("role") || request.nextUrl.searchParams.get("asRole");
  const roleCookie = request.cookies.get("user_role")?.value;
  const currentRole = (roleParam || roleCookie || "VENDOR").toUpperCase();

  const response = NextResponse.next();

  // If role is set via URL parameter in demo mode, persist to cookie
  if (roleParam) {
    response.cookies.set("user_role", currentRole, { path: "/" });
  }

  // Restrict Vendor Dashboard: Accessible to VENDOR or ADMIN
  if (pathname.startsWith("/dashboard")) {
    if (currentRole !== "VENDOR" && currentRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "VendorAccessRequired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Restrict Admin Portal: Accessible ONLY to ADMIN
  if (pathname.startsWith("/admin")) {
    if (currentRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "AdminAccessRequired");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
