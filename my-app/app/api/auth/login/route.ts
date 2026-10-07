import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth-server";
import { Role } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up user in Neon PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
      return NextResponse.json(
        { success: false, error: "No account found with this email address" },
        { status: 401 }
      );
    }

    // Verify password if user has passwordHash
    if (user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }
    } else {
      // User registered with Google or social login
      return NextResponse.json(
        { success: false, error: "This account was registered via Google. Please use 'Continue with Google'." },
        { status: 400 }
      );
    }

    const sessionData = {
      id: user.id,
      name: user.name || "Collector",
      email: user.email,
      role: user.role as Role,
      shopId: user.shop?.id,
      shopSlug: user.shop?.slug,
      shopName: user.shop?.name,
    };

    const token = createSessionToken(sessionData);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: sessionData,
      redirectUrl:
        user.role === "VENDOR"
          ? "/dashboard"
          : user.role === "ADMIN"
          ? "/admin/vendors"
          : "/jewelry",
    });

    // Set secure authentication cookies
    response.cookies.set("auth_session", token, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service encountered an unexpected error" },
      { status: 500 }
    );
  }
}
