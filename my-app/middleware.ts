import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read role and user info from cookies or query parameters
  const roleParam = request.nextUrl.searchParams.get("role") || request.nextUrl.searchParams.get("asRole");
  const roleCookie = request.cookies.get("user_role")?.value;
  const sessionCookie = request.cookies.get("auth_session")?.value;
  const emailCookie = request.cookies.get("user_email")?.value;
  let currentRole = (roleParam || roleCookie || "").toUpperCase();

  // If user is Muhammad Sohaib, always treat as ADMIN
  if (emailCookie && emailCookie.toLowerCase() === "muhammadsohaib.19477@gmail.com") {
    currentRole = "ADMIN";
  }

  // Also check auth session payload
  if (sessionCookie) {
    try {
      const payloadStr = atob(sessionCookie.replace(/-/g, "+").replace(/_/g, "/"));
      const parsed = JSON.parse(payloadStr);
      if (parsed.email && parsed.email.toLowerCase() === "muhammadsohaib.19477@gmail.com") {
        currentRole = "ADMIN";
      } else if (parsed.role && !roleParam) {
        currentRole = parsed.role.toUpperCase();
      }
    } catch {}
  }

  const response = NextResponse.next();

  // If role is set via URL parameter or was normalized, persist to cookie
  if (roleParam || (currentRole === "ADMIN" && roleCookie !== "ADMIN" && emailCookie?.toLowerCase() === "muhammadsohaib.19477@gmail.com")) {
    response.cookies.set("user_role", currentRole, { path: "/" });
  }

  // 1. If an already authenticated user visits /login or /register, redirect to Home Page ("/")
  if ((pathname === "/login" || pathname === "/register") && (sessionCookie || roleCookie)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Protect Vendor Dashboard (/dashboard/:path*)
  // Accessible to VENDOR or ADMIN. If a BUYER or unauthenticated user tries to enter:
  if (pathname.startsWith("/dashboard")) {
    if (currentRole !== "VENDOR" && currentRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "VendorAccessRequired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin Portal (/admin/:path*)
  // Accessible ONLY to ADMIN
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
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
