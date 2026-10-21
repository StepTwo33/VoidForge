/**
 * Round 15b R15-5: Antitoxin / Shock Absorbers / Aerodynamic cards, Umbral Tau resistance,
 * Necramech Aviator and the Boreal set text. Values from wiki.warframe.com mod pages.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { warframesMap } from "@/data/warframes";
import { necramechs, NECRAMECH_RANK30_BONUS } from "@/data/archwing";
import { calculateWarframeBuild } from "@/lib/calc/calculator";
import { calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { AIRBORNE_DR_MODS, TYPED_RESIST_MODS } from "@/lib/calc/damage-reduction";
import { getModStatDisplayLines } from "@/lib/display/mod-display";

const mm = new Map(allMods.map((m) => [m.id, m]));
const excal = warframesMap.get("excalibur")!;
const slot = (modId: string, rank: number, slotIndex: number) => ({ modId, rank, slotIndex });
const card = (id: string) => {
  const m = mm.get(id)!;
  return getModStatDisplayLines(m, m.maxRank).map((l) => l.atRank);
};

describe("mod cards match wiki.warframe.com", () => {
  it("Antitoxin R5: +45% Toxin damage resistance", () => {
    expect(card("antitoxin")).toEqual(["+45% Toxin Damage Resistance"]);
  });
  it("Shock Absorbers R3: +20% Physical (Impact/Puncture/Slash) damage resistance", () => {
    expect(card("shock_absorbers")).toEqual(["+20% Physical Damage Resistance"]);
  });
  it("Aerodynamic R5: 24% airborne DR, +6s Aim Glide, +12s Wall Latch", () => {
    expect(card("aerodynamic")).toEqual([
      "+24% Airborne Damage Reduction",
      "+6s Aim Glide Time",
      "+12s Wall Latch Time",
    ]);
  });
  it("card per-rank values equal the calculator tables", () => {
    expect(mm.get("antitoxin")!.stats.toxinDamageResistance / 100).toBe(TYPED_RESIST_MODS.antitoxin.perRank);
    expect(mm.get("shock_absorbers")!.stats.physicalDamageResistance / 100).toBe(TYPED_RESIST_MODS.shock_absorbers.perRank);
    expect(mm.get("aerodynamic")!.stats.airborneDamageReduction / 100).toBe(AIRBORNE_DR_MODS.aerodynamic.perRank);
  });
});

describe("calc behaviour of the corrected mods", () => {
  const base = calculateWarframeBuild(excal, [], mm);
  it("no stray damage / duration / toxin bonuses", () => {
    const s = calculateWarframeBuild(
      excal,
      [slot("antitoxin", 5, 0), slot("shock_absorbers", 3, 1), slot("aerodynamic", 5, 2)],
      mm,
    );
    expect(s.abilityDuration).toBe(base.abilityDuration);
    expect(s.abilityStrength).toBe(base.abilityStrength);
    expect(s.totalHealth).toBe(base.totalHealth);
    expect(s.effectiveHealth).toBeCloseTo(base.effectiveHealth, 8);
    expect(Object.keys(s.modBonuses ?? {}).filter((k) => /damage|toxin|duration/i.test(k) && !/Resistance|Reduction/.test(k))).toEqual([]);
  });
  it("Antitoxin 45% in the Toxin row, Shock Absorbers 20% in Impact/Puncture/Slash, Aerodynamic 24% airborne", () => {
    const s = calculateWarframeBuild(
      excal,
      [slot("antitoxin", 5, 0), slot("shock_absorbers", 3, 1), slot("aerodynamic", 5, 2)],
      mm,
    );
    const row = (t: string) => s.typedResistances?.find((r) => r.type === t)?.percent;
    expect(row("toxin")).toBeCloseTo(45, 10);
    expect(row("impact")).toBeCloseTo(20, 10);
    expect(row("puncture")).toBeCloseTo(20, 10);
    expect(row("slash")).toBeCloseTo(20, 10);
    expect(s.airborneDamageReductionSources).toEqual([{ name: "Aerodynamic", value: 0.24 }]);
  });
});

describe("Umbral Tau resistance (wiki Umbral Set: set bonus scales every stat)", () => {
  const tau = (mods: ReturnType<typeof slot>[]) =>
    calculateWarframeBuild(excal, mods, mm).typedResistances?.find((r) => r.type === "tau");
  it("one Umbral mod R10: 11%", () => {
    expect(tau([slot("umbra_vitality", 10, 0)])!.percent).toBeCloseTo(11, 10);
  });
  it("two pieces: 11% × 1.3 = 14.3% each → 1 − 0.857² = 26.5551%", () => {
    expect(tau([slot("umbra_vitality", 10, 0), slot("umbra_fiber", 10, 1)])!.percent).toBeCloseTo(26.5551, 8);
  });
  it("full set: 19.8%, 19.8%, 19.25% (Intensify ×1.75) → 1 − 0.802² × 0.8075 = 48.0611%", () => {
    const t = tau([slot("umbra_vitality", 10, 0), slot("umbra_fiber", 10, 1), slot("umbra_intensify", 10, 2)])!;
    expect(t.sources.map((x) => Number((x.value * 100).toFixed(4)))).toEqual([19.8, 19.8, 19.25]);
    expect(t.percent).toBeCloseTo((1 - 0.802 * 0.802 * 0.8075) * 100, 8);
  });
});

describe("Necramech Aviator (wiki: 10/20/30/40% airborne DR, R0–R3)", () => {
  const voidrig = necramechs.find((n) => n.id === "voidrig")!;
  it("R3 = 40% airborne, separate from generic DR / EHP", () => {
    const base = calculateNecramechBuild(voidrig, [], mm);
    const s = calculateNecramechBuild(voidrig, [{ modId: "necramech_aviator", rank: 3 }], mm);
    expect(s.airborneDamageReduction).toBeCloseTo(40, 10);
    expect(s.damageReduction).toBeCloseTo(base.damageReduction, 10);
    expect(s.effectiveHealth).toBeCloseTo(base.effectiveHealth, 8);
    expect(s.modBonuses?.["necramech_aviator::damageReduction"]).toBeUndefined();
    // Hand-worked: health ÷ ((1 − armorDR) × 0.6) + shield ÷ (0.5 × 0.6)
    const h = voidrig.health + NECRAMECH_RANK30_BONUS.health;
    const sh = voidrig.shield + NECRAMECH_RANK30_BONUS.shield;
    const a = voidrig.armor / (voidrig.armor + 300);
    expect(s.airborneEffectiveHealth).toBeCloseTo(h / ((1 - a) * 0.6) + sh / 0.3, 6);
    expect(s.airborneTotalDamageReduction).toBeCloseTo((1 - (1 - a) * 0.6) * 100, 8);
  });
  it("R0 = 10%; no Aviator → no airborne fields", () => {
    expect(calculateNecramechBuild(voidrig, [{ modId: "necramech_aviator", rank: 0 }], mm).airborneDamageReduction).toBeCloseTo(10, 10);
    expect(calculateNecramechBuild(voidrig, [], mm).airborneDamageReduction).toBeUndefined();
  });
});

describe("Boreal set text (wiki: 1/2/3 pieces = 20/40/60% airborne DR)", () => {
  const desc = (n: number) =>
    calculateWarframeBuild(
      excal,
      [slot("boreals_hatred", 10, 0), slot("boreals_anguish", 10, 1)].slice(0, n),
      mm,
    ).setBonusSummary?.find((r) => r.setId === "boreal")?.description;
  it("1 piece 20%, 2 pieces 40%", () => {
    expect(desc(1)).toContain("20% less damage taken while airborne");
    expect(desc(2)).toContain("40% less damage taken while airborne");
  });
  it("2 pieces → 40% in the airborne DR rows", () => {
    const s = calculateWarframeBuild(excal, [slot("boreals_hatred", 10, 0), slot("boreals_anguish", 10, 1)], mm);
    expect(s.airborneDamageReductionSources?.find((x) => x.name.startsWith("Boreal"))?.value).toBeCloseTo(0.4, 10);
  });
});
