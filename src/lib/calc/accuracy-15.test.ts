import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { DEFAULT_SIM_PARAMS, type SimulationParams } from "@/lib/types";

const build = (id: string, mods: string[] = [], sim: Partial<SimulationParams> = {}) =>
  calculateWeaponBuild(
    enrichWeapon(allWeapons.find((x) => x.id === id)!),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
    undefined,
    { ...DEFAULT_SIM_PARAMS, ...sim },
  );

describe("R7-1: Galvanized / CO per-status bonus is direct-hit only (both wikis)", () => {
  it("Kuva Zarr + Galvanized Aptitude (2 stacks, 4 statuses): radial unchanged vs unmodded-equivalent", () => {
    const g = build("kuva_zarr", ["galvanized_aptitude"], { killStacks: 2, statusTypesOnTarget: 4 });
    const plain = build("kuva_zarr", ["galvanized_aptitude"], { killStacks: 0, statusTypesOnTarget: 0 });
    // Galv Aptitude: +40%/status/stack → direct ×(1+3.2)=4.2; radial must stay at plain value.
    expect(g.radialBurstDps!).toBeCloseTo(plain.radialBurstDps!, 6);
    expect(g.totalDamage / plain.totalDamage).toBeCloseTo(4.2, 2);
  });
});

describe("R7-2 + R7-7: DoTs hit shields; Magnetic amplifies shields (wiki Magnetic, both wikis)", () => {
  it("Magnetic multiplier: 1 stack ×2, +0.25/stack, 10 stacks ×4.25 (+325%), capped", async () => {
    const { magneticShieldMultiplier: m } = await import("@/lib/calc/ttk");
    expect(m(0)).toBe(1);
    expect(m(1)).toBe(2);
    expect(m(5)).toBe(3);
    expect(m(10)).toBe(4.25);
    expect(m(14)).toBe(4.25);
  });
  it("Simulor (Magnetic) kills a shielded Crewman L30 faster than before (6.0 s → 2.67 s)", async () => {
    const { calculateTTK, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const crew = ENEMY_TYPES.find((e) => e.id === "crewman")!;
    expect(calculateTTK(build("simulor"), crew, 30).ttk).toBeCloseTo(2.6667, 3);
  });
});

describe("R7-4: level scaling starts at the enemy's wiki BaseLevel (both wikis)", () => {
  it("Corpus Tech (BL 15) at L15 has exactly base stats; L30 scales by q = 15, not 29", async () => {
    const { scaleEnemyPools, scaleHealth, scaleShield, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const tech = ENEMY_TYPES.find((e) => e.id === "corpus_tech")!;
    expect(tech.baseLevel).toBe(15);
    const p15 = scaleEnemyPools(tech, 15);
    expect(p15.health).toBe(700);
    expect(p15.shield).toBe(250);
    const p30 = scaleEnemyPools(tech, 30);
    expect(p30.health).toBeCloseTo(scaleHealth(700, 16, "Corpus"), 9);
    expect(p30.shield).toBeCloseTo(scaleShield(250, 16, "Corpus"), 9);
    expect(p30.health).toBeCloseTo(3969.66, 1); // was 13927.36 with q = 29
  });
  it("Heavy Gunner (BL 8) L30 health 5968.9 → 3456.1; BL-1 units unchanged", async () => {
    const { scaleEnemyPools, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const hg = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    expect(scaleEnemyPools(hg, 30).health).toBeCloseTo(3456.08, 1);
    const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
    expect(lancer.baseLevel).toBeUndefined();
  });
});

describe("R7-3: Eximus Overguard (wiki Enemy Level Scaling § Overguard, wiki Overguard)", () => {
  it("12 × curve: L1 = 12, L30 = 12·(1+0.0015·29⁴) = 12,743.1, L100 ≈ 195,098", async () => {
    const { eximusOverguard } = await import("@/lib/calc/ttk");
    expect(eximusOverguard(1)).toBe(12);
    expect(eximusOverguard(30)).toBeCloseTo(12 * (1 + 0.0015 * 29 ** 4), 6);
    expect(eximusOverguard(30)).toBeCloseTo(12743.06, 1);
    expect(eximusOverguard(100)).toBeCloseTo(12 * (1 + 260 * 99 ** 0.9), 6);
    expect(Math.round(eximusOverguard(100) / 100)).toBe(Math.round(195098 / 100));
  });
  it("only Eximus get Overguard; it adds to effective health in TTK", async () => {
    const { scaleEnemyPools, calculateTTK, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const ex = ENEMY_TYPES.find((e) => e.id === "eximus_heavy_gunner")!;
    const hg = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    expect(scaleEnemyPools(hg, 30).overguard).toBe(0);
    const t = calculateTTK(build("braton_prime"), ex, 30);
    expect(t.scaledOverguard).toBeCloseTo(12743.06, 1);
    expect(t.effectiveHealth).toBeCloseTo(t.scaledHealth + t.scaledShield + 12743.06, 1);
    expect(t.ttk).toBeCloseTo(74.97, 1); // 46.39 s without Overguard (72.46 before R7-5 expiry)
  });
});

describe("R7-5: status stacks expire on their own timers (wiki Status Effect, both wikis)", () => {
  it("StackTimers: per-stack expiry and oldest-first replacement at the cap", async () => {
    const { StackTimers } = await import("@/lib/calc/ttk");
    const v = new StackTimers(6, 10);
    expect(v.add(4, 0)).toBe(4);
    expect(v.add(3, 2)).toBe(7);
    expect(v.count(5.99)).toBe(7);
    expect(v.count(6)).toBe(3); // first 4 expired at t = 6
    expect(v.count(8)).toBe(0);
    const c = new StackTimers(8, 10);
    c.add(8, 0);
    expect(c.add(5, 1)).toBe(10); // 3 of the oldest replaced
    expect(c.count(8)).toBe(5); // remaining 5 of the oldest expired at 8
    expect(c.count(9)).toBe(0);
  });
  it("Viral 6 s × Status Duration: +100% duration doubles the window", async () => {
    const { StackTimers } = await import("@/lib/calc/ttk");
    const v = new StackTimers(6 * 2, 10);
    v.add(1, 0);
    expect(v.count(11.9)).toBe(1);
    expect(v.count(12)).toBe(0);
  });
});

describe("R7-6: Hunter Munitions / Internal Bleeding (wiki, both wikis)", () => {
  it("Lenz + HM: Slash tick = 0.35 × 60 × CM (crit-conditional), not × avg crit", () => {
    const s = build("lenz", ["hunter_munitions"]);
    const hm = s.statusProcs!.find((p) => p.description.includes("Hunter Munitions"))!;
    expect(hm.chance).toBeCloseTo(0.3 * 0.5, 9);
    expect(hm.damagePerTick).toBeCloseTo(0.35 * 60 * s.criticalMultiplier, 6); // 42.01 (was 31.51)
  });
  it("HM and IB Slash now reach the TTK sim", async () => {
    const { calculateTTK, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const hel = ENEMY_TYPES.find((e) => e.id === "hellion")!;
    const crew = ENEMY_TYPES.find((e) => e.id === "crewman")!;
    const plain = calculateTTK(build("rubico_prime"), hel, 100).ttk;
    const hm = calculateTTK(build("rubico_prime", ["hunter_munitions"]), hel, 100).ttk;
    expect(hm).toBeLessThan(plain);
    expect(hm).toBeCloseTo(64.45, 1); // 114.64 s before
    expect(calculateTTK(build("braton_prime", ["hunter_munitions", "internal_bleeding"]), crew, 100).ttk)
      .toBeCloseTo(37.45, 1); // 44.93 s before
  });
});

describe("R7-8: Emerald / Violet shard weapon effects (wiki Archon Shard, both wikis)", () => {
  const shard = (color: string, bonus: string, value: number, i: number) => ({
    shardId: `${color}_standard`, shardColor: color, shardTier: 1, selectedBonus: bonus, bonusValue: value, slotIndex: i,
  });
  const wfStats = async (shards: ReturnType<typeof shard>[]) => {
    const { applyWarframeShardsAndArcanes } = await import("@/lib/calc/calculator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: any = { statusDurationBonus: 0, secondaryShardBonus: 0, primaryShardBonus: 0, meleeCritDamageBonus: 0 };
    return applyWarframeShardsAndArcanes(base, shards);
  };
  it("Violet: +30% primary Electricity + 10% per Crimson/Azure/Violet (self included)", async () => {
    const s = await wfStats([
      shard("violet", "primaryElectricityDamage", 30, 0),
      shard("crimson", "abilityStrength", 10, 1),
      shard("amber", "castingSpeed", 25, 2),
    ]);
    expect(s.primaryElectricityShardBonus).toBeCloseTo(30 + 10 * 2, 9); // violet + crimson; amber excluded
  });
  it("Emerald toxin status no longer adds Status Duration; feeds Toxin DoT additively with Elementalist", async () => {
    const s = await wfStats([shard("emerald", "toxinStatusDamage", 30, 0), shard("emerald", "corrosionMaxStacks", 2, 1)]);
    expect(s.statusDurationBonus).toBe(0);
    expect(s.toxinStatusDamageShardBonus).toBe(30);
    expect(s.corrosionMaxStacksShardBonus).toBe(2);
    const { calculateWeaponBuild } = await import("@/lib/calc/calculator");
    const w = enrichWeapon(allWeapons.find((x) => x.id === "kuva_nukor")!);
    const plain = build("kuva_nukor", ["infected_clip_r3"]);
    const buffs = [{ id: "x", label: "x", category: "shard" as const, toxinStatusDamageBonus: 0.3 }];
    const withShard = calculateWeaponBuild(
      w,
      [{ modId: "infected_clip_r3", rank: modsMap.get("infected_clip_r3")!.maxRank, slotIndex: 0 }],
      modsMap, undefined, { ...DEFAULT_SIM_PARAMS }, { externalBuffs: buffs },
    );
    const tox = (b: typeof plain) => b.statusProcs!.find((p) => p.type === "toxin")!.damagePerTick;
    expect(tox(withShard) / tox(plain)).toBeCloseTo(1.3, 9); // no Elementalist: (1+0.3)/1
  });
  it("Corrosion cap: 13 stacks = 98% strip, 14 = 100% (wiki Corrosive)", async () => {
    const { corrosiveArmorRemaining } = await import("@/lib/calc/ttk");
    expect(corrosiveArmorRemaining(13, 13)).toBeCloseTo(0.02, 9);
    expect(corrosiveArmorRemaining(14, 14)).toBe(0);
    expect(corrosiveArmorRemaining(13)).toBeCloseTo(0.2, 9); // default cap 10
  });
});

describe("R7-9: Exalted Blade wave + missing heavy data (wiki Exalted Blade (Weapon), both wikis)", () => {
  it("wave hits once per swing with the swing's damage: radial DPS = direct DPS (unmodded)", () => {
    for (const id of ["exalted_blade", "exalted_blade_prime", "exalted_blade_umbra"]) {
      const s = build(id);
      expect(s.radialBurstDps!).toBeCloseTo(s.burstDps / 2, 6);
      // 250 × 0.833/s × avg crit (1 + 0.15 × 1) = 239.50
      expect(s.radialBurstDps!).toBeCloseTo(250 * 0.833 * 1.15, 1);
    }
  });
  it("heavy data: Exalted Prime/Umbra 1250, Dark Split-Sword (dual) 464", async () => {
    const { MELEE_ATTACK_DATA } = await import("@/data/melee-attack-data");
    expect(MELEE_ATTACK_DATA.exalted_blade_prime.heavyAttack).toBe(1250);
    expect(MELEE_ATTACK_DATA.exalted_blade_umbra.slideAttack).toBe(536);
    expect(MELEE_ATTACK_DATA.dark_split_sword.heavyAttack).toBe(464);
    expect(MELEE_ATTACK_DATA.dark_split_sword.slam!.damage).toBe(232);
  });
});

describe("R7-10: bosses take at most 4 Cold stacks (wiki Cold Damage, both wikis)", () => {
  it("Glaxion vs Captain Vor: boss is slower than the same stats as a regular unit", async () => {
    const { calculateTTK, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const vor = ENEMY_TYPES.find((e) => e.id === "captain_vor")!;
    expect(vor.kind).toBe("boss");
    const s = build("glaxion", ["cryo_rounds_r3"]);
    const boss = calculateTTK(s, vor, 20).ttk;
    const unit = calculateTTK(s, { ...vor, kind: "unit" }, 20).ttk;
    expect(boss).toBeGreaterThan(unit);
    expect(boss).toBeCloseTo(31.93, 1); // 31.10 s before (10-stack Cold crit + freeze)
  });
});
