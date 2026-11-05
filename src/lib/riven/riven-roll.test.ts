import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { rivenAttributeValue } from "@/lib/riven/riven-roll";
import { resolveRivenUpgrade } from "@/lib/warframe-arsenal/riven-resolve";

describe("Player Sync riven roll conversion (wiki Riven Mods § Attribute Value Formula)", () => {
  it("u=0.5 at rank 8 equals the wiki rank-8 base × 1.2 × L", () => {
    // Shotgun Multishot base 119.7% (wiki Base Values); 3+0 → L 0.75.
    const v = rivenAttributeValue({ type: "shotgun", tag: "WeaponFireIterationsMod", u: 0.5, rank: 8, buffCount: 3, curseCount: 0, isCurse: false })!;
    expect(v * 100).toBeCloseTo(119.7 * 1.2 * 0.75, 1);
    // Rifle CC 2+1 at u=1 → base 149.99 × 1.2 × 1.2375 × 1.1
    const cc = rivenAttributeValue({ type: "rifle", tag: "WeaponCritChanceMod", u: 1, rank: 8, buffCount: 2, curseCount: 1, isCurse: false })!;
    expect(cc * 100).toBeCloseTo(149.99 * 1.2 * 1.2375 * 1.1, 0);
    // Curse 2+1 → −0.495
    const curse = rivenAttributeValue({ type: "rifle", tag: "WeaponAmmoMaxMod", u: 0.5, rank: 8, buffCount: 2, curseCount: 1, isCurse: true })!;
    expect(curse * 100).toBeCloseTo(-49.95 * 1.2 * 0.495, 1);
    // Rank scales by (r+1)/9
    const r0 = rivenAttributeValue({ type: "shotgun", tag: "WeaponFireIterationsMod", u: 0.5, rank: 0, buffCount: 3, curseCount: 0, isCurse: false })!;
    expect(r0).toBeCloseTo(v / 9, 6);
  });

  it("real WFCD arsenal payload (Boar Prime riven, rank 8, 3+0) converts rolls to stat values", () => {
    const raw = JSON.parse(
      readFileSync(join(process.cwd(), "src/lib/warframe-arsenal/__fixtures__/wfcd-example7-wisp-prime.json"), "utf8"),
    );
    const riven = raw.loadOuts.RAILJACK.crew.members.SLOT_A.crewweapon.upgrades.find((u: { uniqueName: string }) => u.uniqueName.includes("Randomized"));
    const r = resolveRivenUpgrade(riven)!;
    // b × 10 × 9 × 1.2 × 0.75 × (0.9 + 0.2u)
    expect(r.rivenStats.statusChance).toBeCloseTo(0.01 * 81 * (0.9 + 0.2 * 0.6189193759289751), 6);
    expect(r.rivenStats.criticalMultiplier).toBeCloseTo(0.01 * 81 * (0.9 + 0.2 * 0.5792203672036719), 6);
    expect(r.rivenStats.multishot).toBeCloseTo(0.0133 * 81 * (0.9 + 0.2 * 0.06930751546221554), 6);
    expect(r.rivenStats.multishot).toBeGreaterThan(0.95); // not the raw 0.069
    expect(r.polarity).toBe("naramon");
  });

  it("curses come out negative, recoil buff negative, combo-gain curse negative", () => {
    const r = resolveRivenUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/PlayerMeleeWeaponRandomModRare",
      rank: 8,
      buffs: [{ tag: "WeaponCritChanceMod", val: 0.5 }, { tag: "WeaponMeleeDamageMod", val: 0.5 }],
      curses: [{ tag: "WeaponMeleeComboPointsOnHitMod", val: 0.5 }],
    })!;
    expect(r.rivenStats.criticalChance).toBeCloseTo(1.8 * 1.2 * 1.2375, 4);
    expect(r.rivenStats.comboGainChance).toBeLessThan(0);
    const g = resolveRivenUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/LotusRifleRandomModRare",
      rank: 8,
      buffs: [{ tag: "WeaponRecoilReductionMod", val: 0.5 }, { tag: "WeaponCritChanceMod", val: 0.5 }],
      curses: [{ tag: "WeaponAmmoMaxMod", val: 0.5 }],
    })!;
    expect(g.rivenStats.recoil).toBeLessThan(0);
    expect(g.rivenStats.ammoMax).toBeLessThan(0);
  });
});
