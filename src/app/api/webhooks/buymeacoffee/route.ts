import { NextRequest, NextResponse } from "next/server";
import {
  bmcEventShouldGrant,
  bmcEventShouldRevoke,
  parseBmcDonationWebhook,
  verifyBmcWebhookSignature,
} from "@/lib/auth/bmc-webhook";
import { logServerError } from "@/lib/log-server-error";
import { prisma } from "@/lib/prisma";
import {
  findVerifiedUserByDonorEmail,
  grantSupporter,
  revokeSupporter,
} from "@/lib/auth/supporter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.BMC_WEBHOOK_SECRET?.trim();
  if (!secret) {
    logServerError("POST /api/webhooks/buymeacoffee", new Error("BMC_WEBHOOK_SECRET is not configured"));
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature =
    req.headers.get("x-signature-sha256") ??
    req.headers.get("X-Signature-Sha256") ??
    req.headers.get("x-bmc-signature") ??
    req.headers.get("X-Bmc-Signature");
  const eventHeader =
    req.headers.get("x-bmc-event") ??
    req.headers.get("X-Bmc-Event");

  if (!verifyBmcWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const donation = parseBmcDonationWebhook(rawBody, eventHeader);
  if (!donation) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const existing = await prisma.donationEvent.findUnique({
      where: { externalId: donation.externalId },
    });
    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const user = await findVerifiedUserByDonorEmail(donation.supporterEmail);

    await prisma.donationEvent.create({
      data: {
        externalId: donation.externalId,
        provider: "buymeacoffee",
        supporterEmail: donation.supporterEmail.toLowerCase(),
        userId: user?.id ?? null,
        amount: donation.amount,
        eventType: donation.eventType,
      },
    });

    if (user) {
      if (bmcEventShouldGrant(donation.eventType)) {
        await grantSupporter(user.id);
      } else if (bmcEventShouldRevoke(donation.eventType)) {
        await revokeSupporter(user.id);
      }
    } else {
      logServerError(
        "POST /api/webhooks/buymeacoffee",
        new Error(
          `No verified Voidforge account matched BMC supporter email for ${donation.eventType}`,
        ),
      );
    }

    return NextResponse.json({ ok: true, matched: Boolean(user) });
  } catch (error) {
    logServerError("POST /api/webhooks/buymeacoffee", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
