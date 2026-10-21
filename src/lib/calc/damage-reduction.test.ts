import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { warframesMap } from "@/data/warframes";
import { allArcanes } from "@/data/arcanes";
import { allCompanions } from "@/data/companions";
import type { Mod } from "@/lib/types";
import { applyWarframeShardsAndArcanes, calculateWarframeBuild } from "@/lib/calc/calculator";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { combineDamageReduction, warframeEffectiveHealth } from "@/lib/calc/damage-reduction";

const mm = new Map(allMods.map((m) => [m.id, m]));
const excal = warframesMap.get("excalibur")!;
// Excalibur R30: 370 health, 370 shields, 240 armor → armor DR 240 / 540 = 4/9.
const ARMOR_DR = 240 / 540;
const slot = (modId: string, rank: number, slotIndex: number) => ({ modId, rank, slotIndex });

describe("combineDamageReduction (wiki.warframe.com Damage Reduction, Update 30.5)", () => {
  it("Aviator 40% + Agility Drift 12% = 47.2% (wiki Aviator / Agility Drift notes)", () => {
    expect(combineDamageReduction([0.4, 0.12])).toBeCloseTo(0.472, 10);
  });
  it("+ Aerodynamic 24% = 59.872%, + full Boreal set 60% = 83.9488% (wiki Aviator note)", () => {
    expect(combineDamageReduction([0.4, 0.12, 0.24])).toBeCloseTo(0.59872, 10);
    expect(combineDamageReduction([0.4, 0.12, 0.24, 0.6])).toBeCloseTo(0.839488, 10);
  });
  it("4 × 25% = 68.36% damage reduction, not 100% (U30.5 patch note example)", () => {
    expect(combineDamageReduction([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(1 - 0.75 ** 4, 10);
  });
  it("no 90% cap: 3 × 70% = 97.3%", () => {
    expect(combineDamageReduction([0.7, 0.7, 0.7])).toBeCloseTo(0.973, 10);
  });
  it("EHP: armor on health only, pure DR on health and shields (shields take 50%)", () => {
    // 370 / (5/9 × 0.5) + 370 / (0.5 × 0.5) = 1332 + 1480
    expect(warframeEffectiveHealth(370, 370, ARMOR_DR, 0.5)).toBeCloseTo(2812, 6);
  });
});

describe("Warframe airborne DR and typed resistances", () => {
  const bare = calculateWarframeBuild(excal, [], mm);
  const built = calculateWarframeBuild(
    excal,
    [slot("aviator", 3, 8), slot("agility_drift", 5, 0), slot("antitoxin", 5, 1), slot("shock_absorbers", 3, 2)],
    mm,
  );

  it("generic EHP / DR stay armor-only: 370 / (5/9) + 370 / 0.5 = 1406", () => {
    expect(bare.effectiveHealth).toBeCloseTo(1406, 6);
    expect(built.effectiveHealth).toBeCloseTo(bare.effectiveHealth, 9);
    expect(built.damageReduction).toBeCloseTo(ARMOR_DR * 100, 9);
  });

  it("airborne: mods 47.2%, total vs health 1 − (5/9)(0.528) = 70.67%", () => {
    expect(built.airborneDamageReduction).toBeCloseTo(47.2, 9);
    expect(built.airborneTotalDamageReduction).toBeCloseTo((1 - (5 / 9) * 0.528) * 100, 9);
  });

  it("airborne EHP: 370 / (5/9 × 0.528) + 370 / (0.5 × 0.528) = 2662.88", () => {
    expect(built.airborneEffectiveHealth).toBeCloseTo(370 / ((5 / 9) * 0.528) + 370 / (0.5 * 0.528), 6);
    expect(built.airborneEffectiveHealth).toBeCloseTo(2662.8788, 3);
  });

  it("Antitoxin R5: 45% Toxin, EHP vs Toxin is health only (Toxin bypasses shields)", () => {
    const tox = built.typedResistances!.find((t) => t.type === "toxin")!;
    expect(tox.percent).toBeCloseTo(45, 9);
    expect(tox.effectiveHealth).toBeCloseTo(370 / ((5 / 9) * 0.55), 6); // 1210.9
  });

  it("Shock Absorbers R3: 20% Impact/Puncture/Slash, EHP 370/(5/9·0.8) + 370/(0.5·0.8) = 1757.5", () => {
    for (const type of ["impact", "puncture", "slash"]) {
      const t = built.typedResistances!.find((x) => x.type === type)!;
      expect(t.percent).toBeCloseTo(20, 9);
      expect(t.effectiveHealth).toBeCloseTo(1757.5, 6);
    }
  });

  it("Toxin Resistance aura R5 (15%) and Antitoxin R5 (45%) multiply: 53.25%", () => {
    const s = calculateWarframeBuild(excal, [slot("aura_toxin_resistance", 5, 9), slot("antitoxin", 5, 1)], mm);
    expect(s.typedResistances!.find((t) => t.type === "toxin")!.percent).toBeCloseTo(53.25, 9);
  });

  it("Boreal set pieces add 20% airborne DR each (wiki: 20/40/60%)", () => {
    const s = calculateWarframeBuild(excal, [slot("aviator", 3, 8), slot("boreals_hatred", 10, 0)], mm);
    expect(s.airborneDamageReduction).toBeCloseTo(52, 9); // 1 − 0.6 × 0.8
  });

  it("no airborne or typed fields without those mods", () => {
    expect(bare.airborneEffectiveHealth).toBeUndefined();
    expect(bare.typedResistances).toBeUndefined();
  });
});

describe("Arcane DR multiplies with armor and protects shields", () => {
  const db = allArcanes.find((a) => a.id === "arcane_double_back")!;
  const s = applyWarframeShardsAndArcanes(calculateWarframeBuild(excal, [], mm), undefined, [db]);

  it("Arcane Double Back R5 (3 stacks additive = 75%) is one source: DR = 1 − (5/9)(0.25) = 86.11%", () => {
    expect(s.pureDamageReductionSources).toEqual([{ name: db.name, value: 0.75 }]);
    expect(s.damageReduction).toBeCloseTo((1 - (5 / 9) * 0.25) * 100, 9);
  });

  it("EHP = 370 / (5/9 × 0.25) + 370 / (0.5 × 0.25) = 2664 + 2960 = 5624", () => {
    expect(s.effectiveHealth).toBeCloseTo(5624, 6);
  });
});

describe("Companion armor and mod DR multiply", () => {
  const carrier = allCompanions.find((c) => c.id === "carrier")!;
  const fake = new Map<string, Mod>(mm);
  fake.set("test_dr", { ...(mm.get("aviator") as Mod), id: "test_dr", name: "Test DR", category: "companion", maxRank: 3, stats: { damageReduction: 10 } });
  // Carrier: 560 health, 250 shields, 80 armor → armor DR 80 / 380.
  const c0 = calculateCompanionBuild(carrier, [], fake);
  const c1 = calculateCompanionBuild(carrier, [{ modId: "test_dr", rank: 3 }], fake);

  it("armor only: DR 21.05%, EHP 560 × (1 + 80/300) + 250 = 959.33", () => {
    expect(c0.damageReduction).toBeCloseTo((80 / 380) * 100, 9);
    expect(c0.effectiveHealth).toBeCloseTo(959.3333, 3);
  });

  it("+40% DR: 1 − (300/380)(0.6) = 52.63% (was 61.05% additive); EHP 959.33 / 0.6", () => {
    expect(c1.damageReduction).toBeCloseTo((1 - (300 / 380) * 0.6) * 100, 9);
    expect(c1.effectiveHealth).toBeCloseTo(959.3333 / 0.6, 2);
  });
});
