/**
 * Ammo reserve (wiki Ammo / Ammo Maximum).
 *
 * - Ammo Maximum is the carried reserve and does not include the magazine.
 * - Ammo Maximum mods (Ammo Drum, Trick Mag, Shell Compression, ...) and a riven's
 *   Ammo Maximum roll add into one pool: reserve = base × (1 + mods + riven).
 * - Incarnon "Increase Base Ammo Capacity to X / by +X" changes the base before mods.
 * - Ammo Mutation mods only convert ammo pickups; pickups are not modelled, so they
 *   do not change the reserve here.
 */
import { WEAPON_BASE_AMMO_MAX } from "@/data/weapon-ammo-max";
import type { Mod, ModSlot } from "@/lib/types";
import { MAX_AMMO_EFFICIENCY, ammoConsumptionFactor, neverConsumesAmmo } from "@/lib/calc/ammo-efficiency";

export function baseAmmoMaxForWeapon(weaponId: string): number | undefined {
  const v = WEAPON_BASE_AMMO_MAX[weaponId];
  return v != null && v > 0 ? v : undefined;
}

/** Summed Ammo Maximum bonus from equipped mods (fraction; Ammo Drum R5 = 0.9). */
export function ammoMaxModBonus(equippedMods: ModSlot[], allMods: Map<string, Mod>): number {
  let bonus = 0;
  for (const slot of equippedMods) {
    const mod = allMods.get(slot.modId);
    const per = mod?.stats?.ammoMaximum;
    if (!mod || typeof per !== "number" || per === 0) continue;
    const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod.maxRank ?? 0);
    bonus += (per * (rank + 1)) / 100;
  }
  return bonus;
}

/**
 * Modded reserve, or undefined when the weapon has no modelled reserve
 * (battery / regenerating magazines, or no wiki AmmoMax for this weapon).
 */
export function moddedAmmoReserve(opts: {
  weaponId: string;
  equippedMods: ModSlot[];
  allMods: Map<string, Mod>;
  incarnonStatChanges?: Record<string, number>;
  rivenStatChanges?: Record<string, number>;
}): number | undefined {
  let base = baseAmmoMaxForWeapon(opts.weaponId);
  if (base == null) return undefined;
  const inc = opts.incarnonStatChanges;
  if (inc?.ammoMaxSet != null && inc.ammoMaxSet > 0) base = inc.ammoMaxSet;
  if (inc?.flatAmmoMax) base += inc.flatAmmoMax;
  const bonus =
    ammoMaxModBonus(opts.equippedMods, opts.allMods) + (opts.rivenStatChanges?.ammoMax ?? 0);
  return Math.max(0, Math.floor(base * Math.max(0, 1 + bonus) + 1e-9));
}

export { MAX_AMMO_EFFICIENCY };

/**
 * Seconds to empty magazine + reserve with no pickups (wiki Ammo Economy:
 * capacity / magazine × (reload + magazine / fire rate), with the starting magazine added).
 */
export function timeToEmptyAmmo(opts: {
  magazine: number;
  reserve: number;
  fireRate: number;
  reloadTime: number;
  ammoCost?: number;
  ammoEfficiency?: number;
  /** Expected Infinite Ammo uptime (0–1); 1 = never runs dry. */
  infiniteAmmoUptime?: number;
}): number {
  const { magazine, reserve, fireRate, reloadTime } = opts;
  if (!(magazine > 0) || !(fireRate > 0)) return Infinity;
  if (neverConsumesAmmo(opts.infiniteAmmoUptime)) return Infinity;
  const perShot =
    Math.max(0.01, opts.ammoCost ?? 1) * ammoConsumptionFactor(opts.ammoEfficiency, opts.infiniteAmmoUptime);
  const magTime = magazine / perShot / fireRate;
  const mags = (magazine + reserve) / magazine;
  const reloads = Math.max(0, Math.ceil(mags - 1e-9) - 1);
  return mags * magTime + reloads * Math.max(0, reloadTime);
}
