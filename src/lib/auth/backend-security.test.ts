import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("backend security hardening", () => {
  it("getSession returns null when the user is banned or missing in DB", async () => {
    const { SignJWT } = await import("jose");
    const secret = new TextEncoder().encode("dev-secret-change-me");
    const token = await new SignJWT({
      user: {
        id: "user_1",
        name: "Tenno",
        username: "tenno",
        email: "tenno@example.com",
        image: null,
        emailVerified: true,
        role: "user",
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .setIssuedAt()
      .sign(secret);

    const findUnique = vi.fn();
    vi.doMock("next/headers", () => ({
      cookies: async () => ({
        get: (name: string) => (name === "framehub_session" ? { value: token } : undefined),
      }),
    }));
    vi.doMock("@/lib/prisma", () => ({
      prisma: { user: { findUnique } },
    }));

    const { getSession } = await import("@/lib/auth/auth");

    // Active user: returns session with fresh DB role/emailVerified
    findUnique.mockResolvedValueOnce({ bannedAt: null, role: "moderator", emailVerified: new Date() });
    const active = await getSession();
    expect(active?.user.id).toBe("user_1");
    expect(active?.user.role).toBe("moderator");

    // Banned user: session invalidated immediately despite valid JWT
    findUnique.mockResolvedValueOnce({ bannedAt: new Date(), role: "user", emailVerified: new Date() });
    expect(await getSession()).toBeNull();

    // Deleted user: session invalidated immediately
    findUnique.mockResolvedValueOnce(null);
    expect(await getSession()).toBeNull();
  });

  it("exchangeCodeForUser rejects unverified Google emails", async () => {
    process.env.GOOGLE_CLIENT_ID ??= "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET ??= "test-client-secret";
    vi.doMock("@/lib/prisma", () => ({ prisma: {} }));

    const fetchMock = vi.fn(async (input: string) =>
      input.startsWith("https://oauth2.googleapis.com/token")
        ? Response.json({ access_token: "at", expires_in: 3599, token_type: "Bearer" })
        : Response.json({ id: "g-1", email: "tenno@example.com", verified_email: false }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { exchangeCodeForUser } = await import("@/lib/auth/auth");
    expect(await exchangeCodeForUser("code", "https://void-forge.org/api/auth/callback")).toBeNull();
  });

  it("resend-verification does not leak whether an email is already verified", async () => {
    vi.doMock("@/lib/auth/auth", () => ({
      findUserByEmailInsensitive: vi.fn(async () => ({
        id: "u1",
        email: "verified@example.com",
        emailVerified: new Date(),
      })),
      generateVerificationCode: () => "123456",
      storeVerificationToken: vi.fn(),
    }));
    vi.doMock("@/lib/auth/email", () => ({ sendVerificationEmail: vi.fn() }));

    const { POST } = await import("@/app/api/auth/resend-verification/route");
    const res = await POST(
      new NextRequest("http://localhost/api/auth/resend-verification", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.10" },
        body: JSON.stringify({ email: "verified@example.com" }),
      }),
    );
    expect(res.status).toBe(200);
  });

  it("discord OAuth callback rejects mismatched or missing session even when discord_oauth_uid matches", async () => {
    const getSession = vi.fn();
    vi.doMock("@/lib/auth/auth", () => ({ getSession }));
    vi.doMock("@/lib/prisma", () => ({ prisma: {} }));

    const { GET } = await import("@/app/api/bot/discord/callback/route");

    const buildReq = () =>
      new NextRequest("http://localhost/api/bot/discord/callback?code=abc&state=st1", {
        headers: { cookie: "discord_oauth_state=st1; discord_oauth_uid=victim_user" },
      });

    getSession.mockResolvedValueOnce(null);
    const resMissing = await GET(buildReq());
    expect(resMissing.headers.get("location")).toContain("Session%20expired");

    getSession.mockResolvedValueOnce({ user: { id: "attacker_user" } });
    const resMismatch = await GET(buildReq());
    expect(resMismatch.headers.get("location")).toContain("Session%20expired");
  });

  it("warframe arsenal route rate-limits excessive requests per IP", async () => {
    vi.doMock("@/lib/warframe-arsenal/fetch", () => ({
      ArsenalFetchError: class extends Error {
        constructor(msg: string, readonly code: string) {
          super(msg);
        }
      },
      fetchAndMapWarframeArsenal: vi.fn(async () => ({ loadout: {} })),
    }));

    const { GET } = await import("@/app/api/warframe/arsenal/route");
    const ip = "203.0.113.77";
    for (let i = 0; i < 30; i++) {
      const r = await GET(
        new NextRequest("http://localhost/api/warframe/arsenal?platform=pc&account=tenno", {
          headers: { "cf-connecting-ip": ip },
        }),
      );
      expect(r.status).toBe(200);
    }
    const blocked = await GET(
      new NextRequest("http://localhost/api/warframe/arsenal?platform=pc&account=tenno", {
        headers: { "cf-connecting-ip": ip },
      }),
    );
    expect(blocked.status).toBe(429);
  });

  it("POST /api/reports strips non-upload screenshot URLs and keeps valid upload paths", async () => {
    const createMock = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: "rep_1", ...data }));
    vi.doMock("@/lib/auth/auth", () => ({ getSession: vi.fn(async () => null) }));
    vi.doMock("@/lib/auth/admin", () => ({ verifyAdmin: vi.fn(async () => ({ isAdmin: false })) }));
    vi.doMock("@/lib/prisma", () => ({ prisma: { report: { create: createMock } } }));
    vi.doMock("@/lib/sqlite-schema-repair", () => ({
      withSqliteSchemaRetry: async <T>(fn: () => Promise<T>) => fn(),
    }));

    const { POST } = await import("@/app/api/reports/route");
    const res = await POST(
      new NextRequest("http://localhost/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.42" },
        body: JSON.stringify({
          itemName: "Braton",
          screenshots: [
            "https://evil.example/pixel.png",
            "javascript:alert(1)",
            "/api/uploads/reports/../secret.png",
            "/api/uploads/reports/report_123_abcd.png",
          ],
        }),
      }),
    );
    expect(res.status).toBe(201);
    const saved = createMock.mock.calls[0][0].data.screenshots;
    expect(JSON.parse(saved as string)).toEqual(["/api/uploads/reports/report_123_abcd.png"]);
  });

  it("GET /api/builds/[id] returns 404 when the author is banned", async () => {
    vi.doMock("@/lib/auth/auth", () => ({ getSession: vi.fn(async () => null) }));
    vi.doMock("@/lib/auth/admin", () => ({ verifyAdmin: vi.fn(async () => ({ isAdmin: false })) }));
    vi.doMock("@/lib/prisma", () => ({
      prisma: {
        build: {
          findUnique: vi.fn(async () => ({
            id: "b_banned",
            name: "Hidden",
            description: "",
            isPublic: true,
            type: "weapon",
            itemId: "braton",
            upvoteCount: 0,
            data: "{}",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "u_banned",
            user: { username: "bad", name: null, image: null, supporterAt: null, bannedAt: new Date() },
          })),
        },
      },
    }));

    const { GET } = await import("@/app/api/builds/[id]/route");
    const res = await GET(new NextRequest("http://localhost/api/builds/b_banned"), {
      params: Promise.resolve({ id: "b_banned" }),
    });
    expect(res.status).toBe(404);
  });
});
