import type { SimulationParams } from "@/lib/types";

export type GalvCritStatus =
  | { active: false; reason: "aim" | "weakPoint" }
  | { active: true; bonus: number; stacks: number; baseOn: boolean };

/**
 * Sidebar text for Galvanized Scope / Crosshairs. Mirrors calculator.ts: the buff needs aiming
 * (the Aiming switch or the legacy "other buffs" switch); the base crit needs a headshot or weak
 * point hit; weak-point kill stacks (max 5) apply while aiming even on a body shot.
 */
export function galvCritStatus(
  sim: Pick<SimulationParams, "applyAiming" | "applyTriggerBuffs" | "applyHeadshots" | "applyWeakPoints">,
  base: number,
  perStack: number,
  killStacks: number,
): GalvCritStatus {
  const aiming = !!(sim.applyAiming || sim.applyTriggerBuffs);
  if (!aiming) return { active: false, reason: "aim" };
  const stacks = Math.min(Math.max(0, Math.floor(killStacks)), 5);
  const baseOn = !!(sim.applyHeadshots || sim.applyWeakPoints);
  const bonus = (baseOn ? base : 0) + perStack * stacks;
  if (bonus <= 0) return { active: false, reason: "weakPoint" };
  return { active: true, bonus, stacks, baseOn };
}
