import crypto from "crypto";

interface VerificationRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

// Preserve state across Next.js HMR reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __verificationStore: Map<string, VerificationRecord> | undefined;
}

const store: Map<string, VerificationRecord> =
  global.__verificationStore || (global.__verificationStore = new Map());

// Cleanup expired codes periodically
function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [email, record] of store.entries()) {
    if (record.expiresAt < now) {
      store.delete(email);
    }
  }
}

/**
 * Generates a 6-digit numeric verification code for an email address
 * Valid for 10 minutes
 */
export function generateVerificationCode(email: string): string {
  cleanupExpiredCodes();

  const normalizedEmail = email.toLowerCase().trim();
  // Generate random 6-digit number between 100000 and 999999
  const code = crypto.randomInt(100000, 999999).toString();

  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  store.set(normalizedEmail, {
    code,
    expiresAt,
    attempts: 0,
    createdAt: Date.now(),
  });

  return code;
}

/**
 * Validates a verification code for an email
 */
export function verifyCode(
  email: string,
  inputCode: string
): { valid: boolean; error?: string } {
  cleanupExpiredCodes();

  const normalizedEmail = email.toLowerCase().trim();
  const record = store.get(normalizedEmail);

  if (!record) {
    return {
      valid: false,
      error: "No verification code was requested for this email, or the code has expired. Please request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    store.delete(normalizedEmail);
    return {
      valid: false,
      error: "Verification code has expired. Please request a new code.",
    };
  }

  if (record.attempts >= 5) {
    store.delete(normalizedEmail);
    return {
      valid: false,
      error: "Too many failed attempts. For your security, this code was invalidated. Please request a new code.",
    };
  }

  if (record.code !== inputCode.trim()) {
    record.attempts += 1;
    store.set(normalizedEmail, record);
    const remaining = 5 - record.attempts;
    return {
      valid: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // Code is valid! Consume it so it cannot be used twice
  store.delete(normalizedEmail);

  return { valid: true };
}

/**
 * Check if a code currently exists and is still valid (without consuming it)
 */
export function hasActiveCode(email: string): boolean {
  cleanupExpiredCodes();
  const normalizedEmail = email.toLowerCase().trim();
  const record = store.get(normalizedEmail);
  return Boolean(record && Date.now() < record.expiresAt);
}
