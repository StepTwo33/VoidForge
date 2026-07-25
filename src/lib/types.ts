// Core data types for FrameHub

export interface Mod {
  id: string;
  name: string;
  polarity: string;
  drain: number;
  maxRank: number;
  category: string;
  stats: Record<string, number>;
  description: string;
  rarity: string;
  imagePath?: string;
  subCategory?: string;
  warframeId?: string; // For augments: which warframe this augment belongs to ('universal' = any)
}

export interface Weapon {
  id: string;
  name: string;
  category: string;
  damage: number;
  impact: number;
  puncture: number;
  slash: number;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  tau?: number;
  fireRate: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  magazine: number;
  reloadTime: number;
  multishot: number;
  /**
   * Ammo consumed per shot (default 1). Staticor charged fire costs 5.
   */
  ammoCost?: number;
  triggerType: string;
  modSlots: number;
  hasPrimaryArcaneSlot: boolean;
  hasSecondaryArcaneSlot: boolean;
  isIncarnon: boolean;
  incarnonEvolutions?: string[];
  hasRivenSlot: boolean;
  // Arcane configuration
  arcaneSlots?: number; // Number of arcane slots (default: 1 for weapons, 2 for warframes/archguns/kitguns/zaws)
  arcaneType?: string; // 'primary' | 'secondary' | 'melee' | 'kitgun' | 'exodia' | 'archgun' | 'amp'
  // Stance (melee only)
  stanceType?: string; // e.g. 'sword', 'heavy_blade', 'dual_swords', etc. Used to filter stance mods
  // Exalted weapon fields
  warframeId?: string;
  abilityName?: string;
  isExalted?: boolean;
  // Companion weapon fields
  companionType?: string;
  weaponCategory?: string;
  // Tektolyst Artifact fields
  focusSchool?: string; // 'Zenurik' | 'Naramon' | 'Madurai' | 'Unairu' | 'Vazarin'
  /** Kitgun chamber category — used for arsenal-parity status display. */
  kitgunChamberCategory?: "projectile_shotgun" | "projectile_rifle" | "hitscan_auto" | "beam";
  /** Codex-style passive (merged from data/weapon-passives when present). */
  passive?: string;
  /** AoE / radial attacks (merged from data/weapon-radial-attacks when present). */
  radialAttacks?: WeaponRadialAttack[];
  /**
   * Base charge time in seconds (unmodded). Used for charge / bow effective fire rate.
   * Populated by weapon-enrich from WEAPON_FIRE_TIMING when known.
   */
  chargeTime?: number;
  /** Charge FR mode: standard | bow | lanka (wiki Fire Rate). */
  chargeMode?: "standard" | "bow" | "lanka";
  /** Shots per burst (burst trigger weapons). */
  burstCount?: number;
  /** Delay between shots inside a burst (seconds). */
  burstDelay?: number;
  /**
   * Gravimag (Atmosphere) mode overrides for archguns. Base stats are the
   * Archwing (space) values; enabling Gravimag mode replaces these fields
   * (and radial attacks, when provided) with the atmospheric values.
   */
  atmosphereStats?: WeaponAtmosphereStats;
  /**
   * Optional alternate fire/form overlay (e.g. Staticor charged, Dark Split-Sword
   * Heavy Blade). Catalog default is the primary form; toggle merges these fields.
   */
  alternateModeStats?: WeaponAlternateModeStats;
}

/** Stat overrides applied when an archgun is deployed via Gravimag (atmosphere). */
export interface WeaponAtmosphereStats {
  damage?: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  fireRate?: number;
  criticalChance?: number;
  criticalMultiplier?: number;
  statusChance?: number;
  magazine?: number;
  reloadTime?: number;
  multishot?: number;
  /** Atmosphere-specific radial attack profiles (replace the Archwing ones). */
  radialAttacks?: WeaponRadialAttack[];
}

/** Alternate fire / stance-form overlays (builder toggle; default catalog = off). */
export interface WeaponAlternateModeStats {
  /** Short UI label when the alternate mode is active. */
  label: string;
  damage?: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  fireRate?: number;
  criticalChance?: number;
  criticalMultiplier?: number;
  statusChance?: number;
  magazine?: number;
  reloadTime?: number;
  multishot?: number;
  /** Ammo consumed per shot while this mode is active (e.g. Staticor charged = 5). */
  ammoCost?: number;
  /** Charge timing for effective fire rate while this mode is active. */
  chargeTime?: number;
  chargeMode?: "standard" | "bow" | "lanka";
  triggerType?: string;
  /** Melee form swap (e.g. Dual Swords → Heavy Blade). */
  stanceType?: string;
  /** Replace default radial profiles while alternate mode is on. */
  radialAttacks?: WeaponRadialAttack[];
}

/** Secondary AoE profile (explosion, slam radial, cube blast, etc.). */
export interface WeaponRadialAttack {
  name: string;
  totalDamage: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  /** Tau damage type (distinct from Tauforged Archon Shards). */
  tau?: number;
  radius: number;
  /** Damage reduction at max radius (0.5 = 50% falloff from center to edge). */
  falloffReduction?: number;
  explosionDelay?: number;
  /** Populated by build calculator for innate radial profiles. */
  burstDps?: number;
  avgDamage?: number;
}

export interface Warframe {
  id: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  energy: number;
  sprintSpeed: number;
  abilities: Ability[];
  description: string;
  passive: string;
}

export interface Ability {
  name: string;
  energyCost: number;
  description: string;
  subAbilities?: string[];
  damage?: number;
  directDamage?: number;
  aoeDamage?: number;
  damagePerSecond?: number;
  range?: number;
  duration?: number;
  radius?: number;
  health?: number;
  armor?: number;
  shield?: number;
  damageReduction?: number;
  damageBuff?: number;
  statusChance?: number;
  damageType?: string;
  castTime?: number;
  cooldown?: number;
  maxTargets?: number;
  chainRange?: number;
  chainLinks?: number;
  comboMultiplier?: number;
  miscStats?: Record<string, unknown>;
}

export interface ArchonShard {
  id: string;
  name: string;
  color: string;
  tier: number; // 1 = standard, 2 = tauforged
  statBonuses: Record<string, number>;
  description: string;
  isCoalescent: boolean;
}

export interface ModSlot {
  modId: string;
  rank: number;
  slotIndex: number;
  /** Imported riven stat rolls (decimal fractions, e.g. 0.44 = +44%). */
  rivenStats?: Record<string, number>;
}

/** Optional other loadout slots so cross-slot mod sets (Augur, Hunter, Synth, …) count correctly. */
export interface SetBonusLinkage {
  warframeMods?: ModSlot[];
  primaryMods?: ModSlot[];
  secondaryMods?: ModSlot[];
  meleeMods?: ModSlot[];
  companionMods?: ModSlot[];
  /** Beast claw / companion weapon mods (elementals for Mecha transferred DoT). */
  companionWeaponMods?: ModSlot[];
}

export interface SetBonusSummaryLine {
  setId: string;
  label: string;
  pieces: number;
  required: number;
  active: boolean;
  description: string;
}

export interface EquippedMod {
  modId: string;
  modName: string;
  rank: number;
  slotIndex: number;
  polarity?: string;
  drain?: number;
}

export interface EquippedArchonShard {
  shardId: string;
  shardColor: string;
  shardTier: number;
  selectedBonus: string;
  bonusValue: number;
  slotIndex: number;
}

/** Saved modular weapon (kitgun / zaw / amp) — matches builder payload. */
export interface ModularBuildData {
  modularType: string; // 'kitgun' | 'zaw' | 'amp'
  parts: Record<string, string>;
  mods: ModSlot[];
  arcaneIds?: (string | null)[];
  hasOrokinCatalyst: boolean;
  isMR30?: boolean;
  slotPolarities?: Record<number, string>;
  customName?: string;
}

export interface WeaponExternalBuffElemental {
  type: string;
  /** Fraction of base weapon damage, same as mod elemental (+0.6 = +60%). */
  bonusFraction: number;
  /**
   * When true, added after elemental combos (wiki Fireball Frenzy / Freeze Force /
   * Shock Trooper / Venom Dose / Smite Infusion — parallel, does not combine).
   */
  parallel?: boolean;
}

/** Buff from warframe abilities, archon shards, or other loadout-wide sources. */
export interface WeaponExternalBuff {
  id: string;
  label: string;
  category: "ability" | "shard" | "companion" | "warframe_mod" | "set" | "other";
  /**
   * Additive base-damage bonus fraction (+0.5 = +50% with Serration-style mods).
   * Prefer {@link damageMultBonus} for Roar / Eclipse-style ability buffs.
   */
  damageBonus?: number;
  /**
   * Multiplicative damage bonus applied after additive base-damage mods
   * (wiki: Roar/Eclipse stack multiplicatively with Serration).
   * +0.5 = ×1.5 on total IPS + elemental.
   */
  damageMultBonus?: number;
  critChanceBonus?: number;
  /**
   * Flat add to final critical chance after relative mods
   * (wiki: Wrathful Advance — e.g. +2.0 = +200% final CC).
   */
  critChanceFlatBonus?: number;
  critMultBonus?: number;
  /** Flat add to final crit multiplier after percent bonuses (+1.2 = +1.2×). */
  critMultFlatBonus?: number;
  statusBonus?: number;
  fireRateBonus?: number;
  /** Additive reload-speed bonus (+0.7 = +70%; reduces reload time). */
  reloadBonus?: number;
  multishotBonus?: number;
  elemental?: WeaponExternalBuffElemental[];
  /**
   * Extra hit as a fraction of modded total damage (Toxic Lash / Xata's Whisper).
   * Paper DPS multiplies by (1 + fraction × elementalDip); does not dilute weapon elements.
   */
  extraHitDamageFraction?: number;
  /** Toxic Lash: Extra Hit always procs Toxin (feeds DoT + faction triple-dip). */
  extraHitGuaranteedToxin?: boolean;
  /**
   * Forced status proc on every hit (Valence Formation). Independent of status chance /
   * damage weighting — stacks with normal weighted procs.
   */
  guaranteedStatusElement?: string;
  /**
   * Flat ability toxin cloud DPS (Contagion Cloud). Not weapon-modded; added to
   * burst/sustained after direct DPS when sim enemies > 0.
   */
  abilityCloudDps?: number;
  /**
   * Projectile speed bonus fraction (Jet Stream). Display-only — does not change DPS.
   */
  projectileSpeedBonus?: number;
  /**
   * Sprint / move speed bonus fraction (Jet Stream). Applied to warframe totals in loadout.
   */
  sprintSpeedBonus?: number;
  nominal?: string;
}

/** Extra weapon calculation options (Kuva/Tenet/Coda progenitor bonus, etc.). */
export interface WeaponCalculationOptions {
  /** Innate element key, e.g. heat, viral, corrosive */
  progenitorElement?: string;
  /** Bonus damage as percent of base weapon damage (typical 25–60%). */
  progenitorBonusPercent?: number;
  /** Loadout-wide buffs applied after weapon mods (abilities, shards, …). */
  externalBuffs?: WeaponExternalBuff[];
  /** When true, Incarnon Form radials contribute to DPS (form attack active). */
  incarnonFormActive?: boolean;
  /**
   * Host Warframe Ability Strength (1 = 100%). Scales most exalted weapon base
   * damage before mods. Garuda Talons (Passive) ignore this. Lizzie uses an
   * additive 1.25×STR−1 pool instead of a flat base multiply.
   */
  abilityStrength?: number;
}

export interface ElementalDamage {
  type: string; // 'heat' | 'cold' | 'toxin' | 'electricity' | 'blast' | 'corrosive' | 'gas' | 'magnetic' | 'radiation' | 'viral'
  value: number;
}

export interface StatusProc {
  type: string;
  chance: number; // weighted chance for this element
  damagePerTick: number;
  duration: number;
  ticks: number;
  totalDamage: number;
  description: string;
}

export interface SimulationParams {
  comboCount: number;         // melee combo hit count (default 0)
  killStacks: number;         // Galvanized / Berserker on-kill stacks (0-5)
  statusTypesOnTarget: number; // Condition Overload / Galvanized Aptitude (0-5)
  arcaneStacks: number;       // e.g. Merciless (0–12), other arcanes vary
  extraGladiatorMods: number; // Gladiator mods on warframe (0-3, adds to weapon-side count)
  /** When no SetBonusLinkage: Vigilante mods on Warframe that apply to primary crit tier. */
  extraVigilanteModsFromWarframe?: number;
  /** When no SetBonusLinkage: Synth set pieces equipped outside this weapon (0–3). */
  extraSynthSetPiecesOffWeapon?: number;
  /** When no SetBonusLinkage: Tek set pieces outside this weapon (0–3). Data may cap at 3 until Tek Enhance exists. */
  extraTekSetPiecesOffWeapon?: number;
  /** If Tek 4-set is complete and this is enabled, apply +60% damage vs marked enemies to primary DPS. */
  applyTekSetVsMarkedDamage?: boolean;
  /**
   * If Hunter set pieces are equipped and this is enabled, apply +25%/piece companion
   * weapon damage vs Slash-status targets (beast claws / sentinel weapons only).
   */
  applyHunterSetVsSlashDamage?: boolean;
  /**
   * If Mecha Empowered is equipped and ≥1 Mecha set piece marks a target, apply
   * +150% squad damage vs that marked enemy (optional DPS toggle).
   */
  applyMechaEmpoweredVsMarkedDamage?: boolean;
  /** Warframe ability names treated as active weapon damage buffs (e.g. "Roar", "Eclipse"). */
  activeWeaponAbilityBuffs?: string[];
  /**
   * Vex Armor Fury progress 0–1 (default 1 = max stacks). Multiplies the +275% Fury bonus.
   */
  vexArmorFuryFraction?: number;
  /**
   * Onos Incarnon Form attack: held Radiation beam (default) or full-charge Heat blast.
   */
  onosIncarnonMode?: "held" | "charge";
  /**
   * Arbucep attack cycle (1–6). Default / unset = 1st Attack (Blast).
   * Wiki: Blast → Corrosive → Gas → Magnetic → Radiation → Viral.
   */
  arbucepAttackMode?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Toxic Lash + Spores synergy: Spore-afflicted target takes TWO Extra Hits
   * (wiki), but still only one Toxin status stack.
   */
  toxicLashSporesOnTarget?: boolean;
  /**
   * Contagion Cloud (Toxic Lash augment): number of enemies assumed standing in
   * active clouds. 0 = off (default). Contribution is ability toxin DPS × STR
   * (×2 melee) × enemies — not folded into single-target TTK.
   */
  contagionCloudEnemies?: number;
  /**
   * Thrall Pact (Enthrall augment): active thrall count (0–7). 0 = off.
   * Primary damage bonus = catalog% × Strength × thralls.
   */
  thrallCount?: number;
  /**
   * Thermal Transfer (Thermal Sunder augment): active polarity.
   * cold = tap, heat = hold, blast = both (sum as parallel Blast).
   * Requires "Thermal Sunder" in activeWeaponAbilityBuffs + augment equipped.
   */
  thermalTransferPolarity?: "cold" | "heat" | "blast";
  /**
   * Razorwing Blitz: ability-cast stacks while Razorwing is active (0–4). 0 = off.
   * Fire/attack speed = 25% × stacks × Strength (Dex Pixia / Diwata only).
   */
  razorwingBlitzStacks?: number;
  /**
   * Critical Surge: meters teleported to a Reservoir (0 = off).
   * Primary CC = min(250%, per-meter% × meters × Strength); in-game min teleport 10m.
   */
  criticalSurgeTeleportMeters?: number;
  /**
   * Furious Javelin: enemies hit by Radial Javelin (0 = off).
   * Melee damage mult = per-enemy% × Strength × enemies (Eclipse-style; includes exalted).
   */
  furiousJavelinEnemies?: number;
  /**
   * Valence Formation: imbued element applied as parallel weapon elemental + guaranteed status.
   * Requires "Valence Formation" in activeWeaponAbilityBuffs + augment equipped.
   * Not × Strength (wiki rank table 50–200%).
   */
  valenceFormationElement?:
    | "heat"
    | "cold"
    | "electricity"
    | "toxin"
    | "blast"
    | "gas"
    | "magnetic"
    | "radiation"
    | "viral"
    | "corrosive";
  /**
   * Critical Precision (Tiberon): headshot stacks (0–50). Undefined = max when trigger on.
   * Miss with full burst removes ~10 stacks (100% CC of the bonus track).
   */
  criticalPrecisionStacks?: number;
  /**
   * Critical Mutation (Catabolyst): kill stacks (0–10). Undefined = max when trigger on.
   * Grenade hitting fewer than 3 enemies removes 1 stack (30% at R5).
   */
  criticalMutationStacks?: number;
  /**
   * Mecha Set: enemies hit by status-spread on mark-kill (0 = off). Amortizes
   * transferred DoT DPS over mark cooldown; needs ≥1 Mecha piece via linkage.
   */
  mechaSpreadEnemies?: number;
  /**
   * Mecha Set: extra enemies from a second mark-kill cascade within the same
   * amortized cooldown window (0 = off). Same tick math as first-hop spread;
   * user-estimated — not mission AI.
   */
  mechaCascadeEnemies?: number;
  /**
   * Thalys Incarnon: number of enemies with embedded shards (0 = off).
   * Papers form embed triggers + Chain Shatter heavy detonations.
   */
  shardHosts?: number;
  /**
   * Thalys Explosive Growth: how many of those hosts are fully grown and erupt
   * at ×shardFullyGrownDamageMult on embed trigger (0 = off; clamped to hosts−1).
   */
  shardFullyGrownHosts?: number;
  /**
   * Innodem Swooping Lunge stacks (0–3). When unset and perk is equipped, paper
   * assumes max (3).
   */
  airborneKillStacks?: number;
  /**
   * Destreza form: Heavy Attack kills granting +10% Puncture (0–30). 0 = off.
   */
  heavyKillStacks?: number;
  /**
   * Nyx Absorb: damage absorbed before release (0 = off). Drives post-blast
   * additive weapon damage buff √(0.025% × STR × absorbed), capped at 400%.
   */
  absorbAbsorbedDamage?: number;
  /** Tenacious Bond: +1.2× crit damage when companion crit > 50%. Default on in loadout calcs. */
  applyTenaciousBondCrit?: boolean;
  /** Reinforced Bond: +60% fire rate when companion shields exceed threshold. Default on in loadout calcs. */
  applyReinforcedBondFireRate?: boolean;
  /**
   * Target faction for Bane/Expel/Smite damage (e.g. "Grineer", "Corpus").
   * Empty/undefined = paper DPS without faction mult.
   */
  targetFaction?: string;
  /** Apply headshot / weak-point multiplier (default body shots). */
  applyHeadshots?: boolean;
  /** Include approximate stance damage multiplier on melee DPS. Default true. */
  applyStanceMultiplier?: boolean;
  /**
   * Stance combo string direction (C6). Default / unset = Neutral (B1 lock).
   * Forward / Forward Block / Block / Heavy / Slide use wiki hit-avg scalars.
   */
  stanceComboDirection?: "neutral" | "forward" | "forwardBlock" | "block" | "heavy" | "slide";
  /**
   * Stance DPS model (C6b). Default / unset = hit-avg (B1/C6).
   * `cycle` = wiki Avg Dmg Multi/s (ΣDmg%/Duration) × Attack Speed.
   */
  stanceDpsModel?: "hitAvg" | "cycle";
  /**
   * Treat aim/reload/cast/wall-latch trigger buffs as active
   * (Catalyzer Link, Spring-Loaded Chamber, Deadly Efficiency, …). Default false —
   * the in-game arsenal never includes them.
   */
  applyTriggerBuffs?: boolean;
  /**
   * Warframe armor used by Primary Bulwark (wiki: +% dmg per armor over 1000).
   * Undefined / 0 = no Bulwark bonus on paper DPS.
   */
  warframeArmor?: number;
}

export const DEFAULT_SIM_PARAMS: SimulationParams = {
  comboCount: 0,
  killStacks: 0,
  statusTypesOnTarget: 0,
  arcaneStacks: 0,
  extraGladiatorMods: 0,
  extraVigilanteModsFromWarframe: 0,
  extraSynthSetPiecesOffWeapon: 0,
  extraTekSetPiecesOffWeapon: 0,
  applyTekSetVsMarkedDamage: false,
  applyHunterSetVsSlashDamage: false,
  applyMechaEmpoweredVsMarkedDamage: false,
  targetFaction: undefined,
  applyHeadshots: false,
  applyStanceMultiplier: true,
  applyTriggerBuffs: false,
};

export interface CalculatedStats {
  totalDamage: number;
  impact: number;
  puncture: number;
  slash: number;
  // Elemental damage breakdown
  elements: ElementalDamage[];
  rawElements: { type: string; value: number }[]; // before combo resolution, for UI ordering
  // Core stats
  /** Arsenal-style modded fire rate (base × (1+FR%)). */
  fireRate: number;
  /**
   * True shots/sec for DPS after charge/bow/burst timing (wiki effective fire rate).
   * Falls back to fireRate when no special timing applies.
   */
  effectiveFireRate?: number;
  /** Sum of fire-rate mod bonuses as a fraction (for charge-time scaling). */
  fireRateBonus?: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  statusChancePerShot: number;
  magazine: number;
  reloadTime: number;
  /** Ammo consumed per shot (default 1). Used with ammoEfficiency for sustained DPS. */
  ammoCost?: number;
  /**
   * Chance not to consume ammo (0–1). Extends mag cycle in sustained DPS;
   * ≥0.99 treated as no reload.
   */
  ammoEfficiency?: number;
  multishot: number;
  /** Melee reach / falloff meters added by incarnon (and similar) — display only. */
  range?: number;
  /** Ammo reserve after incarnon set/add perks — display only (base ammo not always in weapon data). */
  ammoMax?: number;
  /** Punch Through meters from incarnon/rivens — display only (no DPS model). */
  punchThrough?: number;
  /** Projectile speed bonus fraction from incarnon/rivens — display only. */
  projectileSpeed?: number;
  /** Melee follow-through bonus fraction from incarnon — display only (no DPS model). */
  followThrough?: number;
  /** Accuracy bonus fraction from incarnon/rivens — display only (no DPS model). */
  accuracy?: number;
  /** Recoil change fraction from incarnon/rivens (negative = less recoil) — display only. */
  recoil?: number;
  /** Fraction of magazine reloaded per second while holstered (Incarnon) — display only. */
  holsterReloadPerSec?: number;
  /** Chance to instantly reload on kill (Incarnon) — display only. */
  instantReloadOnKillChance?: number;
  /** Chance to instantly reload on headshot / headshot-kill (Incarnon) — display only. */
  instantReloadOnHeadshotChance?: number;
  /** Zoom change fraction from incarnon/rivens (negative = less zoom) — display only. */
  zoom?: number;
  /** Movement speed fraction (not sprint) from incarnon — display only. */
  movementSpeedBonus?: number;
  /** Slam attack radius bonus fraction from incarnon — display only. */
  slamRadius?: number;
  /** Finisher damage bonus fraction from incarnon/rivens — display only. */
  finisherDamage?: number;
  /** Combo timer pauses while holstered (Standoff / Abiding Hold) — display only. */
  comboTimerPauseWhenHolstered?: boolean;
  /** Chance to restore ammo on perk trigger (kill / PT hit / Electric status) — display only. */
  ammoRestoreChance?: number;
  /** Flat rounds restored when ammoRestoreChance procs — display only. */
  ammoRestoreFlat?: number;
  /** Magazine fraction restored when ammoRestoreChance procs — display only. */
  ammoRestoreMagFraction?: number;
  /** Extra Incarnon charge from headshots (e.g. +50% → 0.5) — display only. */
  incarnonHeadshotChargeBonus?: number;
  /** Weapon is silent (enemies won't hear gunfire) — display only. */
  silentWeapon?: boolean;
  /** Melee combo granted when collecting ammo — display only. */
  comboOnAmmoPickup?: number;
  /** Extra mid-air jumps (Ternary Vault) — display only. */
  extraJumps?: number;
  /** Double-jump / jump strength bonus fraction — display only. */
  jumpStrength?: number;
  /** Heal regen per second from perk trigger — display only. */
  healRegenPerSec?: number;
  /** Status-chance vulnerability on marked/impaled targets (fraction) — display / paper SC. */
  statusChanceVulnerability?: number;
  /** Puncture status stacks applied while impaled — display only. */
  punctureStatusOnImpale?: number;
  /** Combo count chance bonus on finishers (fraction) — display only. */
  finisherComboCountChance?: number;
  /** Flat combo granted on finisher — display only. */
  comboOnFinisher?: number;
  /** Combo on Slash-status targets (Seeing Red) — display only. */
  comboOnSlashStatus?: number;
  /** Combo on Toxin-status targets (Alchemist's Wrath) — display only. */
  comboOnToxinStatus?: number;
  /** Combo on Cold-status targets (Master's Shatter) — display only. */
  comboOnColdStatus?: number;
  /** Combo on undamaged enemies (Wartime Nerve) — display only. */
  comboOnUndamaged?: number;
  /** Combo granted per slam-radius enemy hit — display only. */
  comboPerSlamHit?: number;
  /** Combo granted per slide-attack enemy hit — display only. */
  comboPerSlideHit?: number;
  /** Combo granted per N meters of continuous slide — display only. */
  comboPerSlideMeters?: number;
  /** Slide distance (m) required for comboPerSlideMeters — display only. */
  comboSlideMeterInterval?: number;
  /** Combo granted on shard damage tick — display only. */
  comboOnShardDamage?: number;
  /** Stun radius on finisher (m) — display only. */
  stunRadiusOnFinisher?: number;
  /** Knockdown radius on ground finisher (m) — display only. */
  knockdownRadiusOnFinisher?: number;
  /** Embedded shard duration (s) — display only. */
  shardDuration?: number;
  /** Extra crit chance while attacking shard weak spots — display only. */
  shardWeakSpotCritBonus?: number;
  /** Shard damage multiplier delta (e.g. −0.5) — display only. */
  shardDamageMult?: number;
  /** Fully grown shard erupt damage mult — display only. */
  shardFullyGrownDamageMult?: number;
  /** Lingering damage-field duration multiplier (Renewed Horror) — display only. */
  lingeringFieldDurationMult?: number;
  // DPS
  burstDps: number;
  sustainedDps: number;
  // Status procs
  statusProcs: StatusProc[];
  // Heavy attack / combo (melee)
  heavyAttackDamage: number;
  heavyAttackWindUp: number;
  comboCount: number;
  comboDuration: number;
  heavyAttackEfficiency: number; // from mods like Killing Blow
  /**
   * Combo multiplier for Blood Rush / Weeping Wounds / Gladiator and heavy attacks
   * (1× below first tier, then 2×…12× on standard weapons).
   */
  comboMultiplier: number;
  /** Heavy Attack combo damage tier — same track as comboMultiplier (2×–12×+). */
  heavyAttackComboMultiplier: number;
  /**
   * Serration-style modded base damage only (unmodded base × damage mults).
   * Used for DoT ticks and damage quantization scale; excludes elemental/IPS type bonuses.
   */
  moddedBaseDamage?: number;
  /**
   * Unquantized per-shot damage matching the in-game arsenal display
   * (total excludes multishot; the arsenal multiplies total × multishot).
   */
  arsenalDamage?: {
    totalDamage: number;
    impact: number;
    puncture: number;
    slash: number;
    elements: ElementalDamage[];
  };
  // Conditional mod tracking
  conditionOverloadBonus: number; // per unique status
  bloodRushStacks: number; // crit from combo
  weavingFrameBonus: number;
  // Simulation state (for UI display)
  simParams: SimulationParams;
  galvanizedMultishotOnKill: number; // per-stack bonus from Galvanized Chamber/Hell/Diffusion
  galvanizedDamagePerStatus: number; // per-status bonus from Galvanized Aptitude/Savvy/Shot
  /** In-game stack cap for the equipped galvanized multishot mod (Chamber 5, Hell/Diffusion 4). */
  galvanizedMultishotStackCap?: number;
  /** In-game stack cap for the equipped galvanized condition mod (Aptitude/Savvy 2, Shot 3). */
  galvanizedDamagePerStatusStackCap?: number;
  /** Galvanized Scope/Crosshairs: crit chance while aiming after a headshot (sim-gated). */
  galvanizedCritOnHeadshot?: number;
  /** Galvanized Scope/Crosshairs: extra crit chance per headshot-kill stack. */
  galvanizedCritOnHeadshotPerStack?: number;
  /** Non-stacking on-kill buffs (Bladed Rounds, Gorgon Frenzy, …), statKey → bonus. */
  onKillStatBonuses?: Record<string, number>;
  /** Aim/reload/cast trigger buffs (sim-gated), statKey → bonus. */
  triggerStatBonuses?: Record<string, number>;
  /** Chance to force a Slash proc on critical hits (Hunter Munitions). */
  slashOnCritChance?: number;
  /** Chance for Impact procs to add a Slash proc (Internal Bleeding / Hemorrhage). */
  slashOnImpactProcChance?: number;
  /** Bonus damage on first shot of each magazine (Charged/Primed Chamber), averaged into DPS. */
  firstShotDamageBonus?: number;
  berserkerFuryBonus: number; // per-stack attack speed bonus
  weepingWoundsBonus: number; // status chance bonus per combo tier
  vigilanteCritBonus?: number; // Vigilante set: chance to enhance crit tier (0.05 per mod)
  /** Incarnon Devouring/Devastating Attrition: avg bonus damage multiplier on non-crit hits (0.5 × +2000% = 10). */
  devouringAttritionBonus?: number;
  /** Latron Flensing Spikes: fraction of original armor removed per Puncture status stack. */
  punctureArmorStripPerStack?: number;
  /** Synth 4-set: +0.15 reload speed bonus applied to secondaries when complete. */
  synthSetReloadBonusApplied?: number;
  /** Tek 4-set: damage multiplier vs marked when sim + set complete (primary only). */
  tekSetVsMarkedDamageMultiplier?: number;
  /** Hunter set: companion weapon damage multiplier vs Slash-status when sim toggle on. */
  hunterSetVsSlashDamageMultiplier?: number;
  /** Mecha Empowered: damage multiplier vs marked when sim toggle on (+150% → 2.5). */
  mechaEmpoweredVsMarkedDamageMultiplier?: number;
  /** Cross-slot set detection (optional). */
  setBonusSummary?: SetBonusSummaryLine[];
  /** Mod-scaled radial / AoE attacks when the weapon has them. */
  radialAttacks?: WeaponRadialAttack[];
  /** Sum of inferred radial burst DPS (excludes manual melee slams). */
  radialBurstDps?: number;
  /** Radial burst DPS adjusted for reload/magazine cycle. */
  radialSustainedDps?: number;
  /**
   * Contagion Cloud ability toxin DPS contribution (sim-gated enemies × STR).
   * Included in burstDps/sustainedDps totals when > 0; excluded from TTK.
   */
  contagionCloudDps?: number;
  /**
   * Mecha mark-kill status-spread DoT DPS (sim enemies × transferred ticks / CD).
   * Included in burst/sustained; excluded from TTK.
   */
  mechaSpreadDps?: number;
  /**
   * Thalys shard embed-trigger + Chain Shatter detonation DPS (sim shardHosts).
   * Included in burst/sustained; excluded from TTK.
   */
  shardChainDps?: number;
  /**
   * Residual Boils/Shock/Malodor/Viremia kitgun zone DPS (paper: stacks>0 = zone up).
   * Included in burstDps/sustainedDps; flat unmodded zone damage.
   */
  residualZoneDps?: number;
  /** Accumulated arcane stat values for display / future modeling. */
  arcaneBonuses?: Record<string, number>;
  /** Unverified or panel-only mod stat values keyed as `modId::statKey`. */
  modBonuses?: Record<string, number>;
  /**
   * Slide speed fraction from weapon mods that buff Warframe movement.
   */
  slideSpeedBonus?: number;
  /**
   * Sprint speed fraction from weapon mods that buff Warframe movement
   * (e.g. Amalgam Serration +55% at max → 0.55).
   */
  sprintSpeedBonus?: number;
  /** Parkour velocity fraction from incarnon / weapon movement perks — display only. */
  parkourVelocityBonus?: number;
  /** Elementalist-style status effect damage bonus (fraction). */
  statusDamageBonus?: number;
  /** Acuity / headshot damage bonus (fraction on top of base head multi). */
  headshotDamageBonus?: number;
  /** Status duration bonus (fraction) — extends DoT proc duration/ticks. */
  statusDurationBonus?: number;
  /** Acuity equipped: multishot cannot be modified by any source. */
  multishotLocked?: boolean;
  /** Cannonade equipped: fire rate cannot be modified by any source. */
  fireRateLocked?: boolean;
  /** Normalized faction id → Bane-style damage bonus fraction. */
  factionBonuses?: Record<string, number>;
  /** Average stance damage mult applied to melee light DPS (1 = no stance). */
  stanceDamageMultiplier?: number;
  /**
   * Sum of Extra Hit fractions from abilities (Toxic Lash / Xata).
   * Burst/sustained DPS multiply by (1 + this × factionHit) for Extra Hit's second faction dip.
   */
  extraHitDamageFraction?: number;
  /** Toxic Lash Extra Hit: guaranteed Toxin proc / DoT path. */
  extraHitGuaranteedToxin?: boolean;
  /** Forced status element on every hit (Valence Formation). */
  guaranteedStatusElement?: string;
  /**
   * How many Extra Hit damage instances per weapon hit (1, or 2 with Spores synergy).
   * Does not multiply the guaranteed Toxin DoT stack count.
   */
  extraHitInstances?: number;
  /**
   * Sum of toxin mod bonuses as fraction of base (even when combined into Viral/etc.).
   * Used for Toxic Lash Toxin tick type mult.
   */
  toxinModBonusFraction?: number;
  /** Flat initial combo from Incarnon Adept Reflexes etc. */
  incarnonInitialCombo?: number;
  /** Crit/status before Blood Rush / Weeping; used when combo count changes after arcanes. */
  preComboCriticalChance?: number;
  preComboStatusChance?: number;
  /** Inputs for recomputing combo scaling after arcanes adjust combo count. */
  meleeComboModContext?: import("@/lib/calc/melee-combo").MeleeComboModContext;
}

export interface WarframeCalculatedStats {
  baseHealth: number;
  baseShield: number;
  baseArmor: number;
  /** Unmodded max energy at rank 30 — Flow / +% energy mods multiply this (wiki Energymax). */
  baseEnergy: number;
  baseSprint: number;
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  energyBonus: number;
  sprintSpeedBonus: number;
  /** Additive slide speed fraction (Maglev, Cunning Drift, etc.). */
  slideSpeedBonus: number;
  flowBonus: number;
  // Flat additions from Archon Shards (Azure, Topaz)
  flatHealthBonus: number;
  flatShieldBonus: number;
  flatArmorBonus: number;
  flatEnergyBonus: number;
  abilityStrength: number;
  abilityDuration: number;
  abilityEfficiency: number;
  abilityRange: number;
  totalHealth: number;
  totalShield: number;
  totalArmor: number;
  totalEnergy: number;
  totalSprint: number;
  effectiveHealth: number;
  damageReduction: number;
  // Shard-specific display stats
  castingSpeedBonus: number;
  parkourVelocityBonus: number;
  healthRegenPerSec: number;
  /** Additive shield recharge rate fraction (e.g. Arcane Aegis +30% → 0.30). */
  shieldRechargeBonus?: number;
  elementalResistance: number;
  primaryShardBonus: number;
  secondaryShardBonus: number;
  meleeCritDamageBonus: number;
  healingBonus: number;
  statusDurationBonus: number;
  energyCostReduction: number;
  /** Active cross-slot set bonuses (needs linked weapon/companion mods where relevant). */
  setBonusSummary?: SetBonusSummaryLine[];
  /** Augur 6-set: percent of energy spent converted to shields (display / future EHP modeling). */
  augurEnergyToShieldsPercent?: number;
  /** Hunter set: companion damage bonus vs Slash-status enemies (+150% → 150 here). */
  hunterCompanionVsStatusDamagePercent?: number;
  /** Mecha set piece count (for mark timing panel). */
  mechaSetPieces?: number;
  /**
   * When Adaptation is equipped: typed DR stacks (see computeAdaptationSurvivability in UI).
   */
  adaptationNoteMaxTypedDRPercent?: number;
  /** Arcane Persistence: shields stripped while equipped. */
  shieldsNullifiedByPersistence?: boolean;
  /** Arcane Persistence damage/s cap at current arcane rank (inactive below 700 armor). */
  persistenceDamageCapPerSecond?: number;
  /** True when Persistence is equipped and armor ≥ 700. */
  persistenceActive?: boolean;
  /** Accumulated arcane stat values for display / future modeling. */
  arcaneBonuses?: Record<string, number>;
  /** Unverified or panel-only mod stat values keyed as `modId::statKey`. */
  modBonuses?: Record<string, number>;
}

export interface Companion {
  id: string;
  name: string;
  type: string; // 'sentinel' | 'kubrow' | 'kavat' | 'moa' | 'predasite' | 'vulpaphyla' | 'hound'
  health: number;
  shield: number;
  armor: number;
  description: string;
  precept: string;
}

export interface CompanionCalculatedStats {
  baseHealth: number;
  baseShield: number;
  baseArmor: number;
  totalHealth: number;
  totalShield: number;
  totalArmor: number;
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  meleeDamageBonus: number;
  attackSpeedBonus: number;
  critChanceBonus: number;
  critDamageBonus: number;
  effectiveHealth: number;
  damageReduction: number;
  /** Armor-based DR plus conditional mod bonuses (e.g. Loyal Companion). */
  armorDamageReduction: number;
  weakspotDamageBonus: number;
  finisherDamageBonus: number;
  pickupDoubleChance: number;
  creditPickupDoubleChance: number;
  resourcePickupDoubleChance: number;
  impactStatusStacks: number;
  reviveShieldHealth: number;
  incapacitationTimerReduction: number;
  shieldRechargeBonus: number;
  healthRegenBonus: number;
  modBonuses?: Record<string, number>;
}

export interface ArchwingCalculatedStats {
  baseHealth: number;
  baseShield: number;
  baseArmor: number;
  baseEnergy: number;
  baseFlightSpeed: number;
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  energyBonus: number;
  flightSpeedBonus: number;
  abilityStrength: number;
  abilityDuration: number;
  abilityEfficiency: number;
  abilityRange: number;
  totalHealth: number;
  totalShield: number;
  totalArmor: number;
  totalEnergy: number;
  totalFlightSpeed: number;
  effectiveHealth: number;
  damageReduction: number;
  /** Kinetic Diversion: % of health damage converted to energy (max 40). */
  kineticDiversionPercent: number;
  modBonuses?: Record<string, number>;
}

export interface RailjackArmamentComputed {
  id: string;
  name: string;
  type: "turret" | "ordnance";
  damage: number;
  critChance: number;
  critMultiplier: number;
  statusChance: number;
  fireRate: number;
  estimatedDps: number;
}

export interface RailjackCalculatedStats {
  baseHull: number;
  baseArmor: number;
  baseShield: number;
  baseSpeed: number;
  baseBoostSpeed: number;
  baseBoostCost: number;
  baseFluxCapacity: number;
  baseAvionicsCapacity: number;
  baseShieldRecharge: number;
  hull: number;
  armor: number;
  shield: number;
  /** % of max shields recharged per second. */
  shieldRecharge: number;
  /** Seconds removed from shield recharge delay (wiki mid). */
  shieldRechargeDelayReduction?: number;
  speed: number;
  boostSpeed: number;
  /** Equipped boost multiplier used to derive boostSpeed. */
  boostMultiplier?: number;
  boostCost: number;
  fluxCapacity: number;
  avionicsCapacity: number;
  turretDamageBonus: number;
  turretCritBonus: number;
  turretCritDmgBonus: number;
  ordnanceDamageBonus: number;
  artilleryDamageBonus: number;
  turretRangeBonus: number;
  turretProjectileSpeedBonus: number;
  ordnanceSpeedBonus: number;
  munitionsCapacityBonus: number;
  turrets: RailjackArmamentComputed[];
  ordnance: RailjackArmamentComputed | null;
  /** Tunguska / Forward Artillery paper (always equipped). */
  artillery?: {
    id: string;
    name: string;
    damage: number;
    critChance: number;
    critMultiplier: number;
    statusChance: number;
    chargeTime: number;
    /** Average damage per charged shot (includes crit expectation). */
    avgShotDamage: number;
    /** Avg shot damage ÷ charge time (Dome Charge economy not modeled). */
    estimatedDps: number;
  };
  modBonuses?: Record<string, number>;
  /** Reactor battle-mod scaling from equipped reactor. */
  abilityStrengthBonus?: number;
  abilityRangeBonus?: number;
  abilityDurationBonus?: number;
  /** Passive bonuses from elite crew competency. */
  crewBonuses?: {
    turretDamageBonus: number;
    speedBonus: number;
    hullBonus: number;
    repairSpeedBonus: number;
  };
  /** Equipped battle/tactical abilities with scaled costs/cooldowns. */
  battleAbilities?: RailjackAbilityComputed[];
  tacticalAbilities?: RailjackAbilityComputed[];
  /** Extra turret damage from simulated active battle/tactical abilities. */
  abilityTurretDamageBonus?: number;
  /** House unique traits currently applied to paper stats. */
  activeHouseTraits?: { id: string; text: string }[];
  /** Selected wreckage trait rolls (one per house component), including display-only. */
  selectedHouseTraits?: { id: string; text: string }[];
  /** Normalized Intrinsics ranks (0–10). */
  intrinsics?: {
    tactical: number;
    piloting: number;
    gunnery: number;
    engineering: number;
    command: number;
  };
  /** Paper / unlock effects derived from Intrinsics. */
  intrinsicEffects?: {
    dorsalVentralTurretDamageBonus: number;
    battleEnergyCostMult: number;
    tacticalCooldownReduction: number;
    domeChargeForge: boolean;
    ordnanceForge: boolean;
    eliteCrewUnlocked: boolean;
    panelNotes: string[];
  };
}

export interface RailjackAbilityComputed {
  modId: string;
  name: string;
  category: "defensive" | "offensive" | "super";
  description: string;
  rank: number;
  energyCost?: number;
  cooldownSec?: number;
  turretDamageWhileActive?: number;
  isSimulatedActive?: boolean;
}

export interface Loadout {
  id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  /** Cloud build id when saved to account (for share links and sync). */
  cloudId?: string;
  createdAt: number;
  updatedAt: number;
  /** Matches warframe builder / saved build payload so mods, arcanes, helminth, etc. round-trip. */
  warframeBuild?: {
    warframeId: string;
    mods: ModSlot[];
    shards: (EquippedArchonShard | null)[];
    arcaneIds?: (string | null)[];
    arcaneRanks?: number[];
    hasOrokinReactor: boolean;
    isMR30?: boolean;
    slotPolarities?: Record<number, string>;
    helminthSlot?: number | null;
    helminthAbilityId?: string | null;
    exaltedMods?: ModSlot[];
    exaltedSlotPolarities?: Record<number, string>;
    exaltedArcaneIds?: (string | null)[];
    exaltedMeleeMods?: ModSlot[];
    exaltedMeleeSlotPolarities?: Record<number, string>;
    exaltedMeleeArcaneIds?: (string | null)[];
    /** Non-default form mod configs for dual-form warframes (e.g. Orion on Sirius & Orion). */
    dualFormBuilds?: Record<string, { mods: ModSlot[]; slotPolarities?: Record<number, string> }>;
  };
  primaryBuild?: {
    weaponId: string;
    mods: ModSlot[];
    stanceModId?: string;
    arcaneIds?: (string | null)[];
    hasOrokinCatalyst: boolean;
    isMR30?: boolean;
    slotPolarities?: Record<number, string>;
    /** Kuva/Tenet/Coda — same as saved weapon build. */
    progenitorElement?: string;
    progenitorBonusPercent?: number;
    incarnonEvolutions?: Record<number, number>;
  };
  secondaryBuild?: {
    weaponId: string;
    mods: ModSlot[];
    stanceModId?: string;
    arcaneIds?: (string | null)[];
    hasOrokinCatalyst: boolean;
    isMR30?: boolean;
    slotPolarities?: Record<number, string>;
    progenitorElement?: string;
    progenitorBonusPercent?: number;
    incarnonEvolutions?: Record<number, number>;
  };
  meleeBuild?: {
    weaponId: string;
    mods: ModSlot[];
    stanceModId?: string;
    arcaneIds?: (string | null)[];
    hasOrokinCatalyst: boolean;
    isMR30?: boolean;
    slotPolarities?: Record<number, string>;
    progenitorElement?: string;
    progenitorBonusPercent?: number;
    incarnonEvolutions?: Record<number, number>;
  };
  companionBuild?: {
    companionId: string;
    /** Custom pet name from the arsenal payload (not the breed catalog name). */
    customName?: string;
    mods: ModSlot[];
    weaponId?: string;
    weaponMods: ModSlot[];
    weaponSlotPolarities?: Record<number, string>;
    arcaneIds?: (string | null)[];
    hasReactor: boolean;
    hasCatalyst: boolean;
    isMR30?: boolean;
    slotPolarities?: Record<number, string>;
  };
  /** Modular preset occupying one weapon slot (mutually exclusive with that slot's normal weapon build). */
  modularBuild?: ModularBuildData & {
    slot: "primary" | "secondary" | "melee";
  };
  archwingBuild?: {
    archwingId?: string;
    necramechId?: string;
    mode: string; // 'archwing' | 'necramech'
    frameMods: ModSlot[];
    weaponId?: string;
    weaponMods: ModSlot[];
    hasReactor: boolean;
    hasCatalyst: boolean;
  };
}

export interface RivenStatDef {
  key: string;       // calculator key (e.g. "damage", "criticalChance")
  label: string;     // display name
  isPercent: boolean; // whether value is entered as %
}

// Stats available per weapon category for rivens
const RIVEN_RANGED_COMMON: RivenStatDef[] = [
  { key: "damage", label: "Damage", isPercent: true },
  { key: "criticalChance", label: "Critical Chance", isPercent: true },
  { key: "criticalMultiplier", label: "Critical Damage", isPercent: true },
  { key: "statusChance", label: "Status Chance", isPercent: true },
  { key: "multishot", label: "Multishot", isPercent: true },
  { key: "fireRate", label: "Fire Rate", isPercent: true },
  { key: "magazine", label: "Magazine Capacity", isPercent: true },
  { key: "reloadSpeed", label: "Reload Speed", isPercent: true },
  { key: "toxin", label: "Toxin Damage", isPercent: true },
  { key: "cold", label: "Cold Damage", isPercent: true },
  { key: "heat", label: "Heat Damage", isPercent: true },
  { key: "electricity", label: "Electricity Damage", isPercent: true },
  { key: "impact", label: "Impact", isPercent: true },
  { key: "puncture", label: "Puncture", isPercent: true },
  { key: "slash", label: "Slash", isPercent: true },
  { key: "projectileSpeed", label: "Projectile Speed", isPercent: true },
];

const RIVEN_RIFLE: RivenStatDef[] = [
  ...RIVEN_RANGED_COMMON,
  { key: "zoom", label: "Zoom", isPercent: true },
  { key: "punchThrough", label: "Punch Through", isPercent: false },
  { key: "ammoMax", label: "Ammo Maximum", isPercent: true },
  { key: "recoil", label: "Recoil", isPercent: true },
];

const RIVEN_SHOTGUN: RivenStatDef[] = [
  ...RIVEN_RANGED_COMMON,
  { key: "ammoMax", label: "Ammo Maximum", isPercent: true },
];

const RIVEN_PISTOL: RivenStatDef[] = [
  ...RIVEN_RANGED_COMMON,
  { key: "zoom", label: "Zoom", isPercent: true },
  { key: "ammoMax", label: "Ammo Maximum", isPercent: true },
  { key: "recoil", label: "Recoil", isPercent: true },
];

const RIVEN_MELEE: RivenStatDef[] = [
  { key: "damage", label: "Damage", isPercent: true },
  { key: "criticalChance", label: "Critical Chance", isPercent: true },
  { key: "criticalMultiplier", label: "Critical Damage", isPercent: true },
  { key: "statusChance", label: "Status Chance", isPercent: true },
  { key: "fireRate", label: "Attack Speed", isPercent: true },
  { key: "range", label: "Range", isPercent: true },
  { key: "toxin", label: "Toxin Damage", isPercent: true },
  { key: "cold", label: "Cold Damage", isPercent: true },
  { key: "heat", label: "Heat Damage", isPercent: true },
  { key: "electricity", label: "Electricity Damage", isPercent: true },
  { key: "impact", label: "Impact", isPercent: true },
  { key: "puncture", label: "Puncture", isPercent: true },
  { key: "slash", label: "Slash", isPercent: true },
  { key: "slideAttack", label: "Slide Attack", isPercent: true },
  { key: "finisherDamage", label: "Finisher Damage", isPercent: true },
  { key: "comboDuration", label: "Combo Duration", isPercent: false },
];

const RIVEN_ARCHGUN: RivenStatDef[] = [
  ...RIVEN_RANGED_COMMON.filter(s => s.key !== "impact" && s.key !== "puncture" && s.key !== "slash"),
  { key: "ammoMax", label: "Ammo Maximum", isPercent: true },
];

// Get riven stats filtered by weapon category
export function getRivenStatsForCategory(weaponCategory: string): RivenStatDef[] {
  const cat = weaponCategory.toLowerCase();
  if (cat === "melee" || cat === "zaw_strike" || cat === "archmelee") return RIVEN_MELEE;
  if (cat === "shotgun") return RIVEN_SHOTGUN;
  if (cat === "pistol" || cat === "secondary" || cat === "dual_pistols" || cat === "kitgun_chamber" || cat === "sentinel_weapon") return RIVEN_PISTOL;
  if (cat === "archgun") return RIVEN_ARCHGUN;
  // rifle, bow, launcher, primary, etc.
  return RIVEN_RIFLE;
}

// Legacy: flat list for backward compat
export const RIVEN_STATS = RIVEN_RIFLE;

export type WeaponCategory = 'rifle' | 'pistol' | 'shotgun' | 'bow' | 'melee' | 'secondary' | 'primary';
export type ModCategory = 'primary' | 'secondary' | 'melee' | 'warframe' | 'companion' | 'archwing';
export type ShardColor = 'crimson' | 'azure' | 'amber' | 'violet' | 'topaz' | 'emerald';
