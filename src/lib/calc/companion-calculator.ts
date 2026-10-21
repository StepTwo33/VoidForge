import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import type { Companion, CompanionCalculatedStats, CompanionLinkedWarframe, Mod, ModSlot } from "@/lib/types";
import type { ModularCompanionParts } from "@/data/companion-parts";
import { companionWithPartStats } from "@/lib/companions/companion-parts-resolve";
import {
  applyVerifiedModStatToCompanion,
  getVerifiedModStatLine,
  type CompanionModAccumulators,
} from "@/lib/mods/mod-behavior-registry";

const FLAT_COMPANION_STAT_KEYS = new Set([
  "incapacitationTimerReduction",
  "impactStatusStacks",
  "reviveShieldHealth",
]);

type EquippedCompanionMod = Pick<ModSlot, "modId" | "rank">;

function emptyAccumulators(): CompanionModAccumulators {
  return {
    healthBonus: 0,
    shieldBonus: 0,
    armorBonus: 0,
    shieldRechargeBonus: 0,
    meleeDamageBonus: 0,
    attackSpeedBonus: 0,
    critChanceBonus: 0,
    critDamageBonus: 0,
    weakspotDamageBonus: 0,
    finisherDamageBonus: 0,
    damageReductionBonus: 0,
    pickupDoubleChance: 0,
    creditPickupDoubleChance: 0,
    resourcePickupDoubleChance: 0,
    impactStatusStacks: 0,
    reviveShieldHealth: 0,
    incapacitationTimerReduction: 0,
    healthRegenBonus: 0,
  };
}

function modStatValue(
  perRank: number,
  rank: number,
  statKey: string,
  modId: string,
): number {
  const line = getVerifiedModStatLine(modId, statKey);
  const isFlat = line?.mode === "flat" || FLAT_COMPANION_STAT_KEYS.has(statKey);
  if (isFlat) return perRank * (rank + 1);
  return (perRank * (rank + 1)) / 100;
}

function applyLegacyCompanionStat(acc: CompanionModAccumulators, statKey: string, modValue: number): void {
  switch (statKey) {
    case "health":
      acc.healthBonus += modValue;
      break;
    case "shield":
      acc.shieldBonus += modValue;
      break;
    case "armor":
      acc.armorBonus += modValue;
      break;
    case "meleeDamage":
      acc.meleeDamageBonus += modValue;
      break;
    case "attackSpeed":
      acc.attackSpeedBonus += modValue;
      break;
    case "criticalChance":
    case "critChance":
      acc.critChanceBonus += modValue;
      break;
    case "criticalMultiplier":
    case "critDamage":
      acc.critDamageBonus += modValue;
      break;
    case "weakspotDamage":
      acc.weakspotDamageBonus += modValue;
      break;
    case "finisherDamage":
      acc.finisherDamageBonus += modValue;
      break;
    case "damageReduction":
      acc.damageReductionBonus += modValue;
      break;
    case "pickupDoubleChance":
      acc.pickupDoubleChance += modValue;
      break;
    case "creditPickupDoubleChance":
      acc.creditPickupDoubleChance += modValue;
      break;
    case "resourcePickupDoubleChance":
      acc.resourcePickupDoubleChance += modValue;
      break;
    case "impactStatusStacks":
      acc.impactStatusStacks += modValue;
      break;
    case "reviveShieldHealth":
      acc.reviveShieldHealth += modValue;
      break;
    case "incapacitationTimerReduction":
      acc.incapacitationTimerReduction += modValue;
      break;
    case "shieldRecharge":
      acc.shieldRechargeBonus += modValue;
      break;
    case "healthRegen":
      acc.healthRegenBonus += modValue;
      break;
    default:
      break;
  }
}

/**
 * wiki Link Vitality / Link Redirection / Link Fiber: the companion gains +125% (max rank)
 * of the Warframe's max Health / Shields / Armor, added flat after the companion's own % mods.
 */
export const COMPANION_LINK_MODS: Record<string, { statKey: string; target: "health" | "shield" | "armor" }> = {
  link_vitality: { statKey: "health", target: "health" },
  link_redirection: { statKey: "shield", target: "shield" },
  link_fiber: { statKey: "armor", target: "armor" },
};

export function calculateCompanionBuild(
  companion: Companion,
  equippedMods: EquippedCompanionMod[],
  allMods: Map<string, Mod> = getEffectiveModsMap(),
  parts?: ModularCompanionParts | null,
  /** The Warframe this companion follows (loadout). Without it Link mods stay out of the totals. */
  linkedWarframe?: CompanionLinkedWarframe | null,
): CompanionCalculatedStats {
  const body = companionWithPartStats(companion, parts);
  const acc = emptyAccumulators();
  const panel: { modBonuses?: Record<string, number> } = {};
  const linkFraction = { health: 0, shield: 0, armor: 0 };
  let hasLinkMod = false;

  for (const em of equippedMods) {
    const mod = allMods.get(em.modId);
    if (!mod?.stats) continue;
    const rank = Math.min(Math.max(em.rank ?? 0, 0), mod.maxRank);
    const link = COMPANION_LINK_MODS[mod.id];

    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      const modValue = modStatValue(perRank, rank, statKey, mod.id);
      if (link && statKey === link.statKey) {
        hasLinkMod = true;
        linkFraction[link.target] += modValue;
      }
      const handled = applyVerifiedModStatToCompanion(
        panel,
        mod.id,
        statKey,
        modValue,
        acc,
        mod.category,
      );
      if (!handled) {
        applyLegacyCompanionStat(acc, statKey, modValue);
      }
    }
  }

  const linkHealth = linkedWarframe ? linkedWarframe.health * linkFraction.health : 0;
  const linkShield = linkedWarframe ? linkedWarframe.shield * linkFraction.shield : 0;
  const linkArmor = linkedWarframe ? linkedWarframe.armor * linkFraction.armor : 0;
  const totalHealth = body.health * (1 + acc.healthBonus) + linkHealth;
  const totalShield = body.shield * (1 + acc.shieldBonus) + linkShield;
  const totalArmor = body.armor * (1 + acc.armorBonus) + linkArmor;
  const armorDR = totalArmor > 0 ? totalArmor / (totalArmor + 300) : 0;
  const modDR = Math.min(Math.max(acc.damageReductionBonus, 0), 0.999999);

  return {
    baseHealth: body.health,
    baseShield: body.shield,
    baseArmor: body.armor,
    totalHealth,
    totalShield,
    totalArmor,
    healthBonus: acc.healthBonus,
    shieldBonus: acc.shieldBonus,
    armorBonus: acc.armorBonus,
    meleeDamageBonus: acc.meleeDamageBonus,
    attackSpeedBonus: acc.attackSpeedBonus,
    critChanceBonus: acc.critChanceBonus,
    critDamageBonus: acc.critDamageBonus,
    armorDamageReduction: armorDR * 100,
    // wiki.warframe.com Damage Reduction: armor DR and other DR multiply (they don't add).
    damageReduction: (1 - (1 - armorDR) * (1 - modDR)) * 100,
    // Companion shields take full damage; armor protects health only; pure DR protects both.
    effectiveHealth: (totalHealth * (1 + totalArmor / 300) + totalShield) / (1 - modDR),
    weakspotDamageBonus: acc.weakspotDamageBonus,
    finisherDamageBonus: acc.finisherDamageBonus,
    pickupDoubleChance: acc.pickupDoubleChance,
    creditPickupDoubleChance: acc.creditPickupDoubleChance,
    resourcePickupDoubleChance: acc.resourcePickupDoubleChance,
    impactStatusStacks: acc.impactStatusStacks,
    reviveShieldHealth: acc.reviveShieldHealth,
    incapacitationTimerReduction: acc.incapacitationTimerReduction,
    shieldRechargeBonus: acc.shieldRechargeBonus,
    healthRegenBonus: acc.healthRegenBonus,
    linkHealth,
    linkShield,
    linkArmor,
    linkModsNeedWarframe: hasLinkMod && !linkedWarframe,
    modBonuses: panel.modBonuses,
  };
}
