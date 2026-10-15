import { describe, expect, it } from "vitest";
import { incarnonDataMap } from "@/data/incarnon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";

// Per-variant values hand-read from each wiki "<Weapon> Incarnon Genesis" evolution table.
// Conditional bonuses follow the existing convention (assumed active, max stacks).
function evoStat(genesis: string, weaponId: string, name: string, stat: string): number | undefined {
  const data = incarnonDataMap.get(genesis) ?? incarnonDataMap.get(weaponId);
  const evo = data!.evolutions.find((e) => e.name === name)!;
  return mergeIncarnonStatChanges(data, { [evo.tier]: evo.slot }, weaponId)?.[stat];
}

describe("Incarnon per-variant values (wiki)", () => {
  const cases: [string, string, string, string, number][] = [
    ["braton", "braton", "Prelude of Might", "preludeMightBaseCm", 3.4],
    ["braton", "mk1_braton", "Prelude of Might", "preludeMightBaseCm", 3.3],
    ["braton", "braton_vandal", "Prelude of Might", "preludeMightBaseCm", 3.0],
    ["braton", "braton_prime", "Prelude of Might", "preludeMightBaseCm", 3.0],
    ["bronco", "bronco_prime", "Infused Shots", "flatBaseDamage", 16 + 9 * 4],
    ["dera", "dera_vandal", "Extended Volley", "flatMagazine", 30],
    ["destreza", "destreza_prime", "Critical Forte", "criticalMultiplier", 0.6],
    ["gorgon", "gorgon_wraith", "Hoplite Virtue", "flatBaseDamage", 5 + 8],
    ["lato", "lato_prime", "Haven Foray", "flatBaseDamage", 2 + 34],
    ["lato", "lato_vandal", "Reified Bane", "flatBaseDamage", 12 + 30],
    ["lato", "lato_prime", "Reified Bane", "flatBaseDamage", 2 + 24],
    ["lato", "lato_vandal", "Deathtrap Trigger", "criticalMultiplier", 2.6],
    ["lato", "lato_prime", "Deathtrap Trigger", "criticalChance", 0.3],
    ["okina", "okina_prime", "Synergist Surety", "statusDamageBonus", 0.06 * 5],
    ["paris", "mk1_paris", "Guardian's Might", "flatBaseDamage", 50 + 40],
    ["paris", "paris_prime", "Guardian's Might", "flatBaseDamage", 20 + 74],
    ["kunai", "kunai", "Sage's Resolve", "flatBaseDamage", 80],
    ["kunai", "mk1_kunai", "Sage's Resolve", "flatBaseDamage", 70],
    ["zylok", "zylok_prime", "Extended Volley", "flatMagazine", 18],
  ];
  for (const [g, id, name, stat, exp] of cases) {
    it(`${id} ${name} ${stat} = ${exp}`, () => {
      expect(evoStat(g, id, name, stat)).toBeCloseTo(exp, 6);
    });
  }
});
