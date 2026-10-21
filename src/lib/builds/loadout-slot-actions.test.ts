import { describe, expect, it } from "vitest";
import {
  loadoutCardDomId,
  loadoutCardHref,
  loadoutSlotEditHref,
  loadoutSlotsAsBuilds,
} from "@/lib/builds/loadout-slot-helpers";
import type { Loadout } from "@/lib/types";

const l: Loadout = {
  id: "1730000000000_abc1234",
  name: "Kit",
  createdAt: 1,
  updatedAt: 1,
  warframeBuild: { warframeId: "gyre_prime", mods: [], shards: [], hasOrokinReactor: true },
  primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, isMR30: false, slotPolarities: {} },
  modularBuilds: { secondary: { modularType: "kitgun", parts: { chamber: "catchmoon" }, mods: [], hasOrokinCatalyst: false } },
  companionBuild: { companionId: "smeeta_kavat", mods: [], weaponMods: [], arcaneIds: [null, null], hasReactor: true, hasCatalyst: false, isMR30: false, slotPolarities: {} },
} as Loadout;

describe("loadout card links (R11-F1/F4/F5)", () => {
  it("card href and dom id", () => {
    expect(loadoutCardHref(l.id)).toBe("/loadouts?highlight=1730000000000_abc1234");
    expect(loadoutCardDomId(l.id)).toBe("loadout-1730000000000_abc1234");
  });
  it("slot switcher hrefs: builder per slot, modular for kitguns, null when empty", () => {
    expect(loadoutSlotEditHref(l, "warframe")).toBe(`/warframe-builder?loadout=${l.id}&slot=warframe`);
    expect(loadoutSlotEditHref(l, "primary")).toBe(`/weapon-builder?loadout=${l.id}&slot=primary`);
    expect(loadoutSlotEditHref(l, "secondary")).toBe(`/modular-builder?loadout=${l.id}&slot=secondary`);
    expect(loadoutSlotEditHref(l, "melee")).toBeNull();
    expect(loadoutSlotEditHref(l, "companion")).toBe(`/companion-builder?loadout=${l.id}&slot=companion`);
  });
});

describe("Save slots as builds (R11-F8)", () => {
  it("one private build per filled slot, typed and named", () => {
    let n = 0;
    const builds = loadoutSlotsAsBuilds(l, () => `id${n++}`, 5);
    expect(builds.map((b) => [b.type, b.name])).toEqual([
      ["warframe", "Kit — Warframe"],
      ["weapon", "Kit — Primary"],
      ["modular", "Kit — Secondary"],
      ["companion", "Kit — Companion"],
    ]);
    expect(builds.every((b) => b.isPublic === false)).toBe(true);
    expect(builds[0].data.hasOrokinReactor).toBe(true);
    expect(builds[1].data.hasOrokinCatalyst).toBe(true);
    expect(builds[2].data).not.toHaveProperty("slot");
    expect(new Set(builds.map((b) => b.id)).size).toBe(4);
  });
});
