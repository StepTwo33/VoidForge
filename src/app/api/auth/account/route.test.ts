import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from "fs";
import os from "os";
import path from "path";
import { NextRequest } from "next/server";

const USER = { id: "user_abc123", email: "tenno@example.com", username: "tenno" };
const userDelete = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async () => USER),
      delete: (...a: unknown[]) => userDelete(...a),
    },
  },
}));
vi.mock("@/lib/auth/auth", () => ({
  getSession: vi.fn(async () => ({ user: { id: USER.id } })),
  SESSION_COOKIE: "framehub_session",
  clearFramehubSessionCookieOptions: () => ({ path: "/", maxAge: 0 }),
}));

import { DELETE } from "@/app/api/auth/account/route";
import { GET as getAvatar } from "@/app/api/uploads/avatars/[filename]/route";

let root: string;
const avatarDir = () => path.join(root, "public", "uploads", "avatars");
const del = () =>
  DELETE(new NextRequest("http://localhost/api/auth/account", { method: "DELETE", body: JSON.stringify({ confirm: "tenno" }) }));
const fetchAvatar = (filename: string) =>
  getAvatar(new NextRequest(`http://localhost/api/uploads/avatars/${filename}`), { params: Promise.resolve({ filename }) });

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "vf-avatar-"));
  mkdirSync(avatarDir(), { recursive: true });
  vi.spyOn(process, "cwd").mockReturnValue(root);
  userDelete.mockReset().mockResolvedValue(USER);
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("DELETE /api/auth/account removes the uploaded avatar", () => {
  it("deletes the user's avatar file so its link stops opening; other users' files stay", async () => {
    writeFileSync(path.join(avatarDir(), `${USER.id}.png`), "png");
    writeFileSync(path.join(avatarDir(), `${USER.id}.webp`), "stale");
    writeFileSync(path.join(avatarDir(), "someone_else.png"), "png");
    expect((await fetchAvatar(`${USER.id}.png`)).status).toBe(200);

    const res = await del();
    expect(res.status).toBe(200);
    expect(userDelete).toHaveBeenCalledWith({ where: { id: USER.id } });
    expect(existsSync(path.join(avatarDir(), `${USER.id}.png`))).toBe(false);
    expect(existsSync(path.join(avatarDir(), `${USER.id}.webp`))).toBe(false);
    expect(existsSync(path.join(avatarDir(), "someone_else.png"))).toBe(true);
    expect((await fetchAvatar(`${USER.id}.png`)).status).not.toBe(200);
  });

  it("succeeds when the user never uploaded an avatar", async () => {
    expect((await del()).status).toBe(200);
  });

  it("keeps the avatar if the account row could not be deleted", async () => {
    writeFileSync(path.join(avatarDir(), `${USER.id}.jpg`), "jpg");
    userDelete.mockRejectedValueOnce(new Error("db down"));
    expect((await del()).status).toBe(500);
    expect(existsSync(path.join(avatarDir(), `${USER.id}.jpg`))).toBe(true);
  });
});
