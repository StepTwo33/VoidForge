import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { DEFAULT_SIM_PARAMS, type Loadout, type ModSlot } from "@/lib/types";

/**
 * wiki.warframe.com/w/Amalgam_Furax_Body_Count Notes (page body wins over the infobox):
 * unique effect at rank 5 is +45% Fire Rate for Secondary Weapons (not a crit-chance buff).
 * "This bonus applies to Mesa's Regulators, Hildryn's Balefire Charger, Dante's Noctua
 * and Jade's Glory. It does not apply to Titania's Dex Pixia."
 * Desert Wind is Baruuk's exalted melee, so it is already outside the secondary FR path.
 */

const FURAX_R5: ModSlot = { modId: "amalgam_furax_body_count", rank: 5, slotIndex: 0 };
// Any equipped exalted mod so this test does not depend on unmodded exalted slots being listed.
const HORNET: ModSlot = { modId: "hornet_strike", rank: 0, slotIndex: 0 };

function loadout(warframeId: string, meleeHasFurax: boolean): Loadout {
  return {
    id: "furax-exalted",
    name: "Furax exalted FR",
    createdAt: 0,
    updatedAt: 0,
    warframeBuild: {
      warframeId,
      mods: [],
      hasOrokinReactor: true,
      exaltedMods: [HORNET],
    },
    meleeBuild: {
      weaponId: "furax",
      mods: meleeHasFurax ? [FURAX_R5] : [],
      hasOrokinCatalyst: true,
    },
  };
}

function exaltedFireRate(warframeId: string, meleeHasFurax: boolean): number {
  const stats = calcLoadoutStats(loadout(warframeId, meleeHasFurax), { simParams: DEFAULT_SIM_PARAMS });
  const slot = stats.exalted ?? stats.exaltedMelee;
  if (!slot) {
    throw new Error(`No exalted slot for ${warframeId}`);
  }
  return slot.stats.fireRate;
}

describe("Amalgam Furax Body Count +45% FR on exalted secondaries", () => {
  it("buffs Mesa's Regulators (and Prime) by +45% fire rate at rank 5", () => {
    for (const [frame, weaponId] of [
      ["mesa", "regulators"],
      ["mesa_prime", "regulators_prime"],
    ] as const) {
      const base = allWeapons.find((w) => w.id === weaponId)!;
      const withFurax = exaltedFireRate(frame, true);
      const without = exaltedFireRate(frame, false);
      expect(without).toBeCloseTo(base.fireRate, 3);
      expect(withFurax).toBeCloseTo(base.fireRate * 1.45, 3);
    }
  });

  it("buffs Hildryn's Balefire, Dante's Noctua, and Jade's Glory", () => {
    for (const [frame, weaponId] of [
      ["hildryn", "balefire"],
      ["hildryn_prime", "balefire_prime"],
      ["dante", "noctua"],
      ["jade", "glory"],
    ] as const) {
      const base = allWeapons.find((w) => w.id === weaponId)!;
      expect(exaltedFireRate(frame, true)).toBeCloseTo(base.fireRate * 1.45, 3);
      expect(exaltedFireRate(frame, false)).toBeCloseTo(base.fireRate, 3);
    }
  });

  it("does not buff Titania's Dex Pixia or Dex Pixia Prime", () => {
    for (const [frame, weaponId] of [
      ["titania", "dex_pixia"],
      ["titania_prime", "dex_pixia_prime"],
    ] as const) {
      const base = allWeapons.find((w) => w.id === weaponId)!;
      // Dex Pixia is the primary exalted; Diwata is the melee sibling.
      const stats = calcLoadoutStats(loadout(frame, true), { simParams: DEFAULT_SIM_PARAMS });
      expect(stats.exalted?.name).toMatch(/Dex Pixia/i);
      expect(stats.exalted!.stats.fireRate).toBeCloseTo(base.fireRate, 3);
    }
  });

  it("does not apply the secondary FR bonus to Baruuk's Desert Wind (exalted melee)", () => {
    const base = allWeapons.find((w) => w.id === "desert_wind")!;
    const withFurax = exaltedFireRate("baruuk", true);
    // Melee still gets the mod's own combo-duration when it is the host melee, but
    // Desert Wind is the exalted slot, not the Furax host. Attack speed stays base.
    expect(withFurax).toBeCloseTo(base.fireRate, 3);
  });

  it("still buffs a regular secondary (Lex) by +45% fire rate", () => {
    const lex = allWeapons.find((w) => w.id === "lex")!;
    const stats = calcLoadoutStats(
      {
        id: "lex-furax",
        name: "lex-furax",
        createdAt: 0,
        updatedAt: 0,
        secondaryBuild: { weaponId: "lex", mods: [], hasOrokinCatalyst: true },
        meleeBuild: { weaponId: "furax", mods: [FURAX_R5], hasOrokinCatalyst: true },
      },
      { simParams: DEFAULT_SIM_PARAMS },
    );
    expect(stats.secondary!.stats.fireRate).toBeCloseTo(lex.fireRate * 1.45, 3);
  });
});
