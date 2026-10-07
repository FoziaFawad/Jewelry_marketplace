import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken } from "@/lib/auth-server";
import { Role } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role = "BUYER" } = body;

    const googleEmail = (email || "google.collector@eternelle.com").toLowerCase().trim();
    const googleName = name || "Google Verified Collector";
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
      redirectUrl: user.role === "VENDOR" ? "/dashboard" : user.role === "ADMIN" ? "/admin/vendors" : "/jewelry",
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
