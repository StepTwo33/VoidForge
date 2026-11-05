import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SavedBuild } from "./build-storage";
import { resetClientSessionCache } from "@/lib/auth/client-session";
import { deleteYoursSavedBuild, mergeBuilderSavedBuilds, mergeSavedBuildLists } from "./yours-builds";

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

const mk = (id: string, type: SavedBuild["type"], updatedAt: number, name = id): SavedBuild => ({
  id, name, type, createdAt: updatedAt, updatedAt, data: { warframeId: "ash", mods: [] },
});

let cloud: SavedBuild[] = [];
let deleted: string[] = [];

beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = globalThis;
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
  resetClientSessionCache();
  cloud = [];
  deleted = [];
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "/api/auth/session") return new Response(JSON.stringify({ user: { id: "u1" } }));
    if (init?.method === "DELETE") {
      deleted.push(url);
      return new Response("{}");
    }
    const type = new URL(url, "http://x").searchParams.get("type");
    return new Response(JSON.stringify(type ? cloud.filter((b) => b.type === type) : cloud));
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Round 55: builder Saved builds = device + account (root cause: builders read localStorage only)", () => {
  it("includes account builds that are not on this device, like /builds does", async () => {
    localStorage.setItem("framehub_builds", JSON.stringify([mk("1730000000000_dev", "warframe", 1)]));
    cloud = [mk("cl-ash", "warframe", 5), mk("cl-saryn", "warframe", 4), mk("cl-soma", "weapon", 9)];
    const ids = (await mergeBuilderSavedBuilds("warframe")).map((b) => b.id);
    expect(ids).toEqual(["cl-ash", "cl-saryn", "1730000000000_dev"]);
  });

  it("is not capped at 80 (the /builds-style merge helpers default to 80)", async () => {
    cloud = Array.from({ length: 130 }, (_, i) => mk(`cl-${i}`, "weapon", i));
    expect(await mergeBuilderSavedBuilds("weapon")).toHaveLength(130);
  });

  it("dedupes a build saved on this device and in the account, newer copy wins", () => {
    const merged = mergeSavedBuildLists([mk("x", "weapon", 1, "old")], [mk("x", "weapon", 2, "new")]);
    expect(merged.map((b) => b.name)).toEqual(["new"]);
  });

  it("deleting an account build from a builder also deletes it from the account", async () => {
    await deleteYoursSavedBuild("cl-ash");
    await deleteYoursSavedBuild("1730000000000_dev");
    expect(deleted).toEqual(["/api/builds/cl-ash"]);
  });
});
