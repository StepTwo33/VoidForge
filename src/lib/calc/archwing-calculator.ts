import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import type { Archwing, Necramech } from "@/data/archwing";
import { ARCHWING_RANK30_BONUS, NECRAMECH_RANK30_BONUS } from "@/data/archwing";
import { gunneryArchwingAbilityBonus } from "@/data/railjack-intrinsics";
import { playerEffectiveHealth } from "@/lib/calc/player-ehp";
import { warframeEffectiveHealth } from "@/lib/calc/damage-reduction";
import {
  applyVerifiedModStatToArchwing,
  applyVerifiedModStatToNecramech,
  type ArchwingModAccumulators,
} from "@/lib/mods/mod-behavior-registry";
import type { ArchwingCalculatedStats, Mod, ModSlot } from "@/lib/types";

type EquippedArchwingMod = Pick<ModSlot, "modId" | "rank">;

function emptyAccumulators(): ArchwingModAccumulators {
  return {
    healthBonus: 0,
    shieldBonus: 0,
    armorBonus: 0,
    energyBonus: 0,
    sprintSpeedBonus: 0,
    slideSpeedBonus: 0,
    flowBonus: 0,
    parkourVelocityBonus: 0,
    abilityStrength: 0,
    abilityDuration: 0,
    abilityEfficiency: 0,
    abilityRange: 0,
    flightSpeedBonus: 0,
    kineticDiversionPercent: 0,
  };
}

function modStatFraction(perRank: number, rank: number): number {
  return (perRank * (rank + 1)) / 100;
}

function applyArchwingMods(
  equippedMods: EquippedArchwingMod[],
  allMods: Map<string, Mod>,
): { acc: ArchwingModAccumulators; panel: { modBonuses?: Record<string, number> } } {
  const acc = emptyAccumulators();
  const panel: { modBonuses?: Record<string, number> } = {};

  for (const em of equippedMods) {
    const mod = allMods.get(em.modId);
    if (!mod?.stats || mod.category !== "archwing") continue;

    const rank = Math.min(Math.max(em.rank ?? 0, 0), mod.maxRank);
    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      const modValue = modStatFraction(perRank, rank);
      applyVerifiedModStatToArchwing(panel, mod.id, statKey, modValue, acc);
    }
  }

  return { acc, panel };
}

export function calculateArchwingBuild(
  archwing: Archwing,
  equippedMods: EquippedArchwingMod[],
  allMods: Map<string, Mod> = getEffectiveModsMap(),
  /** Railjack Gunnery intrinsic rank (0–10); rank 8 adds +20% STR/Range/Efficiency. */
  railjackGunnery = 0,
): ArchwingCalculatedStats {
  const { acc, panel } = applyArchwingMods(equippedMods, allMods);
  const gunneryAbility = gunneryArchwingAbilityBonus(railjackGunnery);
  acc.abilityStrength += gunneryAbility;
  acc.abilityRange += gunneryAbility;
  acc.abilityEfficiency += gunneryAbility;
  // Mods scale the max-rank (rank 30) stat.
  const baseHealthR30 = archwing.health + ARCHWING_RANK30_BONUS.health;
  const baseShieldR30 = archwing.shield + ARCHWING_RANK30_BONUS.shield;
  const baseEnergyR30 = archwing.energy + ARCHWING_RANK30_BONUS.energy;

  const totalHealth = baseHealthR30 * (1 + acc.healthBonus);
  const totalShield = baseShieldR30 * (1 + acc.shieldBonus);
  const totalArmor = archwing.armor * (1 + acc.armorBonus);
  const totalEnergy = baseEnergyR30 * (1 + acc.energyBonus);
  const totalFlightSpeed = archwing.speed * (1 + acc.flightSpeedBonus);
  const armorDR = totalArmor > 0 ? totalArmor / (totalArmor + 300) : 0;

  return {
    baseHealth: baseHealthR30,
    baseShield: baseShieldR30,
    baseArmor: archwing.armor,
    baseEnergy: baseEnergyR30,
    baseFlightSpeed: archwing.speed,
    healthBonus: acc.healthBonus,
    shieldBonus: acc.shieldBonus,
    armorBonus: acc.armorBonus,
    energyBonus: acc.energyBonus,
    flightSpeedBonus: acc.flightSpeedBonus,
    abilityStrength: 1 + acc.abilityStrength,
    abilityDuration: 1 + acc.abilityDuration,
    abilityEfficiency: 1 + acc.abilityEfficiency,
    abilityRange: 1 + acc.abilityRange,
    totalHealth,
    totalShield,
    totalArmor,
    totalEnergy,
    totalFlightSpeed,
    effectiveHealth: playerEffectiveHealth(totalHealth, armorDR, totalShield),
    damageReduction: armorDR * 100,
    kineticDiversionPercent: acc.kineticDiversionPercent,
    modBonuses: panel.modBonuses,
  };
}

function applyNecramechMods(
  equippedMods: EquippedArchwingMod[],
  allMods: Map<string, Mod>,
): { acc: ArchwingModAccumulators; panel: { modBonuses?: Record<string, number> } } {
  const acc = emptyAccumulators();
  const panel: { modBonuses?: Record<string, number> } = {};

  for (const em of equippedMods) {
    const mod = allMods.get(em.modId);
    if (!mod?.stats || mod.category !== "necramech") continue;

    const rank = Math.min(Math.max(em.rank ?? 0, 0), mod.maxRank);
    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      const modValue = modStatFraction(perRank, rank);
      applyVerifiedModStatToNecramech(panel, mod.id, statKey, modValue, acc);
    }
  }

  return { acc, panel };
}

export function calculateNecramechBuild(
  necramech: Necramech,
  equippedMods: EquippedArchwingMod[],
  allMods: Map<string, Mod> = getEffectiveModsMap(),
): ArchwingCalculatedStats {
  const { acc, panel } = applyNecramechMods(equippedMods, allMods);
  // Mods scale the max-rank (rank 30) stat.
  const baseHealthR30 = necramech.health + NECRAMECH_RANK30_BONUS.health;
  const baseShieldR30 = necramech.shield + NECRAMECH_RANK30_BONUS.shield;
  const baseEnergyR30 = necramech.energy + NECRAMECH_RANK30_BONUS.energy;

  const totalHealth = baseHealthR30 * (1 + acc.healthBonus);
  const totalShield = baseShieldR30 * (1 + acc.shieldBonus);
  const totalArmor = necramech.armor * (1 + acc.armorBonus);
  const totalEnergy = baseEnergyR30 * (1 + acc.energyBonus);
  const armorDR = totalArmor > 0 ? totalArmor / (totalArmor + 300) : 0;
  const airborne = necramechAirborneDamageReduction(equippedMods, allMods);
  const modBonuses = panel.modBonuses ? { ...panel.modBonuses } : undefined;
  // Necramech Aviator is shown as the airborne rows instead of a raw mod-bonus line.
  if (modBonuses) delete modBonuses[`${NECRAMECH_AVIATOR_ID}::damageReduction`];

  return {
    baseHealth: baseHealthR30,
    baseShield: baseShieldR30,
    baseArmor: necramech.armor,
    baseEnergy: baseEnergyR30,
    baseFlightSpeed: 0,
    healthBonus: acc.healthBonus,
    shieldBonus: acc.shieldBonus,
    armorBonus: acc.armorBonus,
    energyBonus: acc.energyBonus,
    flightSpeedBonus: 0,
    abilityStrength: 1 + acc.abilityStrength,
    abilityDuration: 1 + acc.abilityDuration,
    abilityEfficiency: 1 + acc.abilityEfficiency,
    abilityRange: 1 + acc.abilityRange,
    totalHealth,
    totalShield,
    totalArmor,
    totalEnergy,
    totalFlightSpeed: 0,
    effectiveHealth: playerEffectiveHealth(totalHealth, armorDR, totalShield),
    damageReduction: armorDR * 100,
    kineticDiversionPercent: 0,
    modBonuses: modBonuses && Object.keys(modBonuses).length ? modBonuses : undefined,
    ...(airborne > 0
      ? {
          airborneDamageReduction: airborne * 100,
          airborneTotalDamageReduction: (1 - (1 - armorDR) * (1 - airborne)) * 100,
          airborneEffectiveHealth: warframeEffectiveHealth(totalHealth, totalShield, armorDR, airborne),
        }
      : {}),
  };
}

const NECRAMECH_AVIATOR_ID = "necramech_aviator";
/** wiki.warframe.com Necramech Aviator: 10/20/30/40% less damage while airborne (R0–R3). */
export const NECRAMECH_AVIATOR_DR_PER_RANK = 0.1;

/** Airborne-only DR from Necramech mods (fraction). Protects health and shields; not in generic EHP. */
export function necramechAirborneDamageReduction(
  equippedMods: EquippedArchwingMod[],
  allMods: Map<string, Mod>,
): number {
  let taken = 1;
  for (const em of equippedMods) {
    if (em.modId !== NECRAMECH_AVIATOR_ID) continue;
    const maxRank = allMods.get(em.modId)?.maxRank ?? 3;
    const rank = Math.min(Math.max(em.rank ?? 0, 0), maxRank);
    taken *= 1 - NECRAMECH_AVIATOR_DR_PER_RANK * (rank + 1);
  }
  return 1 - taken;
}
