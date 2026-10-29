import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
process.env.GOOGLE_CLIENT_ID ??= "test-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "test-client-secret";

import { exchangeCodeForUser, getGoogleAuthUrl } from "@/lib/auth/auth";

afterEach(() => vi.unstubAllGlobals());

describe("Google sign-in requests only basic scopes", () => {
  const url = new URL(getGoogleAuthUrl("https://void-forge.org/api/auth/callback", "state123"));

  it("asks for openid, email and profile only", () => {
    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("redirect_uri")).toBe("https://void-forge.org/api/auth/callback");
    expect(url.searchParams.get("state")).toBe("state123");
  });

  it("does not request offline access or force the consent prompt", () => {
    expect(url.searchParams.has("access_type")).toBe(false);
    expect(url.searchParams.has("prompt")).toBe(false);
  });

  it("sign-in still completes with just an access token (no refresh token)", async () => {
    const fetchMock = vi.fn(async (input: string) =>
      input.startsWith("https://oauth2.googleapis.com/token")
        ? Response.json({ access_token: "at", expires_in: 3599, token_type: "Bearer", scope: "openid email profile" })
        : Response.json({ id: "g-1", email: "tenno@example.com", name: "Tenno", picture: "https://lh3.example/p.png" })
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = await exchangeCodeForUser("code", "https://void-forge.org/api/auth/callback");
    expect(user).toEqual({ id: "g-1", email: "tenno@example.com", name: "Tenno", image: "https://lh3.example/p.png" });
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ headers: { Authorization: "Bearer at" } });
  });
});
