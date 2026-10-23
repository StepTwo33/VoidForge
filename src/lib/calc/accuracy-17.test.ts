import { describe, expect, it } from "vitest";
import {
  getNegativeStatsWithDisposition,
  getStatsWithDisposition,
  rivenBuffCountMultiplier,
  rivenCurseMultiplier,
} from "@/lib/calc/riven-calculator";

const find = (pool: { name: string }[], n: string) => pool.find((s) => s.name === n) as never as {
  minValue: number; maxValue: number; baseValue: number; type: string;
};

describe("R8-1 riven ranges (wiki Riven Mods attribute formula)", () => {
  it("bonus / curse factors", () => {
    expect(rivenBuffCountMultiplier(2, false)).toBe(0.99);
    expect(rivenBuffCountMultiplier(2, true)).toBe(1.2375);
    expect(rivenBuffCountMultiplier(3, false)).toBe(0.75);
    expect(rivenBuffCountMultiplier(3, true)).toBe(0.9375);
    expect(rivenCurseMultiplier(2)).toBe(0.495);
    expect(rivenCurseMultiplier(3)).toBe(0.75);
  });
  it("rifle Damage 2+1 at dispo 1.0: 165×1.2375×[0.9,1.1] = 183.8–224.6", () => {
    const d = find(getStatsWithDisposition("rifle", 1, { positiveCount: 2, hasNegative: true }), "Damage");
    expect(d.minValue).toBeCloseTo(183.8, 1);
    expect(d.maxValue).toBeCloseTo(224.6, 1);
  });
  it("rifle Damage 3+0: 165×0.75 → 111.4–136.1", () => {
    const d = find(getStatsWithDisposition("rifle", 1, { positiveCount: 3, hasNegative: false }), "Damage");
    expect(d.minValue).toBeCloseTo(111.4, 1);
    expect(d.maxValue).toBeCloseTo(136.1, 1);
  });
  it("rifle Damage curse 2+1: −165×0.495 → −89.8…−73.5", () => {
    const d = find(getNegativeStatsWithDisposition(1, { positiveCount: 2, category: "rifle" }), "Damage");
    expect(d.minValue).toBeCloseTo(-89.8, 1);
    expect(d.maxValue).toBeCloseTo(-73.5, 1);
  });
  it("base values: pistol Damage 219.6, rifle Slash 119.97, melee Range 1.94 m, Combo 8.1 s", () => {
    const o = { positiveCount: 2, hasNegative: true };
    expect(find(getStatsWithDisposition("pistol", 1, o), "Damage").baseValue).toBeCloseTo(219.6 * 1.2375, 1);
    expect(find(getStatsWithDisposition("rifle", 1, o), "Slash").baseValue).toBeCloseTo(119.97 * 1.2375, 1);
    const r = find(getStatsWithDisposition("melee", 1, o), "Range");
    expect(r.type).toBe("integer");
    expect(r.baseValue).toBeCloseTo(2.4, 1); // 1.94×1.2375
    expect(find(getStatsWithDisposition("melee", 1, o), "Combo Duration").baseValue).toBeCloseTo(10.0, 1);
  });
  it("elements and Punch Through never curse; Recoil curse is positive", () => {
    const neg = getNegativeStatsWithDisposition(1, { category: "rifle" });
    expect(neg.some((s) => s.name.includes("Heat") || s.name === "Punch Through")).toBe(false);
    expect(find(neg, "Recoil").baseValue).toBeGreaterThan(0);
  });
});

describe("R8-1 dispositions (standardized to 1.2 after DE disposition retirement)", () => {
  it("7 entries standardized to 1.2", async () => {
    const { rivenDispositions: d } = await import("@/data/riven-dispositions");
    expect([d["Aksondol"], d["Nunchasa"], d["Pathocyst"], d["Sarofang"], d["Tenet Diplos"], d["Tenet Plinx"], d["Coda Bassocyst"]])
      .toEqual([1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2]);
  });
});

describe("R8-4 companion mods (wiki Module:Mods/data)", async () => {
  const { calculateCompanionBuild } = await import("@/lib/calc/companion-calculator");
  const { allCompanions } = await import("@/data/companions");
  const { allMods } = await import("@/data/mods");
  const smeeta = allCompanions.find((c) => c.id === "smeeta")!;
  const run = (id: string, rank: number) => calculateCompanionBuild(smeeta, [{ modId: id, rank }]);
  it("Loyal Companion: conditional 75% DR, not added to armor DR (was 410%)", () => {
    const s = run("loyal_companion", 5);
    expect(s.damageReduction).toBeCloseTo(s.armorDamageReduction, 6);
    expect(s.modBonuses?.["loyal_companion::conditionalDamageReduction"]).toBeCloseTo(75, 4);
  });
  it("Repair Kit +18/s, Medi-Pet Kit +12/s and -15s", () => {
    expect(run("repair_kit", 5).healthRegenBonus).toBeCloseTo(18, 6);
    const m = run("medi_pet_kit", 5);
    expect(m.healthRegenBonus).toBeCloseTo(12, 6);
    expect(m.modBonuses?.["medi_pet_kit::recoveryTime"]).toBeCloseTo(-15, 6);
  });
  it("panel values match wiki text", () => {
    expect(run("accelerated_deflection", 5).modBonuses).toMatchObject({
      "accelerated_deflection::shieldRecharge": 90,
      "accelerated_deflection::shieldRechargeDelay": -45,
    });
    expect(run("sanctuary", 10).modBonuses?.["sanctuary::bubbleHealth"]).toBeCloseTo(1800, 2);
    expect(run("self_destruct", 5).modBonuses).toMatchObject({ "self_destruct::blastDamage": 600, "self_destruct::radius": 18 });
    expect(run("reinforced_bond", 5).modBonuses).toMatchObject({ "reinforced_bond::fireRateBonus": 60, "reinforced_bond::reviveOverguard": 150 });
    const bite = run("bite", 10).modBonuses ?? {};
    expect(Object.keys(bite).sort()).toEqual(["bite::criticalChance", "bite::criticalMultiplier"]);
    expect(Object.keys(run("link_vitality", 10).modBonuses ?? {})).toEqual(["link_vitality::health"]);
  });
  it("polarities", () => {
    const pol = (id: string) => allMods.find((m) => m.id === id)?.polarity;
    expect(pol("bloodthirst")).toBe("madurai");
    expect(pol("tek_enhance")).toBe("madurai");
    expect(pol("martyr_symbiosis")).toBe("penjaga");
  });
});

describe("R8-10 Peacemaker ramp-up is fixed (wiki Peacemaker Misc)", async () => {
  const { scaleAbilityMiscStats } = await import("@/lib/codex/ability-misc-stats");
  const { allWarframes } = await import("@/data/warframes");
  for (const id of ["mesa", "mesa_prime"]) {
    it(`${id}: 200% STR → damage bonus 300%, ramp stays 150%`, () => {
      const wf = allWarframes.find((w) => w.id === id) as never as { abilities: { name: string; miscStats: Record<string, unknown> }[] };
      const pm = wf.abilities.find((a) => a.name === "Peacemaker")!;
      const lines = scaleAbilityMiscStats(pm.miscStats, { strength: 2, duration: 1, range: 1, efficiency: 1 } as never, { warframeId: id, abilityName: "Peacemaker" } as never);
      const get = (l: string) => lines.find((x) => x.label === l)!.scaled;
      expect(get("Damage Bonus")).toBe("300%");
      expect(get("Ramp-Up Damage Bonus")).toBe("150%");
    });
  }
});

describe("R8-2 Railjack Tactical cooldown intrinsics multiply", async () => {
  const { intrinsicPaperEffects } = await import("@/data/railjack-intrinsics");
  const { calculateRailjackBuild } = await import("@/lib/calc/railjack-calculator");
  it("R7 20%, R9 1 − 0.8² = 36% (was 40%)", () => {
    expect(intrinsicPaperEffects({ tactical: 6 }).tacticalCooldownReduction).toBe(0);
    expect(intrinsicPaperEffects({ tactical: 7 }).tacticalCooldownReduction).toBeCloseTo(0.2, 10);
    expect(intrinsicPaperEffects({ tactical: 10 }).tacticalCooldownReduction).toBeCloseTo(0.36, 10);
  });
  it("Squad Renew 300 s → 192 s at Tactical 10", () => {
    const b = calculateRailjackBuild({ tacticalMods: [{ modId: "squad_renew", rank: 0 } as never], intrinsics: { tactical: 10 } });
    expect(b.tacticalAbilities[0].cooldownSec).toBe(192);
  });
});

describe("R8-3 Railjack Gunnery intrinsics on Archwing / Necramech", async () => {
  const { gunneryArchWeaponDamageBonus, gunneryArchwingAbilityBonus } = await import("@/data/railjack-intrinsics");
  const { calculateArchwingBuild } = await import("@/lib/calc/archwing-calculator");
  const { archwings } = await import("@/data/archwing");
  const { calculateWeaponBuild } = await import("@/lib/calc/calculator");
  const { allWeapons } = await import("@/data/weapons");
  const { getEffectiveModsMap } = await import("@/lib/weapons/effective-data");
  it("damage bonus by rank / weapon / mode", () => {
    expect(gunneryArchWeaponDamageBonus(2, "archmelee", "archwing")).toBe(0);
    expect(gunneryArchWeaponDamageBonus(3, "archmelee", "archwing")).toBe(0.2);
    expect(gunneryArchWeaponDamageBonus(7, "archgun", "archwing")).toBe(0);
    expect(gunneryArchWeaponDamageBonus(8, "archgun", "archwing")).toBe(0.25);
    expect(gunneryArchWeaponDamageBonus(10, "archmelee", "archwing")).toBeCloseTo(0.45, 10);
    expect(gunneryArchWeaponDamageBonus(3, "archgun", "necramech")).toBe(0);
    expect(gunneryArchWeaponDamageBonus(4, "archgun", "necramech")).toBe(0.2);
    expect(gunneryArchwingAbilityBonus(8)).toBe(0.2);
  });
  it("Gunnery 8: Elytron STR/Range/Eff 1.2", () => {
    const s = calculateArchwingBuild(archwings.find((a) => a.id === "elytron")!, [], undefined, 8);
    expect([s.abilityStrength, s.abilityRange, s.abilityEfficiency, s.abilityDuration]).toEqual([1.2, 1.2, 1.2, 1]);
  });
  it("Gunnery 8 +25% is additive with Rubedo-Lined Barrel", () => {
    const w = allWeapons.find((x) => x.category === "archgun" && x.id === "imperator")!;
    const M = getEffectiveModsMap();
    const rubedo = [...M.values()].find((m) => m.name === "Rubedo-Lined Barrel")!;
    const mods = [{ modId: rubedo.id, rank: rubedo.maxRank, slotIndex: 0 }] as never;
    const a = calculateWeaponBuild(w, mods, M);
    const b = calculateWeaponBuild(w, mods, M, undefined, undefined, {
      externalBuffs: [{ id: "railjack_gunnery", label: "g", category: "other", damageBonus: 0.25 }],
    });
    // Rubedo max +100%: (1 + 1 + 0.25) / (1 + 1)
    expect(b.totalDamage / a.totalDamage).toBeCloseTo(2.25 / 2, 2);
  });
});

describe("R8-5 Necramech capacity above rank 30 + mod polarities", async () => {
  const { archwingFrameCapacity } = await import("@/data/archwing");
  const { allMods } = await import("@/data/mods");
  it("Necramech: +2 ranks per Forma to 40 → 80 with Reactor; Archwing stays 60", () => {
    expect(archwingFrameCapacity("necramech", 0, true)).toBe(60);
    expect(archwingFrameCapacity("necramech", 3, true)).toBe(72);
    expect(archwingFrameCapacity("necramech", 5, true)).toBe(80);
    expect(archwingFrameCapacity("necramech", 9, false)).toBe(40);
    expect(archwingFrameCapacity("archwing", 5, true)).toBe(60);
  });
  it("Necramech Fury Vazarin, Necramech Hydraulics Madurai", () => {
    expect(allMods.find((m) => m.id === "necramech_fury")?.polarity).toBe("vazarin");
    expect(allMods.find((m) => m.id === "necramech_hydraulics")?.polarity).toBe("madurai");
  });
});

describe("R8-6 Plexus / Archwing mod values (wiki Mods/data + fandom Overloader table)", async () => {
  const { calculateRailjackBuild } = await import("@/lib/calc/railjack-calculator");
  const { allMods } = await import("@/data/mods");
  const desc = (id: string) => allMods.find((m) => m.id === id)!.description;
  it("Overloader +50% munitions (was +87%)", () => {
    const b = calculateRailjackBuild({ integratedMods: [{ modId: "overloader", rank: 3 } as never] });
    expect(b.munitionsCapacityBonus).toBeCloseTo(0.5, 10);
  });
  it("Ironclad calc unchanged (22.5% / 25.5%) and description matches", () => {
    const b = calculateRailjackBuild({ integratedMods: [{ modId: "ironclad_matrix", rank: 5 } as never] });
    expect(b.hull).toBe(Math.round(1050 * 1.225));
    expect(b.shield).toBe(Math.round(1000 * 1.255));
    expect(desc("ironclad_matrix")).toContain("+22.5% Hull and Armor");
  });
  it("descriptions", () => {
    expect(desc("sentient_scalpel")).toBe("x1.27 Turret Damage vs Sentients");
    expect(desc("defensive_fire")).toContain("+9% Maximum Shields");
    expect(desc("onslaught_matrix")).toContain("+15% Turret Damage");
    expect(desc("raider_matrix")).toContain("+15% Archwing Speed and Damage");
  });
});

describe("R8-8 Secondary Outburst rank table (wiki 5/7/9/12/16/20 per combo)", async () => {
  const { ARCANE_EFFECTS } = await import("@/data/arcane-effects");
  const { scaleArcaneEffectLine } = await import("@/lib/calc/arcane-utils");
  it("per-rank values", () => {
    const line = ARCANE_EFFECTS.secondary_outburst!.effects[0]!;
    expect([0, 1, 2, 3, 4, 5].map((r) => scaleArcaneEffectLine(line, r, 5))).toEqual([5, 7, 9, 12, 16, 20]);
  });
});
