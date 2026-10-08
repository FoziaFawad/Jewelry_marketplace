import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken } from "@/lib/auth-server";
import { Role } from "@/types";

/**
 * GET: Initiates official Google OAuth 2.0 flow
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "BUYER";
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || clientId.includes("placeholder") || clientId.length < 10) {
    // Return friendly error page if Google OAuth credentials haven't been provided yet
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Google OAuth Setup Required</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0a09; color: #f5f5f4; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #1c1917; border: 1px solid #292524; border-radius: 16px; padding: 32px; max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h2 { color: #d4af37; margin-top: 0; font-family: serif; }
          p { color: #a8a29e; font-size: 14px; line-height: 1.6; }
          code { background: #292524; color: #facc15; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
          .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #b48c48; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Google OAuth Configuration</h2>
          <p>To enable real Google Sign-In, please add your Google Cloud credentials to your <code>.env</code> file:</p>
          <p style="text-align: left; background: #0c0a09; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #e7e5e4;">
            GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"<br/>
            GOOGLE_CLIENT_SECRET="your-google-client-secret"
          </p>
          <p>Obtain these from the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color: #d4af37;">Google Cloud Console</a>.</p>
          <a class="btn" href="/login">Return to Login</a>
        </div>
      </body>
      </html>
    `;
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const statePayload = Buffer.from(
    JSON.stringify({ role, callbackUrl, timestamp: Date.now() })
  ).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", statePayload);

  return NextResponse.redirect(googleAuthUrl.toString());
}

/**
 * POST: Handles direct token/credential login or simulated sign-in
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, email, name, role = "BUYER" } = body;

    let userEmail = email;
    let userName = name;

    // If Google ID token was passed (e.g. from Google One Tap / GIS)
    if (credential) {
      try {
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
          );
          if (payload.email) {
            userEmail = payload.email;
            userName = payload.name || payload.given_name || userName;
          }
        }
      } catch (err) {
        console.warn("Failed to decode Google credential token:", err);
      }
    }

    const googleEmail = (userEmail || "google.collector@eternelle.com").toLowerCase().trim();
    const googleName = userName || "Google Verified Collector";
    const selectedRole = (role === "VENDOR" ? "VENDOR" : "BUYER") as Role;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: googleEmail },
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

    // If new user, create their account in Neon DB
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleName,
          email: googleEmail,
          role: selectedRole,
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

      // If registered as vendor, create an atelier shop
      if (selectedRole === "VENDOR") {
        const atelierName = `${googleName}'s Fine Atelier`;
        const slug = `atelier-${Date.now().toString().slice(-5)}`;
        const shop = await prisma.shop.create({
          data: {
            name: atelierName,
            slug,
            description: `Bespoke jewelry created by ${googleName}`,
            logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
            status: "PENDING_VERIFICATION",
            ownerId: user.id,
          },
        });
        user = {
          ...user,
          shop,
        };
      }
    }

    const sessionData = {
      id: user.id,
      name: user.name || "Google User",
      email: user.email,
      role: user.role as Role,
      shopId: user.shop?.id,
      shopSlug: user.shop?.slug,
      shopName: user.shop?.name,
    };

    const token = createSessionToken(sessionData);

    const response = NextResponse.json({
      success: true,
      message: "Successfully signed in with Google",
      user: sessionData,
      redirectUrl: "/",
    });

    // Set auth cookies
    response.cookies.set("auth_session", token, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_role", user.role, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_email", user.email, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_name", encodeURIComponent(user.name || ""), {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Google authentication failed" },
      { status: 500 }
    );
  }
}
