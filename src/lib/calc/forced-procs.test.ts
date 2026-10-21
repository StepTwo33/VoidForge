import { describe, expect, it } from "vitest";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { applyAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
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
