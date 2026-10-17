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
