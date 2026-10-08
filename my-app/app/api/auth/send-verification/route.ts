import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, purpose = "register" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If user is registering, ensure email is not already taken
    if (purpose === "register") {
      try {
        const existing = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existing) {
          return NextResponse.json(
            {
              success: false,
              error: "An account with this email address already exists. Please log in instead.",
            },
            { status: 409 }
          );
        }
      } catch (dbError) {
        console.warn("DB check during send-verification skipped or failed:", dbError);
      }
    }

    // Generate a fresh 6-digit code
    const code = generateVerificationCode(normalizedEmail);

    // Send email using Nodemailer
    const emailResult = await sendVerificationEmail(normalizedEmail, code, name);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            emailResult.error ||
            "Failed to send email. Please verify your SMTP settings in .env",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      isDevPreview: emailResult.preview,
      // In dev mode when SMTP is not yet filled in .env, return debug helper
      ...(emailResult.preview ? { devHintCode: code } : {}),
    });
  } catch (error: any) {
    console.error("send-verification route error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Could not send verification code" },
      { status: 500 }
    );
  }
}
