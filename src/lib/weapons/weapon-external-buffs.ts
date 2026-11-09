import { allHelminthAbilities } from "@/data/helminth";
import { WIKI_WEAPON_CLASS } from "@/data/arcane-weapon-classes";
import { getArcaneEffectDef } from "@/lib/calc/arcane-calculator";
import { scaleArcaneEffectLine } from "@/lib/calc/arcane-utils";
import { helminthToAbility } from "@/lib/builds/helminth-resolve";
import {
  computeWarframeAuraEffectivenessMult,
  computeWarframeAuraStrengthMult,
} from "@/lib/calc/calculator";
import {
  computeCovenantCritChance,
  computeExcaliburSwordsmanshipBonuses,
  computeGarudaPassiveDamageBonus,
  computeKullervoMeleePassiveBonuses,
  computeMesaPassiveBonuses,
  computeSarynPassiveStatusDurationMultiplier,
  computeStyanaxHopliteCritChance,
  computeYareliCriticalFlowCritChance,
  computeZephyrAirborneCritChance,
} from "@/lib/codex/ability-misc-stats";
import {
  getVerifiedFieldScaling,
  getVerifiedMiscScaling,
} from "@/lib/codex/ability-scaling-registry";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import {
  applyVerifiedModStatToWeapon,
  getVerifiedModStatLine,
  type WeaponModAccumulators,
} from "@/lib/mods/mod-behavior-registry";
import { weaponSupportsPrimaryStyleSets } from "@/lib/calc/set-bonuses";
import type {
  Ability,
  Mod,
  ModSlot,
  SimulationParams,
  WarframeCalculatedStats,
  Weapon,
  WeaponExternalBuff,
  WeaponExternalBuffElemental,
} from "@/lib/types";

/** Wiki-verified base weapon-buff fractions (rank max). Helminth overrides when host ≠ source. */
const NOURISH_VIRAL_NATIVE = 0.75;
const NOURISH_VIRAL_HELMINTH = 0.45;
const XATA_VOID_NATIVE = 0.26;
/** Wiki Vex Armor rank-3 max Fury (assumes full stacks in sim). */
const VEX_ARMOR_MAX_FURY = 2.75;

function warframeFamilyId(warframeId: string | undefined): string {
  return (warframeId ?? "").replace(/_prime$/, "");
}

export interface WeaponBuffContext {
  warframeId?: string;
  warframeStats?: WarframeCalculatedStats;
  warframeAbilities?: Ability[];
  /** Warframe mod bar — stance augments (Voltaic Strike) and ability augments with weapon effects. */
  warframeModSlots?: ModSlot[];
  /** Equipped Warframe arcanes (e.g. Arcane Rage, Arcane Acceleration). */
  warframeArcaneIds?: (string | null)[];
  warframeArcaneRanks?: number[];
  /** Companion body mods — bond mods that buff the operator's weapons. */
  companionModSlots?: ModSlot[];
  /** Companion weapon crit chance (for Tenacious Bond gate). */
  companionWeaponCritChance?: number;
  allMods?: Map<string, Mod>;
}

function isPrimaryWeapon(weapon: Weapon): boolean {
  return weaponSupportsPrimaryStyleSets(weapon);
}

/** Ground primary (rifle/shotgun/sniper/bow/launcher) — excludes archgun, secondary, melee, exalted. */
function isGroundPrimaryWeapon(weapon: Weapon): boolean {
  if (weapon.isExalted) return false;
  const c = weapon.category;
  return (
    c === "primary" ||
    c === "rifle" ||
    c === "shotgun" ||
    c === "sniper" ||
    c === "bow" ||
    c === "launcher"
  );
}

function isSecondaryWeapon(weapon: Weapon): boolean {
  return ["pistol", "secondary", "dual_pistols"].includes(weapon.category);
}

function isMeleeWeapon(weapon: Weapon): boolean {
  return weapon.category === "melee" || weapon.triggerType === "Melee";
}

function emptyWeaponAcc(): WeaponModAccumulators {
  return {
    damageBonus: 0,
    critChanceBonus: 0,
    critMultBonus: 0,
    fireRateBonus: 0,
    multishotBonus: 0,
    statusBonus: 0,
    magBonus: 0,
    flatMagazineBonus: 0,
    reloadBonus: 0,
    statusChanceFlatBonus: 0,
    impactBonus: 0,
    punctureBonus: 0,
    slashBonus: 0,
    statusDamageBonus: 0,
    headshotDamageBonus: 0,
    weakPointDamageBonus: 0,
    weakPointCritChanceBonus: 0,
    statusDurationBonus: 0,
    factionBonuses: {},
    hasBloodRush: false,
    bloodRushValue: 0,
    hasConditionOverload: false,
    conditionOverloadPerStatus: 0,
    hasWeepingWounds: false,
    weepingWoundsValue: 0,
    hasBerserkerFury: false,
    berserkerFuryPerStack: 0,
    galvMultishotOnKillPerStack: 0,
    galvDamagePerStatusPerStack: 0,
    galvMultishotStackCap: 5,
    galvDamagePerStatusStackCap: 5,
    galvCritOnHeadshotBase: 0,
    galvCritOnHeadshotPerStack: 0,
    onKillStatBonuses: {},
    onKillPerStackBonuses: {},
    onKillPerStackCap: 4,
    heavyAttackWindUpBonus: 0,
    triggerStatBonuses: {},
    invisibleStatBonuses: {},
    abilityCastAimStatBonuses: {},
    slashOnCritChance: 0,
    extraElectricProcChance: 0,
    slashOnImpactProcChance: 0,
    firstShotDamageBonus: 0,
  };
}

function modAppliesFromWarframeToWeapon(mod: Mod, weapon: Weapon): boolean {
  if (mod.category === "melee") return isMeleeWeapon(weapon);
  if (mod.category === "augment") return true;
  return false;
}

function modNominalLine(mod: Mod, rank: number): string {
  return getModStatDisplayLines(mod, rank)
    .map((l) => l.atRank)
    .join(", ");
}

function accToExternalBuff(
  acc: WeaponModAccumulators,
  elementalFractions: WeaponExternalBuffElemental[],
  base: Omit<WeaponExternalBuff, "damageBonus" | "critChanceBonus" | "critMultBonus" | "statusBonus" | "fireRateBonus" | "multishotBonus" | "elemental">,
): WeaponExternalBuff | null {
  const hasScalar =
    acc.damageBonus !== 0 ||
    acc.critChanceBonus !== 0 ||
    acc.critMultBonus !== 0 ||
    acc.statusBonus !== 0 ||
    acc.fireRateBonus !== 0 ||
    acc.multishotBonus !== 0 ||
    elementalFractions.length > 0;
  if (!hasScalar) return null;

  return {
    ...base,
    ...(acc.damageBonus ? { damageBonus: acc.damageBonus } : {}),
    ...(acc.critChanceBonus ? { critChanceBonus: acc.critChanceBonus } : {}),
    ...(acc.critMultBonus ? { critMultBonus: acc.critMultBonus } : {}),
    ...(acc.statusBonus ? { statusBonus: acc.statusBonus } : {}),
    ...(acc.fireRateBonus ? { fireRateBonus: acc.fireRateBonus } : {}),
    ...(acc.multishotBonus ? { multishotBonus: acc.multishotBonus } : {}),
    ...(elementalFractions.length ? { elemental: elementalFractions } : {}),
  };
}

function extractWeaponDpsBuffFromMod(
  weapon: Weapon,
  modSlot: ModSlot,
  allMods: Map<string, Mod>,
  idPrefix: string,
  category: WeaponExternalBuff["category"],
): WeaponExternalBuff | null {
  const mod = allMods.get(modSlot.modId);
  if (!mod?.stats) return null;
  if (!modAppliesFromWarframeToWeapon(mod, weapon)) return null;

  const rank = Math.min(Math.max(modSlot.rank ?? 0, 0), mod.maxRank);
  const multiplier = rank + 1;
  const acc = emptyWeaponAcc();
  const elementalMods: { type: string; value: number }[] = [];
  let hasWeaponDps = false;

  for (const [statName, value] of Object.entries(mod.stats)) {
    const line = getVerifiedModStatLine(mod.id, statName);
    if (!line || line.target !== "weapon_dps") continue;
    hasWeaponDps = true;
    const modValue = (value * multiplier) / 100;
    applyVerifiedModStatToWeapon(
      {},
      {
        modId: mod.id,
        statKey: statName,
        modValue,
        baseWeaponDamage: weapon.damage,
        acc,
        elementalMods,
        comboDuration: { add: () => {} },
        heavyAttackEfficiency: { add: () => {} },
      },
    );
  }

  if (!hasWeaponDps) return null;

  const elementalFractions: WeaponExternalBuffElemental[] = elementalMods.map((e) => ({
    type: e.type,
    bonusFraction: e.value / weapon.damage,
  }));

  return accToExternalBuff(acc, elementalFractions, {
    id: `${idPrefix}:${mod.id}`,
    label: mod.name,
    category,
    nominal: modNominalLine(mod, rank),
  });
}

function isShotgunPrimaryWeapon(weapon: Weapon): boolean {
  if (!isGroundPrimaryWeapon(weapon)) return false;
  return weapon.category === "shotgun" || WIKI_WEAPON_CLASS[weapon.id] === "Shotgun";
}

function isSniperPrimaryWeapon(weapon: Weapon): boolean {
  return weapon.category === "sniper" || WIKI_WEAPON_CLASS[weapon.id] === "Sniper Rifle";
}

function isDualSidearmWeapon(weapon: Weapon): boolean {
  if (!isSecondaryWeapon(weapon)) return false;
  const cls = WIKI_WEAPON_CLASS[weapon.id];
  if (cls === "Dual Pistols" || cls === "Dual Shotguns") return true;
  if (weapon.category === "dual_pistols") return true;
  return /^(ak|twin |dual |afuris|dex furis)/i.test(weapon.name);
}

const EXCALIBUR_SWORD_STANCES = new Set(["sword", "dual_swords", "nikana", "rapier"]);

function isExcaliburSwordWeapon(weapon: Weapon): boolean {
  if (!isMeleeWeapon(weapon)) return false;
  if (weapon.stanceType && EXCALIBUR_SWORD_STANCES.has(weapon.stanceType)) return true;
  return /^exalted.*blade/i.test(weapon.id);
}

/**
 * Enemy armor strip % from Warframe Corrosive Projection aura.
 * Wiki Corrosive Projection / Coaction Drift: enemy-debuffing Auras scale only with Coaction
 * Drift's Squad Aura Strength (+15% → 18% × 1.15 = 20.7% solo), not personal Aura Effectiveness.
 */
export function computeLoadoutAuraArmorStripPct(
  warframeModSlots?: readonly ModSlot[],
): number {
  const cp = warframeModSlots?.find((s) => s.modId === "aura_corrosive_projection");
  if (!cp) return 0;
  const rank = Math.min(Math.max(0, Math.round(cp.rank ?? 5)), 5);
  const auraStrengthMult = computeWarframeAuraStrengthMult(warframeModSlots);
  return Math.min(100, 3 * (rank + 1) * auraStrengthMult);
}

function resolveWarframeCrossModBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const slots = ctx.warframeModSlots;
  if (!slots?.length) return [];
  const allMods = ctx.allMods;
  const auraMult = computeWarframeAuraEffectivenessMult(slots);

  const buffs: WeaponExternalBuff[] = [];
  for (const slot of slots) {
    if (allMods) {
      const buff = extractWeaponDpsBuffFromMod(weapon, slot, allMods, "wf-mod", "warframe_mod");
      if (buff) {
        buffs.push(buff);
        continue;
      }
    }

    const mod = allMods?.get(slot.modId);
    const maxRank = mod?.maxRank ?? (slot.modId === "vigorous_swap" ? 10 : 5);
    const rank = Math.min(Math.max(0, Math.round(slot.rank ?? maxRank)), maxRank);
    const mult = rank + 1;

    switch (slot.modId) {
      case "aura_rifle_amplification": {
        if (isGroundPrimaryWeapon(weapon) && !isShotgunPrimaryWeapon(weapon)) {
          const dmg = ((4.5 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:aura_rifle_amplification",
            label: "Rifle Amp",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(1)}% Rifle Damage`,
          });
        }
        break;
      }
      case "aura_shotgun_amplification": {
        if (isShotgunPrimaryWeapon(weapon)) {
          const dmg = ((3 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:aura_shotgun_amplification",
            label: "Shotgun Amp",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(1)}% Shotgun Damage`,
          });
        }
        break;
      }
      case "aura_pistol_amplification": {
        if (isSecondaryWeapon(weapon)) {
          const dmg = ((4.5 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:aura_pistol_amplification",
            label: "Pistol Amp",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(1)}% Pistol Damage`,
          });
        }
        break;
      }
      case "dead_eye": {
        if (isSniperPrimaryWeapon(weapon)) {
          const dmg = ((8.75 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:dead_eye",
            label: "Dead Eye",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(1)}% Sniper Damage`,
          });
        }
        break;
      }
      case "aura_steel_charge": {
        if (isMeleeWeapon(weapon)) {
          const dmg = ((10 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:aura_steel_charge",
            label: "Steel Charge",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(1)}% Melee Damage`,
          });
        }
        break;
      }
      case "ready_steel": {
        if (isMeleeWeapon(weapon)) {
          // Wiki Ready Steel + Coaction Drift: 24 × 1.3225 = 31.74 → truncates to 31 Initial Combo.
          const ic = Math.floor(4 * mult * auraMult + 1e-9);
          buffs.push({
            id: "wf-aura:ready_steel",
            label: "Ready Steel",
            category: "warframe_mod",
            initialComboBonus: ic,
            nominal: `+${ic} Initial Combo`,
          });
        }
        break;
      }
      case "swift_momentum": {
        if (isMeleeWeapon(weapon)) {
          const windUp = ((5 * mult) / 100) * auraMult;
          const comboDur = 1 * mult * auraMult;
          buffs.push({
            id: "wf-aura:swift_momentum",
            label: "Swift Momentum",
            category: "warframe_mod",
            heavyAttackWindUpBonus: windUp,
            comboDurationBonus: comboDur,
            nominal: `+${(windUp * 100).toFixed(0)}% Heavy Wind-Up, +${comboDur.toFixed(1)}s Combo Duration`,
          });
        }
        break;
      }
      case "worthy_comradery": {
        const wpCc = ((12.5 * mult) / 100) * auraMult;
        buffs.push({
          id: "wf-aura:worthy_comradery",
          label: "Worthy Comradery",
          category: "warframe_mod",
          weakPointCritChanceBonus: wpCc,
          nominal: `+${(wpCc * 100).toFixed(1)}% Weak Point Crit Chance`,
        });
        break;
      }
      case "holster_amp": {
        // Wiki Holster Amp: "+60% Damage on Equip for 3s" applies to Primary, Secondary & Melee,
        // excluding Exalted weapons.
        if (simParams.applyTriggerBuffs && !weapon.isExalted) {
          const dmg = ((10 * mult) / 100) * auraMult;
          buffs.push({
            id: "wf-aura:holster_amp",
            label: "Holster Amp",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(0)}% Damage on Equip`,
          });
        }
        break;
      }
      case "vigorous_swap": {
        // Wiki Vigorous Swap: "+165% Damage on Equip for 3s" applies to Primary & Secondary
        // (including ranged Exalted), not regular Melee swings.
        if (simParams.applyTriggerBuffs && !isMeleeWeapon(weapon)) {
          const dmg = (15 * mult) / 100;
          buffs.push({
            id: "wf-mod:vigorous_swap",
            label: "Vigorous Swap",
            category: "warframe_mod",
            damageBonus: dmg,
            nominal: `+${(dmg * 100).toFixed(0)}% Damage on Equip`,
          });
        }
        break;
      }
    }
  }
  return buffs;
}

function modStatFraction(mod: Mod, statKey: string, rank: number): number {
  const perRank = mod.stats[statKey];
  if (perRank == null) return 0;
  return (perRank * (rank + 1)) / 100;
}

function findCompanionMod(slots: ModSlot[] | undefined, modId: string): ModSlot | undefined {
  return slots?.find((s) => s.modId === modId);
}

function resolveCompanionBondBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const slots = ctx.companionModSlots;
  if (!slots?.length) return [];

  const buffs: WeaponExternalBuff[] = [];
  const tenaciousActive = simParams.applyTenaciousBondCrit !== false;
  const reinforcedActive = simParams.applyReinforcedBondFireRate !== false;

  const tenaciousSlot = findCompanionMod(slots, "tenacious_bond");
  if (tenaciousSlot && tenaciousActive) {
    const companionCrit = ctx.companionWeaponCritChance ?? 0;
    if (companionCrit >= 0.5 - 1e-6) {
      buffs.push({
        id: "companion:tenacious_bond",
        label: "Tenacious Bond",
        category: "companion",
        critMultFlatBonus: 1.2,
        nominal: "+1.2× crit damage (companion crit ≥50%)",
      });
    }
  }

  const reinforcedSlot = findCompanionMod(slots, "reinforced_bond");
  if (reinforcedSlot && reinforcedActive && !isMeleeWeapon(weapon)) {
    buffs.push({
      id: "companion:reinforced_bond",
      label: "Reinforced Bond",
      category: "companion",
      fireRateBonus: 0.6,
      nominal: "+60% fire rate (companion shields)",
    });
  }

  // Covert Bond: no weapon buff. wiki.warframe.com: finisher / mercy kills grant the companion 1–10s
  // of stealth (Duration column only); Round 18 removed the stray stealthDamage key that fed a
  // +720% weapon damage buff here.

  return buffs;
}

function scaledAbilityDamageBuff(
  warframeId: string | undefined,
  abilityName: string,
  baseBuff: number,
  abilityStrength: number,
): number | null {
  // Only verified weapon damage buffs (Roar/Eclipse/…) apply to loadout DPS.
  // Host frame → Helminth subsume key → Rhino (Roar) fallback.
  const rule =
    (warframeId ? getVerifiedFieldScaling(warframeId, abilityName, "damageBuff") : undefined) ??
    getVerifiedFieldScaling("helminth", abilityName, "damageBuff") ??
    getVerifiedFieldScaling("rhino", abilityName, "damageBuff");
  if (!rule) return null;
  const mult = rule.scale === "strength" ? abilityStrength : 1;
  let value = baseBuff * mult;
  if (rule.cap != null) value = Math.min(value, rule.cap);
  return value;
}

/** Wiki Electric Shield: +50% Electricity (additive elemental) and +100% CD (multiplicative). Fixed — no STR. */
function resolveElectricShieldBuff(
  weapon: Weapon,
  ability: Ability,
): WeaponExternalBuff | null {
  if (isMeleeWeapon(weapon)) return null;
  const ele = ability.miscStats?.electricDamageBonus;
  const crit = ability.miscStats?.critDamageBonus;
  const eleFrac = typeof ele === "number" ? ele : 0;
  const critFrac = typeof crit === "number" ? crit : 0;
  if (eleFrac <= 0 && critFrac <= 0) return null;
  return {
    id: `ability:${ability.name}`,
    label: ability.name,
    category: "ability",
    ...(eleFrac > 0
      ? { elemental: [{ type: "electricity", bonusFraction: eleFrac }] }
      : {}),
    ...(critFrac > 0 ? { critMultBonus: critFrac } : {}),
    nominal: `+${(eleFrac * 100).toFixed(0)}% Electricity, +${(critFrac * 100).toFixed(0)}% critical damage`,
  };
}

/** Wiki Nourish: +Viral as an elemental mod; Helminth base is reduced. */
function resolveNourishBuff(
  warframeId: string,
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats?.viralDamageBonus;
  const base =
    typeof misc === "number"
      ? misc
      : warframeFamilyId(warframeId) === "grendel"
        ? NOURISH_VIRAL_NATIVE
        : NOURISH_VIRAL_HELMINTH;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: `ability:${ability.name}`,
    label: ability.name,
    category: "ability",
    elemental: [{ type: "viral", bonusFraction: bonus }],
    nominal: `+${(base * 100).toFixed(0)}% Viral (× Strength)`,
  };
}

const CONTAGION_CLOUD_MOD_ID = "augment_saryn_contagion_cloud";
const JET_STREAM_MOD_ID = "jet_stream";
/** Catalog fallbacks when allMods is omitted (R0 per-rank; maxRank 3). */
const JET_STREAM_SPRINT_PER_RANK = 10;
const JET_STREAM_PROJ_PER_RANK = 25;
const JET_STREAM_MAX_RANK = 3;

function hasContagionCloudAugment(ctx: WeaponBuffContext): boolean {
  return (ctx.warframeModSlots ?? []).some((s) => s.modId === CONTAGION_CLOUD_MOD_ID);
}

function findJetStreamSlot(ctx: WeaponBuffContext): ModSlot | undefined {
  return (ctx.warframeModSlots ?? []).find((s) => s.modId === JET_STREAM_MOD_ID);
}

/** Wiki Jet Stream R3: +40% move / +100% proj × Ability Strength while Turbulence is active. */
function jetStreamFractions(ctx: WeaponBuffContext, slot: ModSlot): { move: number; proj: number } {
  const mod = ctx.allMods?.get(JET_STREAM_MOD_ID);
  const maxRank = mod?.maxRank ?? JET_STREAM_MAX_RANK;
  const rank = Math.min(Math.max(slot.rank ?? 0, 0), maxRank);
  if (mod) {
    return {
      move: modStatFraction(mod, "sprintSpeed", rank),
      proj: modStatFraction(mod, "projectileSpeed", rank),
    };
  }
  return {
    move: (JET_STREAM_SPRINT_PER_RANK * (rank + 1)) / 100,
    proj: (JET_STREAM_PROJ_PER_RANK * (rank + 1)) / 100,
  };
}

/**
 * Wiki Jet Stream: while Turbulence active, movement + projectile speed × Strength.
 * Paper-off (mod_panel); applied only via this ability gate.
 */
function resolveJetStreamBuff(
  strength: number,
  ctx: WeaponBuffContext,
): WeaponExternalBuff | null {
  const slot = findJetStreamSlot(ctx);
  if (!slot) return null;
  const { move, proj } = jetStreamFractions(ctx, slot);
  const moveBonus = move * strength;
  const projBonus = proj * strength;
  if (moveBonus <= 0 && projBonus <= 0) return null;
  return {
    id: "ability:Jet Stream",
    label: "Jet Stream",
    category: "ability",
    ...(moveBonus > 0 ? { sprintSpeedBonus: moveBonus } : {}),
    ...(projBonus > 0 ? { projectileSpeedBonus: projBonus } : {}),
    nominal: `+${(move * 100).toFixed(0)}% move / +${(proj * 100).toFixed(0)}% projectile speed (× Strength)`,
  };
}

/**
 * Apply Jet Stream move-speed to warframe totals when Turbulence is toggled.
 * Call after `calculateWarframeBuild` in loadout resolution.
 */
export function applyJetStreamWarframeMove(
  stats: WarframeCalculatedStats,
  warframeModSlots: ModSlot[] | undefined,
  allMods: Map<string, Mod> | undefined,
  simParams: SimulationParams,
): void {
  const active = simParams.activeWeaponAbilityBuffs ?? [];
  if (!active.includes("Turbulence")) return;
  const slot = (warframeModSlots ?? []).find((s) => s.modId === JET_STREAM_MOD_ID);
  if (!slot) return;
  const ctx: WeaponBuffContext = { warframeModSlots, allMods };
  const { move } = jetStreamFractions(ctx, slot);
  const bonus = move * stats.abilityStrength;
  if (bonus <= 0) return;
  stats.sprintSpeedBonus += bonus;
  stats.totalSprint = stats.baseSprint * (1 + stats.sprintSpeedBonus);
}

/** Hold-cast elemental infusion augments (wiki: parallel element × Strength; no exalted). */
const ELEMENTAL_INFUSION_BY_ABILITY: Record<
  string,
  { modId: string; element: string; label: string; damagePerRank?: number }
> = {
  Fireball: {
    modId: "augment_ember_fireball_frenzy",
    element: "heat",
    label: "Fireball Frenzy",
    damagePerRank: 25,
  },
  Freeze: {
    modId: "augment_frost_freeze_force",
    element: "cold",
    label: "Freeze Force",
    damagePerRank: 25,
  },
  Shock: {
    modId: "augment_volt_shock_trooper",
    element: "electricity",
    label: "Shock Trooper",
    damagePerRank: 25,
  },
  Spores: {
    modId: "augment_saryn_venom_dose",
    element: "corrosive",
    label: "Venom Dose",
    damagePerRank: 25,
  },
  Smite: {
    modId: "smite_infusion",
    element: "radiation",
    label: "Smite Infusion",
    damagePerRank: 25,
  },
};

/** Wiki Teeming Virulence CC ranks (non-linear; catalog R3 matches 200%). */
const TEEMING_VIRULENCE_CC_BY_RANK = [1.25, 1.5, 1.75, 2.0] as const;
const TEEMING_VIRULENCE_MOD_ID = "teeming_virulence";
const THRALL_PACT_MOD_ID = "thrall_pact";
const SMOKE_SHADOW_MOD_ID = "augment_ash_smoke_shadow";
const THRALL_PACT_MAX_THRALLS = 7;

/**
 * Wiki Teeming Virulence: after hitting ≥4 with Virulence, primary CC × Strength.
 * Archgun / secondary / melee / exalted excluded.
 */
function resolveTeemingVirulenceBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
): WeaponExternalBuff | null {
  if (!isGroundPrimaryWeapon(weapon)) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === TEEMING_VIRULENCE_MOD_ID);
  if (!slot) return null;
  const rank = Math.min(Math.max(slot.rank ?? 0, 0), TEEMING_VIRULENCE_CC_BY_RANK.length - 1);
  const base = TEEMING_VIRULENCE_CC_BY_RANK[rank] ?? 2.0;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Teeming Virulence",
    label: "Teeming Virulence",
    category: "ability",
    critChanceBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% primary crit chance (× Strength)`,
  };
}

/**
 * Wiki Thrall Pact: +% primary damage per thrall × Strength (Serration-additive).
 */
function resolveThrallPactBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  if (!isGroundPrimaryWeapon(weapon)) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === THRALL_PACT_MOD_ID);
  if (!slot) return null;
  const thralls = Math.min(
    THRALL_PACT_MAX_THRALLS,
    Math.max(0, Math.floor(simParams.thrallCount ?? 0)),
  );
  if (thralls <= 0) return null;
  const mod = ctx.allMods?.get(THRALL_PACT_MOD_ID);
  const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod?.maxRank ?? 3);
  const perThrall = mod
    ? modStatFraction(mod, "damage", rank)
    : (6.25 * (rank + 1)) / 100;
  const bonus = perThrall * thralls * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Thrall Pact",
    label: "Thrall Pact",
    category: "ability",
    damageBonus: bonus,
    nominal: `+${(perThrall * 100).toFixed(0)}% primary damage × ${thralls} thrall${thralls === 1 ? "" : "s"} (× Strength)`,
  };
}

/**
 * Wiki Smoke Shadow: +150% weapon CC while Smoke Screen invis (R3); not × Strength.
 * Applies to all weapons including exalted.
 */
function resolveSmokeShadowBuff(
  strength: number,
  ctx: WeaponBuffContext,
): WeaponExternalBuff | null {
  void strength;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === SMOKE_SHADOW_MOD_ID);
  if (!slot) return null;
  const mod = ctx.allMods?.get(SMOKE_SHADOW_MOD_ID);
  const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod?.maxRank ?? 3);
  const base = mod
    ? modStatFraction(mod, "criticalChance", rank)
    : (37.5 * (rank + 1)) / 100;
  if (base <= 0) return null;
  return {
    id: "ability:Smoke Shadow",
    label: "Smoke Shadow",
    category: "ability",
    critChanceBonus: base,
    nominal: `+${(base * 100).toFixed(0)}% crit chance while invisible (not × Strength)`,
  };
}

const THERMAL_TRANSFER_MOD_ID = "augment_gauss_thermal_transfer";
/** Wiki Thermal Transfer elemental % ranks (non-linear). */
const THERMAL_TRANSFER_DMG_BY_RANK = [0.4, 0.5, 0.6, 0.75] as const;

const RAZORWING_BLITZ_MOD_ID = "augment_titania_razorwing_blitz";
/** Wiki: +25% FR/AS per stack at all ranks; stacks to 4. */
const RAZORWING_BLITZ_FR_PER_STACK = 0.25;
const RAZORWING_BLITZ_MAX_STACKS = 4;
const RAZORWING_BLITZ_WEAPON_IDS = new Set([
  "dex_pixia",
  "dex_pixia_prime",
  "diwata",
  "diwata_prime",
]);

const CRITICAL_SURGE_MOD_ID = "augment_wisp_critical_surge";
/** Wiki Critical Surge CC% per meter by rank. */
const CRITICAL_SURGE_CC_PER_M_BY_RANK = [0.025, 0.05, 0.075, 0.1] as const;
const CRITICAL_SURGE_CC_CAP = 2.5;
const CRITICAL_SURGE_MIN_TELEPORT_M = 10;

const FURIOUS_JAVELIN_MOD_ID = "augment_excalibur_furious_javelin";
/** Wiki Furious Javelin melee damage % per enemy by rank (non-linear). */
const FURIOUS_JAVELIN_DMG_BY_RANK = [0.08, 0.1, 0.12, 0.15] as const;

const VALENCE_FORMATION_MOD_ID = "valence_formation";
/** Wiki Valence Formation elemental % by rank (not × Strength). */
const VALENCE_FORMATION_DMG_BY_RANK = [0.5, 1.0, 1.5, 2.0] as const;
const VALENCE_FORMATION_ELEMENTS = new Set([
  "heat",
  "cold",
  "electricity",
  "toxin",
  "blast",
  "gas",
  "magnetic",
  "radiation",
  "viral",
  "corrosive",
]);
/** Lavos kit — used to offer the synthetic Valence Formation toggle. */
const LAVOS_ABILITY_NAMES = new Set([
  "Ophidian Bite",
  "Vial Rush",
  "Transmutation Probe",
  "Catalyze",
]);

/**
 * Wiki Razorwing Blitz: cast while Razorwing → +25% FR/AS × stacks × Strength (cap 4).
 * Dex Pixia / Diwata only (including primes).
 */
function resolveRazorwingBlitzBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  if (!RAZORWING_BLITZ_WEAPON_IDS.has(weapon.id)) return null;
  const stacks = Math.min(
    RAZORWING_BLITZ_MAX_STACKS,
    Math.max(0, Math.floor(simParams.razorwingBlitzStacks ?? 0)),
  );
  if (stacks <= 0) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === RAZORWING_BLITZ_MOD_ID);
  if (!slot) return null;
  const bonus = RAZORWING_BLITZ_FR_PER_STACK * stacks * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Razorwing Blitz",
    label: "Razorwing Blitz",
    category: "ability",
    fireRateBonus: bonus,
    nominal: `+${(RAZORWING_BLITZ_FR_PER_STACK * 100).toFixed(0)}% fire/attack speed × ${stacks} stack${stacks === 1 ? "" : "s"} (× Strength)`,
  };
}

/**
 * Wiki Valence Formation: cast with imbued element → parallel elemental × rank
 * (50–200%, not × Strength) + guaranteed status. Universal weapon bonus (incl. exalted).
 */
function resolveValenceFormationBuff(
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  const element = simParams.valenceFormationElement;
  if (!element || !VALENCE_FORMATION_ELEMENTS.has(element)) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === VALENCE_FORMATION_MOD_ID);
  if (!slot) return null;
  const rank = Math.min(
    Math.max(slot.rank ?? 0, 0),
    VALENCE_FORMATION_DMG_BY_RANK.length - 1,
  );
  const frac = VALENCE_FORMATION_DMG_BY_RANK[rank] ?? 2.0;
  if (frac <= 0) return null;
  return {
    id: "ability:Valence Formation",
    label: "Valence Formation",
    category: "ability",
    elemental: [{ type: element, bonusFraction: frac, parallel: true }],
    guaranteedStatusElement: element,
    nominal: `+${(frac * 100).toFixed(0)}% ${element} (parallel, guaranteed status; not × Strength)`,
  };
}

/**
 * Wiki Furious Javelin: each Radial Javelin hit → Eclipse-style melee damage mult × STR.
 * Applies to melee including Exalted Blade.
 */
function resolveFuriousJavelinBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  if (!isMeleeWeapon(weapon)) return null;
  const enemies = Math.max(0, Math.floor(simParams.furiousJavelinEnemies ?? 0));
  if (enemies <= 0) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === FURIOUS_JAVELIN_MOD_ID);
  if (!slot) return null;
  const rank = Math.min(
    Math.max(slot.rank ?? 0, 0),
    FURIOUS_JAVELIN_DMG_BY_RANK.length - 1,
  );
  const perEnemy = FURIOUS_JAVELIN_DMG_BY_RANK[rank] ?? 0.15;
  const bonus = perEnemy * strength * enemies;
  if (bonus <= 0) return null;
  return {
    id: "ability:Furious Javelin",
    label: "Furious Javelin",
    category: "ability",
    damageMultBonus: bonus,
    nominal: `+${(perEnemy * 100).toFixed(0)}% melee damage × ${enemies} enem${enemies === 1 ? "y" : "ies"} (× Strength)`,
  };
}

/**
 * Wiki Critical Surge: teleport to Reservoir → primary CC per meter × Strength, cap 250%.
 * Min teleport distance 10m. Does not affect secondary/melee/archgun/exalted.
 */
function resolveCriticalSurgeBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  if (!isGroundPrimaryWeapon(weapon)) return null;
  let meters = Math.max(0, simParams.criticalSurgeTeleportMeters ?? 0);
  if (meters <= 0) return null;
  if (meters < CRITICAL_SURGE_MIN_TELEPORT_M) meters = CRITICAL_SURGE_MIN_TELEPORT_M;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === CRITICAL_SURGE_MOD_ID);
  if (!slot) return null;
  const mod = ctx.allMods?.get(CRITICAL_SURGE_MOD_ID);
  const rank = Math.min(
    Math.max(slot.rank ?? 0, 0),
    CRITICAL_SURGE_CC_PER_M_BY_RANK.length - 1,
  );
  const perM =
    mod != null
      ? modStatFraction(mod, "criticalChance", rank)
      : (CRITICAL_SURGE_CC_PER_M_BY_RANK[rank] ?? 0.1);
  const bonus = Math.min(CRITICAL_SURGE_CC_CAP, perM * meters * strength);
  if (bonus <= 0) return null;
  return {
    id: "ability:Critical Surge",
    label: "Critical Surge",
    category: "ability",
    critChanceBonus: bonus,
    nominal: `+${(perM * 100).toFixed(1)}%/m × ${meters}m primary crit (cap ${(CRITICAL_SURGE_CC_CAP * 100).toFixed(0)}%, × Strength)`,
  };
}

/**
 * Wiki Thermal Transfer: tap Cold / hold Heat / both → Blast (sum); parallel × Strength.
 * Does not affect exalted weapons.
 */
function resolveThermalTransferBuff(
  weapon: Weapon,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  if (weapon.isExalted) return null;
  const polarity = simParams.thermalTransferPolarity;
  if (!polarity) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === THERMAL_TRANSFER_MOD_ID);
  if (!slot) return null;
  const rank = Math.min(
    Math.max(slot.rank ?? 0, 0),
    THERMAL_TRANSFER_DMG_BY_RANK.length - 1,
  );
  const base = THERMAL_TRANSFER_DMG_BY_RANK[rank] ?? 0.75;
  const element = polarity === "blast" ? "blast" : polarity;
  const frac = (polarity === "blast" ? base * 2 : base) * strength;
  if (frac <= 0) return null;
  return {
    id: "ability:Thermal Transfer",
    label: "Thermal Transfer",
    category: "ability",
    elemental: [{ type: element, bonusFraction: frac, parallel: true }],
    nominal: `+${((polarity === "blast" ? base * 2 : base) * 100).toFixed(0)}% ${element} (parallel, × Strength)`,
  };
}

/**
 * Wiki Fireball Frenzy / Freeze Force / Shock Trooper / Venom Dose / Smite Infusion:
 * hold-cast grants parallel elemental × Strength; does not affect exalted weapons.
 */
function resolveElementalInfusionBuff(
  weapon: Weapon,
  ability: Ability,
  strength: number,
  ctx: WeaponBuffContext,
): WeaponExternalBuff | null {
  const rule = ELEMENTAL_INFUSION_BY_ABILITY[ability.name];
  if (!rule) return null;
  if (weapon.isExalted) return null;
  const slot = (ctx.warframeModSlots ?? []).find((s) => s.modId === rule.modId);
  if (!slot) return null;
  const mod = ctx.allMods?.get(rule.modId);
  const maxRank = mod?.maxRank ?? 3;
  const rank = Math.min(Math.max(slot.rank ?? 0, 0), maxRank);
  const baseFrac = mod
    ? modStatFraction(mod, "damage", rank)
    : ((rule.damagePerRank ?? 25) * (rank + 1)) / 100;
  const bonus = baseFrac * strength;
  if (bonus <= 0) return null;
  return {
    id: `ability:${rule.label}`,
    label: rule.label,
    category: "ability",
    elemental: [{ type: rule.element, bonusFraction: bonus, parallel: true }],
    nominal: `+${(baseFrac * 100).toFixed(0)}% ${rule.element} (parallel, × Strength)`,
  };
}

/**
 * Wiki Contagion Cloud: on-kill toxin cloud = ability misc DPS × STR
 * (× melee mult); sim gates enemy count. Not weapon-modded.
 */
function resolveContagionCloudBuff(
  weapon: Weapon,
  warframeId: string,
  ability: Ability,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  const enemies = Math.max(0, Math.floor(simParams.contagionCloudEnemies ?? 0));
  if (enemies <= 0 || !hasContagionCloudAugment(ctx)) return null;
  const misc = ability.miscStats ?? {};
  const baseDps = typeof misc.contagionCloudDps === "number" ? misc.contagionCloudDps : 300;
  const meleeMult =
    typeof misc.contagionCloudMeleeMult === "number" ? misc.contagionCloudMeleeMult : 2;
  const rule = getVerifiedMiscScaling(warframeId, ability.name, "contagionCloudDps");
  const scaled = baseDps * (rule?.scale === "strength" ? strength : 1);
  const dps = scaled * (isMeleeWeapon(weapon) ? meleeMult : 1) * enemies;
  if (dps <= 0) return null;
  return {
    id: "ability:Contagion Cloud",
    label: "Contagion Cloud",
    category: "ability",
    abilityCloudDps: dps,
    nominal: `${baseDps}/s cloud × Strength × ${enemies} enem${enemies === 1 ? "y" : "ies"}`,
  };
}

/** Wiki Toxic Lash: Extra Hit % of weapon damage; melee is doubled; scales STR (cap 100%). */
function resolveToxicLashBuff(
  weapon: Weapon,
  warframeId: string,
  ability: Ability,
  strength: number,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const gun = ability.miscStats?.gunDamage;
  const melee = ability.miscStats?.meleeDamage;
  const base = isMeleeWeapon(weapon)
    ? typeof melee === "number"
      ? melee
      : 0.6
    : typeof gun === "number"
      ? gun
      : 0.3;
  const key = isMeleeWeapon(weapon) ? "meleeDamage" : "gunDamage";
  const rule = getVerifiedMiscScaling(warframeId, ability.name, key);
  // Wiki: percentages scale with Strength and soft-cap at 100%.
  const frac = Math.min(base * strength, rule?.cap ?? 1);
  const out: WeaponExternalBuff[] = [];
  if (frac > 0) {
    out.push({
      id: `ability:${ability.name}`,
      label: ability.name,
      category: "ability",
      extraHitDamageFraction: frac,
      extraHitGuaranteedToxin: true,
      nominal: `+${(base * 100).toFixed(0)}% Toxin Extra Hit (× Strength)`,
    });
  }
  const cloud = resolveContagionCloudBuff(weapon, warframeId, ability, strength, ctx, simParams);
  if (cloud) out.push(cloud);
  return out;
}

/** Wiki Xata's Whisper: Extra Hit Void %; scales STR. */
function resolveXataBuff(
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats?.voidDamageBonus;
  const base =
    typeof misc === "number"
      ? misc
      : typeof ability.damageBuff === "number" && ability.damageBuff > 0
        ? ability.damageBuff
        : XATA_VOID_NATIVE;
  const frac = base * strength;
  if (frac <= 0) return null;
  return {
    id: `ability:${ability.name}`,
    label: ability.name,
    category: "ability",
    extraHitDamageFraction: frac,
    nominal: `+${(base * 100).toFixed(0)}% Void Extra Hit (× Strength)`,
  };
}

/** Wiki Vex Armor: max Fury is additive Serration-style; sim can scale stack fill. */
function resolveVexArmorBuff(
  strength: number,
  furyFraction: number,
): WeaponExternalBuff | null {
  const fill = Math.min(1, Math.max(0, furyFraction));
  const bonus = VEX_ARMOR_MAX_FURY * strength * fill;
  if (bonus <= 0) return null;
  const pct = Math.round(fill * 100);
  return {
    id: "ability:Vex Armor",
    label: "Vex Armor",
    category: "ability",
    damageBonus: bonus,
    nominal:
      fill >= 1
        ? `+${(VEX_ARMOR_MAX_FURY * 100).toFixed(0)}% weapon damage at max Fury (× Strength)`
        : `+${(VEX_ARMOR_MAX_FURY * 100).toFixed(0)}% max Fury × ${pct}% stacks (× Strength)`,
  };
}

/** Wiki Shooting Gallery: additive with Serration-style mods (not Roar mult). */
function resolveShootingGalleryBuff(
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const base = typeof ability.damageBuff === "number" ? ability.damageBuff : 0.25;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: `ability:${ability.name}`,
    label: ability.name,
    category: "ability",
    damageBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% weapon damage (additive, × Strength)`,
  };
}

/**
 * Wiki Absorb: Weapon Damage Buff = √(0.025% × STR × Absorbed), cap 400%.
 * Convert is wiki percent-points (0.025); sim absorbed damage gates the buff.
 */
function resolveAbsorbBuff(
  ability: Ability,
  strength: number,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  const absorbed = Math.max(0, simParams.absorbAbsorbedDamage ?? 0);
  if (absorbed <= 0) return null;
  const misc = ability.miscStats ?? {};
  const convertPts = typeof misc.weaponDamageConvert === "number" ? misc.weaponDamageConvert : 0.025;
  const cap = typeof misc.weaponDamageCap === "number" ? misc.weaponDamageCap : 4;
  const convertFrac = convertPts / 100;
  const buff = Math.min(Math.sqrt(convertFrac * strength * absorbed), cap);
  if (buff <= 0) return null;
  return {
    id: `ability:${ability.name}`,
    label: ability.name,
    category: "ability",
    damageBonus: buff,
    nominal: `+${(buff * 100).toFixed(0)}% weapon damage (√ convert×STR×${Math.round(absorbed)} absorbed)`,
  };
}

function resolveNamedAbilityWeaponBuff(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  ability: Ability,
  strength: number,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  const warframeId = ctx.warframeId!;
  switch (ability.name) {
    case "Electric Shield":
      return resolveElectricShieldBuff(weapon, ability);
    case "Nourish":
      return resolveNourishBuff(warframeId, ability, strength);
    case "Xata's Whisper":
      return resolveXataBuff(ability, strength);
    case "Vex Armor":
      return resolveVexArmorBuff(strength, simParams.vexArmorFuryFraction ?? 1);
    case "Shooting Gallery":
      return resolveShootingGalleryBuff(ability, strength);
    // wiki: Symphony of Mercy — Deathbringer song is additive with Serration (like SG)
    case "Symphony Of Mercy":
      return resolveShootingGalleryBuff(ability, strength);
    case "Absorb":
      return resolveAbsorbBuff(ability, strength, simParams);
    // wiki: Jet Stream — Turbulence-gated move + projectile speed × Strength
    case "Turbulence":
      return resolveJetStreamBuff(strength, ctx);
    // wiki: Teeming Virulence — Virulence-gated primary CC × Strength
    case "Virulence":
      return resolveTeemingVirulenceBuff(weapon, strength, ctx);
    // wiki: Thrall Pact — Enthrall-gated primary damage × thralls × Strength
    case "Enthrall":
      return resolveThrallPactBuff(weapon, strength, ctx, simParams);
    // wiki: Smoke Shadow — Smoke Screen-gated weapon CC (not × Strength)
    case "Smoke Screen":
      return resolveSmokeShadowBuff(strength, ctx);
    // wiki: Thermal Transfer — Thermal Sunder-gated parallel Cold/Heat/Blast × Strength
    case "Thermal Sunder":
      return resolveThermalTransferBuff(weapon, strength, ctx, simParams);
    // wiki: Razorwing Blitz — cast stacks while Razorwing → FR/AS × Strength (Pixia/Diwata)
    case "Razorwing":
      return resolveRazorwingBlitzBuff(weapon, strength, ctx, simParams);
    // wiki: Critical Surge — Reservoir teleport meters → primary CC × Strength (cap 250%)
    case "Breach Surge":
      return resolveCriticalSurgeBuff(weapon, strength, ctx, simParams);
    // wiki: Furious Javelin — Radial Javelin enemy hits → melee damage mult × Strength
    case "Radial Javelin":
      return resolveFuriousJavelinBuff(weapon, strength, ctx, simParams);
    // wiki: Valence Formation — imbue-gated parallel elemental + guaranteed status (not × Strength)
    case "Valence Formation":
      return resolveValenceFormationBuff(ctx, simParams);
    // wiki: hold-cast infusion augments — parallel elemental × Strength (no exalted)
    case "Fireball":
    case "Freeze":
    case "Shock":
    case "Spores":
    case "Smite":
      return resolveElementalInfusionBuff(weapon, ability, strength, ctx);
    // wiki: Redline — full-battery fire/attack speed × Duration
    case "Redline":
      return resolveRedlineBuff(weapon, ability, ctx.warframeStats!.abilityDuration);
    // wiki: Cathode Grace — weapon CC additive with Point Strike-style mods × STR
    case "Cathode Grace":
      return resolveCathodeGraceBuff(ability, strength);
    // wiki: Wrathful Advance — flat final melee CC after mods × STR
    case "Wrathful Advance":
      return resolveWrathfulAdvanceBuff(weapon, ability, strength);
    // wiki: Grave Spirit — weapon CD additive with Organ Shatter-style mods × STR
    case "Grave Spirit":
      return resolveGraveSpiritBuff(ability, strength);
    // wiki: Penance — fire rate + reload × STR (FR also applies to melee)
    case "Penance":
      return resolvePenanceBuff(ability, strength);
    // wiki: Covenant — flat additive CC (body cap 50%, headshot cap 200%)
    case "Covenant":
      return resolveCovenantBuff(ability, strength, simParams);
    // wiki: Shroud of Dynar — flat melee CD × STR; flat CC/SC Misc-fixed (post-invis window)
    case "Shroud Of Dynar":
      return resolveShroudOfDynarBuff(weapon, ability, strength);
    default:
      return null;
  }
}

/** Wiki Shroud of Dynar: +2.0× flat melee CD × Strength; +100% flat CC/SC are Misc-fixed. */
function resolveShroudOfDynarBuff(
  weapon: Weapon,
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  if (!isMeleeWeapon(weapon)) return null;
  const misc = ability.miscStats ?? {};
  const cdBase = typeof misc.critDamageBonus === "number" ? misc.critDamageBonus : 2;
  const ccBase = typeof misc.criticalChanceBonus === "number" ? misc.criticalChanceBonus : 1;
  const scBase = typeof misc.statusChance === "number" ? misc.statusChance : 1;
  const cd = cdBase * strength;
  if (cd <= 0 && ccBase <= 0 && scBase <= 0) return null;
  return {
    id: "ability:Shroud Of Dynar",
    label: "Shroud Of Dynar",
    category: "ability",
    ...(cd > 0 ? { critMultFlatBonus: cd } : {}),
    ...(ccBase > 0 ? { critChanceFlatBonus: ccBase } : {}),
    ...(scBase > 0 ? { statusBonus: scBase } : {}),
    nominal: `+${cdBase.toFixed(1)}× flat melee CD (× Strength), +${(ccBase * 100).toFixed(0)}% flat CC/SC`,
  };
}

/** Wiki Penance: +35% fire rate / +70% reload × Strength. Fire rate also speeds melee. */
function resolvePenanceBuff(
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats ?? {};
  const frBase = typeof misc.fireRateBuff === "number" ? misc.fireRateBuff : 0.35;
  const reloadBase = typeof misc.reloadBuff === "number" ? misc.reloadBuff : 0.7;
  const fr = frBase * strength;
  const reload = reloadBase * strength;
  if (fr <= 0 && reload <= 0) return null;
  return {
    id: "ability:Penance",
    label: "Penance",
    category: "ability",
    ...(fr > 0 ? { fireRateBonus: fr } : {}),
    ...(reload > 0 ? { reloadBonus: reload } : {}),
    nominal: `+${(frBase * 100).toFixed(0)}% fire rate / +${(reloadBase * 100).toFixed(0)}% reload (× Strength)`,
  };
}

/** Wiki Covenant: +5% base + 1.5%/100 damage absorbed × Strength flat crit chance (body cap 50%, headshot cap 200%). */
function resolveCovenantBuff(
  ability: Ability,
  strength: number,
  simParams: SimulationParams,
): WeaponExternalBuff | null {
  const misc = ability.miscStats ?? {};
  const opts = {
    baseCriticalChance: typeof misc.baseCriticalChance === "number" ? misc.baseCriticalChance : 0.05,
    critChancePer100Damage: typeof misc.critChancePer100Damage === "number" ? misc.critChancePer100Damage : 0.015,
    headshotMultiplier: typeof misc.headshotMultiplier === "number" ? misc.headshotMultiplier : 4,
    bodyshotCritChanceCap: typeof misc.bodyshotCritChanceCap === "number" ? misc.bodyshotCritChanceCap : 0.5,
    headshotCritChanceCap: typeof misc.headshotCritChanceCap === "number" ? misc.headshotCritChanceCap : 2,
  };
  const absorbed =
    simParams.covenantAbsorbedDamage != null
      ? Math.max(0, simParams.covenantAbsorbedDamage)
      : 3000;
  const cc = computeCovenantCritChance(absorbed, strength, opts);
  if (cc.body <= 0 && cc.headshot <= 0) return null;

  const bodyPct = (cc.body * 100).toFixed(0);
  const hsPct = (cc.headshot * 100).toFixed(0);

  return {
    id: "ability:Covenant",
    label: "Covenant",
    category: "ability",
    critChanceFlatBonus: cc.body,
    weakPointCritChanceFlatBonus: Math.max(0, cc.headshot - cc.body),
    nominal: `+${bodyPct}% flat CC (+${hsPct}% on headshots)`,
  };
}

/** Wiki Grave Spirit: +50% weapon CD (additive with Organ Shatter) × Strength; Doom foes use doubled base. */
function resolveGraveSpiritBuff(
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats?.critDamageBonus;
  const base = typeof misc === "number" ? misc : 0.5;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Grave Spirit",
    label: "Grave Spirit",
    category: "ability",
    critMultBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% crit damage (additive, × Strength)`,
  };
}

/** Wiki Wrathful Advance: +200% final melee CC (flat after mods) × Strength; helminth base +100%. */
function resolveWrathfulAdvanceBuff(
  weapon: Weapon,
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  if (!isMeleeWeapon(weapon)) return null;
  const misc = ability.miscStats?.criticalChanceBonus;
  const base = typeof misc === "number" ? misc : 2;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Wrathful Advance",
    label: "Wrathful Advance",
    category: "ability",
    critChanceFlatBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% final melee crit chance (flat, × Strength)`,
  };
}

/** Wiki Cathode Grace: +50% weapon CC (additive with Point Strike) × Strength. */
function resolveCathodeGraceBuff(
  ability: Ability,
  strength: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats?.criticalChanceBonus;
  const base = typeof misc === "number" ? misc : 0.5;
  const bonus = base * strength;
  if (bonus <= 0) return null;
  return {
    id: "ability:Cathode Grace",
    label: "Cathode Grace",
    category: "ability",
    critChanceBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% crit chance (additive, × Strength)`,
  };
}

/** Wiki Redline: max-battery Fire Rate / Attack Speed × Ability Duration. */
function resolveRedlineBuff(
  weapon: Weapon,
  ability: Ability,
  abilityDuration: number,
): WeaponExternalBuff | null {
  const misc = ability.miscStats ?? {};
  if (isMeleeWeapon(weapon)) {
    const base = typeof misc.attackSpeedBuff === "number" ? misc.attackSpeedBuff : 0;
    if (base <= 0) return null;
    const bonus = base * abilityDuration;
    return {
      id: "ability:Redline",
      label: "Redline",
      category: "ability",
      fireRateBonus: bonus,
      nominal: `+${(base * 100).toFixed(0)}% attack speed (full battery)`,
    };
  }
  const base = typeof misc.fireRateBuff === "number" ? misc.fireRateBuff : 0;
  if (base <= 0) return null;
  const bonus = base * abilityDuration;
  return {
    id: "ability:Redline",
    label: "Redline",
    category: "ability",
    fireRateBonus: bonus,
    nominal: `+${(base * 100).toFixed(0)}% fire rate (full battery)`,
  };
}

function resolveAbilityBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const active = simParams.activeWeaponAbilityBuffs ?? [];
  if (active.length === 0 || !ctx.warframeId || !ctx.warframeStats || !ctx.warframeAbilities) return [];

  const strength = ctx.warframeStats.abilityStrength;
  const buffs: WeaponExternalBuff[] = [];

  for (const ability of ctx.warframeAbilities) {
    if (!active.includes(ability.name)) continue;

    if (ability.name === "Toxic Lash") {
      buffs.push(
        ...resolveToxicLashBuff(weapon, ctx.warframeId!, ability, strength, ctx, simParams),
      );
      continue;
    }

    const named = resolveNamedAbilityWeaponBuff(weapon, ctx, ability, strength, simParams);
    if (named) {
      buffs.push(named);
      continue;
    }

    // Damage vulnerability debuffs (e.g. Sevagoth Reap, Dagath Doom, Nezha Blazing Chakram, Caliban Sentient Wrath, Nova Molecular Prime)
    if (ability.miscStats?.damageVulnerability != null && Number(ability.miscStats.damageVulnerability) > 0) {
      const baseVuln = Number(ability.miscStats.damageVulnerability);
      const scaling = getVerifiedMiscScaling(ctx.warframeId, ability.name, "damageVulnerability");
      const scalesWithStr = scaling == null || scaling.scale === "strength";
      const vuln = scalesWithStr ? baseVuln * strength : baseVuln;
      buffs.push({
        id: `ability:${ability.name}:vulnerability`,
        label: `${ability.name}`,
        category: "ability",
        damageMultBonus: vuln,
        nominal: `+${(vuln * 100).toFixed(0)}% damage vulnerability`,
      });
      continue;
    }

    // Armor strip debuffs (e.g. Nekros Terrify, Styanax Tharros Strike, Ember Fire Blast, Hildryn Pillage, Frost Avalanche)
    if (
      (ability.miscStats?.armorStrip != null && Number(ability.miscStats.armorStrip) > 0) ||
      (ability.miscStats?.armorStripPerSecond != null && Number(ability.miscStats.armorStripPerSecond) > 0)
    ) {
      const baseStrip = Number(ability.miscStats?.armorStrip ?? ability.miscStats?.armorStripPerSecond ?? 0);
      const cap = Number(ability.miscStats?.armorStripCap ?? 1);
      const stripFraction = Math.min(cap, baseStrip * strength);
      const stripPct = Math.round(stripFraction * 100);
      buffs.push({
        id: `ability:${ability.name}:armor_strip`,
        label: `${ability.name}`,
        category: "ability",
        nominal: `-${stripPct}% enemy armor`,
      });
      continue;
    }

    if (ability.damageBuff == null || ability.damageBuff <= 0) continue;

    const bonus = scaledAbilityDamageBuff(ctx.warframeId, ability.name, ability.damageBuff, strength);
    if (bonus == null || bonus <= 0) continue;

    // Roar / Eclipse / etc. multiply after Serration (wiki Calculating Bonuses).
    buffs.push({
      id: `ability:${ability.name}`,
      label: ability.name,
      category: "ability",
      damageMultBonus: bonus,
      nominal: `+${(ability.damageBuff * 100).toFixed(0)}% weapon damage`,
    });
  }

  // Synthetic Lavos toggle (not a real kit ability) — resolve even if absent from warframeAbilities.
  if (
    active.includes("Valence Formation") &&
    !buffs.some((b) => b.id === "ability:Valence Formation")
  ) {
    const vf = resolveValenceFormationBuff(ctx, simParams);
    if (vf) buffs.push(vf);
  }

  return buffs;
}

function resolveShardBuffs(weapon: Weapon, ctx: WeaponBuffContext): WeaponExternalBuff[] {
  const stats = ctx.warframeStats;
  if (!stats) return [];

  const buffs: WeaponExternalBuff[] = [];

  if (isMeleeWeapon(weapon) && stats.meleeCritDamageBonus > 0) {
    buffs.push({
      id: "shard:melee-crit-damage",
      label: "Archon Shard (Melee Crit)",
      category: "shard",
      critMultBonus: stats.meleeCritDamageBonus / 100,
      nominal: `+${stats.meleeCritDamageBonus}% melee crit damage${
        stats.violetMeleeCritDamage?.doubled ? " (Violet doubled: Max Energy over 500)" : ""
      }`,
    });
  }

  if (isPrimaryWeapon(weapon) && stats.primaryShardBonus > 0) {
    buffs.push({
      id: "shard:primary-status",
      label: "Archon Shard (Primary Status)",
      category: "shard",
      statusBonus: stats.primaryShardBonus / 100,
      nominal: `+${stats.primaryShardBonus}% primary status chance`,
    });
  }

  if (isPrimaryWeapon(weapon) && (stats.primaryElectricityShardBonus ?? 0) > 0) {
    const v = stats.primaryElectricityShardBonus!;
    buffs.push({
      id: "shard:primary-electricity",
      label: "Archon Shard (Primary Electricity)",
      category: "shard",
      // wiki: combines with mods like Stormbringer (not parallel).
      elemental: [{ type: "electricity", bonusFraction: v / 100 }],
      nominal: `+${v}% primary Electricity damage`,
    });
  }

  if ((stats.toxinStatusDamageShardBonus ?? 0) > 0 || (stats.corrosionMaxStacksShardBonus ?? 0) > 0) {
    const tox = stats.toxinStatusDamageShardBonus ?? 0;
    const cor = stats.corrosionMaxStacksShardBonus ?? 0;
    buffs.push({
      id: "shard:emerald-status",
      label: "Archon Shard (Toxin / Corrosion status)",
      category: "shard",
      toxinStatusDamageBonus: tox / 100,
      corrosionMaxStacksBonus: cor,
      nominal: [tox ? `+${tox}% Toxin status damage` : "", cor ? `+${cor} Corrosion stacks` : ""]
        .filter(Boolean)
        .join(", "),
    });
  }

  if (isSecondaryWeapon(weapon) && stats.secondaryShardBonus > 0) {
    buffs.push({
      id: "shard:secondary-crit",
      label: "Archon Shard (Secondary Crit)",
      category: "shard",
      critChanceBonus: stats.secondaryShardBonus / 100,
      nominal: `+${stats.secondaryShardBonus}% secondary crit chance`,
    });
  }

  return buffs;
}

const SPEARGUN_WEAPON_IDS = new Set([
  "javlok",
  "scourge",
  "scourge_prime",
  "afentis",
  "ferrox",
  "tenet_ferrox",
]);

function resolveWarframePassiveBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const family = warframeFamilyId(ctx.warframeId);
  const buffs: WeaponExternalBuff[] = [];

  if (family === "styanax") {
    const shields = ctx.warframeStats?.totalShield ?? 0;
    const isSpeargun = SPEARGUN_WEAPON_IDS.has(weapon.id) || weapon.name.toLowerCase().includes("speargun");
    const cc = computeStyanaxHopliteCritChance(shields, { speargun: isSpeargun });
    if (cc > 0) {
      buffs.push({
        id: "passive_styanax_hoplite",
        label: "Hoplite (Styanax Passive)",
        category: "ability",
        critChanceFlatBonus: cc,
        nominal: `+${(cc * 100).toFixed(0)}% flat crit chance from shields`,
      });
    }
  }

  if (family === "yareli" && isSecondaryWeapon(weapon) && simParams.applyYareliCriticalFlow === true) {
    const ccBonus = computeYareliCriticalFlowCritChance(true);
    if (ccBonus > 0) {
      buffs.push({
        id: "passive_yareli_critical_flow",
        label: "Critical Flow (Yareli Passive)",
        category: "ability",
        critChanceBonus: ccBonus,
        nominal: "+200% secondary crit chance while moving",
      });
    }
  }

  if (family === "zephyr" && simParams.applyZephyrAirborne === true) {
    const ccBonus = computeZephyrAirborneCritChance(true);
    if (ccBonus > 0) {
      buffs.push({
        id: "passive_zephyr_airborne",
        label: "Aerodynamic (Zephyr Passive)",
        category: "ability",
        critChanceBonus: ccBonus,
        nominal: "+150% weapon crit chance while airborne",
      });
    }
  }

  if (family === "mesa" && isSecondaryWeapon(weapon)) {
    const dual = isDualSidearmWeapon(weapon);
    const mesa = computeMesaPassiveBonuses({
      sidearmStyle: dual ? "dual" : "single",
      meleeEquipped: true,
    });
    if (mesa.fireRateBonus > 0) {
      buffs.push({
        id: "passive_mesa_marksman_dual",
        label: "Marksman's Dexterity (Mesa Passive)",
        category: "ability",
        fireRateBonus: mesa.fireRateBonus,
        nominal: "+15% dual sidearm fire rate",
      });
    }
    if (mesa.reloadSpeedBonus > 0) {
      buffs.push({
        id: "passive_mesa_marksman_single",
        label: "Marksman's Dexterity (Mesa Passive)",
        category: "ability",
        reloadBonus: mesa.reloadSpeedBonus,
        nominal: "+25% one-handed sidearm reload speed",
      });
    }
  }

  if (
    (family === "excalibur" || ctx.warframeId === "excalibur_umbra") &&
    isExcaliburSwordWeapon(weapon)
  ) {
    const excal = computeExcaliburSwordsmanshipBonuses(true);
    if (excal.damageBonus > 0 || excal.attackSpeedBonus > 0) {
      buffs.push({
        id: "passive_excalibur_swordsmanship",
        label: "Swordsmanship (Excalibur Passive)",
        category: "ability",
        damageBonus: excal.damageBonus,
        fireRateBonus: excal.attackSpeedBonus,
        nominal: "+10% sword damage, +10% attack speed",
      });
    }
  }

  if (family === "kullervo" && isMeleeWeapon(weapon)) {
    const kul = computeKullervoMeleePassiveBonuses();
    buffs.push({
      id: "passive_kullervo_wrathful",
      label: "Wrathful Mastery (Kullervo Passive)",
      category: "ability",
      heavyAttackEfficiencyBonus: kul.heavyAttackEfficiency,
      heavyAttackWindUpBonus: kul.heavyAttackWindUpSpeed,
      nominal: "+75% Heavy Attack Efficiency, +100% Heavy Wind-Up Speed",
    });
  }

  if (family === "saryn") {
    const durBonus = computeSarynPassiveStatusDurationMultiplier() - 1;
    if (durBonus > 0) {
      buffs.push({
        id: "passive_saryn_potency",
        label: "Potency (Saryn Passive)",
        category: "ability",
        statusDurationBonus: durBonus,
        nominal: "+25% status duration",
      });
    }
  }

  if (family === "garuda" && simParams.applyGarudaDeathsGate === true) {
    const dmgBonus = computeGarudaPassiveDamageBonus(20);
    if (dmgBonus > 0) {
      buffs.push({
        id: "passive_garuda_deaths_gate",
        label: "Death's Gate (Garuda Passive)",
        category: "ability",
        damageMultBonus: dmgBonus,
        nominal: "+100% multiplicative weapon damage (max stacks)",
      });
    }
  }

  return buffs;
}

/**
 * External conditional buffs toggled manually in standalone Weapon / Modular Builders
 * when no Loadout is linked (defaults are all OFF so paper stats remain untouched).
 */
/**
 * Resolves innate weapon passive buffs conditioned on user toggle/slider state.
 * Default is 0 / false (all buffs OFF so paper stats remain stock).
 */
export function resolveWeaponPassiveBuffs(
  weapon: Weapon,
  simParams?: Pick<SimulationParams, "weaponPassiveState" | "applyHeadshots" | "applyAiming">,
): WeaponExternalBuff[] {
  const state = simParams?.weaponPassiveState ?? {};
  const buffs: WeaponExternalBuff[] = [];
  const wid = weapon.id;

  if ((wid === "athodai" || wid === "athodai_prime") && (state.athodai_overdrive ?? 0) > 0) {
    buffs.push({
      id: "passive_athodai_overdrive",
      label: "Overdrive (Athodai Passive)",
      category: "other",
      fireRateBonus: 1.0,
      infiniteAmmoUptime: 1,
      nominal: "+100% Fire Rate and Infinite Ammo on weak point kill",
    });
  }

  if (wid === "dual_toxocyst" && (state.dual_toxocyst_frenzy ?? 0) > 0) {
    buffs.push({
      id: "passive_dual_toxocyst_frenzy",
      label: "Frenzy (Dual Toxocyst Passive)",
      category: "other",
      fireRateBonus: 1.5,
      damageBonus: 1.0,
      nominal: "+150% Fire Rate & +100% Damage on headshot",
    });
  }

  if ((wid === "knell" || wid === "knell_prime") && (state.knell_death_knell ?? 0) > 0) {
    const stacks = Math.min(3, Math.max(1, Math.round(state.knell_death_knell)));
    buffs.push({
      id: "passive_knell_death_knell",
      label: `Death Knell (${stacks}×) (Knell Passive)`,
      category: "other",
      critMultFlatBonus: 0.5 * stacks,
      statusChanceFlatBonus: 0.2 * stacks,
      nominal: `+${(0.5 * stacks).toFixed(1)}× Crit Multiplier, +${(20 * stacks).toFixed(0)}% Status Chance`,
    });
  }

  if (wid === "arca_scisco" && (state.arca_scisco_target_analysis ?? 0) > 0) {
    const stacks = Math.min(5, Math.max(1, Math.round(state.arca_scisco_target_analysis)));
    buffs.push({
      id: "passive_arca_scisco_target_analysis",
      label: `Target Analysis (${stacks}×) (Arca Scisco Passive)`,
      category: "other",
      critChanceBonus: 0.04 * stacks,
      statusBonus: 0.04 * stacks,
      nominal: `+${(4 * stacks).toFixed(0)}% Crit Chance, +${(4 * stacks).toFixed(0)}% Status Chance`,
    });
  }

  if (wid === "lesion" && (state.lesion_status_rush ?? 0) > 0) {
    buffs.push({
      id: "passive_lesion_status_rush",
      label: "Status Rush (Lesion Passive)",
      category: "other",
      fireRateBonus: 0.15,
      elemental: [{ type: "toxin", bonusFraction: 1.0 }],
      nominal: "+15% Attack Speed & +100% Toxin damage on status proc",
    });
  }

  if (wid === "pennant" && (state.pennant_speed ?? 0) > 0) {
    buffs.push({
      id: "passive_pennant_speed",
      label: "Surge (Pennant Passive)",
      category: "other",
      fireRateBonus: 0.5,
      nominal: "+50% Attack Speed on Heavy Attack kill",
    });
  }

  if (wid === "pyrana_prime" && (state.pyrana_ethereal ?? 0) > 0) {
    buffs.push({
      id: "passive_pyrana_ethereal",
      label: "Ethereal Pyrana (Pyrana Prime Passive)",
      category: "other",
      fireRateBonus: 0.4,
      nominal: "+40% Fire Rate on 3 kills in 3s",
    });
  }

  if (wid === "ax_52") {
    const aimed = !!(simParams?.applyAiming || (state.ax_52_aimed_headshot ?? 0) > 0);
    // Wiki AX-52: hip-fire is +75% ammo efficiency. +400% CC applies only to headshots while aiming.
    if (aimed && simParams?.applyHeadshots) {
      buffs.push({
        id: "passive_ax_52_aimed_headshot",
        label: "Marksman (AX-52 Passive)",
        category: "other",
        critChanceBonus: 4.0,
        nominal: "+400% Critical Chance on aimed headshots",
      });
    } else if (!aimed) {
      buffs.push({
        id: "passive_ax_52_hipfire",
        label: "Hip-fire (AX-52 Passive)",
        category: "other",
        ammoEfficiency: 0.75,
        nominal: "+75% Ammo Efficiency while hip-firing",
      });
    }
  }

  if (wid === "sibear" && (state.sibear_heavy ?? 0) > 0) {
    buffs.push({
      id: "passive_sibear_heavy",
      label: "Heavy Surge (Sibear Passive)",
      category: "other",
      statusBonus: 0.5,
      nominal: "+50% Status Chance after Heavy Attack",
    });
  }

  if ((wid === "silva_&_aegis" || wid === "silva_&_aegis_prime") && (state.silva_aegis_block ?? 0) > 0) {
    const stacks = Math.min(4, Math.max(1, Math.round(state.silva_aegis_block)));
    buffs.push({
      id: "passive_silva_aegis_block",
      label: `Shield Absorption (${stacks}×) (Silva & Aegis Passive)`,
      category: "other",
      critChanceBonus: 0.15 * stacks,
      statusBonus: 0.15 * stacks,
      nominal: `+${(15 * stacks).toFixed(0)}% Crit Chance & +${(15 * stacks).toFixed(0)}% Status Chance`,
    });
  }

  return buffs;
}

/**
 * Standalone weapon builder external buffs (Yareli / Zephyr / Garuda / Bond mods / Weapon Passives)
 * when no Loadout is linked (defaults are all OFF so paper stats remain untouched).
 */
export function resolveStandaloneExternalBuffs(
  weapon: Weapon,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const buffs: WeaponExternalBuff[] = [];
  buffs.push(...resolveWeaponPassiveBuffs(weapon, simParams));
  if (simParams.applyYareliCriticalFlow === true && isSecondaryWeapon(weapon)) {
    buffs.push({
      id: "passive_yareli_critical_flow",
      label: "Critical Flow (Yareli Passive)",
      category: "ability",
      critChanceBonus: computeYareliCriticalFlowCritChance(true),
      nominal: "+200% secondary crit chance while moving",
    });
  }
  if (simParams.applyZephyrAirborne === true) {
    buffs.push({
      id: "passive_zephyr_airborne",
      label: "Aerodynamic (Zephyr Passive)",
      category: "ability",
      critChanceBonus: computeZephyrAirborneCritChance(true),
      nominal: "+150% weapon crit chance while airborne",
    });
  }
  if (simParams.applyGarudaDeathsGate === true) {
    buffs.push({
      id: "passive_garuda_deaths_gate",
      label: "Death's Gate (Garuda Passive)",
      category: "ability",
      damageMultBonus: computeGarudaPassiveDamageBonus(20),
      nominal: "+100% multiplicative weapon damage",
    });
  }
  if (simParams.applyTenaciousBondCrit === true) {
    buffs.push({
      id: "companion:tenacious_bond",
      label: "Tenacious Bond",
      category: "companion",
      critMultFlatBonus: 1.2,
      nominal: "+1.2× crit damage (companion crit ≥50%)",
    });
  }
  if (simParams.applyReinforcedBondFireRate === true && !isMeleeWeapon(weapon)) {
    buffs.push({
      id: "companion:reinforced_bond",
      label: "Reinforced Bond",
      category: "companion",
      fireRateBonus: 0.6,
      nominal: "+60% fire rate (companion shields)",
    });
  }
  return buffs;
}

function resolveWarframeArcaneBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const arcaneIds = ctx.warframeArcaneIds;
  if (!arcaneIds?.length) return [];

  const buffs: WeaponExternalBuff[] = [];
  const ranks = ctx.warframeArcaneRanks ?? [];

  for (let idx = 0; idx < arcaneIds.length; idx++) {
    const id = arcaneIds[idx];
    if (!id) continue;
    const def = getArcaneEffectDef(id);
    if (!def) continue;

    const rank = ranks[idx] != null && Number.isFinite(ranks[idx]) ? ranks[idx]! : def.maxRank;

    // Each Warframe arcane follows its own toggle or event. Kill stacks, combo, and the
    // generic trigger bucket do not turn the others on.
    let stacks = 0;
    if (simParams.arcaneStacksById && simParams.arcaneStacksById[id] != null) {
      stacks = simParams.arcaneStacksById[id];
    } else if (id === "arcane_crepuscular" && simParams.applyInvisible) {
      stacks = 1;
    } else if (def.trigger === "passive") {
      stacks = 1;
    }

    if (stacks <= 0) continue;

    const buffId = `warframe_arcane:${id}:${idx}`;

    switch (id) {
      case "arcane_rage": {
        if (!isPrimaryWeapon(weapon) && !isGroundPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "holsterDamage" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 180;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Rage",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% primary damage on headshot`,
        });
        break;
      }

      case "arcane_acceleration": {
        if (!isGroundPrimaryWeapon(weapon) && !isPrimaryWeapon(weapon)) break;
        if (isShotgunPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "fireRate");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 90;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Acceleration",
          category: "arcane",
          fireRateBonus: val / 100,
          nominal: `+${val}% primary fire rate on crit (excl. shotguns)`,
        });
        break;
      }

      case "arcane_tempo": {
        if (!isShotgunPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "fireRate");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 90;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Tempo",
          category: "arcane",
          fireRateBonus: val / 100,
          nominal: `+${val}% shotgun fire rate on crit`,
        });
        break;
      }

      case "arcane_velocity": {
        if (!isSecondaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "fireRate");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 120;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Velocity",
          category: "arcane",
          fireRateBonus: val / 100,
          nominal: `+${val}% secondary fire rate on crit`,
        });
        break;
      }

      case "arcane_precision": {
        if (!isSecondaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "headshotDamage" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 300;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Precision",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% secondary damage on headshot`,
        });
        break;
      }

      case "arcane_awakening": {
        if (!isSecondaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "holsterDamage" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 150;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Awakening",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% secondary damage on reload`,
        });
        break;
      }

      case "arcane_rise": {
        if (!isPrimaryWeapon(weapon) && !isGroundPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "holsterDamage" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 150;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Rise",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% primary damage on reload`,
        });
        break;
      }

      case "arcane_primary_charger": {
        if (!isPrimaryWeapon(weapon) && !isGroundPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 300;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Primary Charger",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% primary damage on melee kill`,
        });
        break;
      }

      case "arcane_fury": {
        if (!isMeleeWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "meleeDamageBonus" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 180;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Fury",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% melee damage on crit`,
        });
        break;
      }

      case "arcane_blade_charger": {
        if (!isMeleeWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "meleeDamageBonus" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 300;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Blade Charger",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% melee damage on primary kill`,
        });
        break;
      }

      case "arcane_strike": {
        if (!isMeleeWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "attackSpeed");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 60;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Strike",
          category: "arcane",
          fireRateBonus: val / 100,
          nominal: `+${val}% melee attack speed on hit`,
        });
        break;
      }

      case "arcane_avenger": {
        const line = (def.effects ?? []).find((e) => e.stat === "criticalChance");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 45;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Avenger",
          category: "arcane",
          critChanceFlatBonus: val / 100,
          nominal: `+${val}% flat critical chance on damaged`,
        });
        break;
      }

      case "arcane_arachne": {
        if (!isPrimaryWeapon(weapon) && !isSecondaryWeapon(weapon) && !weapon.isExalted) break;
        const line = (def.effects ?? []).find((e) => e.stat === "wallLatchDamage" || e.stat === "damage");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 150;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Arachne",
          category: "arcane",
          damageBonus: val / 100,
          nominal: `+${val}% damage on wall latch`,
        });
        break;
      }

      case "arcane_momentum": {
        if (!isSniperPrimaryWeapon(weapon)) break;
        const line = (def.effects ?? []).find((e) => e.stat === "reloadSpeedBonus" || e.stat === "reloadSpeed");
        const val = line ? scaleArcaneEffectLine(line, rank, def.maxRank) : 150;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Momentum",
          category: "arcane",
          reloadBonus: val / 100,
          nominal: `+${val}% sniper reload speed on crit`,
        });
        break;
      }

      case "arcane_crepuscular": {
        const cmLine = (def.effects ?? []).find((e) => e.stat === "criticalMultiplier");
        const cm = cmLine ? scaleArcaneEffectLine(cmLine, rank, def.maxRank) : 3;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Crepuscular",
          category: "arcane",
          critMultFlatBonus: cm,
          nominal: `+${cm}× final crit multiplier while invisible`,
        });
        break;
      }

      case "arcane_pistoleer": {
        // Realized active window: Infinite Ammo on primaries and secondaries.
        // Expected uptime from the proc chance stays in infiniteAmmoUptimeFromChance, not this toggle.
        if (!isPrimaryWeapon(weapon) && !isGroundPrimaryWeapon(weapon) && !isSecondaryWeapon(weapon)) break;
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Pistoleer",
          category: "arcane",
          infiniteAmmoUptime: 1,
          nominal: "Infinite Ammo (active window) on primary and secondary",
        });
        break;
      }

      case "theorem_demulcent": {
        const effStacks = Math.min(15, stacks > 1 ? stacks : 15);
        buffs.push({
          id: buffId,
          label: def.name || "Theorem Demulcent",
          category: "arcane",
          damageBonus: (12 * effStacks) / 100,
          nominal: `+${12 * effStacks}% weapon damage from Residual zone`,
        });
        break;
      }

      case "arcane_hot_shot": {
        const effStacks = Math.min(50, stacks > 1 ? stacks : 50);
        buffs.push({
          id: buffId,
          label: def.name || "Arcane Hot Shot",
          category: "arcane",
          critChanceBonus: (6 * effStacks) / 100,
          nominal: `+${6 * effStacks}% weapon critical chance on ability heat proc`,
        });
        break;
      }

      default:
        break;
    }
  }

  return buffs;
}

export function resolveWeaponExternalBuffs(
  weapon: Weapon,
  ctx: WeaponBuffContext | undefined,
  simParams: SimulationParams,
): WeaponExternalBuff[] {
  const passiveBuffs = resolveWeaponPassiveBuffs(weapon, simParams);
  if (!ctx) return passiveBuffs;
  return [
    ...passiveBuffs,
    ...resolveAbilityBuffs(weapon, ctx, simParams),
    ...resolveWarframePassiveBuffs(weapon, ctx, simParams),
    ...resolveShardBuffs(weapon, ctx),
    ...resolveWarframeCrossModBuffs(weapon, ctx, simParams),
    ...resolveCompanionBondBuffs(weapon, ctx, simParams),
    ...resolveWarframeArcaneBuffs(weapon, ctx, simParams),
  ];
}

const NAMED_WEAPON_BUFF_ABILITIES = new Set([
  "Electric Shield",
  "Nourish",
  "Toxic Lash",
  "Xata's Whisper",
  "Vex Armor",
  "Shooting Gallery",
  "Symphony Of Mercy",
  "Redline",
  "Cathode Grace",
  "Wrathful Advance",
  "Grave Spirit",
  "Penance",
  "Covenant",
  "Shroud Of Dynar",
  "Absorb",
  "Turbulence",
  "Fireball",
  "Freeze",
  "Shock",
  "Spores",
  "Smite",
  "Virulence",
  "Enthrall",
  "Smoke Screen",
  "Thermal Sunder",
  "Razorwing",
  "Breach Surge",
  "Radial Javelin",
  "Valence Formation",
]);

/** Helminth Empower is +Ability Strength, not a weapon damage buff. */
const NON_WEAPON_DAMAGE_BUFF_ABILITIES = new Set(["Empower"]);

/** Replace one ability slot with a Helminth inject for loadout buff resolution. */
export function resolveAbilitiesWithHelminth(
  abilities: Ability[] | undefined,
  helminthAbilityId?: string | null,
  helminthSlot?: number | null,
  hostWarframeId?: string,
): Ability[] {
  if (!abilities?.length) return [];
  const rows = abilities.map((a) => ({ ...a }));
  if (
    helminthAbilityId == null ||
    helminthSlot == null ||
    helminthSlot < 0 ||
    helminthSlot >= rows.length
  ) {
    return rows;
  }
  const h = allHelminthAbilities.find((x) => x.id === helminthAbilityId);
  if (!h) return rows;
  rows[helminthSlot] = helminthToAbility(h, hostWarframeId);
  return rows;
}

/** Abilities that can be toggled as loadout weapon buffs or enemy debuffs. */
export function weaponDamageBuffAbilities(abilities: Ability[] | undefined): Ability[] {
  if (!abilities) return [];
  const out = abilities.filter((a) => {
    if (NON_WEAPON_DAMAGE_BUFF_ABILITIES.has(a.name)) return false;
    if (NAMED_WEAPON_BUFF_ABILITIES.has(a.name)) return true;
    if (a.miscStats?.damageVulnerability != null && Number(a.miscStats.damageVulnerability) > 0) return true;
    if (a.miscStats?.armorStrip != null && Number(a.miscStats.armorStrip) > 0) return true;
    if (a.miscStats?.armorStripPerSecond != null && Number(a.miscStats.armorStripPerSecond) > 0) return true;
    // Roar / Eclipse / etc. use verified top-level damageBuff.
    return a.damageBuff != null && a.damageBuff > 0 && a.name !== "Xata's Whisper";
  });
  // Lavos Passive Augment — synthetic toggle when kit is present.
  if (
    abilities.some((a) => LAVOS_ABILITY_NAMES.has(a.name)) &&
    !out.some((a) => a.name === "Valence Formation")
  ) {
    out.push({
      name: "Valence Formation",
      energyCost: 0,
      description:
        "Passive Augment: imbued ability cast → parallel elemental + guaranteed status on weapons.",
    });
  }
  return out;
}

/**
 * Computes total armor strip percentage from active warframe debuff abilities (Terrify, Tharros Strike, etc.).
 * Scales with warframe Ability Strength and respects per-ability caps (default 100%).
 */
export function computeLoadoutAbilityArmorStripPct(
  abilities: Ability[] | undefined,
  strength: number,
  activeAbilityNames: string[],
): number {
  if (!abilities?.length || !activeAbilityNames.length) return 0;
  let totalStrip = 0;
  for (const name of activeAbilityNames) {
    const ability = abilities.find((a) => a.name.toLowerCase() === name.toLowerCase());
    if (!ability?.miscStats) continue;
    const base = Number(ability.miscStats.armorStrip ?? ability.miscStats.armorStripPerSecond ?? 0);
    if (base > 0) {
      const cap = Number(ability.miscStats.armorStripCap ?? 1);
      const scaled = Math.min(cap, base * strength);
      totalStrip += scaled * 100;
    }
  }
  return Math.min(100, Math.round(totalStrip));
}

/** Formats a compact badge describing an active ability buff or enemy debuff. */
export function formatAbilityBuffDebuffBadge(
  ability: Ability,
  strength: number,
  warframeId?: string,
): string | null {
  if (ability.damageBuff != null && ability.damageBuff > 0) {
    const bonus = scaledAbilityDamageBuff(warframeId, ability.name, ability.damageBuff, strength);
    return `+${((bonus ?? ability.damageBuff) * 100).toFixed(0)}% dmg`;
  }
  if (ability.miscStats?.damageVulnerability != null && Number(ability.miscStats.damageVulnerability) > 0) {
    const base = Number(ability.miscStats.damageVulnerability);
    const scaling = getVerifiedMiscScaling(warframeId, ability.name, "damageVulnerability");
    const scales = scaling == null || scaling.scale === "strength";
    const vuln = scales ? base * strength : base;
    return `+${(vuln * 100).toFixed(0)}% vuln`;
  }
  if (ability.miscStats?.armorStrip != null && Number(ability.miscStats.armorStrip) > 0) {
    const base = Number(ability.miscStats.armorStrip);
    const cap = Number(ability.miscStats.armorStripCap ?? 1);
    const strip = Math.min(cap, base * strength);
    return `-${(strip * 100).toFixed(0)}% armor`;
  }
  if (ability.miscStats?.armorStripPerSecond != null && Number(ability.miscStats.armorStripPerSecond) > 0) {
    const base = Number(ability.miscStats.armorStripPerSecond);
    return `-${(base * strength * 100).toFixed(0)}%/s armor`;
  }
  if (ability.name === "Covenant") return "+50% CC / +200% HS";
  if (ability.name === "Penance") return `+${(0.35 * strength * 100).toFixed(0)}% fire rate`;
  if (ability.name === "Wrathful Advance") return `+${(2.0 * strength * 100).toFixed(0)}% melee CC`;
  if (ability.name === "Nourish") return "+Viral";
  if (ability.name === "Toxic Lash") return "+Toxin";
  if (ability.name === "Xata's Whisper") return "+Void";
  if (ability.name === "Vex Armor") return `+${(2.75 * strength * 100).toFixed(0)}% Fury`;
  if (ability.name === "Symphony Of Mercy") return `+${(0.3 * strength * 100).toFixed(0)}% dmg`;
  return null;
}

export function mergeWeaponCalcOptions(
  existing:
    | {
        progenitorElement?: string;
        progenitorBonusPercent?: number;
        incarnonFormActive?: boolean;
        abilityStrength?: number;
        arcaneRanks?: number[];
      }
    | undefined,
  externalBuffs: WeaponExternalBuff[],
): import("@/lib/types").WeaponCalculationOptions | undefined {
  const hasProgenitor =
    existing?.progenitorElement &&
    existing.progenitorBonusPercent != null &&
    existing.progenitorBonusPercent > 0;
  const formActive = existing?.incarnonFormActive === true;
  const hasStr =
    typeof existing?.abilityStrength === "number" && Number.isFinite(existing.abilityStrength);
  const hasArcaneRanks = Boolean(existing?.arcaneRanks?.length);
  if (!hasProgenitor && externalBuffs.length === 0 && !formActive && !hasStr && !hasArcaneRanks) {
    return undefined;
  }
  return {
    ...(hasProgenitor
      ? {
          progenitorElement: existing!.progenitorElement,
          progenitorBonusPercent: existing!.progenitorBonusPercent,
        }
      : {}),
    ...(externalBuffs.length > 0 ? { externalBuffs } : {}),
    ...(formActive ? { incarnonFormActive: true } : {}),
    ...(hasStr ? { abilityStrength: existing!.abilityStrength } : {}),
    ...(hasArcaneRanks ? { arcaneRanks: existing!.arcaneRanks } : {}),
  };
}
