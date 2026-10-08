import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/auth-server";
import { verifyCode } from "@/lib/verification";
import { Role } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "BUYER", shopName, code, verificationCode } = body;
    const finalCode = (code || verificationCode || "").toString().trim();

    // Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!finalCode) {
      return NextResponse.json(
        { success: false, error: "Verification code is required. Please verify your email." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Legal full name is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check verification code
    const verification = verifyCode(normalizedEmail, finalCode);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    const selectedRole = (role === "VENDOR" ? "VENDOR" : "BUYER") as Role;

    // Check if account already exists in Neon DB
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    // Create User record in Neon
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: selectedRole,
      },
    });

    let createdShop = null;

    // If registering as Atelier Vendor, automatically provision the boutique shop
    if (selectedRole === "VENDOR") {
      const atelierName = shopName?.trim() || `${name.trim()}'s Atelier`;
      const baseSlug = atelierName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      createdShop = await prisma.shop.create({
        data: {
          name: atelierName,
          slug: uniqueSlug,
          description: `Fine jewelry boutique handcrafted by master artisan ${name.trim()}.`,
          logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
          bannerUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
          status: "PENDING_VERIFICATION",
          ownerId: newUser.id,
        },
      });
    }

    const sessionData = {
      id: newUser.id,
      name: newUser.name || "Collector",
      email: newUser.email,
      role: newUser.role as Role,
      shopId: createdShop?.id,
      shopSlug: createdShop?.slug,
      shopName: createdShop?.name,
    };

    const token = createSessionToken(sessionData);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: sessionData,
      redirectUrl: "/",
    }, { status: 201 });

    // Set auth cookies
    response.cookies.set("auth_session", token, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_role", newUser.role, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_email", newUser.email, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("user_name", encodeURIComponent(newUser.name || ""), {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Registration service encountered an error" },
      { status: 500 }
    );
  }
}
