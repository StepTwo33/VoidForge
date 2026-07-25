import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyFullAdmin } from "@/lib/auth/admin";
import {
  createNewsletterUnsubscribeToken,
  getAppBaseUrl,
  isSafeHttpsUrl,
  renderNewsletterEmail,
  sendNewsletterEmail,
  type NewsletterCompose,
} from "@/lib/auth/email";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logServerError } from "@/lib/log-server-error";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SUBJECT_MAX = 120;
const BODY_MAX = 20_000;
const EYEBROW_MAX = 80;
const PREHEADER_MAX = 200;
const CTA_LABEL_MAX = 60;
const CTA_URL_MAX = 500;
const CHUNK = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ComposeBody = {
  subject?: string;
  body?: string;
  eyebrow?: string;
  preheader?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  confirm?: boolean;
  testTo?: string;
};

function optionalString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseCompose(body: ComposeBody): { error: string } | NewsletterCompose {
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const textBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!subject || !textBody) {
    return { error: "Subject and body are required" };
  }
  if (subject.length > SUBJECT_MAX) {
    return { error: `Subject must be ${SUBJECT_MAX} characters or less` };
  }
  if (textBody.length > BODY_MAX) {
    return { error: `Body must be ${BODY_MAX} characters or less` };
  }

  const eyebrow = optionalString(body.eyebrow, EYEBROW_MAX);
  const preheader = optionalString(body.preheader, PREHEADER_MAX);
  const ctaLabel = optionalString(body.ctaLabel, CTA_LABEL_MAX);
  const ctaUrl = optionalString(body.ctaUrl, CTA_URL_MAX);

  if (ctaLabel || ctaUrl) {
    if (!ctaLabel || !ctaUrl) {
      return { error: "CTA requires both a label and an https URL" };
    }
    if (!isSafeHttpsUrl(ctaUrl)) {
      return { error: "CTA URL must be a valid https:// link" };
    }
  }

  return {
    subject,
    body: textBody,
    ...(eyebrow ? { eyebrow } : {}),
    ...(preheader ? { preheader } : {}),
    ...(ctaLabel && ctaUrl ? { ctaLabel, ctaUrl } : {}),
  };
}

// GET — subscriber count for the compose UI
export async function GET() {
  const { isAdmin } = await verifyFullAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const subscribers = await prisma.user.count({
    where: {
      newsletterOptIn: true,
      email: { not: null },
      bannedAt: null,
    },
  });

  return NextResponse.json({ subscribers });
}

// POST — send newsletter (all opted-in) or a single test address
export async function POST(req: NextRequest) {
  const { isAdmin, userId } = await verifyFullAdmin();
  if (!isAdmin || !userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 503 },
    );
  }

  let body: ComposeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseCompose(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const compose = parsed;

  const testTo = typeof body.testTo === "string" ? body.testTo.trim().toLowerCase() : "";
  const isTest = Boolean(testTo);
  const base = getAppBaseUrl();
  const profileUrl = `${base}/profile`;

  if (isTest) {
    if (!EMAIL_RE.test(testTo) || testTo.length > 254) {
      return NextResponse.json({ error: "Enter a valid test email address" }, { status: 400 });
    }

    const rl = checkRateLimit(`newsletter_test:${userId}`, 20, 60 * 60 * 1000);
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many test sends. Try again later." },
        { status: 429 },
      );
    }

    const html = renderNewsletterEmail(
      { ...compose, subject: `[TEST] ${compose.subject}` },
      { unsubscribeUrl: profileUrl, profileUrl },
    );

    try {
      await sendNewsletterEmail(testTo, `[TEST] ${compose.subject}`, html);
    } catch (e) {
      logServerError("[newsletter] test send failed", e);
      return NextResponse.json({ error: "Failed to send test email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, test: true, to: testTo });
  }

  const rl = checkRateLimit(`newsletter_send:${userId}`, 3, 60 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many newsletter sends. Try again later." },
      { status: 429 },
    );
  }

  if (!body.confirm) {
    return NextResponse.json(
      { error: "Set confirm: true to send the newsletter" },
      { status: 400 },
    );
  }

  const recipients = await prisma.user.findMany({
    where: {
      newsletterOptIn: true,
      email: { not: null },
      bannedAt: null,
    },
    select: { id: true, email: true, name: true },
  });

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += CHUNK) {
    const chunk = recipients.slice(i, i + CHUNK);
    const results = await Promise.allSettled(
      chunk.map(async (user) => {
        const email = user.email!;
        const token = createNewsletterUnsubscribeToken(user.id);
        const unsubscribeUrl = `${base}/unsubscribe?token=${encodeURIComponent(token)}`;
        const html = renderNewsletterEmail(compose, { unsubscribeUrl, profileUrl });
        await sendNewsletterEmail(email, compose.subject, html);
      }),
    );
    for (const r of results) {
      if (r.status === "fulfilled") sent++;
      else {
        failed++;
        logServerError("[newsletter] send failed", r.reason);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    total: recipients.length,
    sent,
    failed,
  });
}
