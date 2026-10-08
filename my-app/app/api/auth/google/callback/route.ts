import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken } from "@/lib/auth-server";
import { Role } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateParam = searchParams.get("state");

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error || !code) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleAuthFailed`);
  }

  let role: Role = "BUYER";
  let targetUrl = "/buyer-dashboard";

  if (stateParam) {
    try {
      const decoded = JSON.parse(
        Buffer.from(stateParam, "base64url").toString("utf-8")
      );
      if (decoded.role === "VENDOR") {
        role = "VENDOR";
        targetUrl = "/dashboard";
      }
      if (decoded.callbackUrl) {
        targetUrl = decoded.callbackUrl;
      }
    } catch {
      // ignore state parse error
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  try {
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Failed to exchange Google token:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=GoogleTokenExchangeFailed`);
    }

    // 2. Fetch authenticated user profile from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userRes.json();

    if (!userRes.ok || !profile.email) {
      console.error("Failed to fetch Google profile:", profile);
      return NextResponse.redirect(`${baseUrl}/login?error=GoogleProfileFetchFailed`);
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || profile.given_name || "Google Collector";

    // 3. Find or create user in Neon DB
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          role,
        },
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
            },
          },
        },
      });

      if (role === "VENDOR") {
        const atelierName = `${name}'s Fine Atelier`;
        const slug = `atelier-${Date.now().toString().slice(-5)}`;
        const shop = await prisma.shop.create({
          data: {
            name: atelierName,
            slug,
            description: `Bespoke fine jewelry collection curated by ${name}.`,
            logoUrl: profile.picture || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
            status: "PENDING_VERIFICATION",
            ownerId: user.id,
          },
        });
        user = { ...user, shop };
      }
    }

    const sessionData = {
      id: user.id,
      name: user.name || name,
      email: user.email,
      role: user.role as Role,
      shopId: user.shop?.id,
      shopSlug: user.shop?.slug,
      shopName: user.shop?.name,
    };

    const token = createSessionToken(sessionData);

    const destination =
      targetUrl && targetUrl !== "/jewelry" && targetUrl !== "/buyer-dashboard"
        ? targetUrl
        : "/";

    const redirectResponse = NextResponse.redirect(
      new URL(destination, baseUrl)
    );

    // Set auth session cookies
    redirectResponse.cookies.set("auth_session", token, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    redirectResponse.cookies.set("user_role", user.role, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    redirectResponse.cookies.set("user_email", user.email, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    redirectResponse.cookies.set("user_name", encodeURIComponent(user.name || ""), {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return redirectResponse;
  } catch (err) {
    console.error("Error in Google OAuth callback:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleCallbackException`);
  }
}
