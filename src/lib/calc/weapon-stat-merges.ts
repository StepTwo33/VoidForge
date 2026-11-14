/**
 * Merge per-slot / per-evolution stat deltas for weapon builders.
 */

import type { IncarnonEvolution, IncarnonWeaponData } from "@/data/incarnon";
import {
  INCARNON_BASE_ONLY_PERKS,
  INCARNON_CONDITIONAL_PERKS,
  type IncarnonConditionalPerk,
} from "@/data/incarnon-conditionals";
import { isRivenModId } from "@/lib/weapons/riven-weapon-type";

export type MergeIncarnonOptions = {
  /** When true, also merge formStatChanges / variantFormStatChanges. */
  formActive?: boolean;
  /** When true, also merge chargeStatChanges (Onos charged blast, etc.). */
  chargeMode?: boolean;
  /**
   * Conditional perk toggles keyed by `incarnonConditionalKey` (round 47). A conditional perk's
   * conditional part only applies when its key is true; unset / false = condition not met.
   */
  conditionalsOn?: Record<string, boolean>;
};

/** Key for one evolution in INCARNON_CONDITIONAL_PERKS / INCARNON_BASE_ONLY_PERKS. */
export function incarnonConditionalKey(
  incarnonData: Pick<IncarnonWeaponData, "weaponId">,
  evo: Pick<IncarnonEvolution, "tier" | "name">,
): string {
  return `${incarnonData.weaponId}|${evo.tier}|${evo.name}`;
}

/** Conditional definition for an evolution, if its perk has an uptime condition we toggle. */
export function getIncarnonConditional(
  incarnonData: Pick<IncarnonWeaponData, "weaponId">,
  evo: Pick<IncarnonEvolution, "tier" | "name">,
): IncarnonConditionalPerk | undefined {
  return INCARNON_CONDITIONAL_PERKS[incarnonConditionalKey(incarnonData, evo)];
}

/** Selected evolutions whose perk has a conditional toggle (UI + saved-build pruning). */
export function selectedIncarnonConditionals(
  incarnonData: IncarnonWeaponData | undefined,
  selectedEvolutions: Record<number, number>,
): { key: string; evo: IncarnonEvolution; cond: IncarnonConditionalPerk }[] {
  if (!incarnonData) return [];
  const out: { key: string; evo: IncarnonEvolution; cond: IncarnonConditionalPerk }[] = [];
  for (const [tierStr, slot] of Object.entries(selectedEvolutions)) {
    const evo = incarnonData.evolutions.find((e) => e.tier === Number(tierStr) && e.slot === slot);
    if (!evo) continue;
    const cond = getIncarnonConditional(incarnonData, evo);
    if (cond) out.push({ key: incarnonConditionalKey(incarnonData, evo), evo, cond });
  }
  return out.sort((a, b) => a.evo.tier - b.evo.tier);
}

/** Every conditional perk of this weapon switched on (tests / "assume max uptime" probes). */
export function allIncarnonConditionalsOn(
  incarnonData: IncarnonWeaponData | undefined,
): Record<string, boolean> {
  const on: Record<string, boolean> = {};
  for (const evo of incarnonData?.evolutions ?? []) {
    if (getIncarnonConditional(incarnonData!, evo)) on[incarnonConditionalKey(incarnonData!, evo)] = true;
  }
  return on;
}

/** Normal-form stat changes for one evolution after the conditional / base-only rules. */
function resolveEvolutionChanges(
  incarnonData: IncarnonWeaponData,
  evo: IncarnonEvolution,
  weaponId: string | undefined,
  formActive: boolean,
  conditionalsOn: Record<string, boolean> | undefined,
): { changes: Record<string, number>; condOff: IncarnonConditionalPerk | undefined } | null {
  const key = incarnonConditionalKey(incarnonData, evo);
  const baseOnly = INCARNON_BASE_ONLY_PERKS[key];
  // wiki Notes: "does not affect the Incarnon Form" → the whole perk is skipped in form.
  if (formActive && baseOnly === "all") return null;
  const changes = { ...(evo.variantStatChanges?.[weaponId ?? ""] ?? evo.statChanges) };
  const cond = INCARNON_CONDITIONAL_PERKS[key];
  const condMet =
    conditionalsOn?.[key] === true && !(formActive && baseOnly === "conditional");
  const condOff = cond && !condMet ? cond : undefined;
  if (condOff) {
    for (const k of condOff.keys) delete changes[k];
    if (condOff.keepFlatBaseDamage != null) {
      const keep = condOff.variantKeepFlatBaseDamage?.[weaponId ?? ""] ?? condOff.keepFlatBaseDamage;
      if (keep > 0) changes.flatBaseDamage = keep;
      else delete changes.flatBaseDamage;
    }
  }
  if (formActive && Array.isArray(baseOnly)) {
    for (const k of baseOnly) delete changes[k];
  }
  return { changes, condOff };
}

/** Sum selected Incarnon evolution stat changes (variant-aware). */
export function mergeIncarnonStatChanges(
  incarnonData: IncarnonWeaponData | undefined,
  selectedEvolutions: Record<number, number>,
  weaponId: string | undefined,
  options?: MergeIncarnonOptions,
): Record<string, number> | undefined {
  if (!incarnonData || Object.keys(selectedEvolutions).length === 0) return undefined;
  const merged: Record<string, number> = {};
  const formActive = options?.formActive === true;
  const chargeMode = options?.chargeMode === true;
  for (const [tierStr, slot] of Object.entries(selectedEvolutions)) {
    const tier = Number(tierStr);
    const evo = incarnonData.evolutions.find((e) => e.tier === tier && e.slot === slot);
    if (!evo) continue;
    const resolved = resolveEvolutionChanges(
      incarnonData,
      evo,
      weaponId,
      formActive,
      options?.conditionalsOn,
    );
    if (!resolved) continue;
    for (const [stat, val] of Object.entries(resolved.changes)) {
      merged[stat] = (merged[stat] ?? 0) + val;
    }
    if (formActive) {
      const formChanges =
        evo.variantFormStatChanges?.[weaponId ?? ""] ?? evo.formStatChanges;
      if (formChanges) {
        for (const [stat, val] of Object.entries(formChanges)) {
          if (resolved.condOff?.formKeys?.includes(stat)) continue;
          merged[stat] = (merged[stat] ?? 0) + val;
        }
      }
    }
    if (chargeMode && evo.chargeStatChanges) {
      for (const [stat, val] of Object.entries(evo.chargeStatChanges)) {
        merged[stat] = (merged[stat] ?? 0) + val;
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * Sum riven stats from slots that currently have a riven equipped.
 * Calculator adds % stats (damage, crit, status, fire rate, multishot, magazine,
 * reload, IPS) into the same pools as normal mods, and riven elements enter the
 * combine order at the riven's slot (wiki Critical Hit / Riven Mods).
 */
export function mergeRivenStatChanges(
  rivenStatsMap: Record<number, Record<string, number>> | undefined,
  equippedMods: { slotIndex: number; modId: string }[],
): Record<string, number> | undefined {
  if (!rivenStatsMap) return undefined;
  const merged: Record<string, number> = {};
  for (const [slotStr, stats] of Object.entries(rivenStatsMap)) {
    const slotIdx = Number(slotStr);
    const equipped = equippedMods.find((m) => m.slotIndex === slotIdx);
    if (equipped && isRivenModId(equipped.modId)) {
      for (const [k, v] of Object.entries(stats)) {
        merged[k] = (merged[k] ?? 0) + v;
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}
