export type Role = "BUYER" | "VENDOR" | "ADMIN";

export type ShopStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type MetalType = "Gold" | "Platinum" | "Silver" | "Rose Gold" | "White Gold";
export type MetalPurity = "10K" | "14K" | "18K" | "22K" | "24K" | "925 Sterling" | "950 Platinum";
export type JewelryCategory = "Rings" | "Necklaces" | "Bracelets" | "Earrings" | "Brooches" | "Watches";
export type GemstoneType = "Diamond" | "Emerald" | "Sapphire" | "Ruby" | "Pearl" | "Moissanite" | "Opal" | "None";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string | Date;
  updatedAt?: string | Date;
  shop?: Shop | null;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  status: ShopStatus;
  stripeAccountId?: string | null;
  ownerId: string;
  owner?: User;
  products?: Product[];
  rating?: number;
  reviewCount?: number;
  location?: string;
  establishedYear?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  category: JewelryCategory | string;
  metalType: MetalType | string;
  metalPurity?: MetalPurity | string | null;
  gemstoneType?: GemstoneType | string | null;
  caratWeight?: number | null;
  certifiedBy?: "GIA" | "IGI" | "AGS" | "None" | string | null;
  certificateNumber?: string | null;
  shopId: string;
  shop?: Pick<Shop, "id" | "name" | "slug" | "logoUrl" | "status">;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedRingSize?: string;
  selectedEngraving?: string;
}

export interface OrderItem {
  id: string;
  subOrderId: string;
  productId: string;
  product: Product;
  quantity: number;
  priceAtSale: number;
}

export interface SubOrder {
  id: string;
  orderId: string;
  shopId: string;
  shop?: Shop;
  payoutAmount: number;
  platformFee: number;
  status: OrderStatus;
  trackingNumber?: string | null;
  items: OrderItem[];
}

export interface Order {
  id: string;
  buyerId: string;
  buyer?: User;
  totalAmount: number;
  status: OrderStatus;
  subOrders: SubOrder[];
  createdAt: string | Date;
}

export interface JewelryFilterParams {
  category?: string;
  metalType?: string;
  metalPurity?: string;
  gemstoneType?: string;
  minPrice?: number;
  maxPrice?: number;
  minCarat?: number;
  maxCarat?: number;
  certifiedOnly?: boolean;
  sortBy?: "price-asc" | "price-desc" | "newest" | "carat-desc";
  shopSlug?: string;
  query?: string;
}

export interface VendorMetrics {
  totalRevenue: number;
  netPayout: number;
  pendingPayout: number;
  totalOrders: number;
  activeProducts: number;
  averageRating: number;
  recentSales: {
    id: string;
    date: string;
    customer: string;
    amount: number;
    status: OrderStatus;
    itemsCount: number;
  }[];
}

export interface AdminMetrics {
  totalGrossVolume: number;
  platformCommissionEarned: number;
  activeShopsCount: number;
  pendingVerificationsCount: number;
  totalOrdersCount: number;
  vendorPayoutsDue: number;
}
