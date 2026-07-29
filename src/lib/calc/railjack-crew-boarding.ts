/**
 * Boarding paper DPS for Railjack crew weapon loadouts.
 */

import type { Mod, Weapon } from "@/lib/types";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import {
  COMBAT_DAMAGE_BONUS,
  clampCompetencyRank,
  resolveCrewCompetency,
  type RailjackCrewSlot,
} from "@/data/railjack-crew";
import { clampProgenitorBonusPercent } from "@/data/railjack-crew-weapons";
import { weaponSupportsProgenitor } from "@/lib/weapons/weapon-progenitor";

export interface CrewBoardingDpsResult {
  weaponId: string;
  baseDps: number;
  boardingDps: number;
  combatDamageBonus: number;
}

export function computeCrewBoardingDps(
  slot: RailjackCrewSlot,
  weapon: Weapon,
  allMods: Map<string, Mod>,
): CrewBoardingDpsResult | null {
  const loadout = slot.weaponLoadout;
  if (!loadout?.weaponId || loadout.weaponId !== weapon.id) return null;

  const supportsProg = weaponSupportsProgenitor(weapon);
  const calcOptions =
    supportsProg && loadout.progenitorElement
      ? {
          progenitorElement: loadout.progenitorElement,
          progenitorBonusPercent: clampProgenitorBonusPercent(loadout.progenitorBonusPercent),
        }
      : undefined;

  const stats = calculateWeaponBuild(
    weapon,
    loadout.mods ?? [],
    allMods,
    undefined,
    undefined,
    calcOptions,
  );

  const baseDps = stats.sustainedDps ?? stats.burstDps ?? 0;
  let combatDamageBonus = 0;
  if (slot.source !== "adversary") {
    const competency = resolveCrewCompetency(slot);
    if (competency) {
      const rank = clampCompetencyRank(competency.combat);
      combatDamageBonus = COMBAT_DAMAGE_BONUS[rank] ?? 0;
    }
  }

  return {
    weaponId: weapon.id,
    baseDps,
    boardingDps: baseDps * (1 + combatDamageBonus),
    combatDamageBonus,
  };
}
