/**
 * Effective fire rate by trigger type (wiki Fire Rate / Damage/Calculation).
 *
 * Standard auto/semi: EffectiveFR = ModdedFireRate
 * Charge:             1 / (ModdedChargeTime + 1/ModdedFireRate)
 * Bow:                1 / (ModdedChargeTime + ModdedReload)
 * Lanka:              1 / ModdedChargeTime
 * Burst:              BurstCount / (1/ModdedFR + (BurstCount−1)×BurstDelay/(1+max(0,b)))
 *
 * Fire-rate % mods: ChargeTime /= (1+b), FireRate ×= (1+b), cap charge slow at 10× base CT.
 */

export type ChargeMode = "standard" | "bow" | "lanka";

export interface FireTimingInput {
  triggerType: string;
  /** Arsenal / base fire rate (unmodded). */
  baseFireRate: number;
  /** Already-modded fire rate (= base × (1+bonus)), used when no special timing. */
  moddedFireRate: number;
  /** Sum of fire-rate bonuses as fraction (0.9 = +90%). */
  fireRateBonus: number;
  /** Already-modded reload time (seconds). */
  reloadTime: number;
  /** Base (unmodded) charge time in seconds, if known. */
  chargeTime?: number;
  chargeMode?: ChargeMode;
  burstCount?: number;
  /** Inter-shot delay inside a burst (seconds), unmodded. */
  burstDelay?: number;
  weaponId?: string;
}

/** Cap: charge time cannot exceed 10× base (from ≤ −90% fire rate). */
export function moddedChargeTime(baseChargeTime: number, fireRateBonus: number): number {
  if (baseChargeTime <= 0) return 0;
  const mult = 1 + fireRateBonus;
  if (mult <= 0.1) return baseChargeTime * 10;
  return baseChargeTime / mult;
}

export function isBowLike(triggerType: string, chargeMode?: ChargeMode): boolean {
  if (chargeMode === "bow") return true;
  const t = triggerType.toLowerCase();
  return t === "bow" || t.includes("bow");
}

export function isChargeTrigger(triggerType: string): boolean {
  const t = triggerType.toLowerCase();
  return t === "charge" || t.includes("charge");
}

export function isBurstTrigger(triggerType: string): boolean {
  const t = triggerType.toLowerCase();
  return t === "burst" || t.startsWith("burst");
}

/**
 * Resolve the true shots-per-second used for DPS / TTK.
 * Falls back to moddedFireRate when timing data is incomplete.
 */
export function resolveEffectiveFireRate(input: FireTimingInput): number {
  const {
    triggerType,
    baseFireRate,
    moddedFireRate,
    fireRateBonus,
    reloadTime,
    chargeTime,
    chargeMode,
    burstCount,
    burstDelay,
    weaponId,
  } = input;

  const bonus = fireRateBonus;
  const mode =
    chargeMode ??
    (weaponId === "lanka" ? "lanka" : isBowLike(triggerType) ? "bow" : "standard");

  // —— Charge family ——
  if (chargeTime != null && chargeTime > 0 && (isChargeTrigger(triggerType) || mode === "bow" || mode === "lanka" || weaponId === "lanka")) {
    const ct = moddedChargeTime(chargeTime, bonus);
    if (mode === "lanka" || (baseFireRate <= 0 && mode !== "bow")) {
      return ct > 0 ? 1 / ct : 0;
    }
    if (mode === "bow" || isBowLike(triggerType)) {
      const cycle = ct + Math.max(0, reloadTime);
      return cycle > 0 ? 1 / cycle : 0;
    }
    // standard charge: CT + 1/FR
    const fr = Math.max(0, baseFireRate) * Math.max(0.01, 1 + bonus);
    if (fr <= 0) return ct > 0 ? 1 / ct : 0;
    return 1 / (ct + 1 / fr);
  }

  // —— Burst ——
  if (burstCount != null && burstCount > 1 && isBurstTrigger(triggerType)) {
    const fr = Math.max(1e-6, moddedFireRate);
    // Wiki Fire Rate (both wikis): the Fire Rate bonus "affects both the speed of the burst
    // as well as the time between bursts", but "Burst Delay is not affected by net negative
    // Fire Rate bonuses" — so only a net positive bonus shortens the in-burst delay.
    const delay = Math.max(0, burstDelay ?? 0) / (1 + Math.max(0, bonus));
    const burstDuration = 1 / fr + (burstCount - 1) * delay;
    return burstDuration > 0 ? burstCount / burstDuration : moddedFireRate;
  }

  // —— Auto / Semi / Held / Melee ——
  return Math.max(0, moddedFireRate);
}
