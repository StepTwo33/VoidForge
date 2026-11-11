/**
 * Pseudo-Exalted melee have no Exilus slot. wiki.warframe.com/w/Mod: "Pseudo-Exalted Melee weapons lack an
 * Exilus slot"; /w/Landslide_Fists, /w/Shattered_Lash, /w/Whipclaw, /w/Shadow_Clones: "...and does not have
 * an Exilus Slot". Update 38.5: "these new Exalted Weapons will not include an Exilus slot". Real exalted
 * melee (Exalted Blade, Diwata, ...) keep theirs. A saved build with a mod there loads, but the mod is ignored.
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import type { Loadout } from "@/lib/types";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { resolvePublicBuildWarframePreview } from "@/lib/builds/build-stats";
import { PSEUDO_EXALTED_MELEE_IDS, splitUnavailableSlotMods, weaponHasExilusSlot } from "@/lib/weapons/exalted-melee-slots";

const w = (id: string) => allWeapons.find((x) => x.id === id)!;

describe("pseudo-exalted Exilus slot", () => {
  it("Landslide Fists, Shattered Lash, Whipclaw and Shadow Clones (and Primes) have none", () => {
    for (const id of ["landslide_fists", "shattered_lash", "whipclaw", "shadow_clones"]) {
      expect(weaponHasExilusSlot(w(id)), id).toBe(false);
      expect(PSEUDO_EXALTED_MELEE_IDS.has(id)).toBe(true);
    }
    for (const id of PSEUDO_EXALTED_MELEE_IDS) expect(allWeapons.some((x) => x.id === id), id).toBe(true);
  });

  it("other exalted and normal weapons keep it", () => {
    for (const id of ["exalted_blade", "diwata", "talons", "garuda_talons", "regulators", "skana"]) {
      expect(weaponHasExilusSlot(w(id)), id).toBe(true);
    }
    expect(weaponHasExilusSlot(null)).toBe(true);
  });

  it("splits a saved Exilus mod off without touching the others", () => {
    const mods = [
      { modId: "primed_pressure_point", rank: 10, slotIndex: 0 },
      { modId: "primed_reach", rank: 10, slotIndex: 8 },
    ];
    expect(splitUnavailableSlotMods(w("whipclaw"), mods)).toEqual({ kept: [mods[0]], dropped: [mods[1]] });
    expect(splitUnavailableSlotMods(w("exalted_blade"), mods)).toEqual({ kept: mods, dropped: [] });
  });
});

describe("saved builds with a pseudo-exalted Exilus mod", () => {
  const base = { id: "t", name: "t", createdAt: 0, updatedAt: 0 } as const;
  const wf = (extra: { modId: string; rank: number; slotIndex: number }[]) => ({
    warframeId: "atlas",
    mods: [],
    shards: [null, null, null, null, null],
    hasOrokinReactor: true,
    exaltedMods: [{ modId: "primed_pressure_point", rank: 10, slotIndex: 0 }, ...extra],
  });
  const exilus = [{ modId: "true_steel_r3", rank: 5, slotIndex: 8 }];

  it("loadout stats ignore it instead of crashing", () => {
    const run = (extra: typeof exilus) =>
      calcLoadoutStats({ ...base, warframeBuild: wf(extra) } as unknown as Loadout).exalted!;
    const withExilus = run(exilus);
    expect(withExilus.name).toMatch(/Landslide/);
    expect(withExilus.stats).toEqual(run([]).stats);
    // Sanity: the same mod in a normal slot does change the stats.
    expect(run([{ ...exilus[0], slotIndex: 1 }]).stats).not.toEqual(run([]).stats);
  });

  it("public build previews ignore it too", () => {
    const a = resolvePublicBuildWarframePreview(wf(exilus))!;
    const b = resolvePublicBuildWarframePreview(wf([]))!;
    expect(a.exalted?.stats).toEqual(b.exalted?.stats);
  });
});
