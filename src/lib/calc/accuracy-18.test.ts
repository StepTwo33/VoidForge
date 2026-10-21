import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { sumInitialComboFromMods } from "@/lib/calc/melee-combo";

const modsMap = new Map(allMods.map((m) => [m.id, m]));

describe("R9-C1 Corrupt Charge (wiki.gg + fandom table: +7.5/15/22.5/30 combo, -12.5…-50% duration)", () => {
  it("initial combo per rank rounds to 8/15/23/30", () => {
    expect([0, 1, 2, 3].map((rank) => sumInitialComboFromMods([{ modId: "corrupt_charge", rank, slotIndex: 0 }], modsMap))).toEqual([8, 15, 23, 30]);
  });
  it("no attack speed stat", () => {
    const m = modsMap.get("corrupt_charge")!;
    expect(m.stats.attackSpeed).toBeUndefined();
    expect(m.stats.comboDuration! * 4).toBe(-50);
  });
});

describe("R9-C2 Sacrificial set (wiki.gg + fandom: both mods +25% when paired)", async () => {
  const { allWeapons } = await import("@/data/weapons");
  const { calculateWeaponBuild } = await import("@/lib/calc/calculator");
  const skana = allWeapons.find((w) => w.id === "skana")!;
  const both = calculateWeaponBuild(skana, [
    { modId: "sacrificial_steel", rank: 10, slotIndex: 0 },
    { modId: "sacrificial_pressure", rank: 10, slotIndex: 1 },
  ], modsMap);
  it("Steel 220% → 275% CC, Pressure 110% → 137.5% damage", () => {
    // skana base CC 0.05, damage 120: 0.05 × (1 + 2.75) = 0.1875; 120 × 2.375 = 285
    expect(both.criticalChance).toBeCloseTo(0.05 * 3.75, 6);
    expect(both.moddedBaseDamage).toBeCloseTo(120 * 2.375, 6);
  });
  it("single mod unchanged", () => {
    const one = calculateWeaponBuild(skana, [{ modId: "sacrificial_steel", rank: 10, slotIndex: 0 }], modsMap);
    expect(one.criticalChance).toBeCloseTo(0.05 * 3.2, 6);
  });
});

describe("R9-B Vinquibus melee mode (wiki Weapons/data/melee 'Vinquibus (Melee)')", async () => {
  const { allWeapons } = await import("@/data/weapons");
  const { MELEE_ATTACK_DATA } = await import("@/data/melee-attack-data");
  it("base stats 182 Puncture / 78 Slash, 40% / 3.2x / 20%, 1.0 attack speed", () => {
    const w = allWeapons.find((x) => x.id === "vinquibus_melee")!;
    expect([w.category, w.damage, w.puncture, w.slash, w.criticalChance, w.criticalMultiplier, w.statusChance, w.fireRate]).toEqual(["melee", 260, 182, 78, 0.4, 3.2, 0.2, 1]);
  });
  it("heavy 2600, slide 520, slam 440 r7, heavy slam 660 r8", () => {
    const d = (MELEE_ATTACK_DATA as Record<string, any>).vinquibus_melee;
    expect([d.heavyAttack, d.slideAttack, d.slam.damage, d.slam.radius, d.heavySlam.damage, d.heavySlam.radius]).toEqual([2600, 520, 440, 7, 660, 8]);
  });
});

describe("R9-I amp scaffold multi-part attacks (wiki Module:Weapons/data/modular)", async () => {
  const { ampScaffolds, ampScaffoldProcsPerTrigger, ampScaffoldEdgeDamage } = await import("@/data/modular-weapons");
  const sc = (id: string) => ampScaffolds.find((x) => x.id === id)!;
  it("parts sum to the stored per-trigger damage", () => {
    for (const s of ampScaffolds) {
      if (!s.attacks) continue;
      expect(s.attacks.reduce((n, a) => n + a.damage * (a.multishot ?? 1), 0)).toBe(s.damage);
    }
  });
  it("Shraksun: 3000 @20% + 4500 @30% explosion, forced Impact each → 2.5 procs/shot; edge 3000 + 4500×0.6 = 5700", () => {
    const s = sc("amp_shraksun");
    expect(s.attacks!.map((a) => [a.damage, a.statusChance])).toEqual([[3000, 0.2], [4500, 0.3]]);
    expect(ampScaffoldProcsPerTrigger(s)).toBeCloseTo(2.5, 10);
    expect(ampScaffoldEdgeDamage(s)).toBeCloseTo(5700, 10);
  });
  it("Dissic: 0.37×(1+1+9) = 4.07 procs; edge 15 + 6600×0.4 + 0 = 2655", () => {
    expect(ampScaffoldProcsPerTrigger(sc("amp_dissic"))).toBeCloseTo(4.07, 10);
    expect(ampScaffoldEdgeDamage(sc("amp_dissic"))).toBeCloseTo(2655, 10);
  });
  it("single-part scaffolds fall back to their status chance", () => {
    expect(ampScaffoldProcsPerTrigger(sc("amp_klebrik"))).toBe(0.14);
  });
});

describe("R9-D2 Nurinarim (wiki: 20s max duration; 2× on marked targets)", async () => {
  const { allWarframes } = await import("@/data/warframes");
  const nur = allWarframes.find((f) => f.id === "narin")!.abilities.find((a) => a.name === "Nurinarim")!;
  it("duration 20s (was 15)", () => expect(nur.duration).toBe(20));
  it("panel note says the damage values are the marked-target 2× case", () => {
    expect(String(nur.miscStats?.markedTarget)).toMatch(/2× marked-target/);
    expect(nur.damage).toBe(2 * 20000);
    expect(nur.miscStats?.explosionDamage).toBe(2 * 10000);
  });
});
