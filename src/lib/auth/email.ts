/**
 * Email delivery via Resend.
 * Transactional mail uses support@; newsletters use a separate news@ address.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { Resend } from "resend";
import { logServerError } from "@/lib/log-server-error";
import { escapeHtml } from "@/lib/auth/newsletter-template";

export {
  buildNewsletterHtml,
  plainTextToNewsletterHtml,
  markdownToNewsletterHtml,
  renderNewsletterEmail,
  buildNewsletterPreviewDocument,
  escapeHtml,
  isSafeHttpsUrl,
  NEWSLETTER_DEFAULT_EYEBROW,
} from "@/lib/auth/newsletter-template";
export type { NewsletterCompose, BuildNewsletterHtmlParams } from "@/lib/auth/newsletter-template";
const resend = new Resend(process.env.RESEND_API_KEY);

const SUPPORT_FROM =
  process.env.EMAIL_FROM_SUPPORT?.trim() || "FrameHub <support@frame-hub.com>";
const NEWSLETTER_FROM =
  process.env.EMAIL_FROM_NEWSLETTER?.trim() || "FrameHub News <news@frame-hub.com>";

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: SUPPORT_FROM,
    to: email,
    subject: "Your FrameHub verification code",
    html: verificationTemplate(code),
  });

  if (error) {
    logServerError("Failed to send verification email", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: SUPPORT_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    logServerError("Failed to send email", error);
    throw new Error("Failed to send email");
  }
}

export async function sendNewsletterEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    logServerError("Failed to send newsletter email", error);
    throw new Error("Failed to send newsletter email");
  }
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  if (process.env.AUTH_URL?.trim()) return process.env.AUTH_URL.trim().replace(/\/$/, "");
  return "http://localhost:3000";
}

function unsubscribeSecret(): string {
  return process.env.AUTH_SECRET?.trim() || "dev-unsubscribe-secret";
}

/** Signed token for one-click newsletter unsubscribe links. */
export function createNewsletterUnsubscribeToken(userId: string): string {
  const sig = createHmac("sha256", unsubscribeSecret())
    .update(`newsletter-unsub:${userId}`)
    .digest("base64url");
  return `${userId}.${sig}`;
}

export function verifyNewsletterUnsubscribeToken(token: string): string | null {
  const [userId, sig] = token.split(".");
  if (!userId || !sig) return null;
  const expected = createHmac("sha256", unsubscribeSecret())
    .update(`newsletter-unsub:${userId}`)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return userId;
}

/** Opt-in email when a mod checks “Also email the reporter” on resolve / won't fix. */
export async function sendReportStatusEmail(params: {
  to: string;
  reporterName: string;
  status: "resolved" | "wontfix";
  itemName: string;
  itemType: string;
  reportId: string;
  adminReply?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] RESEND_API_KEY missing; skipping report status notification");
    }
    return;
  }
  const base = getAppBaseUrl();
  const profileUrl = `${base}/profile`;
  const isResolved = params.status === "resolved";
  const subject = isResolved
    ? `Your report was resolved: ${params.itemName}`
    : `Update on your report: ${params.itemName}`;
  const headline = isResolved ? "Report marked resolved" : "Report closed (won't fix)";
  const bodyText = isResolved
    ? "A moderator reviewed your data issue report and marked it as resolved. Thank you for helping improve Frame Hub."
    : "A moderator reviewed your report and marked it as won't fix. If you still believe there is an error, you can submit a new report with more detail.";

  const reply = params.adminReply?.trim();
  const replyBlock = reply
    ? `
        <div style="margin: 16px 0 0; padding: 14px 16px; background: #0f172a; border: 1px solid #334155; border-radius: 8px;">
          <p style="color: #64748b; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin: 0 0 8px;">Moderator reply</p>
          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.55; margin: 0; white-space: pre-wrap;">${escapeHtml(reply)}</p>
        </div>`
    : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; color: #e2e8f0;">
          <span style="color: #22d3ee;">Frame</span><span style="color: #94a3b8;">Hub</span>
        </h1>
      </div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px;">
        <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 12px;">${headline}</p>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">${bodyText}</p>
        <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Item</td><td style="padding: 4px 0;">${escapeHtml(params.itemName)}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Type</td><td style="padding: 4px 0;">${escapeHtml(params.itemType)}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Report ID</td><td style="padding: 4px 0; font-family: monospace; font-size: 11px;">${escapeHtml(params.reportId)}</td></tr>
        </table>
        ${replyBlock}
        <p style="margin: 20px 0 0;">
          <a href="${profileUrl}" style="display: inline-block; background: #0ea5e9; color: #0f172a; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 8px;">View your profile & reports</a>
        </p>
      </div>
      <p style="color: #475569; font-size: 11px; text-align: center; margin-top: 24px;">
        Hi ${escapeHtml(params.reporterName)}, you received this because you submitted this report while signed in to Frame Hub.
      </p>
    </div>
  `;

  await sendEmail(params.to, subject, html);
}

function verificationTemplate(code: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="margin: 0; font-size: 24px; color: #e2e8f0;">
          <span style="color: #22d3ee;">Frame</span><span style="color: #94a3b8;">Hub</span>
        </h1>
      </div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; text-align: center;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px;">Your verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f1f5f9; margin: 16px 0; font-family: monospace;">
          ${code}
        </div>
        <p style="color: #64748b; font-size: 12px; margin: 16px 0 0;">This code expires in 10 minutes.</p>
      </div>
      <p style="color: #475569; font-size: 11px; text-align: center; margin-top: 24px;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `;
}
