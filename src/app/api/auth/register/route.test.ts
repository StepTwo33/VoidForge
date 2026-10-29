import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const userCreate = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { create: (...a: unknown[]) => userCreate(...a), delete: vi.fn() }, verificationToken: { deleteMany: vi.fn() } },
}));
vi.mock("@/lib/auth/auth", () => ({
  hashPassword: vi.fn(async () => "hash"),
  generateVerificationCode: () => "123456",
  storeVerificationToken: vi.fn(async () => {}),
  findUserByEmail: vi.fn(async () => null),
  generateUniqueUsername: vi.fn(async () => "tenno"),
}));
vi.mock("@/lib/auth/email", () => ({ sendVerificationEmail: vi.fn(async () => {}) }));

import { POST } from "@/app/api/auth/register/route";

let n = 0;
const register = (extra: Record<string, unknown>) =>
  POST(
    new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++n}` },
      body: JSON.stringify({ email: `tenno${n}@example.com`, password: "password123", ...extra }),
    })
  );
const savedOptIn = () => (userCreate.mock.calls.at(-1)?.[0] as { data: { newsletterOptIn: boolean } }).data.newsletterOptIn;

beforeEach(() => userCreate.mockReset().mockResolvedValue({ id: "u1" }));

describe("POST /api/auth/register newsletter opt-in", () => {
  it("is off when the checkbox is left unticked (field missing or false)", async () => {
    expect((await register({})).status).toBe(200);
    expect(savedOptIn()).toBe(false);
    await register({ newsletterOptIn: false });
    expect(savedOptIn()).toBe(false);
  });
  it("is on only when the checkbox is ticked", async () => {
    await register({ newsletterOptIn: true });
    expect(savedOptIn()).toBe(true);
  });
  it("ignores non-boolean values", async () => {
    await register({ newsletterOptIn: "true" });
    expect(savedOptIn()).toBe(false);
  });
});
