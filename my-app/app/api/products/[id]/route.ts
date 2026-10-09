import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            bannerUrl: true,
            description: true,
            status: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update jewelry product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      shopId,
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
        ...(shopId ? { shopId } : {}),
        ...(isBanned !== undefined ? { isBanned: Boolean(isBanned) } : {}),
        ...(banReason !== undefined ? { banReason } : {}),
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Jewelry piece updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Fast toggle ban status or update specific attributes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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

    const dataToUpdate: any = {};
    if (body.isBanned !== undefined) {
      dataToUpdate.isBanned = Boolean(body.isBanned);
      dataToUpdate.banReason = body.isBanned ? (body.banReason || "Flagged by Admin Governance") : null;
    }
    if (body.stock !== undefined) {
      dataToUpdate.stock = parseInt(body.stock.toString(), 10);
    }
    if (body.price !== undefined) {
      dataToUpdate.price = parseFloat(body.price.toString());
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: dataToUpdate,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const statusMsg = updated.isBanned
      ? `Product "${updated.title}" has been banned and suspended from customer marketplace.`
      : `Product "${updated.title}" has been unbanned and restored to marketplace catalog.`;

    return NextResponse.json({
      success: true,
      message: statusMsg,
      data: updated,
    });
  } catch (error: any) {
    console.error("Failed to patch product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to patch product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Permanently delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      message: `Product "${existing.title}" deleted from catalog`,
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
