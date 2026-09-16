/**
 * Time Tempests / Nightwave weapon augment calc goldens.
 * Sentient Incision — parallel weakness elemental (Venato).
 * Velox Conclusion — next-cast Ability Strength (Velox).
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild, quantizeDamageValue } from "@/lib/calc/calculator";
import { sentientIncisionElementForFaction } from "@/lib/calc/sentient-incision";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireWeapon(id: string) {
  const weapon = allWeapons.find((w) => w.id === id);
  expect(weapon, `missing weapon ${id}`).toBeDefined();
  return weapon!;
}

function expectQuantizedElement(
  stats: ReturnType<typeof calculateWeaponBuild>,
  type: string,
  raw: number,
) {
  const scale = (stats.moddedBaseDamage ?? 0) / 32;
  const expected = quantizeDamageValue(raw, scale);
  expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(expected, 8);
}

describe("sentientIncisionElementForFaction", () => {
  it("maps wiki faction weaknesses", () => {
    expect(sentientIncisionElementForFaction(undefined)).toBeNull();
    expect(sentientIncisionElementForFaction("")).toBeNull();
    expect(sentientIncisionElementForFaction("Infested")).toBe("heat");
    expect(sentientIncisionElementForFaction("Infested Deimos")).toBe("gas");
    expect(sentientIncisionElementForFaction("Anarchs")).toBe("electricity");
    expect(sentientIncisionElementForFaction("Narmer")).toBe("toxin");
    expect(sentientIncisionElementForFaction("Grineer")).toBe("corrosive");
    expect(sentientIncisionElementForFaction("Scaldra")).toBe("corrosive");
    expect(sentientIncisionElementForFaction("Corpus")).toBe("magnetic");
    expect(sentientIncisionElementForFaction("Techrot")).toBe("magnetic");
    expect(sentientIncisionElementForFaction("Corrupted")).toBe("viral");
    expect(sentientIncisionElementForFaction("Orokin")).toBe("viral");
    expect(sentientIncisionElementForFaction("Sentient")).toBe("radiation");
    expect(sentientIncisionElementForFaction("Murmur")).toBe("radiation");
  });
});

describe("Sentient Incision (Venato)", () => {
  it("paper (no faction): no parallel elemental and no Serration-style damage", () => {
    const weapon = requireWeapon("venato");
    const mod = requireMod("sentient_incision");
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: mod.id, rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.moddedBaseDamage).toBeCloseTo(bare.moddedBaseDamage ?? weapon.damage, 5);
    expect(stats.elements.map((e) => e.type).sort()).toEqual(
      bare.elements.map((e) => e.type).sort(),
    );
    expect(stats.totalDamage).toBeCloseTo(bare.totalDamage, 4);
  });

  it("vs Grineer: +120% parallel Corrosive from base (scales with Serration)", () => {
    const weapon = requireWeapon("venato");
    const incision = requireMod("sentient_incision");
    const serration = allMods.find((m) => m.id === "pressure_point_r3" || m.id === "pressure_point");
    expect(serration).toBeDefined();

    const stats = calculateWeaponBuild(
      weapon,
      [
        { modId: incision.id, rank: incision.maxRank, slotIndex: 0 },
        { modId: serration!.id, rank: serration!.maxRank, slotIndex: 1 },
      ],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, targetFaction: "Grineer" },
    );

    const corrosive = stats.elements.find((e) => e.type === "corrosive");
    expect(corrosive).toBeDefined();
    // Parallel: base × 1.2 × damageMult (Pressure Point R5 = +120% → ×2.2), then damage quantize
    const dmgMult = 1 + (serration!.stats.damage! * (serration!.maxRank + 1)) / 100;
    expectQuantizedElement(stats, "corrosive", weapon.damage * 1.2 * dmgMult);
    // Must not combine innate IPS into radiation/etc.
    expect(stats.elements.find((e) => e.type === "radiation")).toBeUndefined();
  });

  it("vs Infested: parallel Heat; vs Infested Deimos: parallel Gas", () => {
    const weapon = requireWeapon("venato");
    const mod = requireMod("sentient_incision");
    const heat = calculateWeaponBuild(
      weapon,
      [{ modId: mod.id, rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, targetFaction: "Infested" },
    );
    expectQuantizedElement(heat, "heat", weapon.damage * 1.2);

    const gas = calculateWeaponBuild(
      weapon,
      [{ modId: mod.id, rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, targetFaction: "Infested Deimos" },
    );
    expectQuantizedElement(gas, "gas", weapon.damage * 1.2);
  });
});

describe("Velox Conclusion", () => {
  it("paper: no next-cast Ability Strength", () => {
    const weapon = requireWeapon("velox");
    const mod = requireMod("velox_conclusion");
    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: mod.id, rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.abilityStrengthNextCastBonus ?? 0).toBe(0);
  });

  it("applyTriggerBuffs: +60% next-cast Ability Strength at R5", () => {
    const weapon = requireWeapon("velox");
    const mod = requireMod("velox_conclusion");
    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: mod.id, rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyTriggerBuffs: true },
    );
    expect(stats.abilityStrengthNextCastBonus).toBeCloseTo(0.6, 8);
  });

  it("R0 with trigger buffs: +10% next-cast Ability Strength", () => {
    const weapon = requireWeapon("velox");
    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: "velox_conclusion", rank: 0, slotIndex: 0 }],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyTriggerBuffs: true },
    );
    expect(stats.abilityStrengthNextCastBonus).toBeCloseTo(0.1, 8);
  });
});
