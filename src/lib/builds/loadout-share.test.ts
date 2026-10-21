import { describe, expect, it } from "vitest";
import { decodeLoadoutShare, encodeLoadoutShare, loadoutSharePath } from "@/lib/builds/loadout-share";
import type { Loadout } from "@/lib/types";

const loadout: Loadout = {
  id: "1730000000000_abc1234",
  name: "Gyre — Imported Oct 20, 2026",
  cloudId: "secret-cloud-id",
  isPublic: false,
  importWarnings: ["Something"],
  importSource: { platform: "pc", account: "Me" },
  createdAt: 1,
  updatedAt: 2,
  warframeBuild: {
    warframeId: "gyre_prime",
    mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 0 }],
    shards: [null, null, null, null, null],
    hasOrokinReactor: true,
  },
  primaryBuild: { weaponId: "braton_prime", mods: [], hasOrokinCatalyst: true } as Loadout["primaryBuild"],
};

describe("loadout share links", () => {
  it("round-trips slot data and the name", async () => {
    const code = await encodeLoadoutShare(loadout);
    expect(code.startsWith("z.") || code.length > 0).toBe(true);
    const back = await decodeLoadoutShare(code);
    expect(back?.name).toBe(loadout.name);
    expect(back?.data.warframeBuild?.warframeId).toBe("gyre_prime");
    expect(back?.data.warframeBuild?.hasOrokinReactor).toBe(true);
    expect(back?.data.primaryBuild?.weaponId).toBe("braton_prime");
    expect(loadoutSharePath(code)).toBe(`/loadouts?shared=${code}`);
  });

  it("never carries local-only or account fields", async () => {
    const back = await decodeLoadoutShare(await encodeLoadoutShare(loadout));
    const json = JSON.stringify(back);
    for (const k of ["secret-cloud-id", "importWarnings", "importSource", "1730000000000_abc1234"]) {
      expect(json).not.toContain(k);
    }
  });

  it("rejects junk", async () => {
    expect(await decodeLoadoutShare("not-a-code")).toBeNull();
    expect(await decodeLoadoutShare("z.AAAA")).toBeNull();
  });
});
