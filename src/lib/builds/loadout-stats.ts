import {
  getEffectiveCompanionsMap,
  getEffectiveModsMap,
  getEffectiveWarframesMap,
  getEffectiveWeapons,
  getEffectiveWeaponsMap,
} from "@/lib/weapons/effective-data";
import { incarnonDataMap } from "@/data/incarnon";
import type { WarframeBuildData } from "@/lib/builds/build-storage";
import { allDualFormMods, getDualFormConfig } from "@/lib/builds/dual-form-warframes";
import { resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import { resolveDefaultCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { weaponFromModularData } from "@/lib/builds/modular-resolve";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { getMeleeExaltedWeapon, getPrimaryExaltedWeapon } from "@/lib/weapons/exalted-weapons";
import {
  applyWarframeShardsAndArcanes,
  calculateWarframeBuild,
  calculateWeaponBuild,
  calculateWeaponBuildWithArcanes,
} from "@/lib/calc/calculator";
import { resolveIncarnonActiveWeapon, isIncarnonFormActive } from "@/lib/calc/incarnon-active-weapon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { calculateTTK, ENEMY_TYPES, type EnemyType, type TTKResult } from "@/lib/calc/ttk";
import { buildWeaponContributionContext, computeDpsContributions, type DpsContribution } from "@/lib/calc/dps-contributions";
import { rivenStatChangesFromModSlots } from "@/lib/warframe-arsenal/riven-resolve";
import {
  applyJetStreamWarframeMove,
  mergeWeaponCalcOptions,
  resolveAbilitiesWithHelminth,
  resolveWeaponExternalBuffs,
  type WeaponBuffContext,
} from "@/lib/weapons/weapon-external-buffs";
import type {
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
  },
  midFight: {
    ...DEFAULT_SIM_PARAMS,
    comboCount: 40,
    killStacks: 3,
    statusTypesOnTarget: 2,
    arcaneStacks: 6,
    applyTenaciousBondCrit: true,
    applyReinforcedBondFireRate: true,
  },
  fullRamp: {
    ...DEFAULT_SIM_PARAMS,
    comboCount: 220,
    killStacks: 5,
    statusTypesOnTarget: 4,
    arcaneStacks: 12,
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
  simParams?: SimulationParams;
  enemy?: EnemyType | null;
  enemyLevel?: number;
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
  const m = loadout.modularBuild;
  const wfMods = loadout.warframeBuild
    ? allDualFormMods(loadout.warframeBuild as WarframeBuildData)
    : undefined;
  return {
    warframeMods: wfMods,
    primaryMods: loadout.primaryBuild?.mods ?? (m?.slot === "primary" ? m.mods : undefined),
    secondaryMods: loadout.secondaryBuild?.mods ?? (m?.slot === "secondary" ? m.mods : undefined),
    meleeMods: loadout.meleeBuild?.mods ?? (m?.slot === "melee" ? m.mods : undefined),
    companionMods: loadout.companionBuild?.mods,
    companionWeaponMods: loadout.companionBuild?.weaponMods,
  };
}

function getIncarnonStatChanges(
  weaponId: string,
  evolutions?: Record<number, number>,
  options?: { chargeMode?: boolean },
): Record<string, number> | undefined {
  const data = incarnonDataMap.get(weaponId);
  return mergeIncarnonStatChanges(data, evolutions ?? {}, weaponId, {
    formActive: isIncarnonFormActive(evolutions, data),
    chargeMode: options?.chargeMode === true,
  });
}

export const getIncarnonStatChangesForWeapon = getIncarnonStatChanges;

export type WeaponBuildPayload = {
  weaponId: string;
  mods: ModSlot[];
  arcaneIds?: (string | null)[];
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  incarnonEvolutions?: Record<number, number>;
};

function calcWeaponSlotStats(
  build: WeaponBuildPayload | undefined,
  simParams: SimulationParams,
  setLinkage: SetBonusLinkage,
  enemy?: EnemyType | null,
  enemyLevel?: number,
  buffContext?: WeaponBuffContext,
): LoadoutWeaponSlotStats | null {
  if (!build) return null;
  const weaponsMap = getEffectiveWeaponsMap();
  const modsMap = getEffectiveModsMap();
  const w = weaponsMap.get(build.weaponId);
  if (!w) return null;
  const base = weaponWithPassive(w);
  const incarnonData = incarnonDataMap.get(build.weaponId);
  const calcWeapon = resolveIncarnonActiveWeapon(base, incarnonData, build.incarnonEvolutions, {
    onosIncarnonMode: simParams.onosIncarnonMode,
  });
  const formActive = isIncarnonFormActive(build.incarnonEvolutions, incarnonData);
  const progenitorOpts =
    build.progenitorElement &&
    build.progenitorBonusPercent != null &&
    build.progenitorBonusPercent > 0
      ? {
          progenitorElement: build.progenitorElement,
          progenitorBonusPercent: build.progenitorBonusPercent,
          ...(formActive ? { incarnonFormActive: true as const } : {}),
        }
      : formActive
        ? { incarnonFormActive: true as const }
        : undefined;
  const externalBuffs = resolveWeaponExternalBuffs(calcWeapon, buffContext, simParams);
  const calcOptions = mergeWeaponCalcOptions(progenitorOpts, externalBuffs);
  const incarnonChanges = getIncarnonStatChanges(build.weaponId, build.incarnonEvolutions, {
    chargeMode: simParams.onosIncarnonMode === "charge",
  });
  const arcaneMods = resolveSavedArcaneSlots(build.arcaneIds, 2).filter((m): m is Mod => m != null);
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
    enemy && enemyLevel != null && enemyLevel > 0 ? calculateTTK(stats, enemy, enemyLevel) : undefined;
  const contributionContext = buildWeaponContributionContext({
    weapon: calcWeapon,
    modSlots,
    allMods: modsMap,
    arcanes: arcaneMods,
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
): LoadoutWeaponSlotStats | null {
  if (loadout.modularBuild?.slot !== slot) return null;
  const modsMap = getEffectiveModsMap();
  const data = loadout.modularBuild;
  let w = weaponFromModularData(data);
  if (!w) return null;
  w = weaponWithPassive(w);
  const modSlots = data.mods || [];
  const rivenStatChanges = rivenStatChangesFromModSlots(modSlots);
  const arcaneMods = resolveSavedArcaneSlots(data.arcaneIds, 2).filter((m): m is Mod => m != null);
  const externalBuffs = resolveWeaponExternalBuffs(w, buffContext, simParams);
  const calcOptions = mergeWeaponCalcOptions(undefined, externalBuffs);
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
    enemy && enemyLevel != null && enemyLevel > 0 ? calculateTTK(stats, enemy, enemyLevel) : undefined;
  const contributionContext = buildWeaponContributionContext({
    weapon: w,
    modSlots,
    allMods: modsMap,
    arcanes: arcaneMods,
    simParams,
    linkage: setLinkage,
    buffContext,
  });
  const contributions = computeDpsContributions(contributionContext);
  return { name: w.name, stats, ttk, isMelee, contributions };
}

export function calcLoadoutStats(loadout: Loadout, options: CalcLoadoutStatsOptions = {}): LoadoutStatsResult {
  const simParams = options.simParams ?? scenarioSimParams("midFight");
  const enemy = options.enemy ?? null;
  const enemyLevel = options.enemyLevel ?? 100;
  const weaponList = options.allWeapons ?? getEffectiveWeapons();
  const warframesMap = getEffectiveWarframesMap();
  const companionsMap = getEffectiveCompanionsMap();
  const modsMap = getEffectiveModsMap();
  const setLinkage = setBonusLinkageFromLoadout(loadout);

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
        Pick<WarframeBuildData, "arcaneRanks">;
      const shards = wb.shards;
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
          const stats = calculateWarframeBuild(wf, mods, modsMap, setLinkage);
          return {
            id: form.id,
            label: form.label,
            stats: applyWarframeShardsAndArcanes(
              stats,
              shards,
              resolveSavedArcaneSlots(arcaneIds, 2),
              arcaneRanks,
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
        const stats = applyWarframeShardsAndArcanes(
          calculateWarframeBuild(wf, wb.mods || [], modsMap, setLinkage),
          shards,
          resolveSavedArcaneSlots(wb.arcaneIds, 2),
          wb.arcaneRanks,
        );
        result.warframe = { name: wf.name, stats };
      }

      // Jet Stream: Turbulence-gated move speed × Strength (augment on warframe bar).
      // Dual-form default stats may share a reference with forms[] — apply once per object.
      {
        const seen = new Set<WarframeCalculatedStats>();
        const applyOnce = (stats: WarframeCalculatedStats) => {
          if (seen.has(stats)) return;
          seen.add(stats);
          applyJetStreamWarframeMove(
            stats,
            setLinkage.warframeMods,
            modsMap,
            simParams,
          );
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
        allMods: modsMap,
      };

      const wfStr = result.warframe?.stats.abilityStrength ?? 1;
      const calcExaltedSlot = (
        weapon: Weapon | null,
        modSlots: ModSlot[],
        arcaneIds: (string | null)[] | undefined,
      ): LoadoutWeaponSlotStats | null => {
        if (!weapon) return null;
        const arcanes = resolveSavedArcaneSlots(arcaneIds, 2).filter((m): m is Mod => m != null);
        if (modSlots.length === 0 && arcanes.length === 0) return null;
        const base = weaponWithPassive(weapon);
        const externalBuffs = resolveWeaponExternalBuffs(base, buffContext, simParams);
        const calcOptions = {
          ...mergeWeaponCalcOptions(undefined, externalBuffs),
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
          enemy && enemyLevel > 0 ? calculateTTK(statsEx, enemy, enemyLevel) : undefined;
        const contributions = computeDpsContributions(
          buildWeaponContributionContext({
            weapon: base,
            modSlots,
            allMods: modsMap,
            arcanes,
            simParams,
            linkage: setLinkage,
            buffContext,
            abilityStrength: wfStr,
          }),
        );
        return { name: base.name, stats: statsEx, ttk, isMelee, contributions };
      };

      result.exalted = calcExaltedSlot(
        getPrimaryExaltedWeapon(loadout.warframeBuild!.warframeId, weaponList),
        loadout.warframeBuild.exaltedMods || [],
        loadout.warframeBuild.exaltedArcaneIds,
      );
      result.exaltedMelee = calcExaltedSlot(
        getMeleeExaltedWeapon(loadout.warframeBuild!.warframeId, weaponList),
        loadout.warframeBuild.exaltedMeleeMods || [],
        loadout.warframeBuild.exaltedMeleeArcaneIds,
      );
    }
  }

  if (loadout.companionBuild) {
    const c = companionsMap.get(loadout.companionBuild.companionId);
    if (c) {
      let companionWeaponCritChance: number | undefined;
      const weaponMods = loadout.companionBuild.weaponMods || [];
      if (weaponMods.length > 0) {
        const companionWeapon = resolveCompanionWeaponForLoadout(
          loadout.companionBuild,
          c,
          weaponList,
        );
        if (companionWeapon) {
          const cwStats = calculateWeaponBuild(
            weaponWithPassive(companionWeapon),
            weaponMods,
            modsMap,
            undefined,
            simParams,
            undefined,
            setLinkage,
          );
          companionWeaponCritChance = cwStats.criticalChance;
        }
      }
      buffContext = {
        ...buffContext,
        companionModSlots: loadout.companionBuild.mods ?? [],
        companionWeaponCritChance,
        allMods: modsMap,
      };
    }
  }

  result.primary =
    calcModularSlotStats(loadout, "primary", simParams, setLinkage, enemy, enemyLevel, buffContext) ??
    calcWeaponSlotStats(loadout.primaryBuild, simParams, setLinkage, enemy, enemyLevel, buffContext);
  result.secondary =
    calcModularSlotStats(loadout, "secondary", simParams, setLinkage, enemy, enemyLevel, buffContext) ??
    calcWeaponSlotStats(loadout.secondaryBuild, simParams, setLinkage, enemy, enemyLevel, buffContext);
  result.melee =
    calcModularSlotStats(loadout, "melee", simParams, setLinkage, enemy, enemyLevel, buffContext) ??
    calcWeaponSlotStats(loadout.meleeBuild, simParams, setLinkage, enemy, enemyLevel, buffContext);

  if (loadout.companionBuild) {
    const c = companionsMap.get(loadout.companionBuild.companionId);
    if (c) {
      const bodyStats = calculateCompanionBuild(c, loadout.companionBuild.mods || [], modsMap);
      let weapon: LoadoutWeaponSlotStats | null = null;
      const weaponMods = loadout.companionBuild.weaponMods || [];
      if (weaponMods.length > 0) {
        const companionWeapon = resolveCompanionWeaponForLoadout(
          loadout.companionBuild,
          c,
          weaponList,
        );
        if (companionWeapon) {
          const base = weaponWithPassive(companionWeapon);
          const stats = calculateWeaponBuild(
            base,
            weaponMods,
            modsMap,
            undefined,
            simParams,
            undefined,
            setLinkage,
          );
          const isMelee = base.category === "melee" || base.triggerType === "Melee";
          const ttk =
            enemy && enemyLevel > 0 ? calculateTTK(stats, enemy, enemyLevel) : undefined;
          weapon = { name: base.name, stats, ttk, isMelee };
        }
      }
      result.companion = { name: c.name, bodyStats, weapon };
    }
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
