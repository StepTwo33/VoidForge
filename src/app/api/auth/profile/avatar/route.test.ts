import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { NextRequest } from "next/server";

const userUpdate = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { user: { update: (...a: unknown[]) => userUpdate(...a) } } }));
vi.mock("@/lib/auth/auth", () => ({ getSession: vi.fn(async () => ({ user: { id: "user_1" } })) }));

import { DELETE, POST } from "@/app/api/auth/profile/avatar/route";
import { GET as serveAvatar } from "@/app/api/uploads/avatars/[filename]/route";

let root: string;
const dir = () => path.join(root, "public", "uploads", "avatars");
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 1, 2, 3]);
const upload = (bytes: Buffer, type: string) => {
  const form = new FormData();
  form.append("avatar", new File([new Uint8Array(bytes)], "a", { type }));
  return POST(new NextRequest("http://localhost/api/auth/profile/avatar", { method: "POST", body: form }));
};
const serve = (filename: string) =>
  serveAvatar(new NextRequest(`http://localhost/api/uploads/avatars/${filename}`), { params: Promise.resolve({ filename }) });

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "vf-avatar-route-"));
  vi.spyOn(process, "cwd").mockReturnValue(root);
  userUpdate.mockReset().mockResolvedValue({});
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("avatar upload, serve and delete", () => {
  it("upload creates the folder, writes <userId>.<ext>, drops the old extension and is served back", async () => {
    mkdirSync(dir(), { recursive: true });
    writeFileSync(path.join(dir(), "user_1.jpg"), "old");
    const res = await upload(PNG, "image/png");
    expect(res.status).toBe(200);
    const { image } = await res.json();
    expect(image).toMatch(/^\/api\/uploads\/avatars\/user_1\.png\?t=\d+$/);
    expect(readFileSync(path.join(dir(), "user_1.png"))).toEqual(PNG);
    expect(existsSync(path.join(dir(), "user_1.jpg"))).toBe(false);
    expect(userUpdate).toHaveBeenCalledWith({ where: { id: "user_1" }, data: { image } });
    const served = await serve("user_1.png");
    expect(served.status).toBe(200);
    expect(served.headers.get("content-type")).toBe("image/png");
  });

  it("rejects bytes that are not an image", async () => {
    expect((await upload(Buffer.from("not an image at all"), "image/png")).status).toBe(400);
    expect(existsSync(path.join(dir(), "user_1.png"))).toBe(false);
  });

  it("DELETE removes the file and clears the image", async () => {
    await upload(PNG, "image/png");
    const res = await DELETE();
    expect(res.status).toBe(200);
    expect(existsSync(path.join(dir(), "user_1.png"))).toBe(false);
    expect(userUpdate).toHaveBeenLastCalledWith({ where: { id: "user_1" }, data: { image: null } });
    expect((await serve("user_1.png")).status).toBe(404);
  });
});
