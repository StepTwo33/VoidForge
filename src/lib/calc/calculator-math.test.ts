import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import {
  calculateWeaponBuild,
  quantizeDamageValue,
} from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

describe("multishot formula", () => {
  it("multiplies base multishot by (1 + multishot mods) for shotguns", () => {
    const strun = allWeapons.find((w) => w.id === "strun")!;
    const hells = allMods.find((m) => m.id === "hells_chamber")!;
    expect(strun.multishot).toBeGreaterThan(1);

    const stats = calculateWeaponBuild(
      strun,
      [{ modId: hells.id, rank: hells.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    // Hell's Chamber max: +120% → base × 2.2
    const expected = strun.multishot * (1 + 1.2);
    expect(stats.multishot).toBeCloseTo(expected, 5);
  });

  it("still works for rifles with base multishot 1", () => {
    const braton = allWeapons.find((w) => w.id === "braton" || w.name === "Braton");
    const split = allMods.find((m) => m.id === "split_chamber_r3" || m.id === "split_chamber");
    if (!braton || !split) return;

    const stats = calculateWeaponBuild(
      braton,
      [{ modId: split.id, rank: split.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    // Split Chamber max: +90%
    expect(stats.multishot).toBeCloseTo(braton.multishot * 1.9, 5);
  });
});

describe("damage quantization", () => {
  it("rounds to nearest 1/32 of scale base", () => {
    // scale = 100/32 = 3.125; 30 → 31.25 (wiki Impact example)
    const scale = 100 / 32;
    expect(quantizeDamageValue(30, scale)).toBeCloseTo(31.25, 10);
    expect(quantizeDamageValue(40, scale)).toBeCloseTo(40.625, 10);
  });

  it("can zero out very small IPS portions", () => {
    // Galatine-like: tiny impact relative to base can quantize to 0
    const base = 100;
    const scale = base / 32;
    const tinyImpact = base * 0.01; // 1.0 → rounds toward 0 or 3.125
    const q = quantizeDamageValue(tinyImpact, scale);
    // 1/3.125 = 0.32 → rounds to 0
    expect(q).toBe(0);
  });

  it("applies quantization in calculateWeaponBuild totals", () => {
    const weapon = allWeapons.find((w) => w.id === "braton" || w.name === "Braton");
    if (!weapon) return;
    const stats = calculateWeaponBuild(weapon, [], modsMap());
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage, 5);
    // Quantized IPS should sum (near) totalDamage
    const sum =
      stats.impact +
      stats.puncture +
      stats.slash +
      stats.elements.reduce((s, e) => s + e.value, 0);
    expect(stats.totalDamage).toBeCloseTo(sum, 8);
  });
});

describe("status DoT base", () => {
  it("uses modded base damage (not full elemental total) for slash ticks", () => {
    const weapon = allWeapons.find((w) => w.slash > 0 && w.category !== "melee");
    if (!weapon) return;
    const heatMod = allMods.find(
      (m) => m.stats.heat != null && (m.category === "primary" || m.category === "rifle"),
    );
    const dmgMod = allMods.find(
      (m) => m.id === "serration" || m.id === "serration_r3" || (m.stats.damage && m.category === "rifle"),
    );

    const slots = [];
    if (dmgMod) slots.push({ modId: dmgMod.id, rank: dmgMod.maxRank, slotIndex: 0 });
    if (heatMod) slots.push({ modId: heatMod.id, rank: heatMod.maxRank, slotIndex: 1 });

    const stats = calculateWeaponBuild(weapon, slots, modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
    });
    const slashProc = stats.statusProcs.find((p) => p.type === "slash");
    if (!slashProc || !stats.moddedBaseDamage) return;

    // Slash tick = 0.35 × moddedBase × multishot × avgCrit (no type bonus)
    // With no crit and MS=1: ~0.35 * moddedBase
    if (stats.criticalChance <= 0 && stats.multishot <= 1.0001) {
      expect(slashProc.damagePerTick).toBeCloseTo(stats.moddedBaseDamage * 0.35, 3);
    } else {
      // At least DoT should not use full totalDamage when elementals are present
      if (stats.elements.length > 0 && stats.totalDamage > stats.moddedBaseDamage * 1.1) {
        expect(slashProc.damagePerTick).toBeLessThan(stats.totalDamage * 0.35 * stats.multishot * 3);
      }
    }
  });

  it("includes electricity as a DoT type", () => {
    const weapon = allWeapons.find((w) => w.id === "braton" || w.name === "Braton");
    const storm = allMods.find(
      (m) =>
        m.id === "stormbringer" ||
        m.id === "stormbringer_r3" ||
        (m.stats.electricity != null && (m.category === "primary" || m.category === "rifle")),
    );
    if (!weapon || !storm) return;

    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: storm.id, rank: storm.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    const elec = stats.statusProcs.find((p) => p.type === "electricity");
    expect(elec).toBeDefined();
    expect(elec!.damagePerTick).toBeGreaterThan(0);
    expect(elec!.ticks).toBe(6); // wiki: 0…5s, last tick at 6s deals nothing
  });
});
