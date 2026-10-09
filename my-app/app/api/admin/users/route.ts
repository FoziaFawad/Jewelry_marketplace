import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, hashPassword } from "@/lib/auth-server";
import { Role } from "@/types";

// GET /api/admin/users - List and search all platform users
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "ALL";
    const status = searchParams.get("status") || "ALL";

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (role !== "ALL" && ["BUYER", "VENDOR", "ADMIN"].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    if (status === "BANNED") {
      where.isBanned = true;
    } else if (status === "ACTIVE") {
      where.isBanned = false;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            logoUrl: true,
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Manually create a user with designated role
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role = "BUYER" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = password ? hashPassword(password) : hashPassword("AdminCreated123!");

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || "User",
        email: normalizedEmail,
        passwordHash,
        role: (role.toUpperCase() as Role) || "BUYER",
        isBanned: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User created successfully with role ${user.role}`,
      data: user,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
