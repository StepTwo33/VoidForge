/**
 * Round 13: the game's mod incompatibility rule, from wiki.warframe.com Module:Mods/data
 * `Incompatible` lists (scripts/gen_mod_incompatibilities.py). Samples checked on
 * wiki.warframe.com pages 2026-10-21: Redirection ("Incompatible Mods: Primed Redirection,
 * Flawed Redirection"), Critical Delay ("Cannot be equipped simultaneously with Point Strike"),
 * Link Vitality / Link Redirection / Link Fiber (Enhanced Vitality / Calculated Redirection /
 * Metal Fiber).
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import {
  MOD_INCOMPATIBLE_PAIRS,
  areModsIncompatible,
  findBlockingModId,
  getBlockedModIds,
} from "@/data/mod-exclusions";
import { WIKI_INCOMPATIBLE_MOD_PAIRS } from "@/data/mod-incompatibilities";
import { dropIncompatibleMods, dropIncompatibleModsDeep } from "@/lib/mods/mod-incompatibility";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";

const ids = new Set(allMods.map((m) => m.id));

describe("mod incompatibility data", () => {
  it("every pair names two different catalog mods", () => {
    expect(WIKI_INCOMPATIBLE_MOD_PAIRS.length).toBeGreaterThan(250);
    for (const [a, b] of MOD_INCOMPATIBLE_PAIRS) {
      expect(ids.has(a), a).toBe(true);
      expect(ids.has(b), b).toBe(true);
      expect(a).not.toBe(b);
    }
  });

  it.each([
    ["redirection_r3", "primed_redirection"],
    ["vitality_r3", "umbra_vitality"],
    ["vitality_r3", "archon_vitality"],
    ["umbra_vitality", "archon_vitality"],
    ["steel_fiber_r3", "umbra_fiber"],
    ["intensify_r3", "umbra_intensify"],
    ["flow_r3", "primed_flow"],
    ["flow_r3", "archon_flow"],
    ["continuity_r3", "primed_continuity"],
    ["continuity_r3", "archon_continuity"],
    ["vigor_r5", "primed_vigor"],
    ["serration_r3", "amalgam_serration"],
    ["point_strike_r3", "critical_delay"],
    ["split_chamber_r3", "galvanized_chamber"],
    ["pressure_point_r3", "primed_pressure_point"],
    ["pressure_point_r3", "sacrificial_pressure"],
    ["amars_hatred", "boreals_hatred"],
    ["link_vitality", "enhanced_vitality"],
    ["link_redirection", "calculated_redirection"],
    ["link_fiber", "metal_fiber"],
  ])("%s can't be equipped with %s (both ways)", (a, b) => {
    expect(areModsIncompatible(a, b)).toBe(true);
    expect(areModsIncompatible(b, a)).toBe(true);
  });

  it("leaves compatible mods alone", () => {
    expect(areModsIncompatible("redirection_r3", "vitality_r3")).toBe(false);
    expect(areModsIncompatible("serration_r3", "split_chamber_r3")).toBe(false);
    expect(areModsIncompatible("primed_flow", "primed_continuity")).toBe(false);
    expect(areModsIncompatible("redirection_r3", "redirection_r3")).toBe(false);
  });

  it("picker blocking names the equipped mod", () => {
    expect(getBlockedModIds(["redirection_r3"]).has("primed_redirection")).toBe(true);
    expect(findBlockingModId("primed_redirection", ["vitality_r3", "redirection_r3"])).toBe("redirection_r3");
    expect(findBlockingModId("primed_flow", ["vitality_r3"])).toBeUndefined();
  });
});

describe("loading builds with incompatible mods", () => {
  it("keeps the first mod by slot and drops the later one", () => {
    const { mods, dropped } = dropIncompatibleMods([
      { modId: "primed_redirection", rank: 10, slotIndex: 4 },
      { modId: "vitality_r3", rank: 10, slotIndex: 1 },
      { modId: "redirection_r3", rank: 10, slotIndex: 2 },
    ]);
    expect(mods.map((m) => m.modId)).toEqual(["vitality_r3", "redirection_r3"]);
    expect(dropped).toEqual([{ modId: "primed_redirection", keptModId: "redirection_r3", slotIndex: 4 }]);
  });

  it("returns the same array when nothing conflicts", () => {
    const list = [
      { modId: "vitality_r3", rank: 10, slotIndex: 1 },
      { modId: "redirection_r3", rank: 10, slotIndex: 2 },
    ];
    const res = dropIncompatibleMods(list);
    expect(res.mods).toBe(list);
    expect(res.dropped).toEqual([]);
  });

  it("cleans every mod list in a saved build, each list on its own", () => {
    const data = {
      warframeId: "hildryn",
      mods: [
        { modId: "redirection_r3", rank: 10, slotIndex: 1 },
        { modId: "primed_redirection", rank: 10, slotIndex: 2 },
      ],
      exaltedMods: [
        { modId: "pressure_point_r3", rank: 5, slotIndex: 0 },
        { modId: "primed_pressure_point", rank: 10, slotIndex: 1 },
      ],
      arcaneIds: ["arcane_guardian", null],
    };
    const { data: clean, dropped } = dropIncompatibleModsDeep(data);
    expect(clean.mods.map((m) => m.modId)).toEqual(["redirection_r3"]);
    expect(clean.exaltedMods.map((m) => m.modId)).toEqual(["pressure_point_r3"]);
    expect(clean.arcaneIds).toEqual(["arcane_guardian", null]);
    expect(dropped.map((d) => d.modId)).toEqual(["primed_redirection", "primed_pressure_point"]);
    expect(data.mods).toHaveLength(2); // input untouched
  });

  it("cleans nested loadout slots and leaves a clean loadout as-is", () => {
    const loadout = {
      warframeBuild: { warframeId: "rhino", mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 1 }, { modId: "umbra_vitality", rank: 10, slotIndex: 3 }] },
      companionBuild: { companionId: "smeeta", mods: [{ modId: "link_vitality", rank: 10, slotIndex: 0 }, { modId: "enhanced_vitality", rank: 10, slotIndex: 1 }], weaponMods: [] },
      primaryBuild: { weaponId: "soma", mods: [{ modId: "serration_r3", rank: 10, slotIndex: 0 }] },
    };
    const { data, dropped } = dropIncompatibleModsDeep(loadout);
    expect(data.warframeBuild.mods.map((m) => m.modId)).toEqual(["vitality_r3"]);
    expect(data.companionBuild.mods.map((m) => m.modId)).toEqual(["link_vitality"]);
    expect(data.primaryBuild).toBe(loadout.primaryBuild);
    expect(dropped).toHaveLength(2);
    const clean = { primaryBuild: loadout.primaryBuild };
    expect(dropIncompatibleModsDeep(clean).data).toBe(clean);
  });

  it("Player Sync import skips the duplicate and warns", () => {
    const U = (uniqueName: string, rank: number) => ({ uniqueName, rank });
    const p = {
      accountInfo: { playerName: "Tester", masteryRank: 30, lastUpdated: 1_760_806_000, glyph: "", focus: "" },
      loadOuts: {
        NORMAL: {
          warframe: {
            uniqueName: "/Lotus/Powersuits/IronFrame/IronFrame",
            xp: 2_000_000,
            upgrades: [
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
              U("/Lotus/Upgrades/Mods/Warframe/AvatarShieldMaxMod", 10),
              U("/Lotus/Upgrades/Mods/Warframe/Expert/AvatarShieldMaxModExpert", 10),
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
              { uniqueName: "" },
            ],
          },
        },
      },
    };
    const out = mapArsenalToImportPayload(buildArsenalData(p as never), { loadOuts: p.loadOuts as never });
    const wfMods = out.loadout.warframeBuild?.mods.map((m) => m.modId) ?? [];
    expect(wfMods).toContain("redirection_r3");
    expect(wfMods).not.toContain("primed_redirection");
    expect(out.warnings.some((w) => w.label.includes("Primed Redirection") && w.label.includes("Redirection"))).toBe(true);
  });
});
