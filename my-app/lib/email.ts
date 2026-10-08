import nodemailer from "nodemailer";

/**
 * Configure Nodemailer transporter using Gmail SMTP or custom SMTP settings
 */
function getEmailTransporter() {
  const user = process.env.EMAIL_SERVER_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_SERVER_PORT || "587", 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587 with STARTTLS
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as Parameters<typeof nodemailer.createTransport>[0]);
}

/**
 * Sends a high-end luxury branded verification code email
 */
export async function sendVerificationEmail(
  toEmail: string,
  verificationCode: string,
  recipientName?: string
): Promise<{ success: boolean; messageId?: string; preview?: boolean; error?: string }> {
  const transporter = getEmailTransporter();
  const senderEmail = process.env.EMAIL_SERVER_USER || process.env.GMAIL_USER || "atelier@eternelle.com";
  const fromName = process.env.EMAIL_FROM_NAME || "Éternelle Fine Jewelry Atelier";
  const fromAddress = process.env.EMAIL_FROM || `"${fromName}" <${senderEmail}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Éternelle Verification Code</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #faf7f2;
          color: #292524;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 580px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #ede5dc;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #1c1917;
          padding: 36px 30px;
          text-align: center;
        }
        .header h1 {
          color: #d4af37;
          font-family: 'Georgia', serif;
          font-size: 24px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 0;
          font-weight: 400;
        }
        .header p {
          color: #a8a29e;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 8px;
          margin-bottom: 0;
        }
        .content {
          padding: 40px 36px;
        }
        .greeting {
          font-size: 16px;
          color: #1c1917;
          margin-bottom: 16px;
        }
        .text {
          font-size: 14px;
          line-height: 1.6;
          color: #57534e;
          margin-bottom: 28px;
        }
        .code-box {
          background-color: #fcf9f5;
          border: 1px dashed #b48c48;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin-bottom: 28px;
        }
        .code-title {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #826229;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #1c1917;
          margin: 0;
        }
        .expiry-note {
          font-size: 12px;
          color: #a8a29e;
          margin-top: 12px;
          margin-bottom: 0;
        }
        .security-notice {
          border-top: 1px solid #f5eee6;
          padding-top: 20px;
          font-size: 12px;
          color: #78716c;
          line-height: 1.5;
        }
        .footer {
          background-color: #f7f3ee;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #a8a29e;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>É T E R N E L L E</h1>
          <p>Haute Horlogerie & Fine Jewelry Atelier</p>
        </div>
        <div class="content">
          <p class="greeting">Dear ${recipientName || "Collector"},</p>
          <p class="text">
            Thank you for registering your credentials with the Éternelle Haute Jewelry Marketplace.
            To authenticate your email address and activate your account, please enter the following 6-digit verification code:
          </p>
          
          <div class="code-box">
            <div class="code-title">Security Authentication Code</div>
            <p class="code">${verificationCode}</p>
            <p class="expiry-note">This code will expire in 10 minutes.</p>
          </div>

          <div class="security-notice">
            <strong>Security Notice:</strong> Never share this code with anyone. Éternelle ateliers and curators will never ask for your authentication key. If you did not request this verification, please disregard this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Éternelle Luxury Group. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // Fallback if SMTP credentials are not yet set in .env
  if (!transporter) {
    console.warn("\n=======================================================");
    console.warn("⚠️  NODEMAILER NOT FULLY CONFIGURED IN .env");
    console.warn(`📩  To: ${toEmail}`);
    console.warn(`🔑  VERIFICATION CODE: [ ${verificationCode} ]`);
    console.warn("👉  Add EMAIL_SERVER_USER & EMAIL_SERVER_PASSWORD to .env");
    console.warn("=======================================================\n");

    return {
      success: true,
      preview: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `${verificationCode} is your Éternelle verification code`,
      text: `Your Éternelle verification code is: ${verificationCode}. It is valid for 10 minutes.`,
      html: htmlContent,
    });

    console.log(`✅ Nodemailer successfully delivered code ${verificationCode} to ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      preview: false,
    };
  } catch (error: any) {
    console.error("❌ Nodemailer failed to send email:", error);
    return {
      success: false,
      error: error?.message || "Failed to send verification email through SMTP",
    };
  }
}
