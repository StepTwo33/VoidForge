import { describe, expect, it } from "vitest";
import { withLoadoutSlot, type LoadoutEditContext } from "@/lib/builds/loadout-edit-context";
import type { Loadout } from "@/lib/types";

const base = (): Loadout => ({
  id: "1792000000000_abc",
  name: "Tenno — Imported Loadout",
  createdAt: 1,
  updatedAt: 1,
  warframeBuild: {
    warframeId: "grendel",
    mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 1 }],
    shards: [null, null, null, null, null],
    arcaneIds: [null, null],
    hasOrokinReactor: true,
    slotPolarities: {},
  },
  primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
});
const ctx = (kind: LoadoutEditContext["kind"], slot: string): LoadoutEditContext => ({
  loadoutId: "1792000000000_abc",
  loadoutName: "Tenno",
  kind,
  slot,
});

describe("withLoadoutSlot", () => {
  it("replaces only the warframe slot", () => {
    const lo = base();
    const data = { ...lo.warframeBuild!, mods: [...lo.warframeBuild!.mods, { modId: "augment_grendel_gastroparesis", rank: 3, slotIndex: 3 }] };
    const out = withLoadoutSlot(lo, ctx("warframe", "warframe"), data);
    expect(out.warframeBuild?.mods.map((m) => m.modId)).toEqual(["vitality_r3", "augment_grendel_gastroparesis"]);
    expect(out.primaryBuild).toEqual(lo.primaryBuild);
    expect(out.id).toBe(lo.id);
    expect(lo.warframeBuild?.mods).toHaveLength(1);
  });
  it("writes a weapon into the secondary slot", () => {
    const out = withLoadoutSlot(base(), ctx("weapon", "secondary"), { weaponId: "lex_prime", mods: [], hasOrokinCatalyst: false });
    expect(out.secondaryBuild?.weaponId).toBe("lex_prime");
    expect(out.secondaryBuild?.arcaneIds).toEqual([null, null]);
    expect(out.primaryBuild?.weaponId).toBe("braton_prime");
  });
  it("a modular build replaces the regular weapon in that slot", () => {
    const out = withLoadoutSlot(base(), ctx("modular", "primary"), {
      modularType: "kitgun",
      parts: { chamber: "a" },
      mods: [],
      hasOrokinCatalyst: false,
    });
    expect(out.primaryBuild).toBeUndefined();
    expect(out.modularBuilds?.primary?.modularType).toBe("kitgun");
  });
});
