import { describe, expect, it } from "vitest";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { applyAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { computeAltFire } from "@/lib/weapons/alt-fire";
import type { Weapon } from "@/lib/types";

const talons = getEffectiveWeapons().find((w) => w.id === "talons_thrown")!;
const embedded = applyAlternateMode(talons, 0);
const pps = (s: ReturnType<typeof calculateWeaponBuild>) =>
  s.statusProcs.reduce((a, p) => a + (s.effectiveFireRate ?? s.fireRate) * s.multishot * p.chance, 0);

describe("forced procs (R10-J)", () => {
  it("Talons Embedded Detonation: wiki ForcedProcs Puncture + Ragdoll; only Puncture is a status", () => {
    expect(embedded.forcedProcs).toEqual(["puncture", "ragdoll"]);
    expect(talons.forcedProcs).toBeUndefined(); // Mid-Flight Detonation has none
  });

  it("hand-worked: unmodded Embedded = 0.10 Blast + 1 forced Puncture per hit", () => {
    const s = calculateWeaponBuild(embedded, [], new Map());
    expect(s.statusProcs.map((p) => [p.type, +p.chance.toFixed(4)])).toEqual([
      ["blast", 0.1],
      ["puncture", 1],
    ]);
    // Blast: SC 0.10 (pure Blast). Detonation 30% × 250 × avg crit (1 + 0.22 × (2 − 1) = 1.22)
    // = 91.5 (91.51 after damage quantization). Forced Puncture deals no damage.
    expect(s.statusProcs[0].totalDamage).toBeCloseTo(91.5, 1);
    expect(s.statusProcs[1].totalDamage).toBe(0);
    const efr = s.effectiveFireRate ?? s.fireRate;
    expect(pps(s)).toBeCloseTo(efr * 1.1, 9);
  });

  it("adds procs only: burst and sustained DPS, and status DPS, are unchanged", () => {
    const withForced = calculateWeaponBuild(embedded, [], new Map());
    const without = calculateWeaponBuild({ ...embedded, forcedProcs: undefined } as Weapon, [], new Map());
    expect(withForced.burstDps).toBe(without.burstDps);
    expect(withForced.sustainedDps).toBe(without.sustainedDps);
    expect(withForced.statusProcs.length).toBe(without.statusProcs.length + 1);
    const dotDps = (s: typeof without) =>
      s.statusProcs.reduce((a, p) => a + (s.effectiveFireRate ?? s.fireRate) * s.multishot * p.chance * p.totalDamage, 0);
    expect(dotDps(withForced)).toBe(dotDps(without));
  });

  it("a forced DoT type deals its status damage (hand-worked forced Slash)", () => {
    // 100 Impact, CC 0, SC 0: the only proc is the forced Slash.
    // Slash tick = 35% × 100 = 35, 6 ticks over 6 s → 210 per hit.
    const w = { ...embedded, damage: 100, impact: 100, blast: 0, criticalChance: 0, statusChance: 0, radialAttacks: undefined, forcedProcs: ["slash"] } as Weapon;
    const s = calculateWeaponBuild(w, [], new Map());
    const slash = s.statusProcs.find((p) => p.type === "slash")!;
    expect(slash.chance).toBe(1);
    expect(slash.damagePerTick).toBeCloseTo(35, 6);
    expect(slash.totalDamage).toBeCloseTo(210, 6);
  });
});

describe("Hystrix / Prime Poison Quill: wiki ForcedProcs Toxin (Round 32)", () => {
  const all = getEffectiveWeapons();
  const byId = (id: string) => all.find((w) => w.id === id)!;
  const toxinOf = (s: ReturnType<typeof calculateWeaponBuild>) =>
    s.statusProcs.filter((p) => p.type === "toxin");

  it("both carry forcedProcs Toxin; normal status procs are unchanged (forced is on top)", () => {
    for (const id of ["hystrix", "hystrix_prime"]) {
      const w = byId(id);
      expect(w.forcedProcs).toEqual(["Toxin"]);
      const s = calculateWeaponBuild(w, [], new Map());
      const without = calculateWeaponBuild({ ...w, forcedProcs: undefined } as Weapon, [], new Map());
      expect(s.burstDps).toBe(without.burstDps);
      expect(s.sustainedDps).toBe(without.sustainedDps);
      expect(s.statusProcs.slice(0, without.statusProcs.length)).toEqual(without.statusProcs);
      expect(toxinOf(s)).toHaveLength(1);
      expect(toxinOf(s)[0].chance).toBe(1);
      // Procs/s = 7 x (1 forced + SC): Hystrix 7 x 1.10 = 7.7, Prime 7 x 1.20 = 8.4.
      expect(pps(s)).toBeCloseTo(7 * (1 + w.statusChance), 5);
    }
  });

  it("hand-worked Hystrix: Toxin tick 50% x 36 x (1 + 0.24 x 1.20366) = 23.200, x 6 ticks = 139.20", () => {
    // CM 2.2 is held as 2.20366 by the calculator's crit quantisation.
    const t = toxinOf(calculateWeaponBuild(byId("hystrix"), [], new Map()))[0];
    expect(t.duration).toBe(6);
    expect(t.ticks).toBe(6);
    expect(t.damagePerTick).toBeCloseTo(0.5 * 36 * (1 + 0.24 * 1.20366), 2); // 23.200
    expect(t.totalDamage).toBeCloseTo(139.2, 1);
  });

  it("hand-worked Hystrix Prime: Toxin tick 50% x 46 x (1 + 0.28 x 1.20366) = 30.752, x 6 = 184.51", () => {
    const t = toxinOf(calculateWeaponBuild(byId("hystrix_prime"), [], new Map()))[0];
    expect(t.damagePerTick).toBeCloseTo(0.5 * 46 * (1 + 0.28 * 1.20366), 2); // 30.752
    expect(t.totalDamage).toBeCloseTo(184.51, 1);
  });

  it("alt quills keep their own forced element, not Toxin", () => {
    for (const id of ["hystrix", "hystrix_prime"]) {
      const modes = computeAltFire(byId(id), (w) => calculateWeaponBuild(w, [], new Map()));
      expect(modes.map((m) => m.stats.forcedProcs)).toEqual([["Heat"], ["Electricity"], ["Cold"]]);
      for (const m of modes) expect(toxinOf(m.stats)).toEqual([]);
    }
  });
});
