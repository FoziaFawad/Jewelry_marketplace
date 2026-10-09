import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    // Run parallel counts and metrics from Neon DB
    const [
      totalUsers,
      adminCount,
      vendorCount,
      buyerCount,
      totalShops,
      activeShops,
      pendingShops,
      suspendedShops,
      totalProducts,
      bannedProducts,
      recentUsers,
      recentProducts,
      recentShops,
      orders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "VENDOR" } }),
      prisma.user.count({ where: { role: "BUYER" } }),

      prisma.shop.count(),
      prisma.shop.count({ where: { status: "ACTIVE" } }),
      prisma.shop.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.shop.count({ where: { status: "SUSPENDED" } }),

      prisma.product.count(),
      prisma.product.count({ where: { isBanned: true } }),

      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBanned: true,
          createdAt: true,
          shop: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),

      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          shop: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),

      prisma.shop.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { products: true },
          },
        },
      }),

      prisma.order.findMany({
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }).catch(() => []),
    ]);

    // Calculate gross GMV & commissions
    const totalGrossGmv = orders.reduce((sum, ord) => sum + Number(ord.totalAmount || 0), 0);
    const platformCommission = totalGrossGmv * 0.10;

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: adminCount,
          vendors: vendorCount,
          buyers: buyerCount,
        },
        shops: {
          total: totalShops,
          active: activeShops,
          pending: pendingShops,
          suspended: suspendedShops,
        },
        products: {
          total: totalProducts,
          active: totalProducts - bannedProducts,
          banned: bannedProducts,
        },
        financials: {
          totalOrders: orders.length,
          grossVolume: totalGrossGmv,
          platformCommission,
        },
        recentUsers,
        recentProducts,
        recentShops,
      },
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch platform metrics" },
      { status: 500 }
    );
  }
}
