import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { Role } from "@/types";

// PUT /api/admin/users/[id] - Update user role, ban status, or details
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { role, isBanned, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Safety guard: Protect primary owner muhammadsohaib.19477@gmail.com
    const isMasterAdmin = existingUser.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
    if (isMasterAdmin && role && role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Primary Master Admin account role cannot be changed." },
        { status: 400 }
      );
    }

    if (isMasterAdmin && isBanned === true) {
      return NextResponse.json(
        { success: false, error: "Primary Master Admin account cannot be banned." },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (role && ["BUYER", "VENDOR", "ADMIN"].includes(role.toUpperCase())) {
      updateData.role = role.toUpperCase() as Role;
    }

    if (isBanned !== undefined) {
      updateData.isBanned = Boolean(isBanned);
    }

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name || updatedUser.email} updated successfully`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Permanently delete a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Safety guard
    if (existingUser.email.toLowerCase() === "muhammadsohaib.19477@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Cannot delete the primary Master Admin account." },
        { status: 400 }
      );
    }

    if (session.id === existingUser.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own active admin account." },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `User "${existingUser.name || existingUser.email}" permanently removed`,
    });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
