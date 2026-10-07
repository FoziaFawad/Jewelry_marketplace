import { Role } from "@/types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  shopId?: string;
  shopSlug?: string;
  shopName?: string;
}

export const DEMO_USERS: Record<Role, SessionUser> = {
  BUYER: {
    id: "usr_buyer_01",
    name: "Genevieve Vance",
    email: "genevieve@luxurydomain.com",
    role: "BUYER",
  },
  VENDOR: {
    id: "usr_vendor_01",
    name: "Elena Rostova",
    email: "elena@auroragems.com",
    role: "VENDOR",
    shopId: "shop_aurora_01",
    shopSlug: "aurora-gems",
    shopName: "Aurora Haute Gems",
  },
  ADMIN: {
    id: "usr_admin_01",
    name: "Alexander Sterling",
    email: "admin@gemvault-market.com",
    role: "ADMIN",
  },
};

/**
 * Server-side helper to resolve the active user
 * Reads role header or falls back to simulated session
 */
export async function getCurrentUser(reqHeaders?: Headers): Promise<SessionUser> {
  const roleHeader = reqHeaders?.get("x-user-role") as Role | undefined;
  if (roleHeader && DEMO_USERS[roleHeader]) {
    return DEMO_USERS[roleHeader];
  }
  return DEMO_USERS.VENDOR;
}

export function isAuthorized(role: Role, requiredRole: Role | Role[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(role);
  }
  return role === requiredRole;
}
