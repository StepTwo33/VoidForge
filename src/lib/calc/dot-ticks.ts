/**
 * Status DoT tick timing (wiki Damage over Time / Status Effect; fandom Slash Damage).
 *
 * Total Ticks = ⌊TickRate × (Duration − Delay)⌋ + 1, one tick per second.
 * - Slash / Heat / Toxin: 1s delay, then a tick every second → ticks at 1…6s (6 ticks).
 * - Electricity / Gas: tick on application, then every second; the tick at the end
 *   of the duration deals nothing → ticks at 0…5s (6 ticks).
 * Status Duration scales the duration (e.g. +100% → 12s → 12 ticks).
 */
export const DOT_BASE_DURATION = 6;

const IMMEDIATE_DOT_TYPES = new Set(["electricity", "gas"]);

/** Seconds from proc to first damage tick. */
export function dotFirstTickDelay(type: string): number {
  return IMMEDIATE_DOT_TYPES.has(type) ? 0 : 1;
}

/** Damage ticks dealt by one proc lasting `duration` seconds. */
export function dotTickCount(type: string, duration: number = DOT_BASE_DURATION): number {
  if (!(duration > 0)) return 0;
  if (IMMEDIATE_DOT_TYPES.has(type)) {
    // Ticks at 0,1,… strictly before the duration ends.
    return Math.max(1, Math.ceil(duration - 1e-9));
  }
  // Ticks at 1,2,… up to and including the duration.
  return Math.floor(duration + 1e-9);
}
