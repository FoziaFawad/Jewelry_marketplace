import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

// PUT /api/admin/products/[id] - Edit any shop product from any seller
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
    const {
      title,
      slug,
      description,
      price,
      stock,
      images,
      category,
      metalType,
      metalPurity,
      gemstoneType,
      caratWeight,
      certifiedBy,
      isBanned,
      banReason,
    } = body;

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(slug ? { slug: slug.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() } : {}),
        ...(price !== undefined ? { price: parseFloat(price.toString()) } : {}),
        ...(stock !== undefined ? { stock: parseInt(stock.toString(), 10) } : {}),
        ...(images ? { images: Array.isArray(images) ? images : [images] } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(metalType ? { metalType: metalType.trim() } : {}),
        ...(metalPurity !== undefined ? { metalPurity } : {}),
        ...(gemstoneType !== undefined ? { gemstoneType } : {}),
        ...(caratWeight !== undefined
          ? { caratWeight: caratWeight ? parseFloat(caratWeight.toString()) : null }
          : {}),
        ...(certifiedBy !== undefined ? { certifiedBy } : {}),
        ...(isBanned !== undefined ? { isBanned: Boolean(isBanned) } : {}),
        ...(banReason !== undefined ? { banReason } : {}),
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Product "${updated.title}" successfully updated`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Admin edit product error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/[id] - Fast Ban or Unban toggle with reason
export async function PATCH(
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
    const { isBanned, banReason } = body;

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        shop: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const newBannedState = isBanned !== undefined ? Boolean(isBanned) : !existing.isBanned;
    const newReason = newBannedState
      ? (banReason || "Flagged for policy violation by Admin Governance")
      : null;

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        isBanned: newBannedState,
        banReason: newReason,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: { select: { name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: newBannedState
        ? `Product "${updated.title}" is now BANNED and delisted from customer view.`
        : `Product "${updated.title}" is now ACTIVE and visible on marketplace.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Admin ban product error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update ban status" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Permanently delete product from any seller
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

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: `Product "${existing.title}" permanently deleted from marketplace`,
    });
  } catch (error: any) {
    console.error("Admin delete product error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
