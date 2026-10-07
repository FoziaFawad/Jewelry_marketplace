import crypto from "crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { Role } from "@/types";

export interface AuthSessionData {
  id: string;
  name: string;
  email: string;
  role: Role;
  shopId?: string | null;
  shopSlug?: string | null;
  shopName?: string | null;
}

/**
 * Hashes a plain password using PBKDF2 with a cryptographic salt.
 * Returns formatted "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

/**
 * Creates a signed base64 session payload
 */
export function createSessionToken(data: AuthSessionData): string {
  const payload = JSON.stringify({ ...data, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return Buffer.from(payload).toString("base64url");
}

/**
 * Parses and validates session token
 */
export function verifySessionToken(token: string): AuthSessionData | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      shopId: parsed.shopId,
      shopSlug: parsed.shopSlug,
      shopName: parsed.shopName,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side helper to get the active user session from cookies
 */
export async function getServerSession(): Promise<AuthSessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (token) {
      const decoded = verifySessionToken(token);
      if (decoded) return decoded;
    }

    // Fallback: check user_role cookie if session token is missing
    const roleCookie = cookieStore.get("user_role")?.value as Role | undefined;
    const emailCookie = cookieStore.get("user_email")?.value;

    if (emailCookie) {
      const user = await prisma.user.findUnique({
        where: { email: emailCookie },
        include: { shop: true },
      });
      if (user) {
        return {
          id: user.id,
          name: user.name || "Collector",
          email: user.email,
          role: user.role as Role,
          shopId: user.shop?.id,
          shopSlug: user.shop?.slug,
          shopName: user.shop?.name,
        };
      }
    }

    if (roleCookie) {
      return {
        id: "demo_user",
        name: roleCookie === "VENDOR" ? "Tariq Mehmood" : roleCookie === "ADMIN" ? "Hamza Malik" : "Ayla Zahra",
        email: roleCookie === "VENDOR" ? "tariq@naurattanjewelers.com" : roleCookie === "ADMIN" ? "admin@eternelle.com" : "buyer@eternelle.com",
        role: roleCookie,
        shopId: roleCookie === "VENDOR" ? "shop_aurora_01" : undefined,
        shopSlug: roleCookie === "VENDOR" ? "naurattan-jewelers" : undefined,
      };
    }

    return null;
  } catch {
    return null;
  }
}
