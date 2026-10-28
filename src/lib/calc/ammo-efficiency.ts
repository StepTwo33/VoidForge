/**
 * Ammo Efficiency (AE) and Infinite Ammo.
 *
 * Update 44.1.3 / Hotfix 44.1.3 capped Ammo Efficiency at 75% (1 in 4 shots still
 * consumes ammo) and rephrased every source that used to grant "100% Ammo
 * Efficiency" as Infinite Ammo (Void Relic cracking buffs, Arcane Pistoleer,
 * Brain Storm, Skull Shots, Reaper's Plenty, Chamber Cascade, Death Knell, …).
 * Infinite Ammo is NOT part of the AE stat, so the 75% cap must not swallow it:
 * it is modelled separately as an expected uptime fraction.
 */

/** DE hard cap on the Ammo Efficiency stat (Hotfix 44.1.3). */
export const MAX_AMMO_EFFICIENCY = 0.75;

/**
 * Paper assumption for chance-based Infinite Ammo triggers: one qualifying event
 * (weak-point hit / weak-point kill) per second while the trigger toggle is on.
 */
export const INFINITE_AMMO_TRIGGER_EVENTS_PER_SECOND = 1;

const clamp01 = (n: number): number => (Number.isFinite(n) ? Math.min(Math.max(n, 0), 1) : 0);

/** Brain Storm / Skull Shots catalog chance step per rank (+10%, +20%, +30%, +40%). */
export const INFINITE_AMMO_CHANCE_PER_RANK = 0.1;

/** Wiki rank tables: Brain Storm / Skull Shots duration (s) at rank 0…3. */
export const INFINITE_AMMO_MOD_DURATION_BY_RANK: Record<string, readonly number[]> = {
  brain_storm: [0.5, 1, 2, 2],
  skull_shots: [0.5, 1, 2, 2],
};

/**
 * Expected fraction of time Infinite Ammo is active for a chance-based trigger:
 * `chance` per qualifying event, each success lasting `durationS` (refreshable),
 * with events arriving at `INFINITE_AMMO_TRIGGER_EVENTS_PER_SECOND`. The buff is
 * up if at least one success landed in the last `durationS` seconds:
 * 1 − (1 − chance)^(events in the window), floored at one event per window.
 */
export function infiniteAmmoUptimeFromChance(
  chance: number,
  durationS: number,
  eventsPerSecond: number = INFINITE_AMMO_TRIGGER_EVENTS_PER_SECOND,
): number {
  const p = clamp01(chance);
  if (p <= 0 || !(durationS > 0)) return 0;
  const events = Math.max(1, durationS * Math.max(eventsPerSecond, 0));
  return clamp01(1 - Math.pow(1 - p, events));
}

/** Independent Infinite Ammo sources: P(at least one active). */
export function combineInfiniteAmmoUptime(a: number | undefined, b: number | undefined): number {
  return clamp01(1 - (1 - clamp01(a ?? 0)) * (1 - clamp01(b ?? 0)));
}

/** Fraction of shots that still consume ammo: (1 − min(AE, 75%)) × (1 − Infinite Ammo uptime). */
export function ammoConsumptionFactor(ammoEfficiency: number | undefined, infiniteAmmoUptime?: number): number {
  const ae = Math.min(Math.max(ammoEfficiency ?? 0, 0), MAX_AMMO_EFFICIENCY);
  return (1 - ae) * (1 - clamp01(infiniteAmmoUptime ?? 0));
}

/** Effective Ammo Efficiency including Infinite Ammo uptime (0…1; 1 = never consumes). */
export function effectiveAmmoEfficiency(ammoEfficiency: number | undefined, infiniteAmmoUptime?: number): number {
  return 1 - ammoConsumptionFactor(ammoEfficiency, infiniteAmmoUptime);
}

/** True when no ammo is ever consumed (permanent Infinite Ammo). */
export function neverConsumesAmmo(infiniteAmmoUptime: number | undefined): boolean {
  return clamp01(infiniteAmmoUptime ?? 0) >= 1 - 1e-9;
}
