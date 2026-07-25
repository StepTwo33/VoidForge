import type { Mod, ModSlot, SetBonusLinkage, SetBonusSummaryLine } from "../types";

export const VIGILANTE_MOD_IDS = [
  "vigilante_armaments",
  "vigilante_fervor",
  "vigilante_offense",
  "vigilante_pursuit",
  "vigilante_supplies",
  "vigilante_vigor",
] as const;

/** Primary / rifle / shotgun / bow / launcher / archgun — not secondary or melee. */
export function weaponSupportsPrimaryStyleSets(weapon: { category: string; triggerType?: string }): boolean {
  const c = weapon.category;
  if (c === "melee" || weapon.triggerType === "Melee") return false;
  if (c === "pistol" || c === "secondary" || c === "dual_pistols") return false;
  return (
    c === "primary" ||
    c === "rifle" ||
    c === "shotgun" ||
    c === "bow" ||
    c === "launcher" ||
    c === "archgun"
  );
}

/** Warframe + pistol — Augur Pact is secondary-only. */
export const AUGUR_SET_MOD_IDS = [
  "augur_message",
  "augur_seeker",
  "augur_reach",
  "augur_accord",
  "augur_secrets",
  "augur_breach",
] as const;

export const HUNTER_SET_MOD_IDS = [
  "hunter_adrenaline",
  "hunter_munitions",
  "hunter_track",
  "hunter_recovery",
  "hunter_command",
  "hunter_synergy",
] as const;

export const MECHA_SET_MOD_IDS = [
  "mecha_pulse_r3",
  "mecha_empowered",
  "mecha_recharge",
  "mecha_overdrive",
] as const;

export const SYNTH_SET_MOD_IDS = [
  "synth_deconstruct",
  "synth_fiber",
  "synth_charge_r3",
  "synth_reflex_r3",
] as const;

/** Tek Enhance (Kavat) is in-game piece #4 — add when present in data. */
export const TEK_SET_MOD_IDS = [
  "tek_collateral_r3",
  "tek_assault_r3",
  "tek_gravity_r3",
  "tek_enhance",
] as const;

export const UMBRAL_MOD_IDS = [
  "umbra_vitality",
  "umbra_fiber",
  "umbra_intensify",
] as const;

const AUGUR_SET = new Set<string>(AUGUR_SET_MOD_IDS);
const HUNTER_SET = new Set<string>(HUNTER_SET_MOD_IDS);
const MECHA_SET = new Set<string>(MECHA_SET_MOD_IDS);
const SYNTH_SET = new Set<string>(SYNTH_SET_MOD_IDS);
const TEK_SET = new Set<string>(TEK_SET_MOD_IDS);
const UMBRAL_SET = new Set<string>(UMBRAL_MOD_IDS);

/** Umbral set bonus multiplier for a mod's primary stat (1 = no bonus). Tau Resistance is excluded by caller. */
export function getUmbralSetBonusMultiplier(modId: string, umbralCount: number): number {
  if (umbralCount < 2 || !UMBRAL_SET.has(modId)) return 1;
  if (modId === "umbra_intensify") {
    return 1 + (umbralCount >= 3 ? 0.75 : 0.25);
  }
  return 1 + (umbralCount >= 3 ? 0.8 : 0.3);
}

export function countUmbralSetPieces(warframeMods: ModSlot[]): number {
  return countSetModsInSlots(warframeMods, UMBRAL_SET);
}

export function countSetModsInSlots(slots: ModSlot[] | undefined, setMembers: Set<string>): number {
  if (!slots?.length) return 0;
  return slots.reduce((n, s) => n + (setMembers.has(s.modId) ? 1 : 0), 0);
}

function concatSlots(...groups: (ModSlot[] | undefined)[]): ModSlot[] {
  const out: ModSlot[] = [];
  for (const g of groups) {
    if (g?.length) out.push(...g);
  }
  return out;
}

/** Augur pieces only count from Warframe + secondary (Augur Pact). */
export function countAugurSetPieces(warframeMods?: ModSlot[], secondaryMods?: ModSlot[]): number {
  return countSetModsInSlots(concatSlots(warframeMods, secondaryMods), AUGUR_SET);
}

/**
 * wiki Augur Set: each piece converts +40% of Energy spent on abilities into Shields
 * (max 240% at 6). Pass the actual Energy spent after Ability Efficiency.
 */
export function augurShieldsFromEnergySpent(energySpent: number, pieces: number): number {
  if (pieces <= 0 || energySpent <= 0) return 0;
  return energySpent * pieces * 0.4;
}

/** Hunter set spans frame, weapons, and companion. */
export function countHunterSetPieces(linkage: SetBonusLinkage | undefined, warframeMods: ModSlot[]): number {
  return countSetModsInSlots(
    concatSlots(
      warframeMods,
      linkage?.primaryMods,
      linkage?.secondaryMods,
      linkage?.meleeMods,
      linkage?.companionMods,
    ),
    HUNTER_SET,
  );
}

/** Beast claws / sentinel weapons receive the Hunter set companion damage bonus. */
export function weaponSupportsHunterCompanionSet(weapon: {
  category: string;
  triggerType?: string;
}): boolean {
  const c = weapon.category;
  return c === "beast_claw" || c === "sentinel_weapon";
}

/**
 * wiki Hunter Set: companions gain +25% damage per piece vs Slash-status targets
 * (max +150% at 6 → 2.5×). Returns 1 when inactive.
 */
export function hunterCompanionDamageMultiplier(pieces: number): number {
  if (pieces <= 0) return 1;
  return 1 + Math.min(pieces, 6) * 0.25;
}

export function countMechaSetPieces(warframeMods: ModSlot[], companionMods?: ModSlot[]): number {
  return countSetModsInSlots(concatSlots(warframeMods, companionMods), MECHA_SET);
}

export interface MechaSetMarkStats {
  pieces: number;
  /** Seconds between companion marks. */
  cooldownSec: number;
  /** Mark duration (s). */
  markDurationSec: number;
  /** Status spread radius on mark-kill (m). */
  spreadRangeM: number;
}

const MECHA_MARK_BY_PIECES: readonly Omit<MechaSetMarkStats, "pieces">[] = [
  { cooldownSec: 60, markDurationSec: 3, spreadRangeM: 7.5 },
  { cooldownSec: 45, markDurationSec: 6, spreadRangeM: 15 },
  { cooldownSec: 30, markDurationSec: 9, spreadRangeM: 22.5 },
  { cooldownSec: 15, markDurationSec: 12, spreadRangeM: 30 },
];

/**
 * wiki Mecha Set: companion mark cooldown / duration / spread range by piece count.
 * Requires Kubrow or Predasite. Returns null when inactive.
 */
export function computeMechaSetMarkStats(pieces: number): MechaSetMarkStats | null {
  const p = Math.min(4, Math.max(0, Math.floor(pieces)));
  if (p <= 0) return null;
  const row = MECHA_MARK_BY_PIECES[p - 1]!;
  return { pieces: p, ...row };
}

/** Wiki DoT tick fractions used when Mecha spreads status on mark-kill. */
const MECHA_SPREAD_DOT_FRAC: Record<string, number> = {
  slash: 0.35,
  heat: 0.5,
  toxin: 0.5,
  electricity: 0.5,
  gas: 0.5,
};

const CLAW_ELEMENTAL_STAT_KEYS = [
  "heat",
  "cold",
  "toxin",
  "electricity",
  "magnetic",
  "radiation",
  "viral",
  "corrosive",
  "gas",
  "blast",
] as const;

/**
 * Sum matching elemental fractions from beast claw mods (per-rank % × (rank+1)).
 * wiki Mecha: Sepsis Claws R10 +330% Toxin → 3.3 on transferred Toxin ticks.
 */
export function sumClawElementalBonuses(
  clawMods: ModSlot[] | undefined,
  allMods: Map<string, Mod>,
): Record<string, number> {
  const out: Record<string, number> = {};
  if (!clawMods?.length) return out;
  for (const slot of clawMods) {
    const mod = allMods.get(slot.modId);
    if (!mod?.stats) continue;
    const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod.maxRank);
    for (const key of CLAW_ELEMENTAL_STAT_KEYS) {
      const perRank = mod.stats[key];
      if (typeof perRank === "number" && perRank !== 0) {
        out[key] = (out[key] ?? 0) + (perRank * (rank + 1)) / 100;
      }
    }
  }
  return out;
}

/**
 * wiki Mecha Set: transferred DoT tick = sum(DoT procs on marked) × type fraction
 * × (1 + matching claw elemental %). Paper DPS amortizes mark-kill spreads over
 * mark cooldown (not in TTK). Optional cascadeEnemies models a second hop in the
 * same CD window (user-estimated; not mission AI).
 */
export function computeMechaSpreadPaperDps(opts: {
  pieces: number;
  enemies: number;
  /** Extra enemies from a second mark-kill cascade (same tick math). */
  cascadeEnemies?: number;
  /** damagePerTick of each DoT type present on the marked target */
  dotTicks: { type: string; damagePerTick: number }[];
  /** Assumed remaining duration of transferred DoTs (s). Default 6. */
  remainingDurationSec?: number;
  /** Claw elemental fractions by type (e.g. toxin: 3.3 for Sepsis R10). */
  clawElementalBonuses?: Record<string, number>;
}): number {
  const firstHop = Math.max(0, Math.floor(opts.enemies));
  const cascade = Math.max(0, Math.floor(opts.cascadeEnemies ?? 0));
  const enemies = firstHop + cascade;
  if (enemies <= 0) return 0;
  const mark = computeMechaSetMarkStats(opts.pieces);
  if (!mark || mark.cooldownSec <= 0) return 0;

  const present = opts.dotTicks.filter(
    (d) => d.damagePerTick > 0 && MECHA_SPREAD_DOT_FRAC[d.type] != null,
  );
  if (!present.length) return 0;

  const sum = present.reduce((s, d) => s + d.damagePerTick, 0);
  const claw = opts.clawElementalBonuses ?? {};
  let tickSum = 0;
  for (const d of present) {
    const frac = MECHA_SPREAD_DOT_FRAC[d.type] ?? 0;
    const clawMult = 1 + (claw[d.type] ?? 0);
    tickSum += sum * frac * clawMult;
  }
  const duration = opts.remainingDurationSec ?? 6;
  // 1 tick/s for duration, once per mark cycle (first hop + optional cascade)
  return (enemies * tickSum * duration) / mark.cooldownSec;
}

/** True when Mecha Empowered aura is equipped (squad +150% vs marked). */
export function linkageHasMechaEmpowered(linkage: SetBonusLinkage | undefined): boolean {
  return (linkage?.warframeMods ?? []).some((s) => s.modId === "mecha_empowered");
}

/** wiki Mecha Empowered: squad deals +150% damage vs marked → 2.5×. */
export const MECHA_EMPOWERED_VS_MARKED_MULTIPLIER = 2.5;

export function countSynthSetPieces(linkage: SetBonusLinkage | undefined, localWeaponMods: ModSlot[]): number {
  return countSetModsInSlots(
    concatSlots(
      localWeaponMods,
      linkage?.warframeMods,
      linkage?.primaryMods,
      linkage?.secondaryMods,
      linkage?.meleeMods,
      linkage?.companionMods,
    ),
    SYNTH_SET,
  );
}

export function countTekSetPieces(linkage: SetBonusLinkage | undefined, localWeaponMods: ModSlot[]): number {
  return countSetModsInSlots(
    concatSlots(
      localWeaponMods,
      linkage?.warframeMods,
      linkage?.primaryMods,
      linkage?.secondaryMods,
      linkage?.meleeMods,
      linkage?.companionMods,
    ),
    TEK_SET,
  );
}

export function weaponAcceptsSynthReloadBonus(weapon: { category: string }): boolean {
  const c = weapon.category;
  return c === "pistol" || c === "secondary" || c === "dual_pistols";
}

export function buildWeaponSetBonusSummary(
  weapon: { category: string; triggerType?: string },
  localMods: ModSlot[],
  linkage: SetBonusLinkage | undefined,
  sim: {
    extraVigilanteModsFromWarframe?: number;
    extraSynthSetPiecesOffWeapon?: number;
    extraTekSetPiecesOffWeapon?: number;
    applyTekSetVsMarkedDamage?: boolean;
    applyHunterSetVsSlashDamage?: boolean;
    applyMechaEmpoweredVsMarkedDamage?: boolean;
  },
): SetBonusSummaryLine[] {
  const vigSet = new Set<string>(VIGILANTE_MOD_IDS);
  const vigilanteWeaponCount = countSetModsInSlots(localMods, vigSet);
  const vigFromWf = linkage ? countSetModsInSlots(linkage.warframeMods, vigSet) : (sim.extraVigilanteModsFromWarframe ?? 0);
  const vigPieces = vigilanteWeaponCount + vigFromWf;

  const synthPieces = linkage
    ? countSynthSetPieces(linkage, localMods)
    : countSynthSetPieces(undefined, localMods) + (sim.extraSynthSetPiecesOffWeapon ?? 0);

  const tekPieces = linkage
    ? countTekSetPieces(linkage, localMods)
    : countTekSetPieces(undefined, localMods) + (sim.extraTekSetPiecesOffWeapon ?? 0);

  const hunterPieces = countHunterSetPieces(linkage, linkage?.warframeMods ?? []);
  const mechaPieces = countMechaSetPieces(linkage?.warframeMods ?? [], linkage?.companionMods);
  const primaryStyle = weaponSupportsPrimaryStyleSets(weapon);
  const companionStyle = weaponSupportsHunterCompanionSet(weapon);
  const hunterMult = hunterCompanionDamageMultiplier(hunterPieces);
  const mechaEmpoweredActive =
    mechaPieces >= 1 &&
    !!sim.applyMechaEmpoweredVsMarkedDamage &&
    linkageHasMechaEmpowered(linkage);

  return [
    {
      setId: "vigilante",
      label: "Vigilante",
      pieces: vigPieces,
      required: 6,
      active: vigPieces > 0 && primaryStyle,
      description: "Each piece: +5% chance to improve primary crit tier (stacks with all equipped Vigilante mods)",
    },
    {
      setId: "synth",
      label: "Synth",
      pieces: synthPieces,
      required: 4,
      active: synthPieces >= 4 && weaponAcceptsSynthReloadBonus(weapon),
      description: "4-piece: +15% Pistol Reload Speed",
    },
    {
      setId: "tek",
      label: "Tek",
      pieces: tekPieces,
      required: 4,
      active:
        tekPieces >= 4 &&
        !!sim.applyTekSetVsMarkedDamage &&
        primaryStyle,
      description: "4-piece: +60% damage to marked enemies (optional DPS toggle)",
    },
    {
      setId: "hunter",
      label: "Hunter",
      pieces: hunterPieces,
      required: 6,
      active:
        hunterPieces >= 1 &&
        !!sim.applyHunterSetVsSlashDamage &&
        companionStyle,
      description:
        companionStyle && hunterPieces >= 1
          ? `+${((hunterMult - 1) * 100).toFixed(0)}% companion damage vs Slash-status (optional DPS toggle)`
          : "Each piece: +25% companion damage vs Slash-status enemies (max +150% at 6)",
    },
    {
      setId: "mecha",
      label: "Mecha",
      pieces: mechaPieces,
      required: 4,
      active: mechaEmpoweredActive,
      description: mechaEmpoweredActive
        ? "+150% damage vs Mecha-marked (Empowered; optional DPS toggle)"
        : "Mecha Empowered: +150% vs marked when set marks a target (optional DPS toggle)",
    },
  ];
}

export function buildWarframeSetBonusSummary(
  warframeMods: ModSlot[],
  linkage?: SetBonusLinkage,
): SetBonusSummaryLine[] {
  const umbral = countUmbralSetPieces(warframeMods);
  const augur = countAugurSetPieces(warframeMods, linkage?.secondaryMods);
  const hunter = countHunterSetPieces(linkage, warframeMods);
  const mecha = countMechaSetPieces(warframeMods, linkage?.companionMods);
  const synth = countSynthSetPieces(linkage, warframeMods);
  const tek = countTekSetPieces(linkage, warframeMods);

  return [
    {
      setId: "umbral",
      label: "Umbral",
      pieces: umbral,
      required: 3,
      active: umbral >= 2,
      description:
        umbral >= 3
          ? "3-piece: +80% Health/Armor and +75% Strength on Umbral mods (Tau Resistance unscaled)"
          : umbral >= 2
            ? "2-piece: +30% Health/Armor and +25% Strength on Umbral mods (Tau Resistance unscaled)"
            : "2-piece: +30%/+25%; 3-piece: +80%/+75% on Umbral mod primary stats",
    },
    {
      setId: "augur",
      label: "Augur",
      pieces: augur,
      required: 6,
      // wiki: +40% energy→shields per equipped piece (max 240% at 6)
      active: augur >= 1,
      description:
        augur >= 1
          ? `${augur * 40}% of Energy spent becomes Shields (${augur} piece${augur === 1 ? "" : "s"})`
          : "Each piece: +40% of Energy spent becomes Shields (max 240% at 6)",
    },
    {
      setId: "hunter",
      label: "Hunter",
      pieces: hunter,
      required: 6,
      // wiki: +25% companion dmg vs Slash-status targets per piece (max +150% at 6)
      active: hunter >= 1,
      description:
        hunter >= 1
          ? `Companion +${hunter * 25}% damage vs Slash-status enemies (${hunter} piece${hunter === 1 ? "" : "s"}; optional DPS toggle)`
          : "Each piece: Companion +25% damage vs Slash-status enemies (max +150% at 6)",
    },
    {
      setId: "mecha",
      label: "Mecha",
      pieces: mecha,
      required: 4,
      active: mecha >= 1,
      // wiki: mark + status spread on kill — not a flat explosion DPS buff
      description: (() => {
        const mark = computeMechaSetMarkStats(mecha);
        if (!mark) {
          return "Each piece: shorter mark cooldown, longer mark, wider status spread on mark-kill (requires Kubrow/Predasite)";
        }
        return `Mark every ${mark.cooldownSec}s for ${mark.markDurationSec}s; kill spreads statuses in ${mark.spreadRangeM}m (Kubrow/Predasite)`;
      })(),
    },
    {
      setId: "synth",
      label: "Synth",
      pieces: synth,
      required: 4,
      active: synth >= 4,
      description: "4-piece: +15% Pistol Reload Speed; companion reloads secondary",
    },
    {
      setId: "tek",
      label: "Tek",
      pieces: tek,
      required: 4,
      active: tek >= 4,
      description: "4-piece: Kavat marks +10s; +60% damage to marked enemies",
    },
  ];
}
