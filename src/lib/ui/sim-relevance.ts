import type { CalculatedStats, SimulationParams } from "@/lib/types";

/** Named sim switches shown in the sheet and the summary chips. */
export const SIM_EVENT_KEYS = [
  "applyAiming",
  "applyInvisible",
  "applyAbilityCast",
  "applyReload",
  "applyCrouch",
  "applyWallLatch",
  "applyAirborne",
  "applyAimGlide",
  "applyDistance",
  "applyTriggerBuffs",
] as const;

/** Stack sliders: [key, value used to test them]. */
const SIM_STACK_KEYS = [
  ["killStacks", 5],
  ["statusTypesOnTarget", 4],
  ["arcaneStacks", 12],
  ["comboCount", 220],
  ["clipDelegationShots", 15],
] as const;

export type SimRelevanceKey = (typeof SIM_EVENT_KEYS)[number] | (typeof SIM_STACK_KEYS)[number][0];

/** Every number the stats panel can show; simParams itself is left out (it always differs). */
function fingerprint(stats: CalculatedStats | null): string {
  if (!stats) return "";
  return JSON.stringify(stats, (k, v) => (k === "simParams" ? undefined : v));
}

/**
 * Which sim switches and sliders change any number for this build. Each one is flipped
 * (switch on/off, slider 0 vs its max) and the results compared, so a control is only
 * reported unused when flipping it changes nothing; nothing that moves a number is hidden.
 */
export function relevantSimKeys(
  sim: SimulationParams,
  compute: (sim: SimulationParams) => CalculatedStats | null,
): Set<SimRelevanceKey> {
  const out = new Set<SimRelevanceKey>();
  // Also test from an "everything on" state, so a control that only matters together with
  // another one (Galvanized kill stacks need Aiming) shows up before that other one is on.
  const allOn: SimulationParams = { ...sim, killStacksBySource: undefined, arcaneStacksById: undefined };
  for (const key of SIM_EVENT_KEYS) (allOn as unknown as Record<string, unknown>)[key] = true;
  for (const [key, max] of SIM_STACK_KEYS) (allOn as unknown as Record<string, unknown>)[key] = Math.max(max, Number(sim[key] ?? 0));
  for (const base of [sim, allOn]) {
    for (const key of SIM_EVENT_KEYS) {
      if (out.has(key)) continue;
      const on = compute({ ...base, [key]: true });
      const off = compute({ ...base, [key]: false });
      if (fingerprint(on) !== fingerprint(off)) out.add(key);
    }
    for (const [key, max] of SIM_STACK_KEYS) {
      if (out.has(key)) continue;
      const extra = key === "killStacks" ? { killStacksBySource: undefined } : key === "arcaneStacks" ? { arcaneStacksById: undefined } : {};
      const lo = compute({ ...base, ...extra, [key]: 0 });
      const hi = compute({ ...base, ...extra, [key]: Math.max(max, Number(sim[key] ?? 0)) });
      if (fingerprint(lo) !== fingerprint(hi)) out.add(key);
    }
  }
  return out;
}
