import type { Ability } from "@/lib/types";
import type { HelminthAbility } from "@/data/helminth";
import { getEffectiveWarframesMap } from "@/lib/weapons/effective-data";

const NUMERIC_KEYS = [
  "energyCost",
  "damage",
  "damageBuff",
  "damageReduction",
  "duration",
  "range",
  "radius",
  "castTime",
  "statusChance",
  "damageType",
] as const;

/**
 * Fill missing Helminth preview fields from the source warframe ability.
 * Existing Helminth values (often reduced vs native) always win.
 */
export function hydrateHelminthAbility(h: HelminthAbility): HelminthAbility {
  if (h.source === "helminth" || h.abilitySlot == null) return h;
  const wf = getEffectiveWarframesMap().get(h.source);
  const sourceAbility = wf?.abilities[h.abilitySlot - 1];
  if (!sourceAbility) return h;

  const out: HelminthAbility = { ...h };
  for (const key of NUMERIC_KEYS) {
    if (out[key] == null && sourceAbility[key as keyof Ability] != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[key] = sourceAbility[key as keyof Ability];
    }
  }
  if (!out.miscStats && sourceAbility.miscStats) {
    out.miscStats = { ...sourceAbility.miscStats };
  } else if (out.miscStats && sourceAbility.miscStats) {
    out.miscStats = { ...sourceAbility.miscStats, ...out.miscStats };
  }
  return out;
}

/** Convert a Helminth row into an Ability for calc / display paths. */
export function helminthToAbility(h: HelminthAbility): Ability {
  const hydrated = hydrateHelminthAbility(h);
  return {
    name: hydrated.name,
    energyCost: hydrated.energyCost,
    description: hydrated.description,
    damage: hydrated.damage,
    damageBuff: hydrated.damageBuff,
    damageReduction: hydrated.damageReduction,
    duration: hydrated.duration,
    range: hydrated.range,
    radius: hydrated.radius,
    castTime: hydrated.castTime,
    statusChance: hydrated.statusChance,
    damageType: hydrated.damageType,
    miscStats: hydrated.miscStats,
  };
}
