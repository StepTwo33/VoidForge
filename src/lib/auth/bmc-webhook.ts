import crypto from "crypto";

export interface BmcDonationPayload {
  eventType: string;
  externalId: string;
  supporterEmail: string;
  amount: string | null;
}

/** Events that should grant the cosmetic Supporter badge. */
export const BMC_GRANT_EVENTS = new Set([
  "donation.created",
  "membership.started",
  "membership.updated",
  "recurring_donation.started",
  "recurring_donation.updated",
]);

/** Events that should remove the badge. */
export const BMC_REVOKE_EVENTS = new Set([
  "donation.refunded",
  "membership.cancelled",
  "recurring_donation.cancelled",
]);

function readString(obj: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim()) return val.trim();
    if (typeof val === "number" && Number.isFinite(val)) return String(val);
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function nestedSupporter(data: Record<string, unknown>): Record<string, unknown> | null {
  return (
    asRecord(data.supporter) ??
    asRecord(data.payer) ??
    asRecord(data.member) ??
    asRecord(data.customer) ??
    null
  );
}

/** Verify BMC webhook HMAC-SHA256 signature (x-signature-sha256 / legacy x-bmc-signature). */
export function verifyBmcWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signatureHeader.trim().toLowerCase().replace(/^sha256=/, "");
  if (expected.length !== received.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch {
    return false;
  }
}

/**
 * Parse BMC support webhook body for tip / membership / recurring events.
 * Returns null for event types we do not handle.
 */
export function parseBmcDonationWebhook(
  rawBody: string,
  eventHeader: string | null,
): BmcDonationPayload | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }

  const root = asRecord(parsed);
  if (!root) return null;

  const data =
    asRecord(root.data) ??
    asRecord(root.response) ??
    asRecord(root.payload) ??
    root;

  const eventType =
    (eventHeader ?? readString(root, "type", "event", "event_type") ?? "").toLowerCase();

  if (!BMC_GRANT_EVENTS.has(eventType) && !BMC_REVOKE_EVENTS.has(eventType)) {
    return null;
  }

  const nested = nestedSupporter(data);
  const supporterEmail =
    readString(
      data,
      "supporter_email",
      "supporterEmail",
      "payer_email",
      "payerEmail",
      "member_email",
      "memberEmail",
      "email",
    ) ??
    (nested
      ? readString(nested, "email", "supporter_email", "payer_email", "member_email")
      : null);
  if (!supporterEmail) return null;

  // Prefer envelope event_id so started/updated/cancelled on the same subscription
  // are not collapsed into one DonationEvent row (which would skip revoke).
  const resourceId = readString(
    data,
    "transaction_id",
    "transactionId",
    "payment_id",
    "paymentId",
    "subscription_id",
    "subscriptionId",
    "membership_id",
    "membershipId",
    "id",
    "support_id",
    "supportId",
  );
  const externalId =
    readString(root, "event_id", "eventId") ??
    (resourceId ? `${eventType}:${resourceId}` : null) ??
    `${eventType}:${supporterEmail}:${readString(data, "support_created_on", "created_at", "createdAt", "started_at") ?? rawBody.length}`;
  const amount =
    readString(
      data,
      "total_amount",
      "totalAmount",
      "amount",
      "coffee_price",
      "membership_level_price",
      "level_price",
      "price",
    ) ??
    (() => {
      const coffees = readString(data, "number_of_coffees", "numberOfCoffees");
      return coffees ? `${coffees} coffee(s)` : null;
    })();

  return {
    eventType,
    externalId,
    supporterEmail,
    amount,
  };
}

export function bmcEventShouldGrant(eventType: string): boolean {
  return BMC_GRANT_EVENTS.has(eventType.toLowerCase());
}

export function bmcEventShouldRevoke(eventType: string): boolean {
  return BMC_REVOKE_EVENTS.has(eventType.toLowerCase());
}
