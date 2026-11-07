import {
  getEffectiveCompanionsMap,
  getEffectiveModsMap,
  getEffectiveWarframesMap,
  getEffectiveWeapons,
  getEffectiveWeaponsMap,
} from "@/lib/weapons/effective-data";
import { incarnonDataMap } from "@/data/incarnon";
import type { WarframeBuildData } from "@/lib/builds/build-storage";
import { allDualFormMods, getDualFormConfig, warframeForDualForm } from "@/lib/builds/dual-form-warframes";
import { resolveActiveSavedArcanes, resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import {
  migrateClawModsFromCompanion,
  resolveDefaultCompanionWeapon,
} from "@/lib/weapons/companion-weapons";
import { weaponFromModularData } from "@/lib/builds/modular-resolve";
import { getLoadoutModular } from "@/lib/builds/loadout-slot-helpers";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { getMeleeExaltedWeapon, getPrimaryExaltedWeapon } from "@/lib/weapons/exalted-weapons";
import {
  applyWarframeShardsAndArcanes,
  calculateWarframeBuild,
  calculateWeaponBuild,
  calculateWeaponBuildWithArcanes,
  CONDITIONAL_WARFRAME_MOD_DEFS,
  finalizeWarframeSurvivability,
} from "@/lib/calc/calculator";
import { getArcaneEffectDef } from "@/lib/calc/arcane-calculator";
import {
  computeKhoraVenariPassive,
  computeMesaPassiveBonuses,
} from "@/lib/codex/ability-misc-stats";
import {
  effectiveIncarnonEvolutions,
  isIncarnonFormActive,
  resolveIncarnonActiveWeapon,
} from "@/lib/calc/incarnon-active-weapon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import {
  calculateTTK,
  ENEMY_TYPES,
  type EnemyType,
  type TTKPrimingOptions,
  type TTKResult,
} from "@/lib/calc/ttk";
import { buildWeaponContributionContext, computeDpsContributions, type DpsContribution } from "@/lib/calc/dps-contributions";
import { rivenStatChangesFromModSlots } from "@/lib/warframe-arsenal/riven-resolve";
import {
  applyJetStreamWarframeMove,
  computeLoadoutAbilityArmorStripPct,
  computeLoadoutAuraArmorStripPct,
  mergeWeaponCalcOptions,
  resolveAbilitiesWithHelminth,
  resolveWeaponExternalBuffs,
  type WeaponBuffContext,
} from "@/lib/weapons/weapon-external-buffs";
import type {
  Ability,
  CalculatedStats,
  Companion,
  CompanionCalculatedStats,
  Loadout,
  Mod,
  ModSlot,
  SetBonusLinkage,
  SimulationParams,
  WarframeCalculatedStats,
  Weapon,
  WeaponExternalBuff,
} from "@/lib/types";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

export type DamageScenario = "paper" | "midFight" | "fullRamp" | "vsEnemy";

export const SCENARIO_PRESETS: Record<Exclude<DamageScenario, "vsEnemy">, SimulationParams> = {
  paper: {
    ...DEFAULT_SIM_PARAMS,
    comboCount: 0,
    killStacks: 0,
    statusTypesOnTarget: 0,
    arcaneStacks: 0,
    applyTenaciousBondCrit: false,
    applyReinforcedBondFireRate: false,
    applyYareliCriticalFlow: false,
    applyZephyrAirborne: false,
    applyGarudaDeathsGate: false,
  },
  midFight: {
    ...DEFAULT_SIM_PARAMS,
    comboCount: 40,
    killStacks: 3,
    statusTypesOnTarget: 2,
    arcaneStacks: 6,
    applyTenaciousBondCrit: true,
    applyReinforcedBondFireRate: true,
    applyYareliCriticalFlow: true,
    applyZephyrAirborne: true,
    applyGarudaDeathsGate: true,
  },
  fullRamp: {
    ...DEFAULT_SIM_PARAMS,
    comboCount: 220,
    killStacks: 5,
    statusTypesOnTarget: 4,
    arcaneStacks: 12,
    applyTriggerBuffs: true,
    applyTenaciousBondCrit: true,
    applyReinforcedBondFireRate: true,
    applyYareliCriticalFlow: true,
    applyZephyrAirborne: true,
    applyGarudaDeathsGate: true,
  },
};

export function scenarioSimParams(scenario: DamageScenario): SimulationParams {
  if (scenario === "vsEnemy") return { ...SCENARIO_PRESETS.midFight };
  return { ...SCENARIO_PRESETS[scenario] };
}

export interface LoadoutWeaponSlotStats {
  name: string;
  stats: CalculatedStats;
  ttk?: TTKResult;
  isMelee: boolean;
  contributions?: DpsContribution[];
}

export interface LoadoutWarframeStats {
  name: string;
  stats: WarframeCalculatedStats;
  /** Per-form stats when the warframe has separate mod setups (e.g. Sirius & Orion). */
  forms?: { id: string; label: string; stats: WarframeCalculatedStats }[];
}

export interface LoadoutStatsResult {
  warframe: LoadoutWarframeStats | null;
  primary: LoadoutWeaponSlotStats | null;
  secondary: LoadoutWeaponSlotStats | null;
  melee: LoadoutWeaponSlotStats | null;
  exalted: LoadoutWeaponSlotStats | null;
  /** Titania Diwata when Dex Pixia is the primary exalted. */
  exaltedMelee: LoadoutWeaponSlotStats | null;
  companion: {
    name: string;
    bodyStats: CompanionCalculatedStats;
    weapon: LoadoutWeaponSlotStats | null;
  } | null;
}

export interface CalcLoadoutStatsOptions {
  scenario?: DamageScenario;
  simParams?: Partial<SimulationParams>;
  enemy?: EnemyType | null;
  enemyLevel?: number;
  /** Steel Path ×2.5 HP/Shield after level scaling. */
  steelPath?: boolean;
  /** Pre-applied enemy debuff priming & armor strip for TTK and CO status counts. */
  enemyPriming?: TTKPrimingOptions;
  allWeapons?: Weapon[];
}

function weaponWithPassive(w: Weapon): Weapon {
  return enrichWeapon(w);
}

function resolveCompanionWeaponForLoadout(
  companionBuild: NonNullable<Loadout["companionBuild"]>,
  companion: Companion,
  weaponList: Weapon[],
): Weapon | null {
  if (companionBuild.weaponId) {
    const explicit = weaponList.find((w) => w.id === companionBuild.weaponId);
    if (explicit) return explicit;
  }
  return resolveDefaultCompanionWeapon(companion, weaponList);
}

export function setBonusLinkageFromLoadout(loadout: Loadout): SetBonusLinkage {
  const wfMods = loadout.warframeBuild
    ? allDualFormMods(loadout.warframeBuild as WarframeBuildData)
    : undefined;
  const primaryMod = getLoadoutModular(loadout, "primary");
  const secondaryMod = getLoadoutModular(loadout, "secondary");
  const meleeMod = getLoadoutModular(loadout, "melee");
  let companionMods = loadout.companionBuild?.mods;
  let companionWeaponMods = loadout.companionBuild?.weaponMods;
  if (loadout.companionBuild) {
    const c = getEffectiveCompanionsMap().get(loadout.companionBuild.companionId);
    if (c) {
      const migrated = migrateClawModsFromCompanion(
        companionMods ?? [],
        companionWeaponMods ?? [],
        c,
      );
      companionMods = migrated.mods;
      companionWeaponMods = migrated.weaponMods;
    }
  }
  return {
    warframeMods: wfMods,
    primaryMods: loadout.primaryBuild?.mods ?? primaryMod?.mods,
    secondaryMods: loadout.secondaryBuild?.mods ?? secondaryMod?.mods,
    meleeMods: loadout.meleeBuild?.mods ?? meleeMod?.mods,
    companionMods,
    companionWeaponMods,
  };
}

function getIncarnonStatChanges(
  weaponId: string,
  evolutions?: Record<number, number>,
  options?: {
    chargeMode?: boolean;
    conditionalsOn?: Record<string, boolean>;
    genesisInstalledOverride?: boolean | null;
  },
): Record<string, number> | undefined {
  const data = incarnonDataMap.get(weaponId);
  const effectiveEvos = effectiveIncarnonEvolutions(
    data,
    evolutions,
    options?.genesisInstalledOverride,
  );
  return mergeIncarnonStatChanges(data, effectiveEvos, weaponId, {
    formActive: isIncarnonFormActive(effectiveEvos, data),
    chargeMode: options?.chargeMode === true,
    conditionalsOn: options?.conditionalsOn,
  });
}

export const getIncarnonStatChangesForWeapon = getIncarnonStatChanges;

export type WeaponBuildPayload = {
  weaponId: string;
  mods: ModSlot[];
  arcaneIds?: (string | null)[];
  arcaneRanks?: number[];
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  incarnonEvolutions?: Record<number, number>;
  /** Conditional Incarnon perks switched on (round 47; unset = off). */
  incarnonConditionals?: Record<string, boolean>;
  /** Explicit Incarnon Genesis Adapter ON/OFF state (unset = inferred from evolutions). */
  incarnonGenesisInstalled?: boolean;
};

/**
 * Apply equipped weapon Incarnon mobility perks (Okina's Swordsman's Celerity +30% Movement Speed,
 * Praedos Drifting Grace / Evolved Ascension, Innodem Striking Swiftness, Bo / Anku / Ruvox / Obex,
 * and active melee Tier 1 Incarnon Form sprint / parkour bonuses) to Warframe stats.
 */
export function applyWeaponIncarnonMobilityToWarframe(
  stats: WarframeCalculatedStats,
  loadout: Pick<Loadout, "primaryBuild" | "secondaryBuild" | "meleeBuild">,
): void {
  const builds = [loadout.primaryBuild, loadout.secondaryBuild, loadout.meleeBuild];
  let sprintDelta = 0;
  let slideDelta = 0;
  let parkourDelta = 0;

  for (const b of builds) {
    if (!b?.weaponId) continue;
    const data = incarnonDataMap.get(b.weaponId);
    if (!data) continue;
    const effectiveEvos = effectiveIncarnonEvolutions(
      data,
      b.incarnonEvolutions,
      b.incarnonGenesisInstalled,
    );
    if (Object.keys(effectiveEvos).length === 0) continue;
    const formActive = isIncarnonFormActive(effectiveEvos, data);
    const merged = mergeIncarnonStatChanges(data, effectiveEvos, b.weaponId, {
      formActive,
      conditionalsOn: b.incarnonConditionals,
    });

    // Exclude aim-gated movement perks (e.g. Laetum Raptor's Chase "+50% Movement Speed while Aiming").
    let aimOnlyMove = 0;
    for (const [tierStr, slot] of Object.entries(effectiveEvos)) {
      const evo = data.evolutions.find((e) => e.tier === Number(tierStr) && e.slot === slot);
      if (!evo) continue;
      const moveVal = evo.variantStatChanges?.[b.weaponId]?.movementSpeed ?? evo.statChanges.movementSpeed;
      if (moveVal && /while\s+aiming/i.test(evo.description)) {
        aimOnlyMove += moveVal;
      }
      // Melee Tier 1 Incarnon Form active transformation mobility ("+20% Sprint Speed +20% to Parkour Velocity").
      if (formActive && evo.tier === 1) {
        const hasStructuredSprint =
          evo.statChanges.sprintSpeed != null || evo.formStatChanges?.sprintSpeed != null;
        if (!hasStructuredSprint) {
          const sm = evo.description.match(/\+(\d+(?:\.\d+)?)%\s*Sprint Speed/i);
          if (sm) sprintDelta += Number(sm[1]) / 100;
        }
        const hasStructuredParkour =
          evo.statChanges.parkourVelocity != null || evo.formStatChanges?.parkourVelocity != null;
        if (!hasStructuredParkour) {
          const pm = evo.description.match(
            /\+(\d+(?:\.\d+)?)%\s*(?:to\s+)?(?:Parkour Velocity|Bullet Jump)/i,
          );
          if (pm) parkourDelta += Number(pm[1]) / 100;
        }
      }
    }

    if (merged) {
      const moveSpeed = Math.max(0, (merged.movementSpeed ?? 0) - aimOnlyMove);
      sprintDelta += moveSpeed + (merged.sprintSpeed ?? 0);
      slideDelta += merged.slideSpeed ?? 0;
      parkourDelta += merged.parkourVelocity ?? 0;
    }
  }

  if (sprintDelta !== 0) {
    stats.sprintSpeedBonus += sprintDelta;
    stats.totalSprint = stats.baseSprint * (1 + stats.sprintSpeedBonus);
  }
  if (slideDelta !== 0) {
    stats.slideSpeedBonus += slideDelta;
  }
  if (parkourDelta !== 0) {
    stats.parkourVelocityBonus += parkourDelta;
  }
}

function calcWeaponSlotStats(
  build: WeaponBuildPayload | undefined,
  simParams: SimulationParams,
  setLinkage: SetBonusLinkage,
  enemy?: EnemyType | null,
  enemyLevel?: number,
  buffContext?: WeaponBuffContext,
  steelPath?: boolean,
  enemyPriming?: TTKPrimingOptions,
): LoadoutWeaponSlotStats | null {
  if (!build) return null;
  const weaponsMap = getEffectiveWeaponsMap();
  const modsMap = getEffectiveModsMap();
  const w = weaponsMap.get(build.weaponId);
  if (!w) return null;
  const base = weaponWithPassive(w);
  const incarnonData = incarnonDataMap.get(build.weaponId);
  const effectiveEvos = effectiveIncarnonEvolutions(
    incarnonData,
    build.incarnonEvolutions,
    build.incarnonGenesisInstalled,
  );
  const calcWeapon = resolveIncarnonActiveWeapon(base, incarnonData, effectiveEvos, {
    onosIncarnonMode: simParams.onosIncarnonMode,
  });
  const formActive = isIncarnonFormActive(effectiveEvos, incarnonData);
  const { arcanes: arcaneMods, arcaneRanks: activeArcaneRanks } = resolveActiveSavedArcanes(
    build.arcaneIds,
    build.arcaneRanks,
    2,
  );
  const progenitorOpts =
    build.progenitorElement &&
    build.progenitorBonusPercent != null &&
    build.progenitorBonusPercent > 0
      ? {
          progenitorElement: build.progenitorElement,
          progenitorBonusPercent: build.progenitorBonusPercent,
          ...(formActive ? { incarnonFormActive: true as const } : {}),
          ...(activeArcaneRanks.length > 0 ? { arcaneRanks: activeArcaneRanks } : {}),
        }
      : formActive || activeArcaneRanks.length > 0
        ? {
            ...(formActive ? { incarnonFormActive: true as const } : {}),
            ...(activeArcaneRanks.length > 0 ? { arcaneRanks: activeArcaneRanks } : {}),
          }
        : undefined;
  const externalBuffs = resolveWeaponExternalBuffs(calcWeapon, buffContext, simParams);
  const calcOptions = mergeWeaponCalcOptions(progenitorOpts, externalBuffs);
  const incarnonChanges = getIncarnonStatChanges(build.weaponId, effectiveEvos, {
    chargeMode: simParams.onosIncarnonMode === "charge",
    conditionalsOn: build.incarnonConditionals,
    genesisInstalledOverride: build.incarnonGenesisInstalled,
  });
  const modSlots = build.mods || [];
  const rivenStatChanges = rivenStatChangesFromModSlots(modSlots);
  const stats =
    arcaneMods.length > 0
      ? calculateWeaponBuildWithArcanes(
          calcWeapon,
          modSlots,
          modsMap,
          arcaneMods,
          incarnonChanges,
          simParams,
          calcOptions,
          setLinkage,
          rivenStatChanges,
          activeArcaneRanks,
        )
      : calculateWeaponBuild(
          calcWeapon,
          modSlots,
          modsMap,
          incarnonChanges,
          simParams,
          calcOptions,
          setLinkage,
          rivenStatChanges,
        );
  const isMelee = base.category === "melee" || base.triggerType === "Melee";
  const ttk =
    enemy && enemyLevel != null && enemyLevel > 0
      ? calculateTTK(stats, enemy, enemyLevel, { steelPath, ...enemyPriming })
      : undefined;
  const contributionContext = buildWeaponContributionContext({
    weapon: calcWeapon,
    modSlots,
    allMods: modsMap,
    arcanes: arcaneMods,
    arcaneRanks: activeArcaneRanks,
    incarnonStatChanges: incarnonChanges,
    simParams,
    progenitorElement: build.progenitorElement,
    progenitorBonusPercent: build.progenitorBonusPercent,
    linkage: setLinkage,
    buffContext,
  });
  const contributions = computeDpsContributions(contributionContext);
  return { name: base.name, stats, ttk, isMelee, contributions };
}

function calcModularSlotStats(
  loadout: Loadout,
  slot: "primary" | "secondary" | "melee",
  simParams: SimulationParams,
  setLinkage: SetBonusLinkage,
  enemy?: EnemyType | null,
  enemyLevel?: number,
  buffContext?: WeaponBuffContext,
  steelPath?: boolean,
  enemyPriming?: TTKPrimingOptions,
): LoadoutWeaponSlotStats | null {
  const data = getLoadoutModular(loadout, slot);
  if (!data) return null;
  const modsMap = getEffectiveModsMap();
  let w = weaponFromModularData(data);
  if (!w) return null;
  w = weaponWithPassive(w);
  const modSlots = data.mods || [];
  const rivenStatChanges = rivenStatChangesFromModSlots(modSlots);
  const { arcanes: arcaneMods, arcaneRanks: activeArcaneRanks } = resolveActiveSavedArcanes(
    data.arcaneIds,
    data.arcaneRanks,
    2,
  );
  const externalBuffs = resolveWeaponExternalBuffs(w, buffContext, simParams);
  const calcOptions = mergeWeaponCalcOptions(
    activeArcaneRanks.length > 0 ? { arcaneRanks: activeArcaneRanks } : undefined,
    externalBuffs,
  );
  const stats =
    arcaneMods.length > 0
      ? calculateWeaponBuildWithArcanes(
          w,
          modSlots,
          modsMap,
          arcaneMods,
          undefined,
          simParams,
          calcOptions,
          setLinkage,
          rivenStatChanges,
          activeArcaneRanks,
        )
      : calculateWeaponBuild(
          w,
          modSlots,
          modsMap,
          undefined,
          simParams,
          calcOptions,
          setLinkage,
          rivenStatChanges,
        );
  const isMelee = w.category === "melee" || w.triggerType === "Melee";
  const ttk =
    enemy && enemyLevel != null && enemyLevel > 0
      ? calculateTTK(stats, enemy, enemyLevel, { steelPath, ...enemyPriming })
      : undefined;
  const contributionContext = buildWeaponContributionContext({
    weapon: w,
    modSlots,
    allMods: modsMap,
    arcanes: arcaneMods,
    arcaneRanks: activeArcaneRanks,
    simParams,
    linkage: setLinkage,
    buffContext,
  });
  const contributions = computeDpsContributions(contributionContext);
  return { name: w.name, stats, ttk, isMelee, contributions };
}

export function calcLoadoutStats(loadout: Loadout, options: CalcLoadoutStatsOptions = {}): LoadoutStatsResult {
  const baseSim = scenarioSimParams(options.scenario ?? "midFight");
  let simParams: SimulationParams = options.simParams ? { ...baseSim, ...options.simParams } : baseSim;
  const enemy = options.enemy ?? null;
  const enemyLevel = options.enemyLevel ?? 100;
  const steelPath = !!options.steelPath;
  const enemyPriming = options.enemyPriming;
  if (enemyPriming) {
    let primedTypeCount = 0;
    if ((enemyPriming.primedViralStacks ?? 0) > 0) primedTypeCount++;
    if ((enemyPriming.primedCorrosiveStacks ?? 0) > 0) primedTypeCount++;
    if ((enemyPriming.primedMagneticStacks ?? 0) > 0) primedTypeCount++;
    if ((enemyPriming.primedColdStacks ?? 0) > 0) primedTypeCount++;
    if ((enemyPriming.primedPunctureStacks ?? 0) > 0) primedTypeCount++;
    if ((enemyPriming.primedBlastStacks ?? 0) > 0) primedTypeCount++;
    if (enemyPriming.primedHeatStrip) primedTypeCount++;
    if (primedTypeCount > simParams.statusTypesOnTarget) {
      simParams = { ...simParams, statusTypesOnTarget: primedTypeCount };
    }
  }
  const weaponList = options.allWeapons ?? getEffectiveWeapons();
  const warframesMap = getEffectiveWarframesMap();
  const companionsMap = getEffectiveCompanionsMap();
  const modsMap = getEffectiveModsMap();
  const setLinkage = setBonusLinkageFromLoadout(loadout);
  const auraArmorStripPct = computeLoadoutAuraArmorStripPct(setLinkage.warframeMods);
  const effectiveEnemyPriming: TTKPrimingOptions | undefined =
    enemyPriming || auraArmorStripPct > 0
      ? {
          ...enemyPriming,
          ...(auraArmorStripPct > 0 || (enemyPriming?.armorStripPct ?? 0) > 0
            ? {
                armorStripPct: Math.min(
                  100,
                  (enemyPriming?.armorStripPct ?? 0) + auraArmorStripPct,
                ),
              }
            : {}),
        }
      : undefined;

  const isPaperScenario =
    simParams.arcaneStacks <= 0 &&
    !simParams.applyTriggerBuffs &&
    simParams.killStacks <= 0 &&
    simParams.comboCount <= 0;

  const result: LoadoutStatsResult = {
    warframe: null,
    primary: null,
    secondary: null,
    melee: null,
    exalted: null,
    exaltedMelee: null,
    companion: null,
  };

  let buffContext: WeaponBuffContext | undefined;

  if (loadout.warframeBuild) {
    const wf = warframesMap.get(loadout.warframeBuild.warframeId);
    if (wf) {
      // `arcaneRanks` isn't declared on Loadout["warframeBuild"] but survives the
      // save round-trip (payload spread from WarframeBuildData).
      const wb = loadout.warframeBuild as NonNullable<Loadout["warframeBuild"]> &
        Pick<WarframeBuildData, "arcaneRanks" | "arcaneStacksById" | "conditionalModStacksById">;
      const shards = wb.shards;
      const warframeArcaneCtx = (
        abilities: Ability[] | undefined,
        mods: ModSlot[],
        arcanes: (Mod | null)[],
      ) => {
        const arcaneStacksById: Record<string, number> = {
          ...(isPaperScenario ? {} : wb.arcaneStacksById),
        };
        if (isPaperScenario) {
          for (const arc of arcanes) {
            if (!arc) continue;
            const def = getArcaneEffectDef(arc.id);
            if (
              def &&
              def.trigger !== "passive" &&
              arc.id !== "arcane_intention" &&
              arc.id !== "arcane_persistence"
            ) {
              arcaneStacksById[arc.id] = 0;
            }
          }
        }
        if (simParams.arcaneStacksById) {
          Object.assign(arcaneStacksById, simParams.arcaneStacksById);
        }

        const conditionalModStacksById: Record<string, number> = {};
        for (const slot of mods) {
          const def = CONDITIONAL_WARFRAME_MOD_DEFS[slot.modId];
          if (!def) continue;
          conditionalModStacksById[slot.modId] = isPaperScenario ? 0 : def.maxStacks;
        }
        if (!isPaperScenario && wb.conditionalModStacksById) {
          Object.assign(conditionalModStacksById, wb.conditionalModStacksById);
        }
        if (simParams.conditionalModStacksById) {
          Object.assign(conditionalModStacksById, simParams.conditionalModStacksById);
        }

        return {
          arcaneStacksById,
          conditionalModStacksById,
          equippedModSlots: mods,
          abilities: resolveAbilitiesWithHelminth(abilities, wb.helminthAbilityId, wb.helminthSlot),
          equippedModNames: mods
            .map((m) => modsMap.get(m.modId)?.name)
            .filter((n): n is string => !!n),
        };
      };
      const dualConfig = getDualFormConfig(loadout.warframeBuild.warframeId);
      if (dualConfig) {
        const formStats = dualConfig.forms.map((form) => {
          const isDefault = form.id === dualConfig.defaultFormId;
          const slice = isDefault ? undefined : wb.dualFormBuilds?.[form.id];
          const mods = isDefault ? wb.mods || [] : slice?.mods || [];
          // Arcanes are per-form; archon shards are shared across forms.
          const sliceWithArcanes = slice as
            | (typeof slice & Pick<WarframeBuildData, "arcaneIds" | "arcaneRanks">)
            | undefined;
          const arcaneIds = isDefault ? wb.arcaneIds : sliceWithArcanes?.arcaneIds;
          const arcaneRanks = isDefault ? wb.arcaneRanks : sliceWithArcanes?.arcaneRanks;
          const formArcanes = resolveSavedArcaneSlots(arcaneIds, 2);
          const formWf = warframeForDualForm(wf, form.id);
          const stats = calculateWarframeBuild(formWf, mods, modsMap, setLinkage);
          return {
            id: form.id,
            label: form.label,
            stats: applyWarframeShardsAndArcanes(
              stats,
              shards,
              formArcanes,
              arcaneRanks,
              warframeArcaneCtx(formWf.abilities, mods, formArcanes),
            ),
          };
        });
        result.warframe = {
          name: wf.name,
          stats:
            formStats.find((f) => f.id === dualConfig.defaultFormId)?.stats ??
            formStats[0]?.stats ??
            calculateWarframeBuild(wf, wb.mods || [], modsMap, setLinkage),
          forms: formStats,
        };
      } else {
        const wfArcanes = resolveSavedArcaneSlots(wb.arcaneIds, 2);
        const stats = applyWarframeShardsAndArcanes(
          calculateWarframeBuild(wf, wb.mods || [], modsMap, setLinkage),
          shards,
          wfArcanes,
          wb.arcaneRanks,
          warframeArcaneCtx(wf.abilities, wb.mods || [], wfArcanes),
        );
        result.warframe = { name: wf.name, stats };
      }

      // Jet Stream + equipped Incarnon weapon mobility perks + Warframe loadout passives
      // (Mesa +50 flat Health with no melee; Khora Venari +15% Sprint Speed).
      // Dual-form default stats may share a reference with forms[] — apply once per object.
      {
        const wfFamily = loadout.warframeBuild.warframeId.replace(/_prime$/, "");
        const hasMeleeEquipped = Boolean(
          loadout.meleeBuild?.weaponId || getLoadoutModular(loadout, "melee"),
        );
        const mesaHpBonus =
          wfFamily === "mesa"
            ? computeMesaPassiveBonuses({
                sidearmStyle: "none",
                meleeEquipped: hasMeleeEquipped,
              }).bonusHealth
            : 0;
        const khoraMoveBonus =
          wfFamily === "khora" && !isPaperScenario
            ? computeKhoraVenariPassive(true).moveSpeedBonus
            : 0;

        const seen = new Set<WarframeCalculatedStats>();
        const applyOnce = (stats: WarframeCalculatedStats) => {
          if (seen.has(stats)) return;
          seen.add(stats);
          if (mesaHpBonus > 0) {
            stats.flatHealthBonus += mesaHpBonus;
            stats.totalHealth += mesaHpBonus;
            finalizeWarframeSurvivability(stats);
          }
          if (khoraMoveBonus > 0) {
            stats.sprintSpeedBonus += khoraMoveBonus;
            stats.totalSprint = stats.baseSprint * (1 + stats.sprintSpeedBonus);
          }
          applyJetStreamWarframeMove(
            stats,
            setLinkage.warframeMods,
            modsMap,
            simParams,
          );
          applyWeaponIncarnonMobilityToWarframe(stats, loadout);
        };
        applyOnce(result.warframe.stats);
        for (const form of result.warframe.forms ?? []) applyOnce(form.stats);
      }

      buffContext = {
        warframeId: loadout.warframeBuild.warframeId,
        warframeStats: result.warframe!.stats,
        warframeAbilities: resolveAbilitiesWithHelminth(
          wf.abilities,
          loadout.warframeBuild.helminthAbilityId,
          loadout.warframeBuild.helminthSlot,
        ),
        warframeModSlots: setLinkage.warframeMods,
        warframeArcaneIds: wb.arcaneIds,
        warframeArcaneRanks: wb.arcaneRanks,
        allMods: modsMap,
      };
      // Primary Overcharge scales with this frame's real max energy.
      if (simParams.warframeMaxEnergy == null) {
        simParams = { ...simParams, warframeMaxEnergy: result.warframe!.stats.totalEnergy };
      }
    }
  }

  // Resolve companion body/weapon mods (including pre-U37 claw mod migration + Hunter Synergy)
  // BEFORE computing weapon & exalted slots so Tenacious Bond and Reinforced Bond apply everywhere.
  let resolvedCompanionEntry: {
    companion: Companion;
    companionMods: ModSlot[];
    weaponMods: ModSlot[];
    companionWeapon: Weapon | null;
    companionExternalBuffs: WeaponExternalBuff[];
    companionWeaponStats?: CalculatedStats;
  } | null = null;

  if (loadout.companionBuild) {
    const c = companionsMap.get(loadout.companionBuild.companionId);
    if (c) {
      const migrated = migrateClawModsFromCompanion(
        loadout.companionBuild.mods ?? [],
        loadout.companionBuild.weaponMods ?? [],
        c,
      );
      const companionMods = migrated.mods;
      const weaponMods = migrated.weaponMods;
      const companionWeapon = resolveCompanionWeaponForLoadout(
        loadout.companionBuild,
        c,
        weaponList,
      );
      const allCompanionSlots: ModSlot[] = [...companionMods, ...weaponMods];
      const companionExternalBuffs: WeaponExternalBuff[] = [];

      const hunterSynergyMod = allCompanionSlots.find((m) => m.modId === "hunter_synergy");
      const mechaOverdriveMod = allCompanionSlots.find((m) => m.modId === "mecha_overdrive");
      if (companionWeapon && (hunterSynergyMod || mechaOverdriveMod)) {
        // Tenacious/Reinforced Bond only add Crit Damage / Fire Rate, never Primary CC/SC.
        const primaryProbe =
          calcModularSlotStats(loadout, "primary", simParams, setLinkage, null, undefined, buffContext) ??
          calcWeaponSlotStats(loadout.primaryBuild, simParams, setLinkage, null, undefined, buffContext);
        if (hunterSynergyMod && primaryProbe?.stats.criticalChance) {
          const rank = hunterSynergyMod.rank ?? 5;
          const bonus = primaryProbe.stats.criticalChance * (0.05 * (rank + 1));
          if (bonus > 0) {
            companionExternalBuffs.push({
              id: "mod:hunter_synergy",
              label: "Hunter Synergy",
              category: "companion",
              critChanceFlatBonus: bonus,
            });
          }
        }
        if (mechaOverdriveMod && primaryProbe?.stats.statusChance) {
          const rank = mechaOverdriveMod.rank ?? 5;
          const bonus = primaryProbe.stats.statusChance * (0.10 * (rank + 1));
          if (bonus > 0) {
            companionExternalBuffs.push({
              id: "mod:mecha_overdrive",
              label: "Mecha Overdrive",
              category: "companion",
              statusChanceFlatBonus: bonus,
            });
          }
        }
      }

      let companionWeaponStats: CalculatedStats | undefined;
      if (companionWeapon) {
        const cwRivenChanges = rivenStatChangesFromModSlots(weaponMods);
        companionWeaponStats = calculateWeaponBuild(
          weaponWithPassive(companionWeapon),
          weaponMods,
          modsMap,
          undefined,
          simParams,
          companionExternalBuffs.length > 0 ? { externalBuffs: companionExternalBuffs } : undefined,
          setLinkage,
          cwRivenChanges,
        );
      }

      buffContext = {
        ...buffContext,
        companionModSlots: companionMods,
        companionWeaponCritChance: companionWeaponStats?.criticalChance,
        allMods: modsMap,
      };

      resolvedCompanionEntry = {
        companion: c,
        companionMods,
        weaponMods,
        companionWeapon,
        companionExternalBuffs,
        companionWeaponStats,
      };
    }
  }

  const abilityArmorStripPct = computeLoadoutAbilityArmorStripPct(
    buffContext?.warframeAbilities,
    buffContext?.warframeStats?.abilityStrength ?? 1,
    simParams.activeWeaponAbilityBuffs ?? [],
  );
  const totalArmorStripPct = Math.min(
    100,
    (enemyPriming?.armorStripPct ?? 0) + auraArmorStripPct + abilityArmorStripPct,
  );
  const effectiveEnemyPrimingWithAbilities: TTKPrimingOptions | undefined =
    effectiveEnemyPriming || totalArmorStripPct > 0
      ? {
          ...effectiveEnemyPriming,
          ...(totalArmorStripPct > 0 ? { armorStripPct: totalArmorStripPct } : {}),
        }
      : undefined;

  result.primary =
    calcModularSlotStats(loadout, "primary", simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities) ??
    calcWeaponSlotStats(loadout.primaryBuild, simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities);
  result.secondary =
    calcModularSlotStats(loadout, "secondary", simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities) ??
    calcWeaponSlotStats(loadout.secondaryBuild, simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities);
  result.melee =
    calcModularSlotStats(loadout, "melee", simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities) ??
    calcWeaponSlotStats(loadout.meleeBuild, simParams, setLinkage, enemy, enemyLevel, buffContext, steelPath, effectiveEnemyPrimingWithAbilities);

  if (loadout.warframeBuild && result.warframe) {
    const wfStr = result.warframe.stats.abilityStrength ?? 1;
    const calcExaltedSlot = (
      weapon: Weapon | null,
      modSlots: ModSlot[],
      arcaneIds: (string | null)[] | undefined,
      arcaneRanks: number[] | undefined,
    ): LoadoutWeaponSlotStats | null => {
      if (!weapon) return null;
      const { arcanes, arcaneRanks: activeArcaneRanks } = resolveActiveSavedArcanes(
        arcaneIds,
        arcaneRanks,
        2,
      );
      if (modSlots.length === 0 && arcanes.length === 0) return null;
      const base = weaponWithPassive(weapon);
      const externalBuffs = resolveWeaponExternalBuffs(base, buffContext, simParams);
      const calcOptions = {
        ...mergeWeaponCalcOptions(
          activeArcaneRanks.length > 0 ? { arcaneRanks: activeArcaneRanks } : undefined,
          externalBuffs,
        ),
        abilityStrength: wfStr,
      };
      const statsEx =
        arcanes.length > 0
          ? calculateWeaponBuildWithArcanes(
              base,
              modSlots,
              modsMap,
              arcanes,
              undefined,
              simParams,
              calcOptions,
              setLinkage,
              undefined,
              activeArcaneRanks,
            )
          : calculateWeaponBuild(
              base,
              modSlots,
              modsMap,
              undefined,
              simParams,
              calcOptions,
              setLinkage,
            );
      const isMelee = base.category === "melee" || base.triggerType === "Melee";
      const ttk =
        enemy && enemyLevel > 0
          ? calculateTTK(statsEx, enemy, enemyLevel, { steelPath, ...effectiveEnemyPrimingWithAbilities })
          : undefined;
      const contributions = computeDpsContributions(
        buildWeaponContributionContext({
          weapon: base,
          modSlots,
          allMods: modsMap,
          arcanes,
          arcaneRanks: activeArcaneRanks,
          simParams,
          linkage: setLinkage,
          buffContext,
          abilityStrength: wfStr,
        }),
      );
      return { name: base.name, stats: statsEx, ttk, isMelee, contributions };
    };

    result.exalted = calcExaltedSlot(
      getPrimaryExaltedWeapon(loadout.warframeBuild.warframeId, weaponList),
      loadout.warframeBuild.exaltedMods || [],
      loadout.warframeBuild.exaltedArcaneIds,
      loadout.warframeBuild.exaltedArcaneRanks,
    );
    result.exaltedMelee = calcExaltedSlot(
      getMeleeExaltedWeapon(loadout.warframeBuild.warframeId, weaponList),
      loadout.warframeBuild.exaltedMeleeMods || [],
      loadout.warframeBuild.exaltedMeleeArcaneIds,
      loadout.warframeBuild.exaltedMeleeArcaneRanks,
    );
  }

  if (resolvedCompanionEntry) {
    const { companion: c, companionMods, companionWeapon, companionWeaponStats } =
      resolvedCompanionEntry;
    const wfStats = result.warframe?.stats;
    // Link Vitality / Redirection / Fiber copy the loadout Warframe's max stats.
    const linkedWarframe = wfStats
      ? {
          name: result.warframe?.name,
          health: wfStats.totalHealth,
          shield: wfStats.totalShield,
          armor: wfStats.totalArmor,
        }
      : null;
    const bodyStats = calculateCompanionBuild(c, companionMods, modsMap, undefined, linkedWarframe);
    let weapon: LoadoutWeaponSlotStats | null = null;
    if (companionWeapon && companionWeaponStats) {
      const base = weaponWithPassive(companionWeapon);
      const isMelee = base.category === "melee" || base.triggerType === "Melee";
      const ttk =
        enemy && enemyLevel > 0
          ? calculateTTK(companionWeaponStats, enemy, enemyLevel, { steelPath, ...effectiveEnemyPrimingWithAbilities })
          : undefined;
      weapon = { name: base.name, stats: companionWeaponStats, ttk, isMelee };
    }
    result.companion = { name: c.name, bodyStats, weapon };
  }

  return result;
}

/** Weapon DPS stats from a saved build payload (shared by weapon / loadout previews). */
export function calcSavedWeaponBuildStats(
  build: WeaponBuildPayload,
  simParams: SimulationParams = scenarioSimParams("midFight"),
  linkage: SetBonusLinkage = {},
): Omit<LoadoutWeaponSlotStats, "ttk"> | null {
  const entry = calcWeaponSlotStats(build, simParams, linkage);
  if (!entry) return null;
  const { ttk: _ttk, ...rest } = entry;
  return rest;
}

export function bestSustainedDps(stats: LoadoutStatsResult): {
  slot: string;
  name: string;
  sustainedDps: number;
} | null {
  const slots: { slot: string; entry: LoadoutWeaponSlotStats | null }[] = [
    { slot: "Primary", entry: stats.primary },
    { slot: "Secondary", entry: stats.secondary },
    { slot: "Melee", entry: stats.melee },
    { slot: "Exalted", entry: stats.exalted },
    { slot: "Exalted Melee", entry: stats.exaltedMelee },
  ];
  let best: { slot: string; name: string; sustainedDps: number } | null = null;
  for (const { slot, entry } of slots) {
    if (!entry) continue;
    const dps = entry.ttk?.sustainedDps ?? entry.stats.sustainedDps;
    if (!best || dps > best.sustainedDps) {
      best = { slot, name: entry.name, sustainedDps: dps };
    }
  }
  return best;
}

export function fmtDamageNum(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "–";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(decimals);
}

export { ENEMY_TYPES };
