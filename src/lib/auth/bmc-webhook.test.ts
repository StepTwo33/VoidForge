import { describe, expect, it } from "vitest";
import crypto from "crypto";
import {
  bmcEventShouldGrant,
  bmcEventShouldRevoke,
  parseBmcDonationWebhook,
  verifyBmcWebhookSignature,
} from "@/lib/auth/bmc-webhook";

describe("BMC webhook parser", () => {
  it("parses donation.created from body type", () => {
    const raw = JSON.stringify({
      type: "donation.created",
      data: {
        supporter_email: "aelara@example.com",
        transaction_id: "txn_1",
        total_amount: "5.00",
      },
    });
    expect(parseBmcDonationWebhook(raw, null)).toEqual({
      eventType: "donation.created",
      externalId: "donation.created:txn_1",
      supporterEmail: "aelara@example.com",
      amount: "5.00",
    });
  });


  it("parses membership.started (previously ignored)", () => {
    const raw = JSON.stringify({
      event_id: 99,
      type: "membership.started",
      data: {
        payer_email: "aelara@example.com",
        subscription_id: "sub_42",
        amount: "3.00",
      },
    });
    const parsed = parseBmcDonationWebhook(raw, "membership.started");
    expect(parsed).toEqual({
      eventType: "membership.started",
      externalId: "99",
      supporterEmail: "aelara@example.com",
      amount: "3.00",
    });
    expect(bmcEventShouldGrant(parsed!.eventType)).toBe(true);
  });

  it("keeps cancel distinct from started when only subscription_id exists", () => {
    const started = parseBmcDonationWebhook(
      JSON.stringify({
        type: "membership.started",
        data: { supporter_email: "a@x.com", subscription_id: "sub_1", amount: "3" },
      }),
      null,
    );
    const cancelled = parseBmcDonationWebhook(
      JSON.stringify({
        type: "membership.cancelled",
        data: { supporter_email: "a@x.com", subscription_id: "sub_1" },
      }),
      null,
    );
    expect(started?.externalId).toBe("membership.started:sub_1");
    expect(cancelled?.externalId).toBe("membership.cancelled:sub_1");
    expect(bmcEventShouldRevoke(cancelled!.eventType)).toBe(true);
  });
  it("parses recurring_donation.started with nested supporter", () => {
    const raw = JSON.stringify({
      type: "recurring_donation.started",
      data: {
        id: "rd_7",
        supporter: { email: "tipper@example.com" },
        coffee_price: "5",
      },
    });
    expect(parseBmcDonationWebhook(raw, null)?.supporterEmail).toBe("tipper@example.com");
  });

  it("ignores unrelated shop events", () => {
    const raw = JSON.stringify({
      type: "extra_purchase.created",
      data: { email: "x@example.com", id: "1" },
    });
    expect(parseBmcDonationWebhook(raw, null)).toBeNull();
  });

  it("marks cancel/refund as revoke", () => {
    expect(bmcEventShouldRevoke("donation.refunded")).toBe(true);
    expect(bmcEventShouldRevoke("membership.cancelled")).toBe(true);
    expect(bmcEventShouldRevoke("membership.paused")).toBe(false);
  });

  it("verifies sha256 signature including sha256= prefix", () => {
    const secret = "test-secret";
    const body = '{"type":"donation.created"}';
    const hex = crypto.createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyBmcWebhookSignature(body, hex, secret)).toBe(true);
    expect(verifyBmcWebhookSignature(body, `sha256=${hex}`, secret)).toBe(true);
    expect(verifyBmcWebhookSignature(body, "deadbeef", secret)).toBe(false);
  });
});
