/**
 * Round 52 (Jason: "do what the wiki says"): Grimoire alt-fire 280 (page text), guaranteed Impact
 * on the Glaive throw and on Nepheri fireballs within 10 m (page text), and per-attack slam /
 * heavy slam crit multipliers from Module:Weapons/data/melee, confirmed on each page's infobox.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { MELEE_ATTACK_DATA } from "@/data/melee-attack-data";
import { WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const alt = (id: string, label: string) => WEAPON_ALT_FIRE[id].find((m) => m.label === label)!;

// [id, normal CM, slam CM (undefined = same as normal), heavy slam CM (undefined = same)]
const WIKI_CM: [string, number, number | undefined, number | undefined][] = [
  ["dorrclave", 2.2, 2.4, undefined],
  ["halikar_wraith", 2.3, 2.5, 2.5],
  ["amphis", 1.7, undefined, 2],
  ["ceramic_dagger", 1.5, undefined, 2],
  ["furax_wraith", 2.7, undefined, 2.3],
  ["kestrel_prime", 2.2, undefined, 2],
  ["nami_skyla_prime", 2, undefined, 2.2],
  ["vinquibus_melee", 3.2, undefined, 2.6],
];

describe("Round 52: wiki slam / heavy slam crit multiplier", () => {
  it.each(WIKI_CM)("%s: normal %s, slam %s, heavy slam %s", (id, normal, slam, heavySlam) => {
    expect(weapon(id).criticalMultiplier).toBeCloseTo(normal, 6);
    expect(MELEE_ATTACK_DATA[id].slam?.criticalMultiplier).toBe(slam);
    expect(MELEE_ATTACK_DATA[id].heavySlam?.criticalMultiplier).toBe(heavySlam);
  });

  it("only these weapons carry a per-attack crit multiplier", () => {
    const ids = Object.entries(MELEE_ATTACK_DATA)
      .filter(([, d]) => d.slam?.criticalMultiplier != null || d.heavySlam?.criticalMultiplier != null)
      .map(([id]) => id)
      .sort();
    expect(ids).toEqual(WIKI_CM.map(([id]) => id).sort());
  });

  it.each([
    ["dorrclave", 2.4 / 2.2],
    ["halikar_wraith", 2.5 / 2.3],
  ])("%s slam uses its own multiplier, scaled by crit damage mods", (id, ratio) => {
    const w = weapon(id);
    const bare = calculateWeaponBuild(w, [], modsMap);
    expect(bare.slamCritMultiplierRatio).toBeCloseTo(ratio, 6);
    expect(bare.slamCritChanceRatio).toBeUndefined();
    expect(bare.slamAttackDamage).toBeCloseTo(
      bare.totalDamage * bare.slamBaseMultiplier! * avgCritMultiplier(bare.criticalChance, bare.criticalMultiplier * ratio),
      4,
    );
    const os = calculateWeaponBuild(w, [{ modId: "organ_shatter_r3", rank: 5, slotIndex: 0 }], modsMap);
    expect(os.criticalMultiplier).toBeGreaterThan(bare.criticalMultiplier);
    expect(os.slamAttackDamage).toBeCloseTo(
      os.totalDamage * os.slamBaseMultiplier! * avgCritMultiplier(os.criticalChance, os.criticalMultiplier * ratio),
      4,
    );
  });

  it("heavy-slam-only weapons keep the normal multiplier on the slam figure", () => {
    for (const id of ["amphis", "ceramic_dagger", "furax_wraith", "nami_skyla_prime"]) {
      expect(calculateWeaponBuild(weapon(id), [], modsMap).slamCritMultiplierRatio, id).toBeUndefined();
    }
  });
});

describe("Round 52: page-text values", () => {
  it("Grimoire Voltaic Orb bolt is 280 Electricity; the 250 explosion is unchanged", () => {
    const g = alt("grimoire", "Voltaic Orb");
    expect(g.damage).toBe(280);
    expect(g.electricity).toBe(280);
    expect(g.radialAttacks!.find((r) => r.name === "Active Radial Attack")!.totalDamage).toBe(250);
    expect(g.note).toContain("actual in-game base damage value is 280");
  });

  it("Glaive Throw forces Impact (page text); Charged Throw unchanged", () => {
    expect(alt("glaive", "Throw").forcedProcs).toEqual(["Impact"]);
    expect(alt("glaive", "Charged Throw").forcedProcs).toEqual(["Impact"]);
    expect(alt("glaive", "Throw").note).toContain("Thrown glaive has a guaranteed Impact proc");
  });

  it("Nepheri fireballs force Impact within 10 m (page text)", () => {
    const f = alt("nepheri", "Fireball");
    expect(f.forcedProcs).toEqual(["Impact"]);
    expect(f.note).toContain("within 10 m");
  });
});
