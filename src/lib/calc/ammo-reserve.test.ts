/**
 * R14-7 ammo reserve. Hand-worked against wiki Ammo / Ammo Maximum:
 * reserve = base AmmoMax × (1 + Ammo Maximum mods + riven), magazine not included,
 * no ammo pickups modelled.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import type { EnemyType } from "@/data/enemies";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { runDamageSim, type DamageSimInputs } from "@/lib/calc/damage-sim";
import {
  ammoMaxModBonus,
  baseAmmoMaxForWeapon,
  moddedAmmoReserve,
  timeToEmptyAmmo,
} from "@/lib/calc/ammo-reserve";
import { WEAPON_BASE_AMMO_MAX } from "@/data/weapon-ammo-max";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));
const weapon = (id: string) => {
  const w = allWeapons.find((x) => x.id === id);
  if (!w) throw new Error(id);
  return w;
};
const slot = (modId: string, rank: number, slotIndex = 0) => ({ modId, rank, slotIndex });

describe("base Ammo Maximum data (wiki Module:Weapons/data AmmoMax)", () => {
  it("matches wiki.warframe.com spot checks", () => {
    expect(WEAPON_BASE_AMMO_MAX.braton).toBe(540);
    expect(WEAPON_BASE_AMMO_MAX.braton_prime).toBe(600);
    expect(WEAPON_BASE_AMMO_MAX.braton_vandal).toBe(550);
    expect(WEAPON_BASE_AMMO_MAX.kuva_tonkor).toBe(30);
    expect(WEAPON_BASE_AMMO_MAX.kuva_ogris).toBe(7);
    expect(WEAPON_BASE_AMMO_MAX.kuva_zarr).toBe(5);
    expect(WEAPON_BASE_AMMO_MAX.lex).toBe(210);
  });
  it("R29: recent weapons now carry their wiki AmmoMax (page-verified)", () => {
    const wiki: Record<string, number> = {
      nunchasa: 50, enkaus: 60, steflos_prime: 36, aksondol: 210, athodai_prime: 72, afentis_prime: 12,
      perigale_prime: 32, daikyu_prime: 72, tenet_quanta: 540, reconifex: 1000, zymos: 51, scyotid: 320,
    };
    for (const [id, n] of Object.entries(wiki)) expect(WEAPON_BASE_AMMO_MAX[id], id).toBe(n);
    // Ammo Drum R5 (+90%): Tenet Quanta 540 -> 1026, Afentis Prime 12 -> 22 (rounded)
    expect(calculateWeaponBuild(weapon("tenet_quanta"), [slot("ammo_drum", 5)], modsMap()).ammoMax).toBe(1026);
  });
  it("battery weapons (AmmoMax 0) have no reserve", () => {
    expect(baseAmmoMaxForWeapon("fulmin")).toBeUndefined();
    expect(baseAmmoMaxForWeapon("artemis_bow")).toBeUndefined();
  });
  it("every entry is a known gun id", () => {
    const ids = new Set([...allWeapons, ...customWeapons].map((w) => w.id));
    for (const id of Object.keys(WEAPON_BASE_AMMO_MAX)) expect(ids.has(id), id).toBe(true);
  });
});

describe("modded reserve", () => {
  it("Ammo Drum R5 = +90%: Braton 540 → 1026", () => {
    expect(ammoMaxModBonus([slot("ammo_drum", 5)], modsMap())).toBeCloseTo(0.9, 9);
    const s = calculateWeaponBuild(weapon("braton"), [slot("ammo_drum", 5)], modsMap());
    expect(s.ammoMax).toBe(1026);
    expect(s.ammoReserveModelled).toBe(true);
  });
  it("riven Ammo Maximum adds into the same pool: 540 × (1 + 0.9 + 0.5) = 1296", () => {
    expect(
      moddedAmmoReserve({
        weaponId: "braton",
        equippedMods: [slot("ammo_drum", 5)],
        allMods: modsMap(),
        rivenStatChanges: { ammoMax: 0.5 },
      }),
    ).toBe(1296);
  });
  it("Trick Mag R5 on Lex: 210 × 1.9 = 399; Shell Compression R5 on Hek: 120 × 1.9 = 228", () => {
    expect(calculateWeaponBuild(weapon("lex"), [slot("trick_mag_r3", 5)], modsMap()).ammoMax).toBe(399);
    expect(calculateWeaponBuild(weapon("hek"), [slot("shell_compression", 5)], modsMap()).ammoMax).toBe(228);
  });
  it("incarnon base set / flat apply before mods", () => {
    expect(
      moddedAmmoReserve({
        weaponId: "atomos",
        equippedMods: [slot("trick_mag_r3", 5)],
        allMods: modsMap(),
        incarnonStatChanges: { ammoMaxSet: 560 },
      }),
    ).toBe(1064);
    expect(
      moddedAmmoReserve({
        weaponId: "angstrum",
        equippedMods: [],
        allMods: modsMap(),
        incarnonStatChanges: { flatAmmoMax: 9 },
      }),
    ).toBe(27);
  });
  it("Ammo Mutation mods do not change the reserve (pickups not modelled)", () => {
    const s = calculateWeaponBuild(weapon("braton"), [slot("rifle_ammo_mutation", 5)], modsMap());
    expect(s.ammoMax).toBe(540);
  });
  it("Incarnon Form fires from its own charges: no reserve", () => {
    const s = calculateWeaponBuild(weapon("braton"), [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    } as never);
    expect(s.ammoReserveModelled).toBeUndefined();
  });
  it("time to empty: mag 10 + reserve 20 at 1/s, reload 2 → 3 mags × 10 s + 2 reloads × 2 s = 34 s", () => {
    expect(timeToEmptyAmmo({ magazine: 10, reserve: 20, fireRate: 1, reloadTime: 2 })).toBeCloseTo(34, 9);
  });
});

describe("discrete sim runs dry", () => {
  const dummy = (hp: number): EnemyType => ({
    id: "r14b_dummy",
    name: "Dummy",
    faction: "Tenno",
    baseHealth: hp,
    baseArmor: 0,
    baseShield: 0,
    healthType: "flesh",
    armorType: "none",
    shieldType: "none",
  });
  const input = (ammoMax?: number, ammoEfficiency = 0): DamageSimInputs => ({
    dmgTypes: { impact: 10 },
    fireRate: 1,
    critChance: 0,
    critMulti: 1,
    multishot: 1,
    statusChance: 0,
    magazine: 10,
    reloadTime: 1,
    statusDamageBonus: 0,
    headshotDamageBonus: 0,
    factionBonuses: {},
    applyHeadshots: false,
    ammoMax,
    ammoEfficiency,
  });

  it("25-shot kill fits in 10 + 20 rounds: TTK identical to unlimited ammo", () => {
    const limited = runDamageSim(input(20), dummy(250), 1)!;
    const unlimited = runDamageSim(input(undefined), dummy(250), 1)!;
    expect(limited.shotsToKill).toBe(25);
    expect(limited.ttk).toBe(unlimited.ttk);
    expect(limited.outOfAmmo).toBe(false);
    expect(limited.ammoShotBudget).toBe(30);
  });
  it("40-shot kill with 30 rounds: out of ammo, no kill", () => {
    const r = runDamageSim(input(20), dummy(400), 1)!;
    expect(r.outOfAmmo).toBe(true);
    expect(r.ttk).toBe(Infinity);
    expect(r.shotsToKill).toBe(Infinity);
    expect(runDamageSim(input(undefined), dummy(400), 1)!.shotsToKill).toBe(40);
  });
  it("Ammo Efficiency 50% doubles the budget: 30 / 0.5 = 60 shots → the 40-shot kill lands", () => {
    const r = runDamageSim(input(20, 0.5), dummy(400), 1)!;
    expect(r.ammoShotBudget).toBe(60);
    expect(r.outOfAmmo).toBe(false);
    expect(r.shotsToKill).toBe(40);
  });
  it("Reserve 0 means unlimited (hand-entered default)", () => {
    const r = runDamageSim(input(0), dummy(400), 1)!;
    expect(r.ammoShotBudget).toBe(Infinity);
    expect(r.shotsToKill).toBe(40);
  });
});
