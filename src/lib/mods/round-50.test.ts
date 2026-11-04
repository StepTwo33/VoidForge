/**
 * Round 50 (wiki.warframe.com weapon pages + Module:Weapons/data/melee): per-attack slam / heavy
 * slam crit chance for Prisma Machete, Amphis, Kestrel Prime, Syam and Vinquibus (Melee), using
 * the Round 49 Rumblejack mechanism. Korumm's Tactical Combo Slam is not modelled (see findings).
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { MELEE_ATTACK_DATA } from "@/data/melee-attack-data";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;

// [id, normal CC, slam CC (undefined = same as normal), heavy slam CC]
const WIKI: [string, number, number | undefined, number][] = [
  ["prisma_machete", 0.15, 0.19, 0.19],
  ["amphis", 0.13, undefined, 0.24],
  ["kestrel_prime", 0.2, undefined, 0.1],
  ["syam", 0.22, undefined, 0.2],
  ["vinquibus_melee", 0.4, undefined, 0.34],
];

describe("Round 50: wiki slam / heavy slam crit chance", () => {
  it.each(WIKI)("%s: normal %s, slam %s, heavy slam %s", (id, normal, slam, heavySlam) => {
    expect(weapon(id).criticalChance).toBeCloseTo(normal, 6);
    expect(MELEE_ATTACK_DATA[id].slam?.criticalChance).toBe(slam);
    expect(MELEE_ATTACK_DATA[id].heavySlam?.criticalChance).toBe(heavySlam);
  });

  it("Prisma Machete's slam uses 19% (scaled by crit mods); normal attacks stay 15%", () => {
    const w = weapon("prisma_machete");
    const bare = calculateWeaponBuild(w, [], modsMap);
    expect(bare.criticalChance).toBeCloseTo(0.15, 6);
    expect(bare.slamCritChanceRatio).toBeCloseTo(0.19 / 0.15, 6);
    expect(bare.slamAttackDamage).toBeCloseTo(
      bare.totalDamage * bare.slamBaseMultiplier! * avgCritMultiplier(0.19, bare.criticalMultiplier),
      4,
    );
    const ts = calculateWeaponBuild(w, [{ modId: "true_steel_r3", rank: 5, slotIndex: 0 }], modsMap);
    expect(ts.slamAttackDamage).toBeCloseTo(
      ts.totalDamage * ts.slamBaseMultiplier! * avgCritMultiplier(0.19 * 2.2, ts.criticalMultiplier),
      4,
    );
  });

  it("heavy-slam-only weapons keep the normal crit for slams (no ratio)", () => {
    for (const id of ["amphis", "kestrel_prime", "syam", "vinquibus_melee"]) {
      const s = calculateWeaponBuild(weapon(id), [], modsMap);
      expect(s.slamCritChanceRatio, id).toBeUndefined();
      expect(s.slamAttackDamage, id).toBeCloseTo(
        s.totalDamage * s.slamBaseMultiplier! * avgCritMultiplier(s.criticalChance, s.criticalMultiplier),
        6,
      );
    }
  });

  it("Korumm is unchanged (Tactical Combo Slam is not a modelled attack)", () => {
    expect(MELEE_ATTACK_DATA.korumm.slam?.criticalChance).toBeUndefined();
    expect(MELEE_ATTACK_DATA.korumm.heavySlam?.criticalChance).toBeUndefined();
  });
});
