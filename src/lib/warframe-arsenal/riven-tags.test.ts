import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { RIVEN_TAG_TO_STAT, resolveRivenUpgrade } from "@/lib/warframe-arsenal/riven-resolve";
import { getRivenStatsForCategory } from "@/lib/types";

describe("riven tag mapping", () => {
  it("user's spliced 'Sobek Caliata': +97.6% Gas, +164.7% Damage, +35.1% recoil → no unmapped tags", () => {
    const r = resolveRivenUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/LotusShotgunRandomModRare",
      rank: 8,
      buffs: [
        { tag: "WeaponGasDamageMod", val: 0.976 },
        { tag: "WeaponDamageAmountMod", val: 1.647 },
      ],
      curses: [{ tag: "WeaponRecoilReductionMod", val: 0.351 }],
    })!;
    expect(r.unmappedTags).toEqual([]);
    expect(r.modId).toBe("riven_shotgun");
    expect(r.rivenStats.gas).toBeCloseTo(0.976, 9);
    expect(r.rivenStats.damage).toBeCloseTo(1.647, 9);
    expect(r.rivenStats.recoil).toBeCloseTo(0.351, 9); // -(-0.351): curse on a flipped tag = more recoil
  });

  it("every mapped key is a stat the riven calculator knows", () => {
    const known = new Set(
      ["rifle", "shotgun", "pistol", "melee", "archgun"].flatMap((c) => getRivenStatsForCategory(c).map((d) => d.key)),
    );
    // factionMurmur: pre-existing legacy alias (no current DE riven tag, no riven-calculator stat).
    for (const key of new Set(Object.values(RIVEN_TAG_TO_STAT))) if (key !== "factionMurmur") expect(known.has(key), key).toBe(true);
  });

  it("covers every riven upgradeEntries tag in @wfcd/items", () => {
    const data = JSON.parse(readFileSync(join(process.cwd(), "node_modules/@wfcd/items/data/json/Mods.json"), "utf8")) as Array<{
      upgradeEntries?: Array<{ tag: string }>;
    }>;
    const tags = new Set(data.flatMap((m) => (m.upgradeEntries ?? []).map((e) => e.tag)));
    const missing = [...tags].filter((t) => !RIVEN_TAG_TO_STAT[t] && !t.startsWith("Innate")).sort();
    expect(missing).toEqual([]);
  });

  it("melee slide crit / combo count rivens map; curse-only Chance to Gain Combo Count is negative either way DE signs it", () => {
    for (const curseVal of [0.612, -0.612]) {
      const r = resolveRivenUpgrade({
        uniqueName: "/Lotus/Upgrades/Mods/Randomized/PlayerMeleeWeaponRandomModRare",
        rank: 8,
        buffs: [
          { tag: "SlideAttackCritChanceMod", val: 1.32 },
          { tag: "WeaponMeleeComboBonusOnHitMod", val: 0.647 },
        ],
        curses: [{ tag: "WeaponMeleeComboPointsOnHitMod", val: curseVal }],
      })!;
      expect(r.unmappedTags).toEqual([]);
      expect(r.rivenStats.slideAttackCritChance).toBeCloseTo(1.32, 9);
      expect(r.rivenStats.comboCountChance).toBeCloseTo(0.647, 9);
      expect(r.rivenStats.comboGainChance).toBeCloseTo(-0.612, 9);
    }
  });
});
