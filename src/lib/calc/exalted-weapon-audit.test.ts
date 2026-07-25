/**
 * Exalted weapons accuracy — inventory, wiki bare goldens, Ability Strength wiring.
 * Catalog rows are per-id wiki-locked (no blanket transforms).
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { WEAPON_FIRE_TIMING } from "@/data/weapon-innate-elements";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import type { Mod, ModSlot, Weapon } from "@/lib/types";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import {
  getExaltedWeaponsForWarframe,
  getMeleeExaltedWeapon,
  getPrimaryExaltedWeapon,
} from "@/lib/weapons/exalted-weapons";

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function weapon(id: string): Weapon {
  const w = allWeapons.find((x) => x.id === id);
  expect(w, id).toBeDefined();
  return w!;
}

function bare(id: string, abilityStrength?: number) {
  return calculateWeaponBuild(weapon(id), [], modsMap(), undefined, undefined, {
    abilityStrength,
  });
}

function withMods(id: string, modIds: string[], abilityStrength?: number) {
  const slots: ModSlot[] = modIds.map((modId, i) => ({
    slotIndex: i,
    modId,
    rank: allMods.find((m) => m.id === modId)?.maxRank ?? 0,
  }));
  return calculateWeaponBuild(weapon(id), slots, modsMap(), undefined, undefined, {
    abilityStrength,
  });
}

/** Wiki Module:Weapons/data locked bare paper (catalog + calc). */
const BARE_GOLDENS: Array<{
  id: string;
  damage: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  heat?: number;
  electricity?: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  fireRate: number;
  multishot?: number;
  residual?: boolean;
}> = [
  {
    id: "exalted_blade",
    damage: 250,
    impact: 37.5,
    puncture: 37.5,
    slash: 175,
    criticalChance: 0.15,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 0.833,
  },
  {
    id: "exalted_blade_prime",
    damage: 250,
    impact: 37.5,
    puncture: 37.5,
    slash: 175,
    criticalChance: 0.15,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 0.833,
  },
  {
    id: "exalted_blade_umbra",
    damage: 250,
    impact: 37.5,
    puncture: 37.5,
    slash: 175,
    criticalChance: 0.15,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 0.833,
  },
  {
    id: "regulators",
    damage: 50,
    impact: 25,
    puncture: 12.5,
    slash: 12.5,
    criticalChance: 0.25,
    criticalMultiplier: 3,
    statusChance: 0.1,
    fireRate: 14.8,
  },
  {
    id: "regulators_prime",
    damage: 50,
    impact: 25,
    puncture: 12.5,
    slash: 12.5,
    criticalChance: 0.25,
    criticalMultiplier: 3,
    statusChance: 0.1,
    fireRate: 14.8,
  },
  {
    id: "artemis_bow",
    damage: 240,
    impact: 33.6,
    puncture: 192,
    slash: 14.4,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.2,
    fireRate: 1,
    multishot: 7,
  },
  {
    id: "artemis_bow_prime",
    damage: 240,
    impact: 33.6,
    puncture: 192,
    slash: 14.4,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.2,
    fireRate: 1,
    multishot: 7,
  },
  {
    id: "talons",
    damage: 250,
    impact: 0,
    puncture: 62.5,
    slash: 187.5,
    criticalChance: 0.5,
    criticalMultiplier: 2,
    statusChance: 0.1,
    fireRate: 1.5,
  },
  {
    id: "talons_prime",
    damage: 250,
    impact: 0,
    puncture: 62.5,
    slash: 187.5,
    criticalChance: 0.5,
    criticalMultiplier: 2,
    statusChance: 0.1,
    fireRate: 1.5,
  },
  {
    id: "iron_staff",
    damage: 300,
    impact: 204,
    puncture: 0,
    slash: 96,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.3,
    fireRate: 1,
  },
  {
    id: "iron_staff_prime",
    damage: 300,
    impact: 204,
    puncture: 0,
    slash: 96,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.3,
    fireRate: 1,
  },
  {
    id: "diwata",
    damage: 200,
    impact: 30,
    puncture: 150,
    slash: 20,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.1,
    fireRate: 1.08,
  },
  {
    id: "diwata_prime",
    damage: 200,
    impact: 30,
    puncture: 150,
    slash: 20,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.1,
    fireRate: 1.08,
  },
  {
    id: "balefire",
    damage: 1500,
    electricity: 1500,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    statusChance: 0.1,
    fireRate: 0.833,
  },
  {
    id: "balefire_prime",
    damage: 1500,
    electricity: 1500,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    statusChance: 0.1,
    fireRate: 0.833,
  },
  {
    id: "desert_wind",
    damage: 250,
    impact: 250,
    puncture: 0,
    slash: 0,
    criticalChance: 0.35,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 1,
  },
  {
    id: "desert_wind_prime",
    damage: 250,
    impact: 250,
    puncture: 0,
    slash: 0,
    criticalChance: 0.35,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 1,
  },
  {
    id: "shadow_claws",
    damage: 250,
    impact: 75,
    puncture: 50,
    slash: 125,
    criticalChance: 0.38,
    criticalMultiplier: 2.6,
    statusChance: 0.24,
    fireRate: 1,
  },
  {
    id: "shadow_claws_prime",
    damage: 250,
    impact: 75,
    puncture: 50,
    slash: 125,
    criticalChance: 0.38,
    criticalMultiplier: 2.6,
    statusChance: 0.24,
    fireRate: 1,
  },
  {
    id: "dex_pixia",
    damage: 160,
    impact: 16,
    puncture: 16,
    slash: 128,
    criticalChance: 0.1,
    criticalMultiplier: 2,
    statusChance: 0.25,
    fireRate: 5.83,
  },
  {
    id: "dex_pixia_prime",
    damage: 160,
    impact: 16,
    puncture: 16,
    slash: 128,
    criticalChance: 0.1,
    criticalMultiplier: 2,
    statusChance: 0.25,
    fireRate: 5.83,
  },
  {
    id: "garuda_talons",
    damage: 248,
    impact: 19.84,
    puncture: 54.56,
    slash: 173.6,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.36,
    fireRate: 1,
  },
  {
    id: "garuda_prime_talons",
    damage: 280,
    impact: 14,
    puncture: 28,
    slash: 238,
    criticalChance: 0.35,
    criticalMultiplier: 2,
    statusChance: 0.36,
    fireRate: 1,
  },
  {
    id: "neutralizer",
    damage: 255,
    impact: 12.75,
    puncture: 216.75,
    slash: 25.5,
    criticalChance: 0.45,
    criticalMultiplier: 3,
    statusChance: 0.1,
    fireRate: 1,
  },
  {
    id: "noctua",
    damage: 250,
    impact: 0,
    puncture: 0,
    slash: 250,
    criticalChance: 0.3,
    criticalMultiplier: 2,
    statusChance: 0.25,
    fireRate: 1.5,
  },
  {
    id: "glory",
    damage: 150,
    heat: 150,
    criticalChance: 0.15,
    criticalMultiplier: 2,
    statusChance: 0.2,
    fireRate: 1.67,
  },
  {
    id: "lizzie",
    damage: 85,
    heat: 85,
    criticalChance: 0.35,
    criticalMultiplier: 2.3,
    statusChance: 0.35,
    fireRate: 8,
  },
  {
    id: "landslide_fists",
    damage: 350,
    impact: 350,
    puncture: 0,
    slash: 0,
    criticalChance: 0.35,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 1,
  },
  {
    id: "landslide_fists_prime",
    damage: 350,
    impact: 350,
    puncture: 0,
    slash: 0,
    criticalChance: 0.35,
    criticalMultiplier: 2,
    statusChance: 0.15,
    fireRate: 1,
  },
  {
    id: "shattered_lash",
    damage: 400,
    impact: 0,
    puncture: 400,
    slash: 0,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.3,
    fireRate: 1,
  },
  {
    id: "shattered_lash_prime",
    damage: 400,
    impact: 0,
    puncture: 400,
    slash: 0,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.3,
    fireRate: 1,
  },
  {
    id: "whipclaw",
    damage: 150,
    impact: 50,
    puncture: 50,
    slash: 50,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.25,
    fireRate: 1,
  },
  {
    id: "whipclaw_prime",
    damage: 150,
    impact: 50,
    puncture: 50,
    slash: 50,
    criticalChance: 0.25,
    criticalMultiplier: 2,
    statusChance: 0.25,
    fireRate: 1,
  },
  {
    id: "shadow_clones",
    damage: 1500,
    residual: true,
    criticalChance: 0.05,
    criticalMultiplier: 1.2,
    statusChance: 0.05,
    fireRate: 1,
  },
  {
    id: "shadow_clones_prime",
    damage: 1500,
    residual: true,
    criticalChance: 0.05,
    criticalMultiplier: 1.2,
    statusChance: 0.05,
    fireRate: 1,
  },
  {
    id: "arquebex",
    damage: 10,
    impact: 10,
    puncture: 0,
    slash: 0,
    criticalChance: 0.5,
    criticalMultiplier: 3,
    statusChance: 0.5,
    fireRate: 3.33,
  },
  {
    id: "ironbride",
    damage: 1500,
    impact: 225,
    puncture: 225,
    slash: 1050,
    criticalChance: 0.45,
    criticalMultiplier: 3,
    statusChance: 0.15,
    fireRate: 0.833,
  },
];

describe("exalted weapon inventory", () => {
  const exalted = allWeapons.filter((w) => w.isExalted);

  it("has exactly 37 isExalted catalog rows", () => {
    expect(exalted).toHaveLength(37);
  });

  it("every exalted row has warframeId, abilityName, damage > 0, and warframe resolver", () => {
    for (const w of exalted) {
      expect(w.warframeId, w.id).toBeTruthy();
      expect(w.abilityName, w.id).toBeTruthy();
      expect(w.damage, w.id).toBeGreaterThan(0);
      const owned = getExaltedWeaponsForWarframe(w.warframeId!, allWeapons);
      expect(
        owned.some((x) => x.id === w.id),
        `${w.id} missing from getExaltedWeaponsForWarframe(${w.warframeId})`,
      ).toBe(true);
    }
  });

  it("Titania primary exalted prefers Dex Pixia; melee exalted is Diwata", () => {
    expect(getPrimaryExaltedWeapon("titania", allWeapons)?.id).toBe("dex_pixia");
    expect(getPrimaryExaltedWeapon("titania_prime", allWeapons)?.id).toBe("dex_pixia_prime");
    expect(getMeleeExaltedWeapon("titania", allWeapons)?.id).toBe("diwata");
    expect(getMeleeExaltedWeapon("titania_prime", allWeapons)?.id).toBe("diwata_prime");
    expect(getMeleeExaltedWeapon("excalibur", allWeapons)).toBeNull();
  });
});

describe("exalted bare wiki goldens", () => {
  it.each(BARE_GOLDENS)(
    "$id catalog + bare calc",
    (g) => {
      const w = weapon(g.id);
      expect(w.damage).toBeCloseTo(g.damage, 5);
      expect(w.criticalChance).toBeCloseTo(g.criticalChance, 5);
      expect(w.criticalMultiplier).toBeCloseTo(g.criticalMultiplier, 5);
      expect(w.statusChance).toBeCloseTo(g.statusChance, 5);
      expect(w.fireRate).toBeCloseTo(g.fireRate, 5);
      if (g.multishot != null) expect(w.multishot).toBeCloseTo(g.multishot, 5);
      if (g.residual) {
        expect(w.impact ?? 0).toBe(0);
        expect(w.puncture ?? 0).toBe(0);
        expect(w.slash ?? 0).toBe(0);
      } else {
        if (g.impact != null) expect(w.impact ?? 0).toBeCloseTo(g.impact, 5);
        if (g.puncture != null) expect(w.puncture ?? 0).toBeCloseTo(g.puncture, 5);
        if (g.slash != null) expect(w.slash ?? 0).toBeCloseTo(g.slash, 5);
        if (g.heat != null) expect(w.heat ?? 0).toBeCloseTo(g.heat, 5);
        if (g.electricity != null) expect(w.electricity ?? 0).toBeCloseTo(g.electricity, 5);
      }

      const stats = bare(g.id);
      expect(stats.criticalChance).toBeCloseTo(g.criticalChance, 5);
      expect(stats.statusChance).toBeCloseTo(g.statusChance, 5);
      if (g.residual) {
        expect(stats.impact + stats.puncture + stats.slash).toBe(0);
        expect(stats.totalDamage).toBeCloseTo(1500, 4);
      } else if (g.electricity != null) {
        expect(stats.elements.some((e) => e.type === "electricity")).toBe(true);
        expect(stats.totalDamage).toBeCloseTo(g.damage, 3);
      } else if (g.id === "lizzie") {
        // Exalted Solo: +25% Serration-additive at 100% STR on bare paper
        expect(stats.elements.some((e) => e.type === "heat")).toBe(true);
        expect(stats.moddedBaseDamage).toBeCloseTo(g.damage * 1.25, 3);
      } else if (g.heat != null) {
        expect(stats.elements.some((e) => e.type === "heat")).toBe(true);
        expect(stats.totalDamage).toBeCloseTo(g.damage, 3);
      } else {
        expect(stats.totalDamage).toBeGreaterThan(0);
        expect(stats.moddedBaseDamage).toBeCloseTo(g.damage, 3);
      }
    },
  );

  it("Artemis Bow chargeMode is bow with 1s charge", () => {
    expect(WEAPON_FIRE_TIMING.artemis_bow).toMatchObject({
      chargeTime: 1.0,
      chargeMode: "bow",
    });
    expect(WEAPON_FIRE_TIMING.artemis_bow_prime).toMatchObject({
      chargeTime: 1.0,
      chargeMode: "bow",
    });
  });

  it("Balefire charged electricity + 2s charge timing", () => {
    const w = weapon("balefire");
    expect(w.electricity).toBe(1500);
    expect(WEAPON_FIRE_TIMING.balefire).toMatchObject({
      chargeTime: 2.0,
      chargeMode: "standard",
    });
    const stats = bare("balefire");
    const elec = stats.elements.find((e) => e.type === "electricity");
    expect(elec?.value).toBeCloseTo(1500, 4);
  });

  it("Arquebex keeps direct Impact 10 and wiki radial Blast/Heat", () => {
    const w = enrichWeapon(weapon("arquebex"));
    expect(w.damage).toBe(10);
    expect(w.impact).toBe(10);
    expect(w.radialAttacks?.length ?? 0).toBeGreaterThan(0);
    const radial = w.radialAttacks![0]!;
    expect(radial.blast).toBeCloseTo(9000, 5);
    expect(radial.heat).toBeCloseTo(3000, 5);
    const stats = bare("arquebex");
    expect(stats.radialBurstDps ?? 0).toBeGreaterThan(0);
  });
});

describe("exalted Ability Strength wiring", () => {
  it("Exalted Blade: STR 1 = catalog; STR 2 doubles base before mods", () => {
    const at1 = bare("exalted_blade", 1);
    const at2 = bare("exalted_blade", 2);
    expect(at1.moddedBaseDamage).toBeCloseTo(250, 4);
    expect(at2.moddedBaseDamage).toBeCloseTo(500, 4);
    expect(at2.totalDamage / at1.totalDamage).toBeCloseTo(2, 4);
  });

  it("Regulators: STR 2 doubles IPS base", () => {
    const at1 = bare("regulators", 1);
    const at2 = bare("regulators", 2);
    expect(at1.moddedBaseDamage).toBeCloseTo(50, 4);
    expect(at2.moddedBaseDamage).toBeCloseTo(100, 4);
  });

  it("Exalted Blade + Pressure Point: PP additive on STR-scaled base", () => {
    const pp1 = withMods("exalted_blade", ["pressure_point_r3"], 1);
    const pp2 = withMods("exalted_blade", ["pressure_point_r3"], 2);
    // R5 PP = +120% → ×2.2 on base
    expect(pp1.moddedBaseDamage).toBeCloseTo(250 * 2.2, 3);
    expect(pp2.moddedBaseDamage).toBeCloseTo(500 * 2.2, 3);
  });

  it("Lizzie / Exalted Solo: additive 1.25×STR − 1 (not flat base×STR)", () => {
    const at1 = bare("lizzie", 1);
    const at2 = bare("lizzie", 2);
    // +25% vs +150% Serration-additive
    expect(at1.moddedBaseDamage).toBeCloseTo(85 * 1.25, 3);
    expect(at2.moddedBaseDamage).toBeCloseTo(85 * 2.5, 3);
  });

  it("Garuda Talons (Passive) ignore Ability Strength", () => {
    const at1 = bare("garuda_talons", 1);
    const at2 = bare("garuda_talons", 2);
    expect(at2.totalDamage).toBeCloseTo(at1.totalDamage, 5);
    expect(at2.moddedBaseDamage).toBeCloseTo(at1.moddedBaseDamage, 5);
  });
});
