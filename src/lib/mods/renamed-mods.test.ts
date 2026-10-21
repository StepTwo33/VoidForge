/**
 * Round 14: legacy Link Shields / Link Armor removed. wiki.warframe.com and fandom Patch History,
 * Update 34.0 (2023-10-18): "Link Shields has been renamed to Link Redirection" and "Link Armor has
 * been renamed to Link Fiber" (same item and uniqueName, so ranks carry over). Old builds migrate.
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allCompanions } from "@/data/companions";
import { WIKI_INCOMPATIBLE_MOD_PAIRS } from "@/data/mod-incompatibilities";
import { MOD_INCOMPATIBLE_PAIRS } from "@/data/mod-exclusions";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { calculateCompanionBuild, COMPANION_LINK_MODS } from "@/lib/calc/companion-calculator";
import { dropUnknownMods, migrateRenamedMods, migrateRenamedModsDeep, RENAMED_MOD_IDS } from "@/lib/mods/known-mods";
import { lotusItemName } from "@/lib/warframe-arsenal/lotus-resolve";
import { cleanLoadedBuild, describeMigratedMods } from "@/lib/builds/incompatible-mod-warnings";
import type { SavedBuild } from "@/lib/builds/build-storage";

const LEGACY = ["link_shields", "link_armor"];

describe("legacy Link Shields / Link Armor are gone", () => {
  it("not in the catalog, behaviors, Link table or incompatibility data", () => {
    for (const id of LEGACY) {
      expect(modsMap.has(id)).toBe(false);
      expect(VERIFIED_MOD_BEHAVIORS[id]).toBeUndefined();
      expect(COMPANION_LINK_MODS[id]).toBeUndefined();
      expect(MOD_INCOMPATIBLE_PAIRS.flat()).not.toContain(id);
      expect(WIKI_INCOMPATIBLE_MOD_PAIRS.flat()).not.toContain(id);
    }
    expect(allMods.some((m) => m.name === "Link Shields" || m.name === "Link Armor")).toBe(false);
  });

  it("Player Sync: their in-game uniqueNames resolve to Link Redirection / Link Fiber", () => {
    expect(lotusItemName("/Lotus/Upgrades/Mods/Sentinel/Kubrow/KubrowLinkShieldMaxMod")).toBe("Link Redirection");
    expect(lotusItemName("/Lotus/Upgrades/Mods/Sentinel/Kubrow/KubrowLinkArmourMaxMod")).toBe("Link Fiber");
  });
});

describe("old builds migrate instead of dropping", () => {
  it("maps ids, keeps the rank and the slot", () => {
    expect(RENAMED_MOD_IDS).toEqual({ link_shields: "link_redirection", link_armor: "link_fiber" });
    const { mods, migrated } = migrateRenamedMods(
      [{ modId: "link_shields", rank: 5, slotIndex: 2 }, { modId: "link_armor", rank: 3, slotIndex: 3 }, { modId: "bite", rank: 10, slotIndex: 4 }],
      modsMap,
    );
    expect(mods).toEqual([{ modId: "link_redirection", rank: 5, slotIndex: 2 }, { modId: "link_fiber", rank: 3, slotIndex: 3 }, { modId: "bite", rank: 10, slotIndex: 4 }]);
    expect(migrated.map((m) => m.toModId)).toEqual(["link_redirection", "link_fiber"]);
    expect(describeMigratedMods(migrated)).toEqual(["Link Shields → Link Redirection", "Link Armor → Link Fiber"]);
  });

  it("clamps the rank and drops the old copy when the current mod is already equipped", () => {
    const { mods, migrated } = migrateRenamedMods([{ modId: "link_redirection", rank: 10, slotIndex: 0 }, { modId: "link_shields", rank: 12, slotIndex: 1 }, { modId: "link_armor", rank: 12, slotIndex: 2 }], modsMap);
    expect(mods).toEqual([{ modId: "link_redirection", rank: 10, slotIndex: 0 }, { modId: "link_fiber", rank: 10, slotIndex: 2 }]);
    expect(migrated[0]).toEqual({ fromModId: "link_shields", toModId: "link_redirection", droppedAsDuplicate: true });
  });

  it("returns the same array / payload when there is nothing to migrate", () => {
    const list = [{ modId: "link_vitality", rank: 10, slotIndex: 0 }];
    expect(migrateRenamedMods(list, modsMap).mods).toBe(list);
    const data = { companionBuild: { mods: list } };
    expect(migrateRenamedModsDeep(data, modsMap).data).toBe(data);
  });

  it("a saved companion build loads with the current mods and the right stats (Smeeta + Rhino 740/1,110/480)", () => {
    const build: SavedBuild = {
      id: "old", name: "old", type: "companion", createdAt: 0, updatedAt: 0,
      data: { companionId: "smeeta", mods: [{ modId: "link_shields", rank: 10, slotIndex: 0 }, { modId: "link_armor", rank: 10, slotIndex: 1 }, { modId: "calculated_redirection", rank: 5, slotIndex: 2 }], weaponMods: [], hasReactor: true },
    };
    const cleaned = cleanLoadedBuild(build);
    // Link Shields became Link Redirection, which the game won't equip with Calculated Redirection:
    // the first one (slot 0) is kept.
    expect(cleaned.data.mods).toEqual([{ modId: "link_redirection", rank: 10, slotIndex: 0 }, { modId: "link_fiber", rank: 10, slotIndex: 1 }]);
    const s = calculateCompanionBuild(allCompanions.find((c) => c.id === "smeeta")!, cleaned.data.mods, modsMap, null, { name: "Rhino", health: 740, shield: 1110, armor: 480 });
    expect(s.totalShield).toBeCloseTo(230 + 1.25 * 1110, 3); // 1,617.5
    expect(s.totalArmor).toBeCloseTo(300 + 1.25 * 480, 3); // 900
  });

  it("loadouts migrate too (companion slot inside a loadout payload)", () => {
    const loadout = { warframeBuild: { warframeId: "rhino", mods: [] }, companionBuild: { companionId: "smeeta", mods: [{ modId: "link_armor", rank: 4, slotIndex: 1 }], weaponMods: [] } };
    const { data } = migrateRenamedModsDeep(loadout, modsMap);
    expect(data.companionBuild.mods).toEqual([{ modId: "link_fiber", rank: 4, slotIndex: 1 }]);
    expect(data.warframeBuild).toBe(loadout.warframeBuild);
  });

  it("anything else that's unknown is dropped by dropUnknownMods", () => {
    expect(dropUnknownMods([{ modId: "link_shields" }, { modId: "link_fiber" }], modsMap)).toEqual([{ modId: "link_fiber" }]);
  });
});
