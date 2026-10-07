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
    name: "Ayla Zahra",
    email: "buyer@eternelle.com",
    role: "BUYER",
  },
  VENDOR: {
    id: "usr_vendor_01",
    name: "Tariq Mehmood",
    email: "tariq@naurattanjewelers.com",
    role: "VENDOR",
    shopId: "shop_aurora_01",
    shopSlug: "naurattan-jewelers",
    shopName: "Naurattan Heritage Jewelers",
  },
  ADMIN: {
    id: "usr_admin_01",
    name: "Hamza Malik",
    email: "admin@eternelle.com",
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
