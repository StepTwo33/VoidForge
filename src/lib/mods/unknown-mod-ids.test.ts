import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allMods } from "@/data/mods";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { dropUnknownMods } from "@/lib/mods/known-mods";
import { calculateWarframeBuild } from "@/lib/calc/calculator";
import { computeWarframeCapacityUsed } from "@/lib/calc/compute-used-capacity";
import { summarizeBuildPreview } from "@/lib/builds/build-preview";
import { resolveModDisplay } from "@/lib/builds/compare-equipment";
import {
  mapPositionalWarframeMods,
  rawUpgradeSlots,
  type ArsenalImportWarning,
} from "@/lib/warframe-arsenal/map-import";

// augmented_sonar was a fake mod (not on either wiki or in WFCD) and was removed.
// Builds saved before the removal still carry its id.
const GONE = "augmented_sonar";

describe("unknown / removed mod ids", () => {
  const modsMap = getEffectiveModsMap();
  const banshee = allWarframes.find((w) => w.id === "banshee")!;
  const known = { modId: "vitality_r3", rank: 10, slotIndex: 1 };
  const stale = { modId: GONE, rank: 3, slotIndex: 2 };

  it("augmented_sonar is gone from the catalog", () => {
    expect(allMods.some((m) => m.id === GONE || m.name === "Augmented Sonar")).toBe(false);
    expect(modsMap.has(GONE)).toBe(false);
    expect(modsMap.has("vitality_r3")).toBe(true);
  });

  it("dropUnknownMods keeps known entries and drops unknown/empty ones", () => {
    expect(dropUnknownMods([known, stale, { modId: "", rank: 0, slotIndex: 3 }], modsMap)).toEqual([known]);
    expect(dropUnknownMods(undefined, modsMap)).toEqual([]);
  });

  it("calc and capacity ignore an unknown id instead of crashing", () => {
    const withStale = calculateWarframeBuild(banshee, [known, stale], modsMap);
    const clean = calculateWarframeBuild(banshee, [known], modsMap);
    expect(withStale).toEqual(clean);
    expect(computeWarframeCapacityUsed([known, stale], modsMap, {})).toBe(
      computeWarframeCapacityUsed([known], modsMap, {}),
    );
  });

  it("saved-build preview skips it; compare view shows the raw id", () => {
    const preview = summarizeBuildPreview("warframe", { warframeId: "banshee", mods: [known, stale] });
    expect(preview.modChips.map((c) => c.label)).toEqual(["Vitality"]);
    expect(resolveModDisplay(GONE, 3)).toEqual({ name: GONE, rankLabel: "R3" });
  });

  it("Player Sync: an unrecognised upgrade is skipped with a warning", () => {
    const warnings: ArsenalImportWarning[] = [];
    const slots = rawUpgradeSlots([
      { uniqueName: "/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod", rank: 10 },
      { uniqueName: "/Lotus/Upgrades/Mods/Warframe/NotARealSonarAugmentMod", rank: 3 },
    ])!;
    const { mods } = mapPositionalWarframeMods(slots, warnings, "banshee");
    expect(mods.every((m) => modsMap.has(m.modId))).toBe(true);
    expect(warnings.some((w) => w.kind === "mod")).toBe(true);
  });
});
