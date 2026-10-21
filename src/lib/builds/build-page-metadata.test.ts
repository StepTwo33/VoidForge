import { describe, expect, it, vi } from "vitest";
import { buildPageMetadata, type BuildPageRecord } from "@/lib/builds/build-page-metadata";

const findUnique = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { build: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));

const record = (over: Partial<BuildPageRecord> = {}): BuildPageRecord => ({
  id: "abc123",
  name: "Steel Path Slash",
  description: "",
  isPublic: true,
  type: "warframe",
  data: JSON.stringify({ warframeId: "excalibur", mods: [{ modId: "vitality", rank: 10, slotIndex: 0 }] }),
  updatedAt: new Date(1760000000000),
  user: { username: "tenno", name: null },
  ...over,
});

describe("buildPageMetadata: public build", () => {
  const m = buildPageMetadata(record(), "/build/abc123/og-image?v=1");
  it("title is build name plus item", () => {
    expect(m.title).toBe("Steel Path Slash — Excalibur");
  });
  it("description names the item, type and author, then a short summary", () => {
    expect(m.description).toMatch(/^Excalibur warframe build by tenno\. /);
    expect((m.description as string).length).toBeLessThanOrEqual(200);
  });
  it("canonical and og:url are /build/<id>", () => {
    expect(m.alternates?.canonical).toBe("/build/abc123");
    expect((m.openGraph as { url?: string }).url).toBe("/build/abc123");
  });
  it("og/twitter title, description and dynamic image", () => {
    const og = m.openGraph as { title?: string; description?: string; images?: { url: string }[] };
    expect(og.title).toBe("Steel Path Slash — Excalibur | Voidforge");
    expect(og.description).toBe(m.description);
    expect(og.images?.[0].url).toBe("/build/abc123/og-image?v=1");
    const tw = m.twitter as { title?: string; images?: { url: string }[] };
    expect(tw.title).toBe(og.title);
    expect(tw.images?.[0].url).toBe("/build/abc123/og-image?v=1");
  });
  it("is indexable (no robots override)", () => {
    expect(m.robots).toBeUndefined();
  });
  it("author notes are used as the summary and clipped to 200 chars", () => {
    const long = buildPageMetadata(record({ description: "x ".repeat(300) }));
    expect((long.description as string).length).toBeLessThanOrEqual(200);
    expect(long.description).toMatch(/…$/);
  });
  it("doesn't repeat the item when the build name already has it", () => {
    expect(buildPageMetadata(record({ name: "My Excalibur build" })).title).toBe("My Excalibur build");
  });
});

describe("buildPageMetadata: private and missing builds", () => {
  for (const [label, r] of [
    ["private", record({ isPublic: false, name: "Secret Name", description: "secret notes" })],
    ["missing", null],
    ["corrupt data", record({ data: "{not json" })],
  ] as const) {
    it(`${label}: generic noindex metadata, nothing about the build`, () => {
      const m = buildPageMetadata(r);
      expect(m.robots).toEqual({ index: false, follow: false });
      expect(m.title).toBe("Build not available");
      expect(m.openGraph).toBeUndefined();
      expect(m.alternates).toBeUndefined();
      const text = JSON.stringify(m);
      for (const leak of ["Secret Name", "secret notes", "tenno", "Excalibur", "abc123"]) expect(text).not.toContain(leak);
    });
  }
});

describe("page generateMetadata (one shared DB lookup)", () => {
  it("public: one findUnique, build-specific metadata with the versioned og-image", async () => {
    findUnique.mockReset().mockResolvedValue({ ...record(), user: { username: "tenno", name: null, image: null, supporterAt: null } });
    const { generateMetadata } = await import("@/app/build/[id]/page");
    const m = await generateMetadata({ params: Promise.resolve({ id: "abc123" }) });
    expect(findUnique).toHaveBeenCalledTimes(1);
    expect((m.openGraph as { images?: { url: string }[] }).images?.[0].url).toBe("/build/abc123/og-image?v=1760000000000");
  });
  it("private: generic noindex, no session lookup needed", async () => {
    findUnique.mockReset().mockResolvedValue({ ...record({ isPublic: false }), userId: "u1", user: { username: "tenno", name: null, image: null, supporterAt: null } });
    const { generateMetadata } = await import("@/app/build/[id]/page");
    const m = await generateMetadata({ params: Promise.resolve({ id: "abc123" }) });
    expect(m.robots).toEqual({ index: false, follow: false });
  });
  it("missing: generic noindex", async () => {
    findUnique.mockReset().mockResolvedValue(null);
    const { generateMetadata } = await import("@/app/build/[id]/page");
    expect((await generateMetadata({ params: Promise.resolve({ id: "nope" }) })).robots).toEqual({ index: false, follow: false });
  });
});
