/**
 * Round 26 — signed-in flows, exercised end to end below the auth pages:
 * the real /api/builds route handlers + the real client helpers (build-storage / yours-builds /
 * share-build) against a THROWAWAY SQLite database created in the OS temp dir from the repo's
 * own migrations. Only `getSession` is stubbed (we never mint a session token), and `fetch` is
 * routed straight to the route handlers. No dev.db, no network, no auth pages.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { NextRequest } from "next/server";

type TestSession = { user: { id: string; role: string; [k: string]: unknown } } | null;
const state = vi.hoisted(() => ({ session: null as TestSession }));

// Factory must not load the real auth module: it imports admin.ts, which would then keep the real getSession.
vi.mock("@/lib/auth/auth", () => ({ getSession: async () => state.session }));
vi.mock("@/lib/auth/email", () => ({ sendBuildDeletedEmail: vi.fn(async () => undefined) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/display/clipboard", () => ({ copyTextToClipboard: vi.fn(async () => true) }));
vi.mock("@/lib/site/support", () => ({ maybePromptSupportTip: vi.fn(async () => undefined) }));

let bindingOk = true;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  new (require("better-sqlite3"))(":memory:").close();
} catch {
  bindingOk = false; // native module not built (e.g. npm ci --ignore-scripts) — skip rather than fail
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vf-r26-flows-"));
const dbPath = path.join(tmpDir, "flows.db");
process.env.SQLITE_DATABASE_PATH = dbPath;
delete process.env.DATABASE_URL;

// Imported lazily (after the throwaway DB exists) in beforeAll.
type Mods = {
  prisma: typeof import("@/lib/prisma").prisma;
  buildsRoute: typeof import("@/app/api/builds/route");
  idRoute: typeof import("@/app/api/builds/[id]/route");
  publicRoute: typeof import("@/app/api/builds/public/route");
  voteRoute: typeof import("@/app/api/builds/[id]/vote/route");
  storage: typeof import("@/lib/builds/build-storage");
  yours: typeof import("@/lib/builds/yours-builds");
  loadouts: typeof import("@/lib/builds/loadouts");
  share: typeof import("@/lib/builds/share-build");
  cloudUrl: typeof import("@/lib/builds/use-cloud-build-from-url");
  clientSession: typeof import("@/lib/auth/client-session");
};
let m: Mods;

const ORIGIN = "http://localhost:3000";
function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  };
}

function req(url: string, init?: { method?: string; body?: unknown }) {
  return new NextRequest(new URL(url, ORIGIN), {
    method: init?.method ?? "GET",
    ...(init?.body !== undefined ? { body: typeof init.body === "string" ? init.body : JSON.stringify(init.body) } : {}),
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

/** Routes the client helpers' fetch() calls to the real handlers. */
async function routedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = new URL(String(input), ORIGIN);
  const method = (init?.method ?? "GET").toUpperCase();
  const body = typeof init?.body === "string" ? init.body : undefined;
  const r = new NextRequest(url, { method, ...(body !== undefined ? { body } : {}) });
  if (url.pathname === "/api/auth/session") {
    return Response.json(state.session ? { user: { id: state.session.user.id } } : {});
  }
  if (url.pathname === "/api/builds" && (method === "GET" || method === "POST")) {
    return method === "GET" ? m.buildsRoute.GET(r) : m.buildsRoute.POST(r);
  }
  if (url.pathname === "/api/builds/public") return m.publicRoute.GET(r);
  const one = url.pathname.match(/^\/api\/builds\/([^/]+)$/);
  if (one) return method === "DELETE" ? m.idRoute.DELETE(r, ctx(one[1])) : m.idRoute.GET(r, ctx(one[1]));
  return new Response("not routed in test", { status: 404 });
}

function signIn(id: string, role = "user") {
  state.session = { user: { id, role, name: id, username: id, email: `${id}@test.local`, image: null, emailVerified: true } };
  m.clientSession.resetClientSessionCache();
}
function signOut() {
  state.session = null;
  m.clientSession.resetClientSessionCache();
}

const weaponData = (weaponId = "braton") => ({ weaponId, mods: [], arcaneIds: [], hasOrokinCatalyst: true, isMR30: true, slotPolarities: {} });
const loadoutData = (warframeId = "excalibur") => ({
  warframeBuild: { warframeId, mods: [], shards: [], hasOrokinReactor: true },
});

describe.skipIf(!bindingOk)("signed-in flows (throwaway DB, real routes + client helpers)", () => {
  beforeAll(async () => {
    // Build the schema from the repo's migrations in the temp DB only.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const db = new Database(dbPath);
    const migDir = path.join(process.cwd(), "prisma", "migrations");
    for (const dir of fs.readdirSync(migDir).filter((d) => fs.statSync(path.join(migDir, d)).isDirectory()).sort()) {
      db.exec(fs.readFileSync(path.join(migDir, dir, "migration.sql"), "utf8"));
    }
    db.close();

    vi.stubGlobal("fetch", routedFetch);
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("window", { location: { origin: ORIGIN, href: `${ORIGIN}/`, search: "" } });

    m = {
      prisma: (await import("@/lib/prisma")).prisma,
      buildsRoute: await import("@/app/api/builds/route"),
      idRoute: await import("@/app/api/builds/[id]/route"),
      publicRoute: await import("@/app/api/builds/public/route"),
      voteRoute: await import("@/app/api/builds/[id]/vote/route"),
      storage: await import("@/lib/builds/build-storage"),
      yours: await import("@/lib/builds/yours-builds"),
      loadouts: await import("@/lib/builds/loadouts"),
      share: await import("@/lib/builds/share-build"),
      cloudUrl: await import("@/lib/builds/use-cloud-build-from-url"),
      clientSession: await import("@/lib/auth/client-session"),
    };
    for (const id of ["alice", "bob", "root"]) {
      await m.prisma.user.create({
        data: { id, name: id, username: id, email: `${id}@test.local`, role: id === "root" ? "admin" : "user" },
      });
    }
  });

  beforeEach(async () => {
    localStorage.clear();
    signOut();
    await m.prisma.buildVote.deleteMany();
    await m.prisma.build.deleteMany();
  });

  afterAll(async () => {
    await m.prisma?.$disconnect();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.unstubAllGlobals();
  });

  it("uses only the throwaway database (never dev.db)", () => {
    expect(process.env.SQLITE_DATABASE_PATH).toBe(dbPath);
    expect(path.basename(dbPath)).not.toBe("dev.db");
    expect(dbPath.startsWith(os.tmpdir())).toBe(true);
  });

  describe("cloud save", () => {
    it("rejects signed-out saves/lists with 401 and the client helpers no-op without hitting /api/builds", async () => {
      expect((await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "x", type: "weapon", data: weaponData() } }))).status).toBe(401);
      expect((await m.buildsRoute.GET(req("/api/builds"))).status).toBe(401);
      expect(await m.storage.saveCloudBuild({ id: "1700000000000_ab", name: "x", type: "weapon", createdAt: 1, updatedAt: 1, data: weaponData() })).toBeNull();
      expect(await m.storage.getCloudBuilds()).toEqual([]);
      expect(await m.prisma.build.count()).toBe(0);
    });

    it("persistSavedBuild writes local + account, remaps the device id to the cloud id, and a re-save updates the same row", async () => {
      signIn("alice");
      const local = { id: "1700000000000_abc1234", name: "Braton Prime", type: "weapon" as const, createdAt: 1, updatedAt: 1, data: weaponData("braton_prime") };
      const first = await m.storage.persistSavedBuild(local);
      expect(first.synced).toBe(true);
      expect(first.id).not.toBe(local.id);
      expect(first.builds.map((b) => b.id)).toEqual([first.id]); // device id replaced, no duplicate
      const row = await m.prisma.build.findUnique({ where: { id: first.id } });
      expect(row).toMatchObject({ userId: "alice", name: "Braton Prime", type: "weapon", itemId: "braton_prime", isPublic: false });

      const second = await m.storage.persistSavedBuild({ ...local, id: first.id, name: "Braton Prime v2", updatedAt: 2 });
      expect(second.id).toBe(first.id);
      expect(await m.prisma.build.count()).toBe(1);
      expect((await m.prisma.build.findUnique({ where: { id: first.id } }))!.name).toBe("Braton Prime v2");
    });

    it("signed in but offline/failed sync keeps the local copy and reports synced:false", async () => {
      signIn("alice");
      vi.stubGlobal("fetch", async (input: RequestInfo | URL) =>
        String(input).includes("/api/auth/session") ? Response.json({ user: { id: "alice" } }) : new Response("boom", { status: 500 }),
      );
      const out = await m.storage.persistSavedBuild({ id: "1700000000001_zzz9999", name: "Offline", type: "weapon", createdAt: 1, updatedAt: 1, data: weaponData() });
      vi.stubGlobal("fetch", routedFetch);
      expect(out.synced).toBe(false);
      expect(out.id).toBe("1700000000001_zzz9999");
      expect(m.storage.getSavedBuilds("weapon")).toHaveLength(1);
      expect(await m.prisma.build.count()).toBe(0);
    });

    it("validates input (type, name, size) and never lets one user overwrite another's build", async () => {
      signIn("alice");
      const bad = (body: unknown) => m.buildsRoute.POST(req("/api/builds", { method: "POST", body }));
      expect((await bad({ name: "x", type: "bogus", data: {} })).status).toBe(400);
      expect((await bad({ name: "   ", type: "weapon", data: {} })).status).toBe(400);
      expect((await bad({ type: "weapon", data: {} })).status).toBe(400);
      expect((await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: "{nope" }))).status).toBe(400);
      expect((await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: JSON.stringify({ name: "x", type: "weapon", data: { pad: "x".repeat(500_001) } }) }))).status).toBe(413);

      const created = await (await bad({ name: "Mine", type: "weapon", data: weaponData() })).json();
      signIn("bob");
      expect((await bad({ id: created.id, name: "Hijack", type: "weapon", data: weaponData() })).status).toBe(403);
      expect((await m.prisma.build.findUnique({ where: { id: created.id } }))!.name).toBe("Mine");
    });
  });

  describe("loading saved builds", () => {
    it("GET /api/builds lists only the signed-in user's builds, newest first, filterable by type", async () => {
      signIn("alice");
      for (const [name, type, data] of [["W", "weapon", weaponData()], ["L", "loadout", loadoutData()]] as const) {
        await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name, type, data } }));
      }
      signIn("bob");
      await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "Bob's", type: "weapon", data: weaponData() } }));

      signIn("alice");
      const all = await (await m.buildsRoute.GET(req("/api/builds"))).json();
      expect(all.map((b: { name: string }) => b.name).sort()).toEqual(["L", "W"]);
      const onlyLoadouts = await m.storage.getCloudBuilds("loadout");
      expect(onlyLoadouts.map((b) => b.name)).toEqual(["L"]);
      expect((await m.buildsRoute.GET(req("/api/builds?type=nope"))).status).toBe(400);
    });

    it("?buildId= loading: owner opens a private build; others and signed-out get nothing", async () => {
      signIn("alice");
      const created = await (await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "Private", type: "weapon", data: weaponData("soma") } }))).json();

      const owner = await m.cloudUrl.fetchCloudBuild(created.id);
      expect(owner).toMatchObject({ id: created.id, name: "Private", type: "weapon", isPublic: false });
      expect((owner!.data as { weaponId: string }).weaponId).toBe("soma");
      const ownerRes = await m.idRoute.GET(req(`/api/builds/${created.id}`), ctx(created.id));
      expect(ownerRes.headers.get("Cache-Control")).toBe("private, no-store");

      signIn("bob");
      expect(await m.cloudUrl.fetchCloudBuild(created.id)).toBeNull();
      signOut();
      expect((await m.idRoute.GET(req(`/api/builds/${created.id}`), ctx(created.id))).status).toBe(401);
      expect((await m.idRoute.GET(req("/api/builds/does-not-exist"), ctx("does-not-exist"))).status).toBe(404);
    });
  });

  describe("public listing, removing visibility, and deleting", () => {
    it("listing → unlisting keeps the build; deleting removes it (and its votes) everywhere", async () => {
      signIn("alice");
      const saved = await m.storage.persistSavedBuild({ id: "1700000000002_aaa1111", name: "Soma Crit", type: "weapon", createdAt: 1, updatedAt: 1, data: weaponData("soma") });
      const cloudId = saved.id;
      const publicIds = async () => ((await (await m.publicRoute.GET(req("/api/builds/public"))).json()).builds as { id: string }[]).map((b) => b.id);

      expect(await publicIds()).toEqual([]); // private by default

      const asBuild = (await m.storage.getCloudBuilds("weapon"))[0];
      const listed = await m.yours.setYoursBuildPublic(asBuild, true);
      expect(listed.ok).toBe(true);
      expect(await publicIds()).toEqual([cloudId]);
      const publicCard = (await (await m.publicRoute.GET(req("/api/builds/public"))).json()).builds[0];
      expect(publicCard.author.username).toBe("alice");
      expect(publicCard).not.toHaveProperty("data"); // summaries never leak build payloads
      const publicGet = await m.idRoute.GET(req(`/api/builds/${cloudId}`), ctx(cloudId));
      expect(publicGet.status).toBe(200);
      expect(publicGet.headers.get("Cache-Control")).toContain("public");

      // Another signed-in user can upvote a public build.
      signIn("bob");
      expect((await m.voteRoute.POST(req(`/api/builds/${cloudId}/vote`, { method: "POST" }), ctx(cloudId))).status).toBe(200);
      expect(await m.prisma.buildVote.count()).toBe(1);

      // Remove from Community (visibility only).
      signIn("alice");
      const unlisted = await m.yours.setYoursBuildPublic({ ...asBuild, isPublic: true }, false);
      expect(unlisted.ok).toBe(true);
      expect(await publicIds()).toEqual([]);
      expect(await m.prisma.build.findUnique({ where: { id: cloudId } })).toMatchObject({ isPublic: false, name: "Soma Crit" });
      expect((await m.storage.getCloudBuilds("weapon")).map((b) => b.id)).toEqual([cloudId]); // still in the owner's library
      expect((await m.idRoute.GET(req(`/api/builds/${cloudId}`), ctx(cloudId))).status).toBe(200); // owner can still open it
      signIn("bob");
      expect((await m.idRoute.GET(req(`/api/builds/${cloudId}`), ctx(cloudId))).status).toBe(401); // others can't
      expect((await m.voteRoute.POST(req(`/api/builds/${cloudId}/vote`, { method: "POST" }), ctx(cloudId))).status).toBe(403);

      // Delete (removes the row for real).
      signIn("alice");
      expect(await m.storage.deleteCloudBuild(cloudId)).toBe(true);
      expect(await m.prisma.build.count()).toBe(0);
      expect(await m.prisma.buildVote.count()).toBe(0); // cascade
      expect(await m.storage.getCloudBuilds()).toEqual([]);
      expect((await m.idRoute.GET(req(`/api/builds/${cloudId}`), ctx(cloudId))).status).toBe(404);
      expect(await publicIds()).toEqual([]);
    });

    it("only the owner (or staff) can delete; a stranger gets 403 and the build survives", async () => {
      signIn("alice");
      const created = await (await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "Keep", type: "weapon", data: weaponData(), isPublic: true } }))).json();
      signIn("bob");
      expect((await m.idRoute.DELETE(req(`/api/builds/${created.id}`, { method: "DELETE" }), ctx(created.id))).status).toBe(403);
      expect(await m.storage.deleteCloudBuild(created.id)).toBe(false);
      signOut();
      expect((await m.idRoute.DELETE(req(`/api/builds/${created.id}`, { method: "DELETE" }), ctx(created.id))).status).toBe(401);
      expect(await m.prisma.build.count()).toBe(1);

      signIn("root", "admin"); // staff moderation path
      const res = await m.idRoute.DELETE(req(`/api/builds/${created.id}`, { method: "DELETE", body: { reason: "test", notifyOwner: false } }), ctx(created.id));
      expect(res.status).toBe(200);
      expect((await res.json()).notified).toBe(false);
      expect(await m.prisma.build.count()).toBe(0);
    });

    it("banned authors' builds stay out of the public feed", async () => {
      signIn("alice");
      await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "Pub", type: "weapon", data: weaponData(), isPublic: true } }));
      await m.prisma.user.update({ where: { id: "alice" }, data: { bannedAt: new Date() } });
      try {
        expect((await (await m.publicRoute.GET(req("/api/builds/public"))).json()).builds).toEqual([]);
      } finally {
        await m.prisma.user.update({ where: { id: "alice" }, data: { bannedAt: null } });
      }
    });
  });

  describe("loadouts: synced + public", () => {
    const loadout = (over: Record<string, unknown> = {}) => ({
      id: "1700000000003_lo11111",
      name: "Daily driver",
      createdAt: 1,
      updatedAt: 1,
      ...loadoutData("volt"),
      ...over,
    });

    it("a loadout saved to the account merges onto the local copy via cloudId (no duplicate), and rename syncs", async () => {
      signIn("alice");
      const local = loadout();
      m.loadouts.saveLoadout(local as never);
      const saved = await m.storage.saveCloudBuild({
        id: local.id, name: local.name, type: "loadout", createdAt: 1, updatedAt: 1,
        data: m.loadouts.loadoutToBuildData(m.loadouts.getLoadouts()[0]),
      });
      expect(saved).not.toBeNull();
      expect((await m.prisma.build.findUniqueOrThrow({ where: { id: saved!.id } })).itemId).toBe("volt");
      m.loadouts.saveLoadout({ ...m.loadouts.getLoadouts()[0], cloudId: saved!.id });

      const merged = await m.yours.mergeYoursLoadouts();
      expect(merged).toHaveLength(1);
      // The row keeps the device id; the account id is reachable through cloudId (what Delete / List use).
      expect(m.yours.accountBuildId(merged[0])).toBe(saved!.id);

      const renamed = await m.yours.renameYoursBuild(merged[0], "Volt main");
      expect(renamed.ok).toBe(true);
      expect((await m.prisma.build.findUniqueOrThrow({ where: { id: saved!.id } })).name).toBe("Volt main");
      expect(m.loadouts.getLoadouts()[0].name).toBe("Volt main");
      expect(await m.prisma.build.count()).toBe(1);
    });

    it("public toggle on a synced loadout updates both the local kit and the account row; unlisting is not deleting", async () => {
      signIn("alice");
      m.loadouts.saveLoadout(loadout() as never);
      const saved = await m.storage.saveCloudBuild({
        id: "1700000000003_lo11111", name: "Daily driver", type: "loadout", createdAt: 1, updatedAt: 1,
        data: m.loadouts.loadoutToBuildData(m.loadouts.getLoadouts()[0]),
      });
      m.loadouts.saveLoadout({ ...m.loadouts.getLoadouts()[0], cloudId: saved!.id });
      const row = (await m.yours.mergeYoursLoadouts())[0];
      const feed = async () => (await (await m.publicRoute.GET(req("/api/builds/public?type=loadout"))).json()).builds.length;

      expect((await m.yours.setYoursBuildPublic(row, true)).ok).toBe(true);
      expect(await feed()).toBe(1);
      expect(m.loadouts.getLoadouts()[0].isPublic).toBe(true);

      expect((await m.yours.setYoursBuildPublic({ ...row, isPublic: true }, false)).ok).toBe(true);
      expect(await feed()).toBe(0);
      expect(m.loadouts.getLoadouts()[0].isPublic).toBe(false);
      expect(await m.prisma.build.count()).toBe(1);
      expect((await m.prisma.build.findUniqueOrThrow({ where: { id: saved!.id } })).data).toContain("volt");
    });

    it("device-only loadouts can't be listed until saved to the account", async () => {
      signIn("alice");
      m.loadouts.saveLoadout(loadout() as never);
      const row = (await m.yours.mergeYoursLoadouts())[0];
      const res = await m.yours.setYoursBuildPublic(row, true);
      expect(res.ok).toBe(false);
      expect(await m.prisma.build.count()).toBe(0);
    });
  });

  describe("share links", () => {
    const fallback = { type: "weapon" as const, itemId: "soma", mods: [{ id: "serration", rank: 10 }], hasOrokinCatalyst: true, isMR30: true };

    it("a public account build shares /build/<id>; a private or device build shares a self-contained ?build= link", async () => {
      const publicOut = await m.share.shareBuilderBuild({ isPublic: true, buildId: "ckabc123", fallback });
      expect(publicOut).toEqual({ kind: "copied", url: `${ORIGIN}/build/ckabc123` });

      const privateOut = await m.share.shareBuilderBuild({ isPublic: false, buildId: "ckabc123", fallback });
      expect(privateOut.kind).toBe("copied");
      expect((privateOut as { url: string }).url).toContain("?build=");
      expect((privateOut as { url: string }).url).not.toContain("/build/ckabc123");

      const deviceOut = await m.share.shareBuilderBuild({ isPublic: true, buildId: "1700000000004_dev1234", fallback });
      expect((deviceOut as { url: string }).url).toContain("?build="); // device ids never produce a community URL

      // The private link is self-contained: it decodes back to the same build.
      const code = new URL((privateOut as { url: string }).url).searchParams.get("build")!;
      const { decodeBuild } = await import("@/lib/builds/build-url");
      expect(decodeBuild(code)).toMatchObject({ type: "weapon", itemId: "soma", mods: [{ id: "serration", rank: 10 }] });
    });

    it("the /build/<id> link a public share points at resolves for signed-out visitors, and stops once unlisted", async () => {
      signIn("alice");
      const created = await (await m.buildsRoute.POST(req("/api/builds", { method: "POST", body: { name: "Shared", type: "weapon", data: weaponData("soma"), isPublic: true } }))).json();
      signOut();
      expect((await m.idRoute.GET(req(`/api/builds/${created.id}`), ctx(created.id))).status).toBe(200);
      await m.prisma.build.update({ where: { id: created.id }, data: { isPublic: false } });
      expect((await m.idRoute.GET(req(`/api/builds/${created.id}`), ctx(created.id))).status).toBe(401);
    });
  });
});
