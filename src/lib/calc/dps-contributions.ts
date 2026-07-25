import {
  calculateWeaponBuild,
  calculateWeaponBuildWithArcanes,
} from "@/lib/calc/calculator";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import {
  DEFAULT_SIM_PARAMS,
  type CalculatedStats,
  type Mod,
  type ModSlot,
  type SetBonusLinkage,
  type SimulationParams,
  type Weapon,
  type WeaponCalculationOptions,
} from "@/lib/types";
import { mergeWeaponCalcOptions, resolveWeaponExternalBuffs, type WeaponBuffContext } from "@/lib/weapons/weapon-external-buffs";
import {
  countSetModsInSlots,
  countSynthSetPieces,
  SYNTH_SET_MOD_IDS,
  VIGILANTE_MOD_IDS,
  weaponAcceptsSynthReloadBonus,
  weaponSupportsPrimaryStyleSets,
} from "@/lib/calc/set-bonuses";

export type DpsContributionCategory =
  | "damage"
  | "crit"
  | "rate"
  | "multishot"
  | "elemental"
  | "conditional"
  | "arcane"
  | "external"
  | "set"
  | "other";

export interface DpsContribution {
  id: string;
  label: string;
  category: DpsContributionCategory;
  /** Arsenal-style stat line(s), e.g. "+165% Damage". */
  nominal?: string;
  burstMarginalPct: number;
  sustainedMarginalPct: number;
  tooltip?: string;
}

export interface WeaponDpsCalcContext {
  baseWeapon: Weapon;
  modSlots: ModSlot[];
  allMods: Map<string, Mod>;
  arcanes?: Mod[];
  incarnonStatChanges?: Record<string, number>;
  simParams?: SimulationParams;
  calcOptions?: WeaponCalculationOptions;
  linkage?: SetBonusLinkage;
  rivenStatChanges?: Record<string, number>;
}

type OmitSource = {
  id: string;
  label: string;
  category: DpsContributionCategory;
  nominal?: string;
  tooltip?: string;
  apply: (ctx: WeaponDpsCalcContext) => WeaponDpsCalcContext | null;
};

const CATEGORY_ORDER: DpsContributionCategory[] = [
  "damage",
  "crit",
  "rate",
  "multishot",
  "elemental",
  "conditional",
  "arcane",
  "external",
  "set",
  "other",
];

function cloneLinkage(linkage?: SetBonusLinkage): SetBonusLinkage | undefined {
  if (!linkage) return undefined;
  return {
    warframeMods: linkage.warframeMods ? [...linkage.warframeMods] : undefined,
    primaryMods: linkage.primaryMods ? [...linkage.primaryMods] : undefined,
    secondaryMods: linkage.secondaryMods ? [...linkage.secondaryMods] : undefined,
    meleeMods: linkage.meleeMods ? [...linkage.meleeMods] : undefined,
    companionMods: linkage.companionMods ? [...linkage.companionMods] : undefined,
    companionWeaponMods: linkage.companionWeaponMods
      ? [...linkage.companionWeaponMods]
      : undefined,
  };
}

function cloneCtx(ctx: WeaponDpsCalcContext): WeaponDpsCalcContext {
  return {
    ...ctx,
    modSlots: [...ctx.modSlots],
    arcanes: ctx.arcanes ? [...ctx.arcanes] : undefined,
    simParams: ctx.simParams ? { ...ctx.simParams } : undefined,
    calcOptions: ctx.calcOptions
      ? {
          ...ctx.calcOptions,
          externalBuffs: ctx.calcOptions.externalBuffs
            ? ctx.calcOptions.externalBuffs.map((b) => ({ ...b }))
            : undefined,
        }
      : undefined,
    linkage: cloneLinkage(ctx.linkage),
    incarnonStatChanges: ctx.incarnonStatChanges ? { ...ctx.incarnonStatChanges } : undefined,
    rivenStatChanges: ctx.rivenStatChanges ? { ...ctx.rivenStatChanges } : undefined,
  };
}

function calcWeaponStats(ctx: WeaponDpsCalcContext): CalculatedStats {
  const sim = ctx.simParams ?? DEFAULT_SIM_PARAMS;
  const arcanes = ctx.arcanes ?? [];
  if (arcanes.length > 0) {
    return calculateWeaponBuildWithArcanes(
      ctx.baseWeapon,
      ctx.modSlots,
      ctx.allMods,
      arcanes,
      ctx.incarnonStatChanges,
      sim,
      ctx.calcOptions,
      ctx.linkage,
      ctx.rivenStatChanges,
    );
  }
  return calculateWeaponBuild(
    ctx.baseWeapon,
    ctx.modSlots,
    ctx.allMods,
    ctx.incarnonStatChanges,
    sim,
    ctx.calcOptions,
    ctx.linkage,
    ctx.rivenStatChanges,
  );
}

function marginalPct(full: number, without: number): number {
  if (without <= 0) return full > 0 ? 100 : 0;
  return ((full - without) / without) * 100;
}

function inferModCategory(mod: Mod): DpsContributionCategory {
  const keys = Object.keys(mod.stats);
  if (keys.some((k) => k === "damage" || k === "damageFirstShot" || k === "weakPointDamage")) return "damage";
  if (keys.some((k) => k === "criticalChance" || k === "criticalMultiplier" || k === "criticalChanceOnHeadshot")) return "crit";
  if (keys.some((k) => k === "fireRate" || k === "attackSpeed")) return "rate";
  if (keys.some((k) => k === "multishot" || k === "multishotOnKill")) return "multishot";
  if (
    keys.some((k) =>
      ["heat", "cold", "toxin", "electricity", "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau"].includes(k),
    )
  ) {
    return "elemental";
  }
  if (
    mod.id.includes("blood_rush") ||
    mod.id.includes("condition_overload") ||
    mod.id.includes("weeping_wounds") ||
    mod.id.includes("berserker") ||
    mod.id.includes("galvanized")
  ) {
    return "conditional";
  }
  return "other";
}

function modNominalLine(mod: Mod, rank: number): string {
  const lines = getModStatDisplayLines(mod, rank);
  return lines.map((l) => l.atRank).join(", ");
}

function externalBuffContributionCategory(buff: import("@/lib/types").WeaponExternalBuff): DpsContributionCategory {
  if (buff.elemental?.length) return "elemental";
  if (
    buff.critChanceBonus ||
    buff.critChanceFlatBonus ||
    buff.critMultBonus ||
    buff.critMultFlatBonus
  ) {
    return "crit";
  }
  if (buff.fireRateBonus) return "rate";
  if (buff.multishotBonus) return "multishot";
  if (buff.damageBonus || buff.damageMultBonus || buff.statusBonus) return "damage";
  return "external";
}

function enumerateSources(ctx: WeaponDpsCalcContext): OmitSource[] {
  const sources: OmitSource[] = [];

  for (const slot of ctx.modSlots) {
    const mod = ctx.allMods.get(slot.modId);
    if (!mod) continue;
    const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod.maxRank);
    const isRiven = slot.modId.startsWith("riven_");
    sources.push({
      id: `mod:${slot.slotIndex}:${slot.modId}`,
      label: isRiven ? mod.name || "Riven" : mod.name,
      category: isRiven ? "other" : inferModCategory(mod),
      nominal: isRiven ? "Custom riven stats" : modNominalLine(mod, rank),
      apply: (base) => {
        const next = cloneCtx(base);
        next.modSlots = next.modSlots.filter((s) => s.slotIndex !== slot.slotIndex);
        if (isRiven) {
          const riven = next.rivenStatChanges ? { ...next.rivenStatChanges } : undefined;
          if (riven) {
            delete riven[slot.slotIndex];
            next.rivenStatChanges = Object.keys(riven).length > 0 ? riven : undefined;
          }
        }
        return next;
      },
    });
  }

  for (let i = 0; i < (ctx.arcanes?.length ?? 0); i++) {
    const arcane = ctx.arcanes![i];
    sources.push({
      id: `arcane:${arcane.id}:${i}`,
      label: arcane.name,
      category: "arcane",
      nominal: cleanArcaneNominal(arcane),
      tooltip: "Marginal DPS with current arcane stack count.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.arcanes = (next.arcanes ?? []).filter((_, idx) => idx !== i);
        return next;
      },
    });
  }

  if (ctx.incarnonStatChanges && Object.keys(ctx.incarnonStatChanges).length > 0) {
    sources.push({
      id: "incarnon",
      label: "Incarnon Evolution",
      category: "other",
      nominal: "Selected evolution bonuses",
      apply: (base) => {
        const next = cloneCtx(base);
        next.incarnonStatChanges = undefined;
        return next;
      },
    });
  }

  if (ctx.rivenStatChanges && Object.keys(ctx.rivenStatChanges).length > 0) {
    if (!ctx.modSlots.some((s) => s.modId.startsWith("riven_"))) {
      sources.push({
        id: "riven",
        label: "Riven",
        category: "other",
        nominal: "Custom riven stats",
        apply: (base) => {
          const next = cloneCtx(base);
          next.rivenStatChanges = undefined;
          return next;
        },
      });
    }
  }

  if (
    ctx.calcOptions?.progenitorElement &&
    ctx.calcOptions.progenitorBonusPercent != null &&
    ctx.calcOptions.progenitorBonusPercent > 0
  ) {
    sources.push({
      id: "progenitor",
      label: "Progenitor Bonus",
      category: "elemental",
      nominal: `+${ctx.calcOptions.progenitorBonusPercent}% ${ctx.calcOptions.progenitorElement}`,
      apply: (base) => {
        const next = cloneCtx(base);
        const opts = next.calcOptions;
        if (!opts) return next;
        next.calcOptions = mergeWeaponCalcOptions(
          {
            progenitorElement: undefined,
            progenitorBonusPercent: undefined,
          },
          opts.externalBuffs ?? [],
        );
        return next;
      },
    });
  }

  for (const buff of ctx.calcOptions?.externalBuffs ?? []) {
    sources.push({
      id: buff.id,
      label: buff.label,
      category: externalBuffContributionCategory(buff),
      nominal: buff.nominal,
      tooltip:
        buff.category === "ability"
          ? "Warframe ability weapon damage buff at current strength."
          : buff.category === "shard"
            ? "Archon shard bonus applied to this weapon type."
            : buff.category === "companion"
              ? "Companion bond mod buff applied to your weapons."
              : buff.category === "warframe_mod"
                ? "Warframe mod (stance augment / ability augment) applied to this weapon."
                : buff.category === "set"
                  ? "Set bonus from other loadout slots."
                  : undefined,
      apply: (base) => {
        const next = cloneCtx(base);
        const opts = next.calcOptions;
        if (!opts?.externalBuffs) return next;
        const remaining = opts.externalBuffs.filter((b) => b.id !== buff.id);
        next.calcOptions = mergeWeaponCalcOptions(
          {
            progenitorElement: opts.progenitorElement,
            progenitorBonusPercent: opts.progenitorBonusPercent,
          },
          remaining,
        );
        return next;
      },
    });
  }

  const sim = ctx.simParams ?? DEFAULT_SIM_PARAMS;

  if (sim.extraGladiatorMods > 0) {
    sources.push({
      id: "wf-gladiator",
      label: "Warframe Gladiator",
      category: "external",
      nominal: `${sim.extraGladiatorMods} Gladiator mod(s) on frame`,
      tooltip: "Gladiator set on warframe — crit bonus scales with melee combo.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), extraGladiatorMods: 0 };
        return next;
      },
    });
  }

  if ((sim.extraVigilanteModsFromWarframe ?? 0) > 0) {
    sources.push({
      id: "wf-vigilante",
      label: "Warframe Vigilante",
      category: "external",
      nominal: `${sim.extraVigilanteModsFromWarframe} Vigilante mod(s) on frame`,
      tooltip: "Each Vigilante mod on warframe upgrades primary crit tier (+5% per piece).",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), extraVigilanteModsFromWarframe: 0 };
        return next;
      },
    });
  }

  if ((sim.extraTekSetPiecesOffWeapon ?? 0) > 0) {
    sources.push({
      id: "wf-tek-pieces",
      label: "Off-weapon Tek set",
      category: "external",
      nominal: `${sim.extraTekSetPiecesOffWeapon} Tek piece(s) elsewhere`,
      tooltip: "Tek mods on other loadout slots toward the 4-piece set.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), extraTekSetPiecesOffWeapon: 0 };
        return next;
      },
    });
  }

  if (sim.applyTekSetVsMarkedDamage) {
    sources.push({
      id: "tek-marked",
      label: "Tek vs marked",
      category: "external",
      nominal: "+60% damage vs marked",
      tooltip: "Tek 4-set bonus vs Kavat-marked enemies.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), applyTekSetVsMarkedDamage: false };
        return next;
      },
    });
  }

  if (sim.applyHunterSetVsSlashDamage) {
    sources.push({
      id: "hunter-slash",
      label: "Hunter vs Slash",
      category: "external",
      nominal: "+25%/piece companion dmg vs Slash",
      tooltip: "Hunter set bonus on beast claws / sentinel weapons vs Slash-status targets.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), applyHunterSetVsSlashDamage: false };
        return next;
      },
    });
  }

  if (sim.applyMechaEmpoweredVsMarkedDamage) {
    sources.push({
      id: "mecha-marked",
      label: "Mecha Empowered vs marked",
      category: "external",
      nominal: "+150% damage vs marked",
      tooltip: "Mecha Empowered aura vs companion-marked enemies (requires ≥1 Mecha set piece).",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = {
          ...(next.simParams ?? DEFAULT_SIM_PARAMS),
          applyMechaEmpoweredVsMarkedDamage: false,
        };
        return next;
      },
    });
  }

  if ((sim.extraSynthSetPiecesOffWeapon ?? 0) > 0) {
    sources.push({
      id: "wf-synth-pieces",
      label: "Off-weapon Synth set",
      category: "external",
      nominal: `${sim.extraSynthSetPiecesOffWeapon} Synth piece(s) elsewhere`,
      tooltip: "Synth set pieces on companion/warframe — mainly affects sustained DPS via reload.",
      apply: (base) => {
        const next = cloneCtx(base);
        next.simParams = { ...(next.simParams ?? DEFAULT_SIM_PARAMS), extraSynthSetPiecesOffWeapon: 0 };
        return next;
      },
    });
  }

  if (ctx.linkage?.warframeMods && weaponSupportsPrimaryStyleSets(ctx.baseWeapon)) {
    const vigSet = new Set<string>(VIGILANTE_MOD_IDS);
    const vigFromWf = countSetModsInSlots(ctx.linkage.warframeMods, vigSet);
    if (vigFromWf > 0) {
      sources.push({
        id: "linkage-wf-vigilante",
        label: "Warframe Vigilante (loadout)",
        category: "set",
        nominal: `${vigFromWf} Vigilante mod(s) on frame`,
        tooltip: "Vigilante mods on warframe improve primary crit tier (+5% per piece).",
        apply: (base) => {
          const next = cloneCtx(base);
          if (!next.linkage?.warframeMods) return null;
          next.linkage = {
            ...next.linkage,
            warframeMods: next.linkage.warframeMods.filter((s) => !vigSet.has(s.modId)),
          };
          return next;
        },
      });
    }
  }

  if (ctx.linkage && weaponAcceptsSynthReloadBonus(ctx.baseWeapon)) {
    const synthSet = new Set<string>(SYNTH_SET_MOD_IDS);
    const totalSynth = countSynthSetPieces(ctx.linkage, ctx.modSlots);
    const onWeaponSynth = countSetModsInSlots(ctx.modSlots, synthSet);
    const offWeaponSynth = totalSynth - onWeaponSynth;
    if (offWeaponSynth > 0 && totalSynth >= 4) {
      sources.push({
        id: "linkage-synth-reload",
        label: "Synth 4-set reload (loadout)",
        category: "set",
        nominal: `${offWeaponSynth} off-weapon Synth piece(s)`,
        tooltip: "Synth 4-set grants +15% reload speed on pistols when complete across the loadout.",
        apply: (base) => {
          const next = cloneCtx(base);
          if (!next.linkage) return null;
          const stripSynth = (slots?: ModSlot[]) =>
            slots?.filter((s) => !synthSet.has(s.modId) || next.modSlots.some((w) => w.modId === s.modId && w.slotIndex === s.slotIndex));
          next.linkage = {
            warframeMods: stripSynth(next.linkage.warframeMods),
            primaryMods: stripSynth(next.linkage.primaryMods),
            secondaryMods: stripSynth(next.linkage.secondaryMods),
            meleeMods: stripSynth(next.linkage.meleeMods),
            companionMods: stripSynth(next.linkage.companionMods),
          };
          return next;
        },
      });
    }
  }

  return sources;
}

function cleanArcaneNominal(arcane: Mod): string | undefined {
  const desc = arcane.description?.replace(/\\n/g, " ").trim();
  return desc ? desc.slice(0, 80) + (desc.length > 80 ? "…" : "") : undefined;
}

export function computeDpsContributions(ctx: WeaponDpsCalcContext): DpsContribution[] {
  const full = calcWeaponStats(ctx);
  const fullBurst = full.burstDps;
  const fullSustained = full.sustainedDps;

  const contributions: DpsContribution[] = [];

  for (const source of enumerateSources(ctx)) {
    const omitted = source.apply(ctx);
    if (!omitted) continue;
    const without = calcWeaponStats(omitted);
    const burstMarginal = marginalPct(fullBurst, without.burstDps);
    const sustainedMarginal = marginalPct(fullSustained, without.sustainedDps);

    if (Math.abs(burstMarginal) < 0.05 && Math.abs(sustainedMarginal) < 0.05) continue;

    contributions.push({
      id: source.id,
      label: source.label,
      category: source.category,
      nominal: source.nominal,
      burstMarginalPct: burstMarginal,
      sustainedMarginalPct: sustainedMarginal,
      tooltip: source.tooltip,
    });
  }

  contributions.sort((a, b) => {
    const burstDiff = b.burstMarginalPct - a.burstMarginalPct;
    if (Math.abs(burstDiff) > 0.01) return burstDiff;
    const catA = CATEGORY_ORDER.indexOf(a.category);
    const catB = CATEGORY_ORDER.indexOf(b.category);
    return catA - catB;
  });

  return contributions;
}

export function formatMarginalPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  if (Math.abs(value) >= 100) return `${sign}${value.toFixed(0)}%`;
  if (Math.abs(value) >= 10) return `${sign}${value.toFixed(1)}%`;
  return `${sign}${value.toFixed(1)}%`;
}

export function buildWeaponContributionContext(params: {
  weapon: Weapon;
  modSlots: ModSlot[];
  allMods: Map<string, Mod>;
  arcanes?: Mod[];
  incarnonStatChanges?: Record<string, number>;
  simParams?: SimulationParams;
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  linkage?: SetBonusLinkage;
  rivenStatChanges?: Record<string, number>;
  buffContext?: WeaponBuffContext;
  abilityStrength?: number;
}): WeaponDpsCalcContext {
  const simParams = params.simParams ?? DEFAULT_SIM_PARAMS;
  const externalBuffs = resolveWeaponExternalBuffs(params.weapon, params.buffContext, simParams);
  const calcOptions = mergeWeaponCalcOptions(
    {
      progenitorElement: params.progenitorElement,
      progenitorBonusPercent: params.progenitorBonusPercent,
      abilityStrength: params.abilityStrength,
    },
    externalBuffs,
  );

  return {
    baseWeapon: params.weapon,
    modSlots: params.modSlots,
    allMods: params.allMods,
    arcanes: params.arcanes,
    incarnonStatChanges: params.incarnonStatChanges,
    simParams,
    calcOptions,
    linkage: params.linkage,
    rivenStatChanges: params.rivenStatChanges,
  };
}
