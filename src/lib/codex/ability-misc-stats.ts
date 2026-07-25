import type { Ability } from "@/lib/types";
import {
  getVerifiedFieldScaling,
  getVerifiedMiscScaling,
  type AbilityScaleAttribute,
  type VerifiedStatScaling,
} from "@/lib/codex/ability-scaling-registry";

export interface AbilityScaleContext {
  strength: number;
  duration: number;
  range: number;
  /** Ability Efficiency multiplier (1 = 100%). Defaults to 1 when omitted. */
  efficiency?: number;
}

export interface AbilityDisplayContext {
  warframeId?: string;
  abilityName: string;
  helminth?: boolean;
}

export interface ScaledMiscStatLine {
  label: string;
  base: string;
  scaled: string;
  modified: boolean;
  positive?: boolean;
  /** When wiki-verified scaling applies, which stat drives it. */
  scaleAttr?: AbilityScaleAttribute;
}

const SKIP_KEYS = new Set(["drCap", "slowCap", "channeled", "maxDuration", "damageRedirectionCap"]);

const LABELS: Record<string, string> = {
  shieldStrip: "Shield Strip",
  armorStrip: "Armor Strip",
  armorStripPerSecond: "Armor Strip/s",
  shieldStripPerSecond: "Shield Strip/s",
  slowPerSecond: "Slow/s",
  coneAngle: "Cone Angle",
  tickInterval: "Tick Interval",
  shieldRegen: "Shield Regen",
  shieldRechargeDelayReduction: "Shield Recharge Delay Red.",
  affinityRange: "Affinity Range",
  wellsLimit: "Wells Limit",
  judgmentVulnerability: "Judgment Vulnerability",
  judgmentChance: "Judgment Chance",
  altFireExplosion: "Alt-Fire Explosion",
  altFireEnergy: "Alt-Fire Energy",
  maxHeatEnergyCost: "Energy Cost (Max Heat)",
  dashDistance: "Dash Distance",
  batteryChargeOnCast: "Battery Charge on Cast",
  batteryCharge: "Battery Charge",
  batteryDrain: "Battery Drain",
  batteryDrainPerSecond: "Battery Drain/s",
  energyRestorePerHit: "Energy Restore per Hit",
  emptyBatteryDrCap: "Empty-Battery DR Cap",
  areasPerElement: "Areas per Element",
  statusDurationMin: "Status Duration Min",
  statusDurationMax: "Status Duration Max",
  heatDamage: "Heat Damage",
  fireRateBuff: "Fire Rate Buff",
  attackSpeedBuff: "Attack Speed Buff",
  castSpeedBuff: "Cast Speed Buff",
  fieldDamagePerSecond: "Field Damage/s",
  fieldRadius: "Field Radius",
  maxSpheres: "Max Spheres",
  multiHitDamageMultiplier: "Multi-Hit Damage Mult.",
  contactDamagePerSecond: "Contact Damage/s",
  sphereLifetime: "Sphere Lifetime",
  implosionLifetime: "Implosion Lifetime",
  abilityCritChance: "Ability Crit Chance",
  durationCap: "Duration Cap",
  castingCooldown: "Casting Cooldown",
  dischargeDamage: "Discharge Damage",
  dischargeRange: "Discharge Range",
  moveSpeedMultiplier: "Move Speed Mult.",
  dischargeTargets: "Discharge Targets",
  simultaneousDischarges: "Simultaneous Discharges",
  dischargeCooldown: "Discharge Cooldown",
  shieldRestore: "Shield Restore",
  shieldsPerSecond: "Shields/s",
  shrapnelGrenades: "Shrapnel Grenades",
  shieldGrenades: "Shield Grenades",
  staggerChance: "Stagger Chance",
  shieldGateExtension: "Shield Gate Extension",
  shotsPerSecond: "Shots/s",
  firingArc: "Firing Arc",
  maxTurrets: "Max Turrets",
  damageBonusPerHit: "Damage Bonus per Hit",
  extraPickupChance: "Extra Pickup Chance",
  spawnInterval: "Spawn Interval",
  empoweredHealthRestore: "Empowered Health Orb",
  maxCaches: "Max Caches",
  damageConversion: "Damage Conversion",
  invulnerabilityDuration: "Invulnerability",
  rewindCountdown: "Rewind Countdown",
  lethalHealthRestore: "Lethal Health Restore",
  energyPerShot: "Energy per Shot",
  energyPerEnemy: "Energy per Enemy",
  altFireDamage: "Alt-Fire Damage",
  pageFragments: "Page Fragments",
  seekAngle: "Seek Angle",
  seekDistance: "Seek Distance",
  overguardGain: "Overguard Gain",
  overguardCap: "Overguard Cap",
  healthHealPercent: "Health Heal",
  slashStatuses: "Slash Statuses",
  overguardRegenPerSecond: "Overguard Regen/s",
  overguardRegenTimer: "Overguard Regen Timer",
  statusDetonationMultiplier: "Status Detonation Mult.",
  damageCopied: "Damage Copied",
  noctuaCopyLimit: "Noctua Copies per Ally",
  pageflightDamage: "Pageflight Damage",
  statusChanceVulnerability: "Status Chance Vulnerability",
  statusDamageIncrease: "Status Damage Increase",
  statusVulnerabilityDuration: "Status Vulnerability Duration",
  paragrimmLimit: "Paragrimm Limit",
  paragrimmAttackRange: "Paragrimm Attack Range",
  empoweredDuration: "Empowered Duration",
  pillarHeight: "Pillar Height",
  maxPillars: "Max Pillars",
  pulseInterval: "Pulse Interval",
  empoweredPulseInterval: "Empowered Pulse Interval",
  radiationDamagePerTick: "Radiation Damage/Tick",
  damageVulnerability: "Damage Vulnerability",
  wallsGap: "Walls Gap",
  assemblyTime: "Assembly Time",
  damageInterval: "Damage Interval",
  radiationTicks: "Radiation Ticks",
  initialStatusStacks: "Initial Status Stacks",
  maxStatusStacks: "Max Status Stacks",
  damageRadius: "Damage Radius",
  stackChancePerStatus: "Stack Chance per Status",
  stackChanceCap: "Stack Chance Cap",
  explosionDamage: "Explosion Damage",
  explosionDamagePerStatus: "Explosion Damage per Status",
  beamRadius: "Beam Radius",
  beamTicksPerSecond: "Beam Ticks/s",
  beamDuration: "Beam Duration",
  healthConversion: "Damage to Health",
  vialCharges: "Vial Charges",
  residueRadius: "Residue Radius",
  chargeSpeed: "Charge Speed",
  probeSpeed: "Probe Speed",
  probeDuration: "Probe Duration",
  cooldownReduction: "Cooldown Reduction",
  haltDelay: "Halt Delay",
  probeCount: "Probe Count",
  travelTime: "Travel Time",
  gelMistReach: "Gel Mist Reach",
  damagePerStatus: "Damage per Status",
  missDrain: "Miss Drain",
  daggerCount: "Daggers",
  daggerAirtime: "Dagger Airtime",
  maxDaggersPerEnemy: "Max Daggers per Enemy",
  damageRedirection: "Damage Redirection",
  maxStorms: "Max Storms",
  ticksPerSecond: "Ticks/s",
  arc: "Arc",
  minRadius: "Min Radius",
  maxRadius: "Max Radius",
  rangeGrowthPerSecond: "Range Growth/s",
  energyDrainPerEnemy: "Energy Drain per Enemy",
  energyDrainEnemyCap: "Energy Drain Enemy Cap",
  deathWellGain: "Death Well Gain",
  deathWellGainPerSecond: "Death Well Gain/s",
  deathWellThreshold: "Death Well Threshold",
  deathWellDrain: "Death Well Drain",
  radialDamagePercent: "Radial Damage",
  radialDamageRange: "Radial Damage Range",
  debuffDuration: "Debuff Duration",
  throwDamage: "Throw Damage",
  sickleCount: "Sickles",
  minSpinRadius: "Min Spin Radius",
  maxSpinRadius: "Max Spin Radius",
  phantomWrathStored: "Phantom Wrath Stored",
  doomCritDamageBonus: "Doom Crit Damage",
  kaitheCount: "Kaithes",
  summonRadius: "Summon Radius",
  chargeVelocity: "Charge Velocity",
  wrathDamagePerSecond: "Wrath-Raised Damage/s",
  energyRestorePercent: "Energy Restore",
  dashDuration: "Dash Duration",
  shieldRestorePerSecond: "Shield Restore/s",
  maxConculysts: "Max Conculysts",
  maxOrtholysts: "Max Ortholysts",
  maxSummulysts: "Max Summulysts",
  detonationDamage: "Detonation Damage",
  streamCount: "Streams",
  enemyExplosionRadius: "Enemy Explosion Radius",
  evasionAngle: "Evasion Angle",
  restraintErosion: "Restraint Erosion",
  waveDuration: "Wave Duration",
  finisherDamageVulnerability: "Finisher Damage Vulnerability",
  daggerCharges: "Dagger Charges",
  damageReductionPerDagger: "Damage Reduction per Dagger",
  restraintRestoreOnCast: "Restraint Restore on Cast",
  restraintRestorePerSecond: "Restraint Restore/s",
  shieldsPerEnemy: "Shields per Enemy",
  waveWidth: "Wave Width",
  waveRange: "Wave Range",
  meleeRange: "Melee Range",
  slideEnergyCost: "Slide Energy Cost",
  maxReservoirs: "Max Reservoirs",
  vitalityHealth: "Vitality Health",
  vitalityHealPerSecond: "Vitality Heal/s",
  hasteMoveSpeed: "Haste Move Speed",
  hasteAttackSpeed: "Haste Attack Speed",
  hasteFireRate: "Haste Fire Rate",
  shockDamage: "Shock Damage",
  shockRange: "Shock Range",
  shockTargets: "Shock Targets",
  shockCooldown: "Shock Cooldown",
  teleportInvulnerability: "Teleport Invulnerability",
  radiationStatusChance: "Radiation Status Chance",
  sparkSeekRange: "Spark Seek Range",
  sparkChanceOnHit: "Spark Chance on Hit",
  sparkCritMultiplier: "Spark Crit Multiplier",
  reservoirSurgeRangeBonus: "Reservoir Surge Range Bonus",
  boostedDamagePerSecond: "Boosted Damage/s",
  boostedEnergyDrain: "Boosted Energy Drain",
  damageRampCap: "Damage Ramp Cap",
  boostedMoveSpeedPenalty: "Boosted Move Speed Penalty",
  diveBombDamage: "Dive Bomb Damage",
  airSpeed: "Air Speed",
  airborneEnergyCost: "Airborne Energy Cost",
  travelDistance: "Travel Distance",
  damageGrowthPerEnemy: "Damage Growth per Enemy",
  pullForceDuration: "Pull Force Duration",
  tickDamage: "Tick Damage",
  tornadoCount: "Tornadoes",
  pullRadius: "Pull Radius",
  tornadoHeight: "Tornado Height",
  stunDuration: "Stun Duration",
  initialDamageBonus: "Initial Damage Bonus",
  damageConversionRate: "Damage Conversion Rate",
  damageConversionDuration: "Damage Conversion Duration",
  maxTargets: "Max Targets",
  boltCount: "Bolts",
  boltsOnKill: "Bolts on Kill",
  targetingRange: "Targeting Range",
  infestedSlow: "Infested Slow",
  armorSteal: "Armor Steal",
  shieldSteal: "Shield Steal",
  overguardSteal: "Overguard Steal",
  armorStealCap: "Armor Steal Cap",
  overguardStealCap: "Overguard Steal Cap",
  armorStealDuration: "Armor Steal Duration",
  radiationStacks: "Radiation Stacks",
  absorbDuration: "Absorb Duration",
  weaponDamageConvert: "Weapon Damage Convert",
  weaponDamageCap: "Weapon Damage Cap",
  invulnAbsorbThreshold: "Invuln Absorb Threshold",
  invulnDurationBoost: "Invuln Duration Boost",
  invulnDurationCap: "Invuln Duration Cap",
  damagePercentage: "Damage Percentage",
  maxDamagePerInstance: "Max Damage per Instance",
  maxStoredDamage: "Max Stored Damage",
  stunTargets: "Stun Targets",
  stunInterval: "Stun Interval",
  rampUpDamageBonus: "Ramp-Up Damage Bonus",
  maxShootingDistance: "Max Shooting Distance",
  minFov: "Min FoV",
  hologramCount: "Holograms",
  cloneMeleeDamage: "Clone Melee Damage",
  cloneRangedDamage: "Clone Ranged Damage",
  blindDuration: "Blind Duration",
  jewelCharmRadius: "Jewel Charm Radius",
  blindRadius: "Blind Radius",
  jewelCastRange: "Jewel Cast Range",
  jewelDuration: "Jewel Duration",
  laserCount: "Lasers",
  prismSpeed: "Prism Speed",
  tickRate: "Tick Rate",
  initialHealPercent: "Initial Heal",
  durationPer100Shields: "Duration per 100 Shields",
  energyConvert: "Energy Convert",
  headshotMultiplier: "Headshot Multiplier",
  baseCriticalChance: "Base Critical Chance",
  critChancePer100Damage: "Crit Chance per 100 Damage",
  critChanceDuration: "Crit Chance Duration",
  bodyshotCritChanceCap: "Bodyshot Crit Chance Cap",
  headshotCritChanceCap: "Headshot Crit Chance Cap",
  damageCaptureMultiplier: "Damage Capture Mult.",
  instantKillThreshold: "Instant Kill Threshold",
  staggerRadius: "Stagger Radius",
  mirrorContactDamage: "Mirror Contact Damage",
  healthPerSecond: "Health/s",
  damagePerSecond: "Damage/s",
  maxAltars: "Max Altars",
  energyGainPercent: "Energy Gain",
  healthDeducted: "Health Deducted",
  minimumHealth: "Minimum Health",
  slashStatusChance: "Slash Status Chance",
  maxRange: "Max Range",
  minChargeAngle: "Min Charge Angle",
  maxChargeAngle: "Max Charge Angle",
  initialProjectiles: "Initial Projectiles",
  knockbackRadius: "Knockback Radius",
  flameDuration: "Flame Duration",
  boostedDamage: "Boosted Damage",
  unchargedThrowDistance: "Uncharged Throw Distance",
  chargedThrowDistance: "Charged Throw Distance",
  haloHealth: "Halo Health",
  absorptionMultiplier: "Absorption Mult.",
  breakInvulnerabilityDuration: "Break Invulnerability",
  slamDamage: "Slam Damage",
  shieldCount: "Shields",
  horizontalSpread: "Horizontal Spread",
  verticalSpread: "Vertical Spread",
  projectileDamage: "Projectile Damage",
  markDuration: "Mark Duration",
  energyPerCorpse: "Energy per Corpse",
  dropTableChance: "Drop Table Chance",
  shieldBonus: "Shield Bonus",
  healthBonus: "Health Bonus",
  healthDecayPerSecond: "Health Decay/s",
  shadowCopies: "Shadow Copies",
  spawnRadius: "Spawn Radius",
  statusDamageBonus: "Status Damage Bonus",
  critDamagePerKill: "Crit Damage per Kill",
  barrageRadius: "Barrage Radius",
  salvosPerSecond: "Salvos/s",
  recastEnergyDiscount: "Recast Energy Discount",
  armorPerEnemy: "Armor per Enemy",
  armorPerCorrosiveStatus: "Armor per Corrosive Status",
  armorCap: "Armor Cap",
  corrosiveBonusPerEnemy: "Corrosive Bonus per Enemy",
  corrosiveBonusPerStatus: "Corrosive Bonus per Status",
  corrosiveBonusCap: "Corrosive Bonus Cap",
  tentacleCount: "Tentacles",
  overguardContactDamage: "Overguard Contact Damage",
  transitionalDamage: "Transitional Damage",
  coneInitialRadius: "Cone Initial Radius",
  spreadAngle: "Spread Angle",
  gunfireObjectLimit: "Gunfire Object Limit",
  banishDuration: "Banish Duration",
  finalRadius: "Final Radius",
  collapseDamageBonus: "Collapse Damage Bonus",
  healthShieldAbsorb: "Health/Shield Absorb",
  decoyShields: "Decoy Shields",
  decoyHealth: "Decoy Health",
  radialPull: "Radial Pull",
  pullAngle: "Pull Angle",
  magneticPull: "Magnetic Pull",
  damageAbsorption: "Damage Absorption",
  explosionDamageMultiplier: "Explosion Damage Mult.",
  shardDamage: "Shard Damage",
  shardPickupRadius: "Shard Pickup Radius",
  magnetizeExtraDamage: "Magnetize Extra Damage",
  shieldsPerHit: "Shields per Hit",
  shieldsPerHitCap: "Shields per Hit Cap",
  areaDamage: "Area Damage",
  waveAngle: "Wave Angle",
  initialWidth: "Initial Width",
  breakDamage: "Break Damage",
  globeLimit: "Globe Limit",
  healthCap: "Health Cap",
  shatterDamage: "Shatter Damage",
  shatterRadius: "Shatter Radius",
  sweepArc: "Sweep Arc",
  bladeRadius: "Blade Radius",
  absorbedDamage: "Absorbed Damage",
  collapseDamage: "Collapse Damage",
  mirrorCount: "Mirrors",
  collapseThreshold: "Collapse Threshold",
  charmRadius: "Charm Radius",
  castRange: "Cast Range",
  segmentHealth: "Segment Health",
  expansionTime: "Expansion Time",
  ringInitialRadius: "Ring Initial Radius",
  ringExpansionRate: "Ring Expansion Rate",
  explosionRange: "Explosion Range",
  crystallizationTime: "Crystallization Time",
  ringSegments: "Ring Segments",
  nightArmor: "Night Armor",
  nightShields: "Night Shields",
  dayDamageBonus: "Day Damage Bonus",
  daySpeedBonus: "Day Speed Bonus",
  enemySpeedBonus: "Enemy Speed Bonus",
  wakeupHealthThreshold: "Wakeup Health Threshold",
  pacifyDamageReduction: "Pacify Damage Reduction",
  abilityStrengthBonus: "Ability Strength Bonus",
  abilityStrengthBonusCap: "Ability Strength Bonus Cap",
  energyPerAbility: "Energy per Ability",
  hitpointConversion: "Hitpoint Conversion",
  noiseRadius: "Noise Radius",
  sleepDuration: "Sleep Duration",
  sleepRadius: "Sleep Radius",
  sleepHealthThreshold: "Sleep Health Threshold",
  maxCloakBubbles: "Max Cloak Bubbles",
  maxZiplines: "Max Ziplines",
  ziplineRange: "Zipline Range",
  maxDamageMultiplier: "Max Damage Multiplier",
  multiplierGrowth: "Multiplier Growth",
  energyDrainGrowth: "Energy Drain Growth",
  headshotBonus: "Headshot Bonus",
  lootChance: "Loot Chance",
  stealTime: "Steal Time",
  movementSpeedPenalty: "Movement Speed Penalty",
  energyDrainMoving: "Energy Drain (Moving)",
  meleeEnergyCost: "Melee Energy Cost",
  damageEnergyCost: "Damage Energy Cost",
  arrowCount: "Arrow Count",
  shurikenCount: "Shuriken Count",
  autoTargetRadius: "Auto-Target Radius",
  homingAngle: "Homing Angle",
  finisherDamageBonus: "Finisher Damage Bonus",
  energyRefund: "Energy Refund",
  energyPerMark: "Energy per Mark",
  invisibleMarkDiscount: "Invisible Mark Discount",
  shadowClones: "Shadow Clones",
  hitsPerMark: "Hits per Mark",
  ammoPacks: "Ammo Packs",
  maxAmmoPacks: "Max Ammo Packs",
  hit2Radius: "2nd Hit Radius",
  hit3Radius: "3rd Hit Radius",
  comboWindow: "Combo Window",
  rollDamage: "Roll Damage",
  rollDistance: "Roll Distance",
  slashHealthMultiplier: "Slash Health Multiplier",
  rumblerHeal: "Rumbler Heal",
  rockDamage: "Rock Damage",
  blastDamage: "Blast Damage",
  rumblerCount: "Rumblers",
  speedMultiplier: "Speed Multiplier",
  stoneDuration: "Stone Duration",
  propagationSpeed: "Propagation Speed",
  pillarDuration: "Pillar Duration",
  pillarRadius: "Pillar Radius",
  projectileSeekRange: "Projectile Seek Range",
  maxThralls: "Max Thralls",
  hitpointsDrain: "Hitpoints Drain",
  thrallHitpointsDrain: "Thrall Hitpoints Drain",
  travelSpeed: "Travel Speed",
  boostedBeamRadius: "Boosted Beam Radius",
  beamCount: "Beams",
  sweepArea: "Sweep Area",
  boostedStatusChance: "Boosted Status Chance",
  percentageDamage: "Percentage Damage",
  aoePercentageDamage: "AoE Percentage Damage",
  percentageDamageCap: "Percentage Damage Cap",
  aoePercentageDamageCap: "AoE Percentage Damage Cap",
  groundCap: "Ground Cap",
  armorBuff: "Armor Buff",
  armorBuffCap: "Armor Buff Cap",
  initialHeal: "Initial Heal",
  bleedoutSlow: "Bleedout Slow",
  bleedoutSlowCap: "Bleedout Slow Cap",
  allyArmorMultiplier: "Ally Armor Multiplier",
  radiationBonusDamage: "Radiation Bonus Damage",
  bonusArmorPerEnemy: "Bonus Armor per Enemy",
  bonusArmorPerRadiation: "Bonus Armor per Radiation",
  maxCharmRadius: "Max Charm Radius",
  enemiesToMaxRadius: "Enemies to Max Radius",
  armorBonus: "Armor Bonus",
  speedBonus: "Speed Bonus",
  multishotBonus: "Multishot Bonus",
  meleeDamageBonus: "Melee Damage Bonus",
  buffDuration: "Buff Duration",
  maxDamageBuff: "Max Damage Buff",
  malletRangeBonus: "Mallet Range Bonus",
  lifesteal: "Lifesteal",
  healingRadius: "Healing Radius",
  energyPerPulse: "Energy per Pulse",
  pulseRadius: "Pulse Radius",
  damageHealthThreshold: "Damage Health Threshold",
  healthShieldRestore: "Health/Shield Restore",
  particles: "Particles",
  damageReductionPerParticle: "DR per Particle",
  attackInterval: "Attack Interval",
  absorbMultiplier: "Absorb Multiplier",
  contactDamage: "Contact Damage",
  maxHitsAbsorbed: "Max Hits Absorbed",
  absorbedDamageCap: "Absorbed Damage Cap",
  maxPortals: "Max Portals",
  portalUses: "Portal Uses",
  startingWaveRadius: "Starting Wave Radius",
  waveSpeed: "Wave Speed",
  allySpeedCap: "Ally Speed Cap",
  shieldLimit: "Shield Limit",
  pulseDuration: "Pulse Duration",
  damageDelay: "Damage Delay",
  decoyDamage: "Decoy Damage",
  decoyRadius: "Decoy Radius",
  decoyDuration: "Decoy Duration",
  decoyCooldown: "Decoy Cooldown",
  damageReduction: "Damage Reduction",
  healthRegen: "Health Regen",
  reviveCooldown: "Revive Cooldown",
  criticalChanceBonus: "Crit Chance Bonus",
  maxConstellationStars: "Max Constellation Stars",
  durationExtension: "Duration Extension",
  slowPercent: "Slow",
  lifeStealPercent: "Life Steal",
  defenseReduction: "Defense Reduction",
  defenseStrip: "Defense Strip",
  splashRadius: "Splash Radius",
  javelins: "Javelins",
  maggots: "Maggots",
  affectedEnemies: "Affected Enemies",
  energyRegen: "Energy Regen",
  shieldsPerKill: "Shields per Kill",
  healthPerHit: "Health per Hit",
  speedBuff: "Speed Buff",
  reloadBuff: "Reload Buff",
  gunDamage: "Gun Damage",
  meleeDamage: "Melee Damage",
  contagionCloudDps: "Contagion Cloud DPS",
  contagionCloudRange: "Contagion Cloud Range",
  contagionCloudDuration: "Contagion Cloud Duration",
  contagionCloudMeleeMult: "Contagion Melee Mult.",
  damageBonus: "Damage Bonus",
  releaseDelay: "Release Delay",
  maggotHealth: "Maggot Health",
  maggotDamage: "Maggot Damage",
  dashSpeed: "Dash Speed",
  terrainPullSpeed: "Terrain Pull Speed",
  enemyPullSpeed: "Enemy Pull Speed",
  meleeDamageVulnerability: "Melee Damage Vulnerability",
  warcryArmorMultiplier: "Warcry Armor Mult.",
  strengthBonus: "Strength Bonus",
  enemyLinkRange: "Link Range",
  explosionRadius: "Explosion Radius",
  armorMultiplier: "Armor Mult.",
  damageGrowth: "Damage Growth",
  electricDamageBonus: "Electric Damage Bonus",
  critDamageBonus: "Crit Damage Bonus",
  viralDamageBonus: "Viral Damage Bonus",
  voidDamageBonus: "Void Damage Bonus",
  energyMultiplier: "Energy Multiplier",
  selfHeal: "Self Heal",
  viralDamage: "Viral Damage",
  digestionDamage: "Digestion Damage",
  viralStacks: "Viral Stacks",
  maxEnemies: "Max Enemies",
  vomitConeRange: "Vomit Cone Range",
  mawOpenDuration: "Maw Open Duration",
  minCollisionDamage: "Min Collision Damage",
  healPerSecond: "Heal/s",
  toxinDamagePerSecond: "Toxin Damage/s",
  minSlamRadius: "Min Slam Radius",
  collisionRadius: "Collision Radius",
  slowDuration: "Slow Duration",
  shieldCost: "Shield Cost",
  dodgeShieldCost: "Dodge Shield Cost",
  minDamage: "Min Damage",
  allyShieldBonus: "Ally Shields",
  shieldRechargeRate: "Shield Recharge Rate",
  shieldDrainPerAlly: "Shield Drain/Ally",
  shieldDrainPerEnemy: "Shield Drain/Enemy",
  deactivationDamage: "Deactivation Damage",
  shieldDrain: "Shield Drain",
  maxAltitude: "Max Altitude",
  auraDuration: "Aura Duration",
  maxLanterns: "Max Lanterns",
  droneDamage: "Drone Damage",
  evasion: "Evasion",
  razorflies: "Razorflies",
  vacuumRadius: "Vacuum Radius",
  spreadRadius: "Spread Radius",
  resetDecay: "Reset Decay",
  damageDecayRate: "Damage Decay Rate",
  growthEnemyCap: "Growth Enemy Cap",
  initialSpores: "Initial Spores",
  miasmaDamageMultiplier: "Miasma Damage Mult.",
  speedBuffDuration: "Speed Buff Duration",
  decoyInvulnerability: "Decoy Invulnerability",
  moveSpeedBonus: "Move Speed Bonus",
  moveSpeedPenalty: "Move Speed Penalty",
  armorDuration: "Armor Duration",
  minArmorBonus: "Min Armor Bonus",
  rangePerCombo: "Range per Combo",
  targetRange: "Target Range",
  accuseMaxTargets: "Accuse Max Targets",
  accuseDuration: "Accuse Duration",
  accuseRange: "Accuse Range",
  gazeDefenseStrip: "Gaze Defense Strip",
  gazeDuration: "Gaze Duration",
  gazeCastRange: "Gaze Cast Range",
  gazeAuraRadius: "Gaze Aura Radius",
  gazeMaxTargets: "Gaze Max Targets",
  denyRange: "Deny Range",
  denyDuration: "Deny Duration",
  voidDamageVulnerability: "Void Damage Vulnerability",
  dodgeChance: "Dodge Chance",
  areaDamageReduction: "Area Damage Reduction",
  damageGrowthPerSecond: "Damage Growth/s",
  globules: "Globules",
  globuleLifetime: "Globule Lifetime",
  globuleTargetRadius: "Globule Target Radius",
  activeGlobuleCap: "Active Globule Cap",
  merulinaHealth: "Merulina Health",
  initialInvulnerability: "Initial Invulnerability",
  dismountInvulnerability: "Dismount Invulnerability",
  blades: "Blades",
  hitsPerInterval: "Hits per Interval",
  intervalTime: "Interval Time",
  attackCooldown: "Attack Cooldown",
  burstDamage: "Burst Damage",
  vortexRadius: "Vortex Radius",
  extraDamagePerEnemy: "Extra Damage per Enemy",
  ensnareDamageMultiplier: "Ensnare Damage Mult.",
  spreadDelay: "Spread Delay",
  snareDamage: "Snare Damage",
  respawnTime: "Respawn Time",
  healAuraRadius: "Heal Aura Radius",
  grabRadius: "Grab Radius",
  maxDomes: "Max Domes",
  vertices: "Vertices",
  healthPerEnemy: "Health per Enemy",
  totalHealthCost: "Total Health Cost",
  statusProtectionCost: "Status Protection Cost",
  minHealthThreshold: "Min Health Threshold",
  healthAsDamage: "Health as Damage",
  spreadRange: "Spread Range",
  swarmKavatLimit: "Swarm Kavat Limit",
  swarmKavatLifespan: "Swarm Kavat Lifespan",
  streamLinkRange: "Stream Link Range",
  scornPerMeleeKill: "Scorn per Melee Kill",
  furyPerRangedKill: "Fury per Ranged Kill",
  armorReduction: "Armor Reduction",
  knockbackDamage: "Knockback Damage",
  creditChance: "Credit Chance",
  creditBonus: "Credit Bonus",
  charges: "Charges",
  dischargeInterval: "Discharge Interval",
  maxDrones: "Max Drones",
  capsuleDamage: "Capsule Damage",
  flechetteDamage: "Flechette Damage",
  tetherMaxTargets: "Tether Max Targets",
  flechetteTargetRadius: "Flechette Target Radius",
  maxOrbs: "Max Orbs",
  vectorSpeed: "Vector Speed",
  weaponDamageBonus: "Weapon Damage Bonus",
  maxPads: "Max Pads",
  overguardDamageMultiplier: "Overguard Damage Mult.",
  strikeDelay: "Strike Delay",
  armorBuffRate: "Armor Buff Rate",
  armorBuffDuration: "Armor Buff Duration",
  vortexDamagePerSecond: "Vortex Damage/s",
  vortexDuration: "Vortex Duration",
  vortexStatusChance: "Vortex Status Chance",
  maxBastilles: "Max Bastilles",
  maxVortices: "Max Vortices",
  energyRefundPerHit: "Energy per Hit",
  width: "Width",
  mutationStackChance: "Mutation Chance",
  mutationStackCost: "Mutation Cost",
  statusCleanse: "Status Cleanse",
  statusChance: "Status Chance",
  healthMultiplier: "Health Multiplier",
  damageMultiplier: "Damage Multiplier",
  sparkDamageMultiplier: "Spark Damage Mult.",
  markDamageMultiplier: "Mark Damage Mult.",
  sporesDamageMultiplier: "Spores Damage Mult.",
  healPerMeter: "Heal per Meter",
  stunRadius: "Stun Radius",
  parkourVelocity: "Parkour Velocity",
  meleeBuffDuration: "Melee Buff Duration",
  statusTypes: "Status Types",
  statusStacks: "Stacks per Status",
  healthOrbChance: "Health Orb Chance",
  energyOrbChance: "Energy Orb Chance",
  heavyAttackEfficiency: "Heavy Attack Efficiency",
  killDamageBonus: "Kill Damage Bonus",
  critChancePerKill: "Crit Chance per Kill",
  drPerKill: "DR per Kill",
  drPerAssist: "DR per Assist",
  minDamageReduction: "Min Damage Reduction",
  initialDamageReduction: "Initial Damage Reduction",
  initialDecayDelay: "Initial Decay Delay",
  killAssistDecayDelay: "Kill/Assist Decay Delay",
  statusChanceBonus: "Status Chance Bonus",
  statusDurationBonus: "Status Duration Bonus",
  placementDistance: "Placement Distance",
  beamsPerAlly: "Beams per Ally",
  retargetDelay: "Retarget Delay",
  gemLimit: "Gem Limit",
  sightCone: "Sight Cone",
  growthsPerEnemy: "Growths per Enemy",
  absoluteCritChance: "Growth Crit Chance",
  auraRadius: "Aura Radius",
  heatHealthBonus: "Heat Health Bonus",
  heatDps: "Heat DPS",
  electricShieldBonus: "Electric Shield Bonus",
  electricReflectMult: "Electric Reflect Mult.",
  toxinReloadBonus: "Toxin Reload Bonus",
  toxinHolsterDamage: "Toxin Holster Damage",
  toxinProcChance: "Toxin Proc Chance",
  coldArmorBonus: "Cold Armor Bonus",
  coldReflectMult: "Cold Reflect Mult.",
  scornMax: "Scorn Max",
  furyMax: "Fury Max",
  sentryArmor: "Sentry Armor",
  creditPickupRadius: "Credit Pickup Radius",
  pillars: "Pillars",
  heatStatusChance: "Heat Status Chance",
  wailDurationBonus: "Wail Duration Bonus",
  backbeatPillarMultiplier: "Backbeat Pillars",
  criticalChanceVulnerability: "Crit Chance Vulnerability",
  backbeatCritMultiplier: "Backbeat Crit Mult.",
  heatDamageBonus: "Heat Damage Bonus",
  heatDamageCap: "Heat Damage Cap",
  healthRestore: "Health Restore",
  healthRestorePerSecond: "Health Restore/s",
  backbeatInvulnerabilityBonus: "Backbeat Invuln Bonus",
  backbeatBonus: "Backbeat Bonus",
  maxBuffDuration: "Max Buff Duration",
  backbeatAmmoCost: "Backbeat Ammo Cost",
  backbeatStatusBonus: "Backbeat Status Stacks",
  bounceRadius: "Bounce Radius",
  threadLength: "Thread Length",
  threads: "Threads",
  maxThreads: "Max Threads",
  tripleSixBounceDamage: "Triple Six Bounce Damage",
  rareDecreeChance: "Rare Decree Chance",
  unluckyThreshold: "Unlucky Roll Threshold",
  cooldownCap: "Cooldown Cap",
  allyKillWindow: "Ally Kill Window",
  healMultiplier: "Heal Multiplier",
  blockChance: "Block Chance",
  healCooldown: "Heal Cooldown",
  recastThreshold: "Recast Threshold",
  statusDurationPause: "Status Duration Pause",
  minCharms: "Min Charms",
  maxCharms: "Max Charms",
  finisherPromptDuration: "Finisher Prompt",
  maxWebs: "Max Webs",
  toxinStatusChance: "Toxin Status Chance",
  darts: "Darts",
  forcedToxinStacks: "Forced Toxin Stacks",
  scuttlerDuration: "Scuttler Duration",
  maxScuttlers: "Max Scuttlers",
  scuttlerDamage: "Scuttler Damage",
  recallRadius: "Recall Radius",
  toxinWeaponDamage: "Toxin Weapon Damage",
  wallLatchToxinWeaponDamage: "Wall-Latch Toxin Damage",
  dodgeRange: "Dodge Range",
  explosionRadiusCap: "Explosion Radius Cap",
  parkourVelocityBonus: "Parkour Velocity Bonus",
  statusImmunity: "Status Immunity",
  flightSpeed: "Flight Speed",
  catenachChainDamage: "Catenach Chain DPS",
  catenachSlow: "Catenach Slow",
  catenachSlowCap: "Catenach Slow Cap",
  catenachChainDuration: "Catenach Chain Duration",
  catenachChainRange: "Catenach Chain Range",
  catenachMaxTargets: "Catenach Max Targets",
  gulphagorDamage: "Gulphagor Damage/Tick",
  gulphagorHealthOrbChance: "Gulphagor Health Orb Chance",
  gulphagorEnergyOrbChance: "Gulphagor Energy Orb Chance",
  gulphagorFieldDamage: "Gulphagor Field DPS",
  gulphagorFieldDuration: "Gulphagor Field Duration",
  gulphagorFieldRadius: "Gulphagor Field Radius",
  demonHealthDrain: "Demon Health Drain",
  maxProjectiles: "Max Projectiles",
  vythelasFireRate: "Vythelas Fire Rate",
  vythelasHeatDamage: "Vythelas Heat Damage",
  vythelasDuration: "Vythelas Duration",
  maxRunes: "Max Runes",
  damageGrowthPercent: "Damage Growth",
  damageGrowthInterval: "Damage Growth Interval",
  damageMultiplierCap: "Damage Mult Cap",
  objectTypes: "Object Types",
  maxBrushLayers: "Max Brush Layers",
  startingDamageReduction: "Starting Damage Reduction",
  durationBonusPerKill: "Duration per Kill",
  minFallDamage: "Min Fall Damage",
  motes: "Motes",
  moteRecoveryPerSecond: "Mote Recovery/s",
  maxAttackRange: "Max Attack Range",
  tauntRadius: "Taunt Radius",
  minHealthRegen: "Min Health Regen",
  maxHealthRegen: "Max Health Regen",
  sanctuaryLimit: "Sanctuary Limit",
  blackHoleLimit: "Black Hole Limit",
  matchedDamageBonus: "Matched Damage Bonus",
  finisherVulnerability: "Finisher Vulnerability",
  maxMushrooms: "Max Mushrooms",
  invigoratedPulseInterval: "Invigorated Pulse Interval",
  viralStatusChance: "Viral Status Chance",
  energyRestore: "Energy Restore",
  strengthBonusDuration: "Strength Bonus Duration",
  strengthBonusCap: "Strength Bonus Cap",
  invigoratedStrengthBonusCap: "Invigorated STR Cap",
  sproutDamage: "Sprout Damage",
  sproutRadius: "Sprout Radius",
  healthShieldPerSecond: "Health/Shields/s",
  pickupHeal: "Pickup Heal",
  fungalSpores: "Fungal Spores",
  sporeSpawnRadius: "Spore Spawn Radius",
  moveSpeedBonusDuration: "Move Speed Bonus Duration",
  baseMoveSpeed: "Base Move Speed",
  bounces: "Bounces",
  bounceDistance: "Bounce Distance",
  bounceDamageMultiplier: "Bounce Damage Mult.",
  initialCriticalChance: "Initial Crit Chance",
  criticalChancePerBounce: "Crit Chance per Bounce",
  maxSporesprings: "Max Sporesprings",
  shroudHealth: "Shroud Health",
  reflectChance: "Reflect Chance",
  selfDetonationTime: "Self-Detonation Time",
  healthDrainPerSecond: "Health Drain/s",
  explosionHealthPercent: "Explosion Health %",
  impactStatusChance: "Impact Status Chance",
  shieldHealth: "Shield Health",
  reflectMultiplier: "Reflect Mult.",
  blockAngle: "Block Angle",
  augmentBlockAngle: "Augment Block Angle",
  breakCooldown: "Break Cooldown",
  kissEnergyCost: "Maiden's Kiss Energy",
  sweepSpeed: "Sweep Speed",
  sprintSpeedBonus: "Sprint Speed Bonus",
  ammoEfficiency: "Ammo Efficiency",
  damageSpread: "Damage Spread",
};

/** Fraction keys where 1 = 100% and values may exceed 1 (Cold Ward, Vex caps). */
function isFractionPercentKey(key: string): boolean {
  return (
    key.endsWith("Bonus") ||
    key.endsWith("Max") ||
    key === "damageBonus" ||
    key === "abilityCritChance" ||
    key === "damageBonusPerHit" ||
    key === "extraPickupChance" ||
    key === "damageConversion" ||
    key === "lethalHealthRestore" ||
    key === "staggerChance" ||
    key === "healthHealPercent" ||
    key === "damageCopied" ||
    key === "statusChanceVulnerability" ||
    key === "statusDamageIncrease" ||
    key === "damageVulnerability" ||
    key === "stackChancePerStatus" ||
    key === "stackChanceCap" ||
    key === "healthConversion" ||
    key === "damagePerStatus" ||
    key === "damageRedirection" ||
    key === "toxinHolsterDamage" ||
    key === "toxinProcChance" ||
    key === "mutationStackChance" ||
    key === "hasteMoveSpeed" ||
    key === "hasteAttackSpeed" ||
    key === "hasteFireRate" ||
    key === "radiationStatusChance" ||
    key === "sparkChanceOnHit" ||
    key === "boostedMoveSpeedPenalty" ||
    key === "damageGrowthPerEnemy" ||
    key === "radiationStatusChance" ||
    key === "infestedSlow" ||
    key === "weaponDamageCap" ||
    key === "damagePercentage" ||
    key === "rampUpDamageBonus" ||
    key === "cloneMeleeDamage" ||
    key === "cloneRangedDamage" ||
    key === "damageBonusPerHit" ||
    key === "slowPercent" ||
    key === "armorBuff" ||
    key === "meleeDamageVulnerability" ||
    key === "attackSpeedBuff" ||
    key === "digestionDamage" ||
    key === "evasion" ||
    key === "armorStrip" ||
    key === "shieldStrip" ||
    key === "resetDecay" ||
    key === "damageDecayRate" ||
    key === "healPerMeter" ||
    key === "moveSpeedPenalty" ||
    key === "gazeDefenseStrip" ||
    key === "voidDamageVulnerability" ||
    key === "dodgeChance" ||
    key === "areaDamageReduction" ||
    key === "moveSpeedBonus" ||
    key === "speedBuff" ||
    key === "moveSpeedBuff" ||
    key === "weaponDamageBonus" ||
    key === "armorReduction" ||
    key === "creditChance" ||
    key === "creditBonus" ||
    key === "vortexStatusChance" ||
    key === "scornPerMeleeKill" ||
    key === "furyPerRangedKill" ||
    key === "healthOrbChance" ||
    key === "energyOrbChance" ||
    key === "criticalChanceVulnerability" ||
    key === "blockChance" ||
    key === "heatDamageCap" ||
    key === "heatStatusChance" ||
    key === "toxinStatusChance" ||
    key === "toxinWeaponDamage" ||
    key === "wallLatchToxinWeaponDamage" ||
    // healthRestore: Cyte Evade is flat (100); Uriel Remedium is % (0.5) — handled in format/scale
    key === "healthRestorePerSecond" ||
    key === "rareDecreeChance" ||
    key === "instantKillThreshold" ||
    key === "parkourVelocityBonus" ||
    key === "catenachSlow" ||
    key === "demonHealthDrain" ||
    key === "vythelasFireRate" ||
    key === "vythelasHeatDamage" ||
    key === "damageGrowthPercent" ||
    key === "gulphagorHealthOrbChance" ||
    key === "gulphagorEnergyOrbChance" ||
    key === "startingDamageReduction" ||
    key === "defenseReduction" ||
    key === "minDamageReduction" ||
    key === "matchedDamageBonus" ||
    key === "criticalChanceBonus" ||
    key === "finisherVulnerability" ||
    key === "viralStatusChance" ||
    key === "strengthBonusCap" ||
    key === "invigoratedStrengthBonusCap" ||
    key === "initialCriticalChance" ||
    key === "criticalChancePerBounce" ||
    key === "slow" ||
    key === "reflectChance" ||
    key === "healthDrainPerSecond" ||
    key === "lifesteal" ||
    key === "explosionHealthPercent" ||
    key === "impactStatusChance" ||
    key === "ammoEfficiency" ||
    key === "damageSpread" ||
    key === "sprintSpeedBonus" ||
    key === "rumblerHeal" ||
    key === "finisherDamageVulnerability" ||
    key === "lootChance" ||
    key === "statusChance" ||
    key === "heavyAttackEfficiency" ||
    key === "armorBuffCap" ||
    key === "corrosiveBonusCap" ||
    key === "headshotCritChanceCap"
  );
}

function humanizeKey(key: string): string {
  return LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function parsePercentValue(value: unknown): number | null {
  // Bare numbers: only unit-interval fractions (e.g. 0.5 → 50%).
  // Values ≥ 1 are flat counts/damage/etc. unless handled via isFractionPercentKey.
  // Never treat 75 as "75 percent points" here — that path made Shuriken Count → 5%.
  if (typeof value === "number") return value > 0 && value < 1 ? value : null;
  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)\s*%/);
    if (match) return parseFloat(match[1]) / 100;
  }
  return null;
}

function parseRangePercent(value: string): { min: number; max: number } | null {
  const match = value.match(/^([\d.]+)\s*[–-]\s*([\d.]+)\s*%/);
  if (!match) return null;
  return { min: parseFloat(match[1]) / 100, max: parseFloat(match[2]) / 100 };
}

function parseRangePerSecond(value: string): { min: number; max: number } | null {
  const match = value.match(/^([\d.]+)\s*[–-]\s*([\d.]+)\/s$/);
  if (!match) return null;
  return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
}

function parseSinglePerSecond(value: string): number | null {
  const match = value.match(/^([\d.]+)\/s$/);
  if (!match) return null;
  return parseFloat(match[1]);
}

function parseNumeric(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseMeters(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/([\d.]+)\s*m\b/i);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

function parseSeconds(value: unknown): number | null {
  // Only accept explicit "Xs" strings. Bare numbers are often multipliers (e.g. 2× health).
  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)s$/);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

/** Keys that store duration as a bare number of seconds (not a "5s" string). */
function isDurationSecondsKey(key: string): boolean {
  return /duration|delay|cooldown|interval|lifetime|lifespan|countdown|travelTime|airtime|invulnerability|stealTime|assemblyTime|comboWindow|allyKillWindow|overguardRegenTimer/i.test(
    key,
  );
}

function parseDurationSeconds(key: string, value: unknown): number | null {
  if (typeof value === "number" && isDurationSecondsKey(key)) return value;
  return parseSeconds(value);
}

function parseDegrees(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)\s*°/);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

function fmtPct(fraction: number): string {
  return `${(fraction * 100).toFixed(0)}%`;
}

function scaleMultiplier(ctx: AbilityScaleContext, attr: AbilityScaleAttribute): number {
  if (attr === "strength") return ctx.strength;
  if (attr === "duration") return ctx.duration;
  if (attr === "efficiency") return ctx.efficiency ?? 1;
  return ctx.range;
}

/** Effective scale factor; inverse rules divide by the attribute (e.g. interval ÷ DUR). */
function scaleFactor(ctx: AbilityScaleContext, rule: VerifiedStatScaling): number {
  const mult = scaleMultiplier(ctx, rule.scale);
  if (!rule.inverse) return mult;
  return mult > 0 ? 1 / mult : Number.POSITIVE_INFINITY;
}

function resolveCap(
  rule: VerifiedStatScaling,
  miscStats: Record<string, unknown>,
): number | undefined {
  if (rule.useSiblingDrCap) {
    const cap = miscStats.drCap;
    if (typeof cap === "number") return cap <= 1 ? cap : cap / 100;
  }
  if (rule.useSiblingSlowCap) {
    const cap = miscStats.slowCap;
    if (typeof cap === "number") return cap <= 1 ? cap : cap / 100;
  }
  return rule.cap;
}

function applyCap(value: number, cap: number | undefined): number {
  return cap != null ? Math.min(value, cap) : value;
}

function applyBounds(value: number, cap: number | undefined, floor: number | undefined): number {
  let next = applyCap(value, cap);
  if (floor != null) next = Math.max(next, floor);
  return next;
}

function formatBaseValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return String(value);
  if (
    key === "arc" ||
    key === "coneAngle" ||
    key === "firingArc" ||
    key === "seekAngle" ||
    key === "minFov" ||
    key === "homingAngle" ||
    key === "evasionAngle" ||
    key === "waveAngle" ||
    key === "pullAngle" ||
    key === "sweepArc" ||
    key === "blockAngle" ||
    key === "augmentBlockAngle" ||
    key === "minChargeAngle" ||
    key === "maxChargeAngle" ||
    key === "spreadAngle" ||
    key === "horizontalSpread" ||
    key === "verticalSpread"
  ) {
    const deg = parseDegrees(value);
    if (deg != null) return `${deg.toFixed(1)}°`;
  }
  if (typeof value === "number" && key === "shieldGateExtension") {
    return `${value.toFixed(0)}x`;
  }
  // Wiki card rates already in percent points (e.g. 0.025% convert, 0.06% Mind Control).
  if (typeof value === "number" && (key === "weaponDamageConvert" || key === "damageConversionRate")) {
    return `${value}%`;
  }
  // Evade flat heal (100) vs Remedium % heal (0.5) share healthRestore.
  if (typeof value === "number" && key === "healthRestore") {
    return value <= 1 ? fmtPct(value) : Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  if (
    typeof value === "number" &&
    (key === "probeSpeed" ||
      key === "chargeSpeed" ||
      key === "waveSpeed" ||
      key === "airSpeed" ||
      key === "prismSpeed" ||
      key === "dashSpeed")
  ) {
    return key === "waveSpeed" ||
      key === "airSpeed" ||
      key === "prismSpeed" ||
      key === "dashSpeed"
      ? `${value.toFixed(0)}m/s`
      : `${value.toFixed(2)}m/s`;
  }
  if (typeof value === "number" && key === "cooldownReduction") {
    return `${value.toFixed(1)}s`;
  }
  const meters = parseMeters(value);
  if (
    meters != null &&
    (key.includes("adius") ||
      key.includes("ange") ||
      key === "width" ||
      key === "arc" ||
      key === "altFireExplosion" ||
      key === "dashDistance" ||
      key === "seekDistance" ||
      key === "paragrimmAttackRange" ||
      key === "pillarHeight" ||
      key === "wallsGap" ||
      key === "damageRadius" ||
      key === "beamRadius" ||
      key === "residueRadius" ||
      key === "gelMistReach" ||
      key === "tornadoHeight" ||
      key === "travelDistance" ||
      key === "maxShootingDistance")
  ) {
    return `${meters.toFixed(1)}m`;
  }
  const seconds = parseDurationSeconds(key, value);
  if (seconds != null) return `${seconds.toFixed(1)}s`;
  // Multipliers like Celestial Twin 2× must not go through percent parsing (2 → 2%).
  if (
    typeof value === "number" &&
    (key.endsWith("Multiplier") ||
      key.endsWith("Mult") ||
      key === "damageGrowth" ||
      key === "multiplierGrowth")
  ) {
    return value <= 1 ? `${value.toFixed(2)}x` : `${value.toFixed(1)}x`;
  }
  // Shroud of Dynar-style flat melee crit damage (not a 200% bonus).
  if (typeof value === "number" && key === "critDamageBonus") {
    return `+${value.toFixed(1)}x`;
  }
  // Crystallize-style absolute crit (3 → 300%).
  if (typeof value === "number" && key === "absoluteCritChance") {
    return `${(value * 100).toFixed(0)}%`;
  }
  // Flat counts / heal amounts must not go through percent parsing (250 → 250%).
  if (
    typeof value === "number" &&
    (key === "javelins" ||
      key === "maggots" ||
      key === "affectedEnemies" ||
      key === "healthPerHit" ||
      key === "shieldsPerKill" ||
      key === "energyRegen" ||
      key === "contagionCloudDps" ||
      key === "heatDps" ||
      key === "heatDamage" ||
      key === "fieldDamagePerSecond" ||
      key === "contactDamagePerSecond" ||
      key === "dischargeDamage" ||
      key === "energyDrain" ||
      key === "energyDrainPerEnemy" ||
      key === "energyDrainEnemyCap" ||
      key === "energyDrainMoving" ||
      key === "energyRegen" ||
      key === "altFireEnergy" ||
      key === "maxHeatEnergyCost" ||
      key === "wellsLimit" ||
      key === "charges" ||
      key === "areasPerElement" ||
      key === "maxSpheres" ||
      key === "dischargeTargets" ||
      key === "simultaneousDischarges" ||
      key === "shrapnelGrenades" ||
      key === "shieldGrenades" ||
      key === "maxTurrets" ||
      key === "maxCaches" ||
      key === "shotsPerSecond" ||
      key === "shieldRestore" ||
      key === "shieldsPerSecond" ||
      key === "empoweredHealthRestore" ||
      key === "energyPerShot" ||
      key === "altFireDamage" ||
      key === "pageFragments" ||
      key === "overguardGain" ||
      key === "overguardCap" ||
      key === "slashStatuses" ||
      key === "overguardRegenPerSecond" ||
      key === "noctuaCopyLimit" ||
      key === "pageflightDamage" ||
      key === "paragrimmLimit" ||
      key === "maxPillars" ||
      key === "radiationDamagePerTick" ||
      key === "radiationTicks" ||
      key === "initialStatusStacks" ||
      key === "maxStatusStacks" ||
      key === "explosionDamage" ||
      key === "explosionDamagePerStatus" ||
      key === "beamTicksPerSecond" ||
      key === "vialCharges" ||
      key === "probeCount" ||
      key === "missDrain" ||
      key === "daggerCount" ||
      key === "maxDaggersPerEnemy" ||
      key === "maxStorms" ||
      key === "ticksPerSecond" ||
      key === "sentryArmor" ||
      key === "statusTypes" ||
      key === "statusStacks" ||
      key === "maxReservoirs" ||
      key === "vitalityHealth" ||
      key === "vitalityHealPerSecond" ||
      key === "shockDamage" ||
      key === "shockTargets" ||
      key === "boostedDamagePerSecond" ||
      key === "boostedEnergyDrain" ||
      key === "damageRampCap" ||
      key === "slideEnergyCost" ||
      key === "diveBombDamage" ||
      key === "airborneEnergyCost" ||
      key === "meleeEnergyCost" ||
      key === "damageEnergyCost" ||
      key === "kissEnergyCost" ||
      key === "energyPerMark" ||
      key === "energyPerAbility" ||
      key === "energyPerCorpse" ||
      key === "energyPerPulse" ||
      key === "energyRefundPerHit" ||
      key === "energyDrainGrowth" ||
      key === "mutationStackCost" ||
      key === "backbeatAmmoCost" ||
      key === "tickDamage" ||
      key === "tornadoCount" ||
      key === "travelDistance" ||
      key === "boltCount" ||
      key === "boltsOnKill" ||
      key === "maxTargets" ||
      key === "armorSteal" ||
      key === "shieldSteal" ||
      key === "overguardSteal" ||
      key === "armorStealCap" ||
      key === "overguardStealCap" ||
      key === "radiationStacks" ||
      key === "invulnAbsorbThreshold" ||
      key === "maxDamagePerInstance" ||
      key === "maxStoredDamage" ||
      key === "stunTargets" ||
      key === "maxShootingDistance" ||
      key === "hologramCount" ||
      key === "laserCount" ||
      key === "healthRegen" ||
      key === "maggotHealth" ||
      key === "maggotDamage" ||
      key === "selfHeal" ||
      key === "viralDamage" ||
      key === "viralStacks" ||
      key === "maxEnemies" ||
      key === "minCollisionDamage" ||
      key === "slamDamage" ||
      key === "healPerSecond" ||
      key === "toxinDamagePerSecond" ||
      key === "shieldCost" ||
      key === "dodgeShieldCost" ||
      key === "minDamage" ||
      key === "allyShieldBonus" ||
      key === "shieldDrainPerAlly" ||
      key === "shieldDrainPerEnemy" ||
      key === "deactivationDamage" ||
      key === "shieldDrain" ||
      key === "maxAltitude" ||
      key === "maxLanterns" ||
      key === "droneDamage" ||
      key === "razorflies" ||
      key === "meleeDamage" ||
      key === "growthEnemyCap" ||
      key === "initialSpores" ||
      key === "decoyShields" ||
      key === "decoyHealth" ||
      key === "minArmorBonus" ||
      key === "accuseMaxTargets" ||
      key === "gazeMaxTargets" ||
      key === "damageGrowthPerSecond" ||
      key === "globules" ||
      key === "activeGlobuleCap" ||
      key === "merulinaHealth" ||
      key === "blades" ||
      key === "hitsPerInterval" ||
      key === "burstDamage" ||
      key === "snareDamage" ||
      key === "maxDomes" ||
      key === "vertices" ||
      key === "healthPerEnemy" ||
      key === "armorBonus" ||
      key === "totalHealthCost" ||
      key === "minHealthThreshold" ||
      key === "swarmKavatLimit" ||
      key === "charges" ||
      key === "maxDrones" ||
      key === "capsuleDamage" ||
      key === "flechetteDamage" ||
      key === "tetherMaxTargets" ||
      key === "maxOrbs" ||
      key === "maxPads" ||
      key === "knockbackDamage" ||
      key === "armorBuffRate" ||
      key === "vortexDamagePerSecond" ||
      key === "maxBastilles" ||
      key === "maxVortices" ||
      key === "areaDamage" ||
      key === "comboDamageCap" ||
      key === "minRingDamagePerSecond" ||
      key === "energyPerEnemy" ||
      key === "maxEnergyTargets" ||
      key === "energyRestore" ||
      key === "pickupHeal" ||
      key === "haloHealth" ||
      key === "shroudHealth" ||
      key === "shieldHealth" ||
      key === "segmentHealth" ||
      key === "hitsPerMark" ||
      key === "ammoPacks" ||
      key === "maxAmmoPacks" ||
      key === "nightShields" ||
      key === "healthCap" ||
      key === "shieldsPerEnemy" ||
      key === "healthShieldPerSecond" ||
      key === "fungalSpores" ||
      key === "maxMushrooms" ||
      key === "maxSporesprings" ||
      key === "bounces" ||
      key === "sproutDamage" ||
      key === "minHealthRegen" ||
      key === "maxHealthRegen")
  ) {
    return key === "contagionCloudDps" ||
      key === "heatDps" ||
      key === "energyDrain" ||
      key === "energyDrainPerEnemy" ||
      key === "energyDrainMoving" ||
      key === "energyDrainGrowth" ||
      key === "energyRegen" ||
      key === "fieldDamagePerSecond" ||
      key === "contactDamagePerSecond" ||
      key === "shotsPerSecond" ||
      key === "shieldsPerSecond" ||
      key === "overguardRegenPerSecond" ||
      key === "beamTicksPerSecond" ||
      key === "ticksPerSecond" ||
      key === "vitalityHealPerSecond" ||
      key === "boostedDamagePerSecond" ||
      key === "boostedEnergyDrain" ||
      key === "healthRegen" ||
      key === "healthShieldPerSecond" ||
      key === "minHealthRegen" ||
      key === "maxHealthRegen" ||
      key === "healPerSecond" ||
      key === "toxinDamagePerSecond" ||
      key === "shieldDrain" ||
      key === "shieldDrainPerAlly" ||
      key === "shieldDrainPerEnemy" ||
      key === "vortexDamagePerSecond"
      ? `${
          Number.isInteger(value)
            ? value
            : key === "energyDrainPerEnemy"
              ? value.toFixed(2)
              : value.toFixed(1)
        }/s`
      : key === "damageRampCap"
        ? `${value.toFixed(0)}x`
      : key === "travelDistance"
        ? `${value.toFixed(0)}m`
      : Number.isInteger(value)
        ? String(value)
        : value.toFixed(2);
  }
  // Fraction percents may exceed 100% (e.g. coldArmorBonus 1.45 → 145%).
  if (typeof value === "number" && isFractionPercentKey(key)) {
    return fmtPct(value);
  }
  const pct = parsePercentValue(value);
  if (pct != null) return fmtPct(pct);
  if (typeof value === "string") {
    const range = parseRangePercent(value);
    if (range) return `${fmtPct(range.min)}–${fmtPct(range.max)}`;
    const perSec = parseRangePerSecond(value);
    if (perSec) return `${perSec.min}–${perSec.max}/s`;
    const single = parseSinglePerSecond(value);
    if (single != null) return `${single}/s`;
    return value;
  }
  if (typeof value === "number") {
    if (value > 1 && value <= 10 && (key.endsWith("Bonus") || key === "damageBonus")) {
      return `${(value * 100).toFixed(0)}%`;
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
}

function scaleVerifiedValue(
  key: string,
  value: unknown,
  rule: VerifiedStatScaling,
  ctx: AbilityScaleContext,
  miscStats: Record<string, unknown>,
): { scaled: string; modified: boolean; positive: boolean } | null {
  const attrMult = scaleMultiplier(ctx, rule.scale);
  const mult = scaleFactor(ctx, rule);
  const cap = resolveCap(rule, miscStats);
  const floor = rule.floor;
  const modified = Math.abs(attrMult - 1) > 0.001;
  // Tint by whether the driving attribute is above baseline (inverse stats may shrink).
  const positive = attrMult >= 1;

  if (rule.formula === "one_minus_base_over_attr") {
    const base = parsePercentValue(value);
    if (base == null || attrMult <= 0) return null;
    const scaled = applyBounds(1 - base / attrMult, cap, floor);
    return {
      scaled: fmtPct(scaled),
      modified,
      positive,
    };
  }

  if (rule.formula === "channeled_drain") {
    const base = parseNumeric(value);
    if (base == null) return null;
    const eff = ctx.efficiency ?? 1;
    const dur = ctx.duration > 0 ? ctx.duration : 1;
    const factor = Math.max((2 - eff) / dur, 0.25);
    const scaled = applyBounds(base * factor, cap, floor);
    const fmt =
      Math.abs(scaled - Math.round(scaled)) < 0.05
        ? String(Math.round(scaled))
        : scaled < 1
          ? scaled.toFixed(2)
          : scaled.toFixed(1);
    return {
      scaled: `${fmt}/s`,
      modified: Math.abs(factor - 1) > 0.001,
      // Lower drain is better once EFF/DUR reduce the factor.
      positive: factor <= 1,
    };
  }

  // wiki cast/activation cost (energy or shields): base × max(2 − min(EFF, 1.75), 0.25)
  if (rule.formula === "cast_cost") {
    const base = parseNumeric(value);
    if (base == null) return null;
    const scaled = applyBounds(scaledAbilityEnergyCost(base, ctx.efficiency ?? 1), cap, floor);
    const fmt =
      Math.abs(scaled - Math.round(scaled)) < 0.05 ? String(Math.round(scaled)) : scaled.toFixed(1);
    // Refunds/gains use the same EFF curve but higher values are better (Virulence).
    const isRefund = /Refund|Restore|Gain/i.test(key);
    return {
      scaled: fmt,
      modified: Math.abs(scaled - base) > 0.001,
      positive: isRefund ? scaled >= base : scaled <= base,
    };
  }

  // wiki Nourish: 1 + ((storedMultiplier − 1) × STR); Helminth 1.6 → 1.78 at 130% STR
  if (rule.formula === "one_plus_bonus_times_attr") {
    const base = parseNumeric(value);
    if (base == null) return null;
    const scaled = applyBounds(1 + (base - 1) * attrMult, cap, floor);
    return {
      scaled: scaled <= 1 ? `${scaled.toFixed(2)}x` : `${scaled.toFixed(1)}x`,
      modified,
      positive,
    };
  }

  // Wiki card percent-points (Absorb 0.025%, Mind Control 0.06%) — not 0–1 fractions.
  if (
    typeof value === "number" &&
    (key === "weaponDamageConvert" || key === "damageConversionRate")
  ) {
    const scaled = applyBounds(value * mult, cap, floor);
    const fmt = Number.parseFloat(scaled.toPrecision(6)).toString();
    return {
      scaled: `${fmt}%`,
      modified,
      positive,
    };
  }

  if (key === "arc" || key === "coneAngle" || key === "firingArc" || key === "seekAngle") {
    const base = parseDegrees(value);
    if (base == null) return null;
    const scaled = applyBounds(base * mult, cap, floor);
    return {
      scaled: `${scaled.toFixed(1)}°`,
      modified,
      positive,
    };
  }

  const meters = parseMeters(value);
  if (
    meters != null &&
    (key.includes("adius") ||
      key.includes("ange") ||
      key === "width" ||
      key === "stunRadius" ||
      key === "enemyLinkRange" ||
      key === "explosionRadius" ||
      key === "splashRadius" ||
      key === "decoyRadius" ||
      key === "altFireExplosion" ||
      key === "dashDistance" ||
      key === "seekDistance" ||
      key === "paragrimmAttackRange" ||
      key === "pillarHeight" ||
      key === "wallsGap" ||
      key === "damageRadius" ||
      key === "beamRadius" ||
      key === "residueRadius" ||
      key === "gelMistReach" ||
      key === "tornadoHeight" ||
      key === "travelDistance")
  ) {
    const scaled = applyBounds(meters * mult, cap, floor);
    return {
      scaled: `${scaled.toFixed(1)}m`,
      modified,
      positive,
    };
  }

  if (
    typeof value === "number" &&
    (key === "probeSpeed" || key === "chargeSpeed" || key === "waveSpeed" || key === "airSpeed")
  ) {
    const scaled = applyBounds(value * mult, cap, floor);
    const fmt = key === "waveSpeed" || key === "airSpeed" ? scaled.toFixed(0) : scaled.toFixed(2);
    return {
      scaled: `${fmt}m/s`,
      modified,
      positive,
    };
  }
  if (typeof value === "number" && key === "cooldownReduction") {
    const scaled = applyBounds(value * mult, cap, floor);
    return {
      scaled: `${scaled.toFixed(1)}s`,
      modified,
      positive,
    };
  }

  const seconds = parseDurationSeconds(key, value);
  if (seconds != null) {
    const scaled = applyBounds(seconds * mult, cap, floor);
    return {
      scaled: `${scaled.toFixed(1)}s`,
      modified,
      positive,
    };
  }

  if (typeof value === "string" && key === "damageReduction") {
    const range = parseRangePercent(value);
    if (range) {
      const minScaled = applyBounds(range.min * mult, cap, floor);
      const maxScaled = applyBounds(range.max * mult, cap, floor);
      return {
        scaled: `${fmtPct(minScaled)}–${fmtPct(maxScaled)}`,
        modified,
        positive,
      };
    }
  }

  if (typeof value === "string" && key === "healthRegen") {
    const range = parseRangePerSecond(value);
    if (range) {
      return {
        scaled: `${Math.round(range.min * mult)}–${Math.round(range.max * mult)}/s`,
        modified,
        positive,
      };
    }
    const single = parseSinglePerSecond(value);
    if (single != null) {
      return {
        scaled: `${Math.round(single * mult)}/s`,
        modified,
        positive,
      };
    }
  }

  const numEarly = parseNumeric(value);
  if (
    numEarly != null &&
    (key.endsWith("Multiplier") ||
      key.endsWith("Mult") ||
      key === "damageGrowth" ||
      key === "multiplierGrowth")
  ) {
    const scaledNum = applyBounds(numEarly * mult, cap, floor);
    return {
      scaled: scaledNum <= 1 ? `${scaledNum.toFixed(2)}x` : `${scaledNum.toFixed(1)}x`,
      modified,
      positive,
    };
  }
  if (numEarly != null && key === "critDamageBonus") {
    const scaledNum = applyBounds(numEarly * mult, cap, floor);
    return {
      scaled: `+${scaledNum.toFixed(1)}x`,
      modified,
      positive,
    };
  }

  const num = parseNumeric(value);
  if (
    num != null &&
    (key === "javelins" ||
      key === "maggots" ||
      key === "affectedEnemies" ||
      key === "healthPerHit" ||
      key === "shieldsPerKill" ||
      key === "energyRegen" ||
      key === "contagionCloudDps" ||
      key === "heatDps" ||
      key === "heatDamage" ||
      key === "fieldDamagePerSecond" ||
      key === "contactDamagePerSecond" ||
      key === "dischargeDamage" ||
      key === "energyDrain" ||
      key === "energyDrainPerEnemy" ||
      key === "energyDrainEnemyCap" ||
      key === "energyDrainMoving" ||
      key === "energyRegen" ||
      key === "wellsLimit" ||
      key === "charges" ||
      key === "areasPerElement" ||
      key === "maxSpheres" ||
      key === "dischargeTargets" ||
      key === "simultaneousDischarges" ||
      key === "shrapnelGrenades" ||
      key === "shieldGrenades" ||
      key === "maxTurrets" ||
      key === "maxCaches" ||
      key === "shotsPerSecond" ||
      key === "shieldRestore" ||
      key === "shieldsPerSecond" ||
      key === "empoweredHealthRestore" ||
      key === "energyPerShot" ||
      key === "altFireDamage" ||
      key === "pageFragments" ||
      key === "overguardGain" ||
      key === "overguardCap" ||
      key === "slashStatuses" ||
      key === "overguardRegenPerSecond" ||
      key === "noctuaCopyLimit" ||
      key === "pageflightDamage" ||
      key === "paragrimmLimit" ||
      key === "maxPillars" ||
      key === "radiationDamagePerTick" ||
      key === "radiationTicks" ||
      key === "initialStatusStacks" ||
      key === "maxStatusStacks" ||
      key === "explosionDamage" ||
      key === "explosionDamagePerStatus" ||
      key === "beamTicksPerSecond" ||
      key === "vialCharges" ||
      key === "probeCount" ||
      key === "missDrain" ||
      key === "daggerCount" ||
      key === "maxDaggersPerEnemy" ||
      key === "maxStorms" ||
      key === "ticksPerSecond" ||
      key === "altFireEnergy" ||
      key === "maxHeatEnergyCost" ||
      key === "sentryArmor" ||
      key === "statusTypes" ||
      key === "statusStacks" ||
      key === "maxReservoirs" ||
      key === "vitalityHealth" ||
      key === "vitalityHealPerSecond" ||
      key === "shockDamage" ||
      key === "shockTargets" ||
      key === "boostedDamagePerSecond" ||
      key === "boostedEnergyDrain" ||
      key === "damageRampCap" ||
      key === "slideEnergyCost" ||
      key === "diveBombDamage" ||
      key === "airborneEnergyCost" ||
      key === "meleeEnergyCost" ||
      key === "damageEnergyCost" ||
      key === "kissEnergyCost" ||
      key === "energyPerMark" ||
      key === "energyPerAbility" ||
      key === "energyPerCorpse" ||
      key === "energyPerPulse" ||
      key === "energyRefundPerHit" ||
      key === "energyDrainGrowth" ||
      key === "mutationStackCost" ||
      key === "backbeatAmmoCost" ||
      key === "tickDamage" ||
      key === "tornadoCount" ||
      key === "travelDistance" ||
      key === "boltCount" ||
      key === "boltsOnKill" ||
      key === "maxTargets" ||
      key === "armorSteal" ||
      key === "shieldSteal" ||
      key === "overguardSteal" ||
      key === "armorStealCap" ||
      key === "overguardStealCap" ||
      key === "radiationStacks" ||
      key === "invulnAbsorbThreshold" ||
      key === "maxDamagePerInstance" ||
      key === "maxStoredDamage" ||
      key === "stunTargets" ||
      key === "maxShootingDistance" ||
      key === "hologramCount" ||
      key === "laserCount" ||
      key === "healthRegen" ||
      key === "maggotHealth" ||
      key === "maggotDamage" ||
      key === "selfHeal" ||
      key === "viralDamage" ||
      key === "viralStacks" ||
      key === "maxEnemies" ||
      key === "minCollisionDamage" ||
      key === "slamDamage" ||
      key === "healPerSecond" ||
      key === "toxinDamagePerSecond" ||
      key === "shieldCost" ||
      key === "dodgeShieldCost" ||
      key === "minDamage" ||
      key === "allyShieldBonus" ||
      key === "shieldDrainPerAlly" ||
      key === "shieldDrainPerEnemy" ||
      key === "deactivationDamage" ||
      key === "shieldDrain" ||
      key === "maxAltitude" ||
      key === "maxLanterns" ||
      key === "droneDamage" ||
      key === "razorflies" ||
      key === "meleeDamage" ||
      key === "growthEnemyCap" ||
      key === "initialSpores" ||
      key === "decoyShields" ||
      key === "decoyHealth" ||
      key === "minArmorBonus" ||
      key === "accuseMaxTargets" ||
      key === "gazeMaxTargets" ||
      key === "damageGrowthPerSecond" ||
      key === "globules" ||
      key === "activeGlobuleCap" ||
      key === "merulinaHealth" ||
      key === "blades" ||
      key === "hitsPerInterval" ||
      key === "burstDamage" ||
      key === "snareDamage" ||
      key === "maxDomes" ||
      key === "vertices" ||
      key === "healthPerEnemy" ||
      key === "armorBonus" ||
      key === "totalHealthCost" ||
      key === "minHealthThreshold" ||
      key === "swarmKavatLimit" ||
      key === "charges" ||
      key === "maxDrones" ||
      key === "capsuleDamage" ||
      key === "flechetteDamage" ||
      key === "tetherMaxTargets" ||
      key === "maxOrbs" ||
      key === "maxPads" ||
      key === "knockbackDamage" ||
      key === "armorBuffRate" ||
      key === "vortexDamagePerSecond" ||
      key === "maxBastilles" ||
      key === "maxVortices" ||
      key === "areaDamage" ||
      key === "comboDamageCap" ||
      key === "minRingDamagePerSecond" ||
      key === "energyPerEnemy" ||
      key === "maxEnergyTargets" ||
      key === "energyRestore" ||
      key === "pickupHeal" ||
      key === "haloHealth" ||
      key === "shroudHealth" ||
      key === "shieldHealth" ||
      key === "segmentHealth" ||
      key === "hitsPerMark" ||
      key === "ammoPacks" ||
      key === "maxAmmoPacks" ||
      key === "nightShields" ||
      key === "healthCap" ||
      key === "shieldsPerEnemy" ||
      key === "healthShieldPerSecond" ||
      key === "fungalSpores" ||
      key === "maxMushrooms" ||
      key === "maxSporesprings" ||
      key === "bounces" ||
      key === "sproutDamage" ||
      key === "minHealthRegen" ||
      key === "maxHealthRegen")
  ) {
    const scaledNum =
      key === "energyRegen" ? Math.round(num * mult * 100) / 100 : Math.round(num * mult);
    return {
      scaled:
        key === "contagionCloudDps" ||
        key === "heatDps" ||
        key === "energyDrain" ||
        key === "energyDrainPerEnemy" ||
        key === "energyDrainMoving" ||
        key === "energyDrainGrowth" ||
        key === "energyRegen" ||
        key === "fieldDamagePerSecond" ||
        key === "contactDamagePerSecond" ||
        key === "shotsPerSecond" ||
        key === "shieldsPerSecond" ||
        key === "overguardRegenPerSecond" ||
        key === "beamTicksPerSecond" ||
        key === "ticksPerSecond" ||
        key === "vitalityHealPerSecond" ||
        key === "boostedDamagePerSecond" ||
        key === "boostedEnergyDrain" ||
        key === "healthRegen" ||
        key === "healPerSecond" ||
        key === "toxinDamagePerSecond" ||
        key === "shieldDrain" ||
        key === "shieldDrainPerAlly" ||
        key === "shieldDrainPerEnemy" ||
        key === "vortexDamagePerSecond"
          ? `${
              key === "energyDrainPerEnemy" && !Number.isInteger(scaledNum)
                ? Number(scaledNum).toFixed(2)
                : scaledNum
            }/s`
          : key === "damageRampCap"
            ? `${scaledNum}x`
          : key === "travelDistance"
            ? `${scaledNum}m`
          : String(scaledNum),
      modified: Math.abs(scaledNum - num) > 0.001,
      positive: scaledNum >= num,
    };
  }

  // Evade flat heal vs Remedium % heal share healthRestore.
  if (num != null && key === "healthRestore") {
    if (num <= 1) {
      const scaled = applyBounds(num * mult, cap, floor);
      return {
        scaled: fmtPct(scaled),
        modified: Math.abs(scaled - num) > 0.001,
        positive,
      };
    }
    const scaledNum = Math.round(applyBounds(num * mult, cap, floor));
    return {
      scaled: String(scaledNum),
      modified: Math.abs(scaledNum - num) > 0.001,
      positive: scaledNum >= num,
    };
  }

  if (num != null && isFractionPercentKey(key)) {
    const scaled = applyBounds(num * mult, cap, floor);
    return {
      scaled: fmtPct(scaled),
      modified: Math.abs(scaled - num) > 0.001,
      positive,
    };
  }

  const pct = parsePercentValue(value);
  if (pct != null) {
    const scaled = applyBounds(pct * mult, cap, floor);
    return {
      scaled: fmtPct(scaled),
      modified: Math.abs(scaled - pct) > 0.001,
      positive,
    };
  }

  if (num != null) {
    const scaledNum = applyBounds(num * mult, cap, floor);
    return {
      scaled: String(Math.round(scaledNum)),
      modified: Math.round(scaledNum) !== Math.round(num),
      positive,
    };
  }

  return null;
}

/** Scale misc stats only where verified in the scaling registry. */
export function scaleAbilityMiscStats(
  miscStats: Record<string, unknown>,
  ctx: AbilityScaleContext,
  display?: AbilityDisplayContext,
): ScaledMiscStatLine[] {
  const lines: ScaledMiscStatLine[] = [];

  for (const [key, value] of Object.entries(miscStats)) {
    if (SKIP_KEYS.has(key)) continue;

    const base = formatBaseValue(key, value);
    const rule = display
      ? getVerifiedMiscScaling(display.warframeId, display.abilityName, key, display.helminth)
      : null;

    if (!rule) {
      lines.push({
        label: humanizeKey(key),
        base,
        scaled: base,
        modified: false,
      });
      continue;
    }

    const result = scaleVerifiedValue(key, value, rule, ctx, miscStats);
    lines.push({
      label: humanizeKey(key),
      base,
      scaled: result?.scaled ?? base,
      modified: result?.modified ?? false,
      positive: result?.positive ?? true,
      scaleAttr: rule.scale,
    });
  }

  return lines;
}

/** Effective energy cost with 175% efficiency cap (matches in-game builder cards).
 * Negative efficiency (e.g. Overextended without Streamline) pushes costs above 2× base. */
export function scaledAbilityEnergyCost(baseCost: number, efficiency: number): number {
  const clampedEff = Math.min(efficiency, 1.75);
  return Math.max(baseCost * 0.25, baseCost * (2 - clampedEff));
}

/** How cast-invuln absorbed damage enters an armor-scaled pool. */
export type ArmorPoolAbsorbMode = "additive" | "inside_strength";

export type ArmorScaledPoolOptions = {
  /** Damage taken during cast invulnerability (0 = pre-absorb initial pool). */
  absorbedDamage?: number;
  /**
   * additive — Iron Skin / Snow Globe / Tectonics / Shield Maiden:
   *   (base + armorMult × armor) × STR + absorbed
   * inside_strength — Warding Halo:
   *   (base + armorMult × armor + absorbed × absorbMult) × STR
   */
  absorbMode?: ArmorPoolAbsorbMode;
  /** Halo-style absorb multiplier (Misc-fixed 2.5). Default 1. */
  absorptionMultiplier?: number;
};

/**
 * Wiki Iron Skin / Snow Globe / Halo-style pools.
 * Pre-absorb (default): (base + armorMultiplier × totalArmor) × Ability Strength.
 */
export function computeArmorScaledPool(
  base: number,
  armorMultiplier: number,
  totalArmor: number,
  strength: number,
  opts?: ArmorScaledPoolOptions,
): number {
  const armor = Math.max(0, totalArmor);
  const absorbed = Math.max(0, opts?.absorbedDamage ?? 0);
  const absorbMult = opts?.absorptionMultiplier ?? 1;
  if (opts?.absorbMode === "inside_strength") {
    return (base + armorMultiplier * armor + absorbed * absorbMult) * strength;
  }
  return (base + armorMultiplier * armor) * strength + absorbed;
}

/**
 * wiki Mass Vitrify: min absorb per crystallized enemy =
 * (320 + 5 × totalArmor) × STR  (320 = rank-3 segment base / armorMult).
 */
export function computeMassVitrifyAbsorbFloor(
  totalArmor: number,
  strength: number,
  opts?: { absorbBase?: number; armorMultiplier?: number },
): number {
  const absorbBase = opts?.absorbBase ?? 320;
  const armorMult = opts?.armorMultiplier ?? 5;
  return (absorbBase + armorMult * Math.max(0, totalArmor)) * strength;
}

/**
 * wiki Mass Vitrify per-enemy absorb =
 * max(floor, (enemyMaxHP + enemyMaxShields) ÷ 10).
 */
export function computeMassVitrifyEnemyAbsorb(
  totalArmor: number,
  strength: number,
  enemyMaxHpAndShields: number,
  opts?: { absorbBase?: number; armorMultiplier?: number },
): number {
  const floor = computeMassVitrifyAbsorbFloor(totalArmor, strength, opts);
  return Math.max(floor, Math.max(0, enemyMaxHpAndShields) / 10);
}

/** Segment HP = Initial + enemies × per-enemy absorb (absorb added after Initial×STR). */
export function computeMassVitrifySegmentHealth(
  segmentBase: number,
  armorMultiplier: number,
  totalArmor: number,
  strength: number,
  crystallizedEnemies: number,
  enemyMaxHpAndShields = 0,
): number {
  const initial = computeArmorScaledPool(
    segmentBase,
    armorMultiplier,
    totalArmor,
    strength,
  );
  const perEnemy = computeMassVitrifyEnemyAbsorb(
    totalArmor,
    strength,
    enemyMaxHpAndShields,
    { absorbBase: segmentBase / armorMultiplier, armorMultiplier },
  );
  return initial + Math.max(0, crystallizedEnemies) * perEnemy;
}

/** Abilities whose cast invuln adds absorbed damage into the armor-scaled pool. */
export function getArmorPoolInvulnAbsorb(
  abilityName: string,
  miscStats?: Record<string, unknown> | null,
): { mode: ArmorPoolAbsorbMode; absorptionMultiplier: number } | null {
  switch (abilityName) {
    case "Iron Skin":
    case "Snow Globe":
    case "Tectonics":
    case "Shield Maiden":
      return { mode: "additive", absorptionMultiplier: 1 };
    case "Warding Halo": {
      const m = Number(miscStats?.absorptionMultiplier);
      return {
        mode: "inside_strength",
        absorptionMultiplier: Number.isFinite(m) && m > 0 ? m : 2.5,
      };
    }
    case "Storm Shroud": {
      // wiki: absorb Mult scales with STR → effective rate absorbMult×STR ≡ inside_strength
      const m = Number(miscStats?.absorptionMultiplier);
      return {
        mode: "inside_strength",
        absorptionMultiplier: Number.isFinite(m) && m > 0 ? m : 2,
      };
    }
    default:
      return null;
  }
}

/** Clamp heat gauge to unit interval. */
export function clampHeatFraction(heatFraction: number): number {
  return Math.min(1, Math.max(0, heatFraction));
}

/**
 * wiki Inferno: Ring DPS gains +heat% bonus (double at max heat).
 * ringDps = minRing × (1 + heat) × STR
 */
export function computeInfernoRingDps(
  minRingDps: number,
  heatFraction: number,
  strength: number,
): number {
  return minRingDps * (1 + clampHeatFraction(heatFraction)) * strength;
}

/**
 * wiki Immolation:
 * DR = H×Min(maxCap, maxBase×STR) + (1−H)×Min(initialCap, initialBase×STR)
 */
export function computeImmolationDrAtHeat(
  heatFraction: number,
  strength: number,
  opts?: {
    initialDr?: number;
    maxDr?: number;
    initialCap?: number;
    maxCap?: number;
  },
): number {
  const h = clampHeatFraction(heatFraction);
  const initialBase = opts?.initialDr ?? 0.4;
  const maxBase = opts?.maxDr ?? 0.85;
  const initialCap = opts?.initialCap ?? 0.5;
  const maxCap = opts?.maxCap ?? 0.9;
  const maxTerm = Math.min(maxCap, maxBase * strength);
  const initialTerm = Math.min(initialCap, initialBase * strength);
  return h * maxTerm + (1 - h) * initialTerm;
}

/**
 * wiki Fire Blast: armor strip lerps 50%→100% with Immolation heat; × STR, hard-capped at the heat value.
 * strip = Min(lerp(0.5, 1, H) × STR, lerp(0.5, 1, H))
 */
export function computeFireBlastArmorStripAtHeat(
  heatFraction: number,
  strength: number,
): number {
  const heatCap = 0.5 + 0.5 * clampHeatFraction(heatFraction);
  return Math.min(heatCap * strength, heatCap);
}

/** wiki Fireball combo chain before heat: 1× / 2× / 4× / 8× (0…3 prior casts in window). */
const FIREBALL_COMBO_CHAIN = [1, 2, 4, 8] as const;

/**
 * wiki Fireball combo multiplier (UI “×N”):
 * chain[casts] + 4×heat → 1/2/4/8 at 0% heat, 5/6/8/12 at max heat.
 * Damage = internalBase × (combo + 1) × STR; stored catalog bases are first-cast
 * (800/300 = 2 × 400/150), so internal = catalogBase / 2.
 */
export function computeFireballComboMultiplier(
  priorCastsInWindow: number,
  heatFraction: number,
): number {
  const step = Math.min(3, Math.max(0, Math.floor(priorCastsInWindow)));
  return FIREBALL_COMBO_CHAIN[step]! + 4 * clampHeatFraction(heatFraction);
}

/**
 * wiki Fireball direct/AoE damage with Immolation heat + combo chain.
 * First cast @ 0% heat → catalog base; @ max heat → ×3; max combo+heat → ×6.5
 * (800→5200 / 300→1950).
 */
export function computeFireballHeatDamage(
  catalogBase: number,
  heatFraction: number,
  strength: number,
  priorCastsInWindow = 0,
): number {
  const internalBase = catalogBase / 2;
  const combo = computeFireballComboMultiplier(priorCastsInWindow, heatFraction);
  return internalBase * (combo + 1) * strength;
}

/**
 * wiki Kinetic Plating:
 * DR = MinDR + (MaxDR − MinDR) × battery
 * MinDR = Min(emptyCap, minBase×STR); MaxDR = Min(fullCap, maxBase×STR)
 */
export function computeKineticPlatingDrAtBattery(
  batteryFraction: number,
  strength: number,
  opts?: {
    minDr?: number;
    maxDr?: number;
    emptyCap?: number;
    fullCap?: number;
  },
): number {
  const b = clampHeatFraction(batteryFraction);
  const minDr = Math.min(opts?.emptyCap ?? 0.5, (opts?.minDr ?? 0.2) * strength);
  const maxDr = Math.min(opts?.fullCap ?? 1, (opts?.maxDr ?? 1) * strength);
  return minDr + (maxDr - minDr) * b;
}

/** Linear battery/heat lerp between two endpoints. */
export function lerpBatteryValue(min: number, max: number, batteryFraction: number): number {
  const b = clampHeatFraction(batteryFraction);
  return min + (max - min) * b;
}

/**
 * Wiki battery-scaled max stats where the empty-battery floor is max/5
 * (Redline speed buffs; Thermal Sunder Cold/Heat damage).
 */
export function lerpBatteryMaxStat(max: number, batteryFraction: number): number {
  return lerpBatteryValue(max / 5, max, batteryFraction);
}

/**
 * wiki Redline: Fire Rate / Attack Speed / Reload / Cast Speed buffs
 * lerp min→max with battery, then × Ability Duration (not Strength).
 */
export function computeRedlineBuffAtBattery(
  maxBuff: number,
  batteryFraction: number,
  duration: number,
): number {
  return lerpBatteryMaxStat(maxBuff, batteryFraction) * duration;
}

/**
 * wiki Gauss passive: linear across battery gauge (not × STR/DUR).
 * Full battery → +120% shield recharge rate, −80% recharge delay.
 */
export function computeGaussPassiveShieldRecharge(batteryFraction: number): number {
  return clampHeatFraction(batteryFraction) * 1.2;
}

export function computeGaussPassiveRechargeDelayReduction(
  batteryFraction: number,
): number {
  return clampHeatFraction(batteryFraction) * 0.8;
}

/**
 * wiki Thermal Sunder + Redline: Blast armor strip scales from 0% at 80% battery
 * to 100% at full battery (Redline active; not × STR).
 */
export function computeThermalSunderRedlineArmorStrip(
  batteryFraction: number,
): number {
  const b = clampHeatFraction(batteryFraction);
  if (b <= 0.8) return 0;
  if (b >= 1) return 1;
  return (b - 0.8) / 0.2;
}

/**
 * wiki Thurible energy per bodyshot kill:
 * 1 + [EnergyChanneled × convert ÷ (2 − EFF)] × STR
 * (EFF denom floored at 0.25 ≡ 175% Efficiency cap.)
 */
export function computeThuribleEnergyPerKill(
  energyChanneled: number,
  strength: number,
  efficiency: number,
  opts?: { energyConvert?: number; headshotMultiplier?: number },
): { body: number; headshot: number } {
  const convert = opts?.energyConvert ?? 0.15;
  const hsMult = opts?.headshotMultiplier ?? 4;
  const denom = Math.max(2 - efficiency, 0.25);
  const body =
    1 + (Math.max(0, energyChanneled) * convert) / denom * strength;
  return { body, headshot: body * hsMult };
}

/**
 * wiki Metamorphosis: bonuses decay linearly to 0 over Ability Duration.
 * remaining = (base × STR) × max(0, 1 − elapsed / (duration × DUR))
 */
export function computeMetamorphosisBonusAtTime(
  base: number,
  strength: number,
  elapsedSec: number,
  durationSec: number,
): number {
  const peak = base * strength;
  const d = Math.max(0, durationSec);
  if (d <= 0) return 0;
  const remain = Math.max(0, 1 - Math.max(0, elapsedSec) / d);
  return peak * remain;
}

/**
 * wiki Covenant Retaliation flat crit chance:
 * CC = (base + (absorbed÷100)×per100) × STR
 * body = Min(bodyCap, CC); headshot = Min(hsCap, CC × hsMult)
 */
export function computeCovenantCritChance(
  absorbedDamage: number,
  strength: number,
  opts?: {
    baseCriticalChance?: number;
    critChancePer100Damage?: number;
    headshotMultiplier?: number;
    bodyshotCritChanceCap?: number;
    headshotCritChanceCap?: number;
  },
): { body: number; headshot: number; uncapped: number } {
  const base = opts?.baseCriticalChance ?? 0.05;
  const per100 = opts?.critChancePer100Damage ?? 0.015;
  const hsMult = opts?.headshotMultiplier ?? 4;
  const bodyCap = opts?.bodyshotCritChanceCap ?? 0.5;
  const hsCap = opts?.headshotCritChanceCap ?? 2;
  const uncapped =
    (base + (Math.max(0, absorbedDamage) / 100) * per100) * strength;
  return {
    uncapped,
    body: Math.min(bodyCap, uncapped),
    headshot: Math.min(hsCap, uncapped * hsMult),
  };
}

/**
 * wiki Baruuk Restraint passive: up to 50% DR when meter is fully eroded.
 * DR = erodedFraction × 0.5 (not × STR).
 */
export function computeBaruukRestraintDr(erodedFraction: number): number {
  return clampHeatFraction(erodedFraction) * 0.5;
}

/**
 * wiki Virulence: Amplified Damage = Base × STR × (1 + Mutation stacks).
 * Decimals floored (wiki).
 */
export function computeVirulenceDamage(
  base: number,
  strength: number,
  mutationStacks: number,
): number {
  return Math.floor(base * strength * (1 + Math.max(0, mutationStacks)));
}

/**
 * wiki Valkyr Rage passive: melee damage bonus equals Rage meter % (cap 300%).
 * Death prevention when Rage ≥ 150%.
 */
export function computeValkyrRageMeleeBonus(ragePercent: number): number {
  return Math.min(300, Math.max(0, ragePercent)) / 100;
}

export function valkyrRageDeathPreventionActive(ragePercent: number): boolean {
  return ragePercent >= 150;
}

/**
 * wiki Ember passive: +5% Ability Strength per enemy with an active Heat
 * status within Affinity Range (not × STR).
 */
export function computeEmberPassiveAbilityStrength(heatEnemies: number): number {
  return Math.max(0, Math.floor(heatEnemies)) * 0.05;
}

/**
 * wiki Garuda Death's Gate: +5% weapon/melee damage per kill, cap 100%.
 * Bonus is multiplicative to other damage multipliers (panel display only).
 */
export function computeGarudaPassiveDamageBonus(kills: number): number {
  return Math.min(1, Math.max(0, Math.floor(kills)) * 0.05);
}

/**
 * wiki Frost Fortifying Freeze: +50 Armor per enemy with Cold status in Affinity Range
 * (flat after armor mods; not × STR).
 */
export function computeFrostPassiveArmor(coldEnemies: number): number {
  return Math.max(0, Math.floor(coldEnemies)) * 50;
}

/**
 * wiki Cyte-09 Practiced Aim: +1% Weak Point Critical Chance per WP kill, cap 300%
 * (mission-long; additive to CC mods; not × STR).
 */
export function computeCyte09PracticedAimCritChance(weakPointKills: number): number {
  return Math.min(3, Math.max(0, Math.floor(weakPointKills)) * 0.01);
}

/**
 * wiki Grendel passive: +250 Armor per living enemy in belly, cap 5 → +1,250
 * (flat after armor mods; not × STR). Catgut (+150/enemy) is separate.
 */
export function computeGrendelPassiveArmor(
  enemiesInGut: number,
  opts?: { armorPerEnemy?: number; enemyCap?: number },
): number {
  const per = opts?.armorPerEnemy ?? 250;
  const cap = opts?.enemyCap ?? 5;
  return Math.min(cap, Math.max(0, Math.floor(enemiesInGut))) * per;
}

/**
 * wiki Caliban Adaptive Armor: +5% typed DR per hit taken, cap 50%.
 * Does not stack with Adaptation (higher of the two applies). Not × STR.
 */
export function computeCalibanAdaptiveArmorDr(hitsTaken: number): number {
  return Math.min(0.5, Math.max(0, Math.floor(hitsTaken)) * 0.05);
}

/**
 * wiki Protea passive: every 4th cast gets +100% Ability Strength (additive).
 * Power recorder fills 0→3 bars; at 3 bars the next cast is empowered.
 */
export function computeProteaPassiveStrengthBonus(powerBars: number): number {
  return Math.min(3, Math.max(0, Math.floor(powerBars))) >= 3 ? 1 : 0;
}

/**
 * wiki Styanax Hoplite: +1% weapon Critical Chance per 40 current shields
 * (includes Overshields). Doubled when a Speargun primary is equipped.
 */
export function computeStyanaxHopliteCritChance(
  currentShields: number,
  opts?: { speargun?: boolean },
): number {
  const base = Math.max(0, Math.floor(currentShields / 40)) * 0.01;
  return opts?.speargun ? base * 2 : base;
}

/**
 * wiki Yareli Critical Flow: +200% Secondary Critical Chance after moving ≥1.5s
 * (additive to pistol CC mods; lost after 1s without movement).
 */
export function computeYareliCriticalFlowCritChance(moving: boolean): number {
  return moving ? 2 : 0;
}

/**
 * wiki Zephyr passive: +150% weapon Critical Chance while airborne
 * (additive to CC mods; not × STR).
 */
export function computeZephyrAirborneCritChance(airborne: boolean): number {
  return airborne ? 1.5 : 0;
}

export interface XakuPassiveEvasion {
  /** Chance to phase through enemy weapon attacks. */
  dodgeChance: number;
  /** Damage reduction vs area-of-effect damage. */
  aoeDamageReduction: number;
}

/**
 * wiki Xaku passive: 25% dodge + 25% AoE DR; both rise to 75% during The Vast Untime.
 */
export function computeXakuPassiveEvasion(vastUntimeActive: boolean): XakuPassiveEvasion {
  const v = vastUntimeActive ? 0.75 : 0.25;
  return { dodgeChance: v, aoeDamageReduction: v };
}

/**
 * wiki Volt Static Discharge: +10 Electricity damage per grounded meter traveled,
 * discharged on next weapon attack or ability hit. Cap 1000 bonus damage.
 */
export function computeVoltStaticDischargeDamage(metersTraveled: number): number {
  return Math.min(1000, Math.max(0, metersTraveled) * 10);
}

/**
 * wiki Trinity Lifegiver: allies in Affinity Range gain Health equal to 50% of
 * Trinity's total Energy pool (scales with max energy mods/shards).
 */
export function computeTrinityLifegiverBonusHealth(maxEnergy: number): number {
  return Math.max(0, maxEnergy) * 0.5;
}

export type MesaSidearmStyle = "none" | "single" | "dual";

export interface MesaPassiveBonuses {
  /** +15% fire rate with dual-wielded sidearms. */
  fireRateBonus: number;
  /** +25% reload speed for one-handed sidearms. */
  reloadSpeedBonus: number;
  /** +50 Health when no melee is equipped. */
  bonusHealth: number;
}

/**
 * wiki Mesa passive: dual FR +15%, single-hand reload +25%, +50 HP without melee.
 */
export function computeMesaPassiveBonuses(opts: {
  sidearmStyle: MesaSidearmStyle;
  meleeEquipped: boolean;
}): MesaPassiveBonuses {
  return {
    fireRateBonus: opts.sidearmStyle === "dual" ? 0.15 : 0,
    reloadSpeedBonus: opts.sidearmStyle === "single" ? 0.25 : 0,
    bonusHealth: opts.meleeEquipped ? 0 : 50,
  };
}

/** wiki Qorvex Core Exposure: +3 Punch Through on all weapons. */
export function computeQorvexPassivePunchThrough(): number {
  return 3;
}

export interface ExcaliburSwordsmanshipBonuses {
  /** +10% melee damage while wielding eligible swords. */
  damageBonus: number;
  /** +10% attack speed while wielding eligible swords. */
  attackSpeedBonus: number;
}

/**
 * wiki Excalibur Swordsmanship: +10% damage and +10% attack speed with swords,
 * dual swords, nikanas, and rapiers (Umbra shares the same blade bonuses).
 */
export function computeExcaliburSwordsmanshipBonuses(
  wieldingSword: boolean,
): ExcaliburSwordsmanshipBonuses {
  return wieldingSword
    ? { damageBonus: 0.1, attackSpeedBonus: 0.1 }
    : { damageBonus: 0, attackSpeedBonus: 0 };
}

/**
 * wiki Saryn passive: Status Effects from weapons and abilities last 25% longer.
 * Returns the duration multiplier (1.25), not a percent.
 */
export function computeSarynPassiveStatusDurationMultiplier(): number {
  return 1.25;
}

export interface KullervoMeleePassiveBonuses {
  /** +75% Heavy Attack Efficiency on all melee. */
  heavyAttackEfficiency: number;
  /** +100% Heavy Attack Wind Up Speed on all melee. */
  heavyAttackWindUpSpeed: number;
}

/** wiki Kullervo passive: +75% HAE and +100% Heavy Attack Wind Up Speed. */
export function computeKullervoMeleePassiveBonuses(): KullervoMeleePassiveBonuses {
  return { heavyAttackEfficiency: 0.75, heavyAttackWindUpSpeed: 1 };
}

/**
 * wiki Vauban passive: ×1.25 damage vs incapacitated enemies (weapons + abilities).
 * Returns the multiplicative damage bonus fraction (0.25 → +25%).
 */
export function computeVaubanIncapacitatedDamageBonus(incapacitated: boolean): number {
  return incapacitated ? 0.25 : 0;
}

export interface AshSlashPassiveBonuses {
  /** +25% Slash status (Bleed) damage. */
  statusDamageBonus: number;
  /** +50% Slash status duration. */
  statusDurationBonus: number;
}

/** wiki Ash passive: Slash status +25% damage and +50% duration. */
export function computeAshSlashPassiveBonuses(): AshSlashPassiveBonuses {
  return { statusDamageBonus: 0.25, statusDurationBonus: 0.5 };
}

export interface HydroidCorrosiveArmorStrip {
  /** Armor removed by the first Corrosive stack (26% normal / 50% marked). */
  firstStackStrip: number;
  /** Armor removed at full Corrosive stacks (80% normal / 100% marked). */
  fullStackStrip: number;
}

/**
 * wiki Hydroid passive: enemies he has damaged take 50% armor strip on the first
 * Corrosive stack (vs 26%), allowing 100% strip at full stacks (vs 80%).
 */
export function computeHydroidCorrosiveArmorStrip(markedByHydroid: boolean): HydroidCorrosiveArmorStrip {
  return markedByHydroid
    ? { firstStackStrip: 0.5, fullStackStrip: 1 }
    : { firstStackStrip: 0.26, fullStackStrip: 0.8 };
}

/**
 * wiki Dante Chronicler's Mark: ×1.5 Status Chance vs fully Codex-scanned enemies
 * (multiplicative to post-mod status chance).
 */
export function computeDanteChroniclersMarkStatusChance(
  baseStatusChance: number,
  fullyScanned: boolean,
): number {
  const base = Math.max(0, baseStatusChance);
  return fullyScanned ? base * 1.5 : base;
}

export interface DagathAbundantAbyssResult {
  /** Chance Abundant Abyss procs on an orb pickup. */
  procChance: number;
  /** Orb yield multiplier when the passive procs (+300% → ×4). */
  procYieldMultiplier: number;
  /** Expected yield multiplier: procChance×4 + (1−procChance)×1. */
  expectedYieldMultiplier: number;
  /** Effective orb value after optional proc. */
  effectiveValue: number;
}

/**
 * wiki Dagath Abundant Abyss: 35% chance Health/Energy orbs are +300% more effective (×4).
 */
export function computeDagathAbundantAbyss(
  baseOrbValue: number,
  opts?: { forceProc?: boolean },
): DagathAbundantAbyssResult {
  const procChance = 0.35;
  const procYieldMultiplier = 4;
  const expectedYieldMultiplier = procChance * procYieldMultiplier + (1 - procChance);
  const value = Math.max(0, baseOrbValue);
  const effectiveValue =
    opts?.forceProc === true
      ? value * procYieldMultiplier
      : opts?.forceProc === false
        ? value
        : value * expectedYieldMultiplier;
  return { procChance, procYieldMultiplier, expectedYieldMultiplier, effectiveValue };
}

export interface EquinoxOrbConversion {
  /** Primary restore from the orb (full value). */
  primaryAmount: number;
  /** Converted amount (10% of orb value). */
  convertedAmount: number;
  convertedResource: "health" | "energy";
}

/**
 * wiki Equinox passive: 10% of Health Orbs → Energy, 10% of Energy Orbs → Health.
 */
export function computeEquinoxOrbConversion(
  orbValue: number,
  orbKind: "health" | "energy",
): EquinoxOrbConversion {
  const primaryAmount = Math.max(0, orbValue);
  const convertedAmount = primaryAmount * 0.1;
  return {
    primaryAmount,
    convertedAmount,
    convertedResource: orbKind === "health" ? "energy" : "health",
  };
}

export interface RevenantShieldPulse {
  damage: number;
  radius: number;
  /** Max damage falloff at the edge (wiki 75%). */
  maxFalloff: number;
}

/** wiki Revenant: on shield break, 100 Impact knockdown pulse in 7.5m (75% edge falloff). */
export function computeRevenantShieldDepletionPulse(): RevenantShieldPulse {
  return { damage: 100, radius: 7.5, maxFalloff: 0.75 };
}

/**
 * Linear falloff from center (0) to edge (maxFalloff) across pulse radius.
 * distanceFraction = distance / radius, clamped 0–1.
 */
export function computeRevenantShieldPulseDamageAtDistance(
  distanceFraction: number,
  pulse: RevenantShieldPulse = computeRevenantShieldDepletionPulse(),
): number {
  const t = Math.min(1, Math.max(0, distanceFraction));
  return pulse.damage * (1 - pulse.maxFalloff * t);
}

export interface OctaviaInspirationPassive {
  energyPerSecond: number;
  durationSec: number;
  radiusM: number;
  /** Total energy restored over a full Inspiration buff (1/s × 30s). */
  totalEnergy: number;
}

/** wiki Octavia Inspiration: on ability cast, 1 energy/s for 30s within 15m. */
export function computeOctaviaInspirationPassive(): OctaviaInspirationPassive {
  const energyPerSecond = 1;
  const durationSec = 30;
  const radiusM = 15;
  return {
    energyPerSecond,
    durationSec,
    radiusM,
    totalEnergy: energyPerSecond * durationSec,
  };
}

/** Remaining Inspiration energy from elapsed time (refresh resets to full 30s). */
export function computeOctaviaInspirationEnergyRemaining(
  elapsedSec: number,
  passive: OctaviaInspirationPassive = computeOctaviaInspirationPassive(),
): number {
  const remaining = Math.max(0, passive.durationSec - Math.max(0, elapsedSec));
  return remaining * passive.energyPerSecond;
}

export interface NekrosDeathHealPassive {
  healthPerDeath: number;
  radiusM: number;
}

/** wiki Nekros: restore 5 Health (self + companions) per enemy death within 10m. */
export function computeNekrosDeathHealPassive(): NekrosDeathHealPassive {
  return { healthPerDeath: 5, radiusM: 10 };
}

export function computeNekrosDeathHealTotal(deaths: number): number {
  const { healthPerDeath } = computeNekrosDeathHealPassive();
  return Math.max(0, Math.floor(deaths)) * healthPerDeath;
}

export type NovaSpeedState = "none" | "slowed" | "sped";

export interface NovaPassiveOrbChances {
  healthOrbChance: number;
  energyOrbChance: number;
}

/**
 * wiki Nova passive: 15% Health Orb on kill while slowed; 15% Energy Orb while sped up.
 * Slow/speed can come from any source (incl. Molecular Prime).
 */
export function computeNovaPassiveOrbChances(speedState: NovaSpeedState): NovaPassiveOrbChances {
  return {
    healthOrbChance: speedState === "slowed" ? 0.15 : 0,
    energyOrbChance: speedState === "sped" ? 0.15 : 0,
  };
}

export function computeNovaPassiveExpectedOrbs(
  kills: number,
  speedState: NovaSpeedState,
): { expectedHealthOrbs: number; expectedEnergyOrbs: number } {
  const n = Math.max(0, Math.floor(kills));
  const chances = computeNovaPassiveOrbChances(speedState);
  return {
    expectedHealthOrbs: n * chances.healthOrbChance,
    expectedEnergyOrbs: n * chances.energyOrbChance,
  };
}

/** Default Warframe enemy radar (for comparison with Ivara). */
export const DEFAULT_ENEMY_RADAR_M = 30;

/** wiki Ivara: innate enemy radar 50m (vs normal 30m). Stacks with Enemy Radar mods/auras. */
export function computeIvaraEnemyRadarRange(extraRadarM = 0): number {
  return 50 + Math.max(0, extraRadarM);
}

export interface NezhaSlidePassiveBonuses {
  /** +60% slide speed. */
  slideSpeedBonus: number;
  /** +35% slide distance. */
  slideDistanceBonus: number;
}

/** wiki Nezha: slides 60% faster and 35% farther (additive with Maglev etc.). */
export function computeNezhaSlidePassiveBonuses(): NezhaSlidePassiveBonuses {
  return { slideSpeedBonus: 0.6, slideDistanceBonus: 0.35 };
}

export interface MirageParkourPassiveBonuses {
  /** +85% slide duration. */
  slideDurationBonus: number;
  /** +50% maneuver / parkour velocity. */
  maneuverSpeedBonus: number;
}

/** wiki Mirage: sliding lasts 85% longer; acrobatic maneuvers 50% faster. */
export function computeMirageParkourPassiveBonuses(): MirageParkourPassiveBonuses {
  return { slideDurationBonus: 0.85, maneuverSpeedBonus: 0.5 };
}

/** Default wall-latch duration for non-Loki Warframes. */
export const DEFAULT_WALL_LATCH_SEC = 6;

export interface LokiWallLatchPassive {
  /** ×10 longer than normal wall latch. */
  multiplier: number;
  /** Cap 60s (10 × 6s default). */
  durationSec: number;
}

/** wiki Loki: wall latch up to 60s (10× the normal 6s). */
export function computeLokiWallLatchPassive(): LokiWallLatchPassive {
  return { multiplier: 10, durationSec: DEFAULT_WALL_LATCH_SEC * 10 };
}

export interface LavosValenceBlockPassive {
  /** Status immunity duration after picking up an Energy/Universal Orb. */
  immunityDurationSec: number;
  /** Cooldown before another Energy/Universal Orb can refresh Valence Block. */
  orbPickupCooldownSec: number;
}

/** wiki Lavos Valence Block: 10s status immunity on Energy/Universal orb; 5s orb cooldown. */
export function computeLavosValenceBlockPassive(): LavosValenceBlockPassive {
  return { immunityDurationSec: 10, orbPickupCooldownSec: 5 };
}

/** Remaining Valence Block immunity from elapsed time since last proc. */
export function computeLavosValenceBlockRemaining(
  elapsedSec: number,
  passive: LavosValenceBlockPassive = computeLavosValenceBlockPassive(),
): number {
  return Math.max(0, passive.immunityDurationSec - Math.max(0, elapsedSec));
}

export interface KhoraVenariPassive {
  /** +15% movement speed while Venari is alive. */
  moveSpeedBonus: number;
  /** Seconds until Venari respawns if killed (instant via Venari ability cast). */
  respawnSec: number;
}

/** wiki Khora: Venari grants +15% move speed while alive; respawns after 45s if killed. */
export function computeKhoraVenariPassive(venariAlive: boolean): KhoraVenariPassive {
  return {
    moveSpeedBonus: venariAlive ? 0.15 : 0,
    respawnSec: 45,
  };
}

export interface OberonRighteousNegationPassive {
  maxStacks: number;
  /** Invulnerability on consuming a non-final charge. */
  invulnOnConsumeSec: number;
  /** Invulnerability when consuming the final charge. */
  invulnOnFinalSec: number;
}

/** wiki Oberon: Health Orbs grant Righteous Negation stacks (cap 3) that block the next hit. */
export function computeOberonRighteousNegationPassive(): OberonRighteousNegationPassive {
  return { maxStacks: 3, invulnOnConsumeSec: 0.25, invulnOnFinalSec: 0.5 };
}

/** Clamp displayed Negation stacks to the wiki max of 3. */
export function computeOberonRighteousNegationStacks(stacks: number): number {
  return Math.min(3, Math.max(0, Math.floor(stacks)));
}

export interface JadeJudgmentPassive {
  /** +50% damage vulnerability on Judged enemies. */
  damageVulnerability: number;
  durationSec: number;
  /** Jade has two Aura mod slots. */
  auraSlots: number;
}

/** wiki Jade: Judgments apply 50% damage vulnerability for 10s; two Aura slots. */
export function computeJadeJudgmentPassive(): JadeJudgmentPassive {
  return { damageVulnerability: 0.5, durationSec: 10, auraSlots: 2 };
}

/** Remaining Judgment duration from elapsed time since application. */
export function computeJadeJudgmentRemaining(
  elapsedSec: number,
  passive: JadeJudgmentPassive = computeJadeJudgmentPassive(),
): number {
  return Math.max(0, passive.durationSec - Math.max(0, elapsedSec));
}

/**
 * Effective damage multiplier vs a Judged enemy (1 + vulnerability).
 * Returns 1 when Judgment is inactive.
 */
export function computeJadeJudgmentDamageMultiplier(judged: boolean): number {
  return judged ? 1 + computeJadeJudgmentPassive().damageVulnerability : 1;
}

/**
 * wiki Temple Backbeat: casting on the metronome zone grants +50% Ability Efficiency
 * (among other per-ability amplifications). Returns additive EFF bonus fraction.
 */
export function computeTempleBackbeatEfficiencyBonus(onBackbeat: boolean): number {
  return onBackbeat ? 0.5 : 0;
}

export interface OraxiaPredatorsLurkPassive {
  /** Invisibility duration from wall latch. */
  invisibilitySec: number;
}

/** wiki Oraxia Predator's Lurk: wall latch grants 8s invisibility (refreshable). */
export function computeOraxiaPredatorsLurkPassive(): OraxiaPredatorsLurkPassive {
  return { invisibilitySec: 8 };
}

export function computeOraxiaPredatorsLurkRemaining(
  elapsedSec: number,
  passive: OraxiaPredatorsLurkPassive = computeOraxiaPredatorsLurkPassive(),
): number {
  return Math.max(0, passive.invisibilitySec - Math.max(0, elapsedSec));
}

export interface RhinoHardLandingPulse {
  damage: number;
  radius: number;
  /** Max damage falloff at the edge (wiki 90%). */
  maxFalloff: number;
}

/** wiki Rhino: hard landing emits 100 Impact knockdown shockwave in 6m (90% edge falloff). */
export function computeRhinoHardLandingPulse(): RhinoHardLandingPulse {
  return { damage: 100, radius: 6, maxFalloff: 0.9 };
}

/**
 * Linear falloff from center (0) to edge (maxFalloff) across Rhino pulse radius.
 * distanceFraction = distance / radius, clamped 0–1.
 */
export function computeRhinoHardLandingDamageAtDistance(
  distanceFraction: number,
  pulse: RhinoHardLandingPulse = computeRhinoHardLandingPulse(),
): number {
  const t = Math.min(1, Math.max(0, distanceFraction));
  return pulse.damage * (1 - pulse.maxFalloff * t);
}

export interface GaraPassiveBlind {
  baseChance: number;
  /** Chance added after each cast that fails to proc (until success). */
  chanceIncreasePerMiss: number;
  durationSec: number;
  radiusM: number;
}

/** wiki Gara: 15% chance on cast for 10s radial blind in 12m; +20% chance per miss until proc. */
export function computeGaraPassiveBlind(): GaraPassiveBlind {
  return {
    baseChance: 0.15,
    chanceIncreasePerMiss: 0.2,
    durationSec: 10,
    radiusM: 12,
  };
}

/**
 * Current blind proc chance after `missedCasts` consecutive failures (resets on success).
 * Caps at 100%.
 */
export function computeGaraPassiveBlindChance(missedCasts: number): number {
  const { baseChance, chanceIncreasePerMiss } = computeGaraPassiveBlind();
  const misses = Math.max(0, Math.floor(missedCasts));
  return Math.min(1, baseChance + misses * chanceIncreasePerMiss);
}

export interface LimboRiftPassive {
  portalDurationSec: number;
  energyPerKill: number;
  energyPerSecondInRift: number;
  /** Banish duration for allies/enemies that touch the portal (not × DUR). */
  portalBanishDurationSec: number;
}

/** wiki Limbo Rift Walk: 5s portal, +10 Energy per Rift kill, +2 Energy/s while in Rift. */
export function computeLimboRiftPassive(): LimboRiftPassive {
  return {
    portalDurationSec: 5,
    energyPerKill: 10,
    energyPerSecondInRift: 2,
    portalBanishDurationSec: 15,
  };
}

/** Energy from Rift kills + passive regen over time spent in the Rift. */
export function computeLimboRiftEnergyGained(
  riftKills: number,
  secondsInRift: number,
  passive: LimboRiftPassive = computeLimboRiftPassive(),
): number {
  return (
    Math.max(0, Math.floor(riftKills)) * passive.energyPerKill +
    Math.max(0, secondsInRift) * passive.energyPerSecondInRift
  );
}

export interface MagVacuumPassive {
  /** Pickup vacuum radius in meters. */
  radiusM: number;
}

/** wiki Mag: automatically vacuum pickups within 8m (overridden by larger vacuum mods). */
export function computeMagVacuumPassive(): MagVacuumPassive {
  return { radiusM: 8 };
}

export interface KoumeiFatePassive {
  /** Interval between weapon selections. */
  intervalSec: number;
  /** Duration the selected weapon inflicts random status effects. */
  durationSec: number;
}

/** wiki Koumei: every 60s, one equipped weapon deals random Status Effects for 60s. */
export function computeKoumeiFatePassive(): KoumeiFatePassive {
  return { intervalSec: 60, durationSec: 60 };
}

/** Remaining Fate buff time from elapsed seconds since the weapon was selected. */
export function computeKoumeiFateRemaining(
  elapsedSec: number,
  passive: KoumeiFatePassive = computeKoumeiFatePassive(),
): number {
  return Math.max(0, passive.durationSec - Math.max(0, elapsedSec));
}

export interface BansheeSilencePassive {
  /** All equipped weapons (incl. Gunblades / Sentinel weapons) are treated as silent. */
  weaponsSilent: boolean;
}

/** wiki Banshee: equipped weapons are hushed so enemies cannot hear them. */
export function computeBansheeSilencePassive(): BansheeSilencePassive {
  return { weaponsSilent: true };
}

export interface AtlasKnockdownPassive {
  /** Immune to Knockdown while in contact with the ground. */
  knockdownImmuneWhileGrounded: boolean;
}

/** wiki Atlas: knockdown immunity while grounded (not in air; pushback still applies). */
export function computeAtlasKnockdownPassive(grounded: boolean): AtlasKnockdownPassive {
  return { knockdownImmuneWhileGrounded: grounded };
}

/** wiki Nyx: +40% Primary/Secondary Critical Chance per Confused enemy in Affinity Range (cap +200%). */
export function computeNyxPsychicCritChance(confusedEnemies: number): number {
  const perEnemy = 0.4;
  const cap = 2;
  return Math.min(Math.max(0, Math.floor(confusedEnemies)) * perEnemy, cap);
}

export interface HarrowPassive {
  /** Default Warframe overshield cap before Harrow's passive. */
  baseOvershieldCap: number;
  /** Overshield capacity with passive (×2). */
  overshieldCap: number;
  /** Missions begin at maximum Energy. */
  startAtMaxEnergy: boolean;
}

/** wiki Harrow: Overshield capacity doubled; start missions at maximum energy. */
export function computeHarrowPassive(
  baseOvershieldCap = 1200,
): HarrowPassive {
  return {
    baseOvershieldCap,
    overshieldCap: baseOvershieldCap * 2,
    startAtMaxEnergy: true,
  };
}

export interface GyreAbilityCritPassive {
  /** Flat ability Critical Chance from Electric status stacks (fraction). */
  critChance: number;
  /** Base ability Critical Damage multiplier at yellow crit. */
  critMultiplier: number;
  /** Yellow / orange / red tier from chance alone (before Cathode Grace). */
  tier: "none" | "yellow" | "orange" | "red";
}

/**
 * wiki Gyre: abilities gain +10% Critical Chance per Electricity status on the target
 * (2.0× yellow / 3.0× orange / 4.0× red). Combined with Cathode Grace, ability CC caps at 300%.
 */
export function computeGyreAbilityCritChance(electricStacks: number): GyreAbilityCritPassive {
  const stacks = Math.max(0, Math.floor(electricStacks));
  const critChance = stacks * 0.1;
  const capped = Math.min(critChance, 3);
  let tier: GyreAbilityCritPassive["tier"] = "none";
  if (capped >= 2.1) tier = "red";
  else if (capped >= 1.1) tier = "orange";
  else if (capped > 0) tier = "yellow";
  const critMultiplier = tier === "red" ? 4 : tier === "orange" ? 3 : tier === "yellow" ? 2 : 1;
  return { critChance: capped, critMultiplier, tier };
}

export interface CitrineGeoluminesencePassive {
  /** Affinity-range-sized heal aura radius (m). */
  radiusM: number;
  /** Base Health/s before orb stacks. */
  baseHealPerSec: number;
  /** Heal/s gained per Health/Universal Orb collected. */
  healPerOrb: number;
  /** Maximum Health/s after 200 orbs. */
  maxHealPerSec: number;
  /** Orbs needed to reach max heal rate. */
  orbsToMax: number;
  /** Current Geoluminesence heal rate. */
  healPerSec: number;
}

/** wiki Citrine: 5 HP/s aura in 50m; +0.1/s per Health Orb up to 25/s (200 orbs). */
export function computeCitrineGeoluminesence(orbsCollected: number): CitrineGeoluminesencePassive {
  const baseHealPerSec = 5;
  const healPerOrb = 0.1;
  const maxHealPerSec = 25;
  const orbsToMax = 200;
  const orbs = Math.max(0, Math.floor(orbsCollected));
  const healPerSec = Math.min(baseHealPerSec + orbs * healPerOrb, maxHealPerSec);
  return {
    radiusM: 50,
    baseHealPerSec,
    healPerOrb,
    maxHealPerSec,
    orbsToMax,
    healPerSec,
  };
}

export interface ChromaDragonFlightPassive {
  /** Extra midair jump / bullet jump from Dragon's Flight. */
  extraAirJump: boolean;
}

/** wiki Chroma: extra midair jump and bullet jump (Dragon's Flight). */
export function computeChromaDragonFlightPassive(): ChromaDragonFlightPassive {
  return { extraAirJump: true };
}

export type ChromaElement = "heat" | "electricity" | "toxin" | "cold";

export interface ChromaElementCyclePassive {
  element: ChromaElement;
  label: string;
}

/** wiki Chroma: emission color / Spectral Scream cycle selects Heat / Electricity / Toxin / Cold. */
export function computeChromaElementCycle(element: ChromaElement): ChromaElementCyclePassive {
  const labels: Record<ChromaElement, string> = {
    heat: "Heat",
    electricity: "Electricity",
    toxin: "Toxin",
    cold: "Cold",
  };
  return { element, label: labels[element] };
}

export interface TitaniaUpsurgePassive {
  /** Bullet Jump / Roll distance bonus. */
  parkourDistanceBonus: number;
  /** Upsurge heal radius (m). */
  healRadiusM: number;
  /** Health regenerated per second. */
  healPerSec: number;
  /** Upsurge duration (s); refreshed on cast. */
  durationSec: number;
}

/** Remaining Upsurge heal time from elapsed seconds since last cast. */
export function computeTitaniaUpsurgeRemaining(
  elapsedSec: number,
  passive: TitaniaUpsurgePassive = computeTitaniaUpsurgePassive(),
): number {
  return Math.max(0, passive.durationSec - Math.max(0, elapsedSec));
}

/** wiki Titania: +25% Bullet Jump/Roll distance; casts grant Upsurge 4 HP/s for 20s in 15m. */
export function computeTitaniaUpsurgePassive(): TitaniaUpsurgePassive {
  return {
    parkourDistanceBonus: 0.25,
    healRadiusM: 15,
    healPerSec: 4,
    durationSec: 20,
  };
}

export interface HildrynShieldGatePassive {
  /** Full-shield Shield Gate invulnerability duration (s). */
  fullGateSec: number;
  /** Energy Orbs restore this many Shield points (cannot create Overshields). */
  energyOrbShieldRestore: number;
  /** Abilities spend Shields / Overshields instead of Energy. */
  abilitiesUseShields: boolean;
}

/** wiki Hildryn: 3.5s full Shield Gate; Energy Orbs → 25 Shields; abilities drain Shields. */
export function computeHildrynShieldGatePassive(): HildrynShieldGatePassive {
  return {
    fullGateSec: 3.5,
    energyOrbShieldRestore: 25,
    abilitiesUseShields: true,
  };
}

export interface NidusUndyingPassive {
  /** Mutation stacks required to trigger Undying. */
  stacksRequired: number;
  /** Invulnerability duration on Undying (s). */
  invulnSec: number;
  /** Fraction of max Health restored. */
  healFraction: number;
  /** Mutation stack soft cap. */
  stackCap: number;
  /** Whether Undying would trigger at the current stack count. */
  undyingReady: boolean;
  /** Stacks remaining after a successful Undying proc. */
  stacksAfterUndying: number;
}

/**
 * wiki Nidus Undying: at ≥15 Mutation stacks on lethal damage, consume 15 stacks,
 * gain 5s invulnerability, restore 50% Health. Cap 200 stacks.
 */
export function computeNidusUndyingPassive(mutationStacks: number): NidusUndyingPassive {
  const stacksRequired = 15;
  const invulnSec = 5;
  const healFraction = 0.5;
  const stackCap = 200;
  const stacks = Math.min(Math.max(0, Math.floor(mutationStacks)), stackCap);
  const undyingReady = stacks >= stacksRequired;
  return {
    stacksRequired,
    invulnSec,
    healFraction,
    stackCap,
    undyingReady,
    stacksAfterUndying: undyingReady ? stacks - stacksRequired : stacks,
  };
}

export interface SiriusOrionPassive {
  /** Ability Efficiency granted after swapping forms. */
  efficiencyBonus: number;
  /** Number of casts that receive the Efficiency bonus. */
  casts: number;
  /** Energy threshold below which forms steal energy from each other. */
  energyStealThreshold: number;
}

/** Remaining Efficiency-buffed casts after N casts since the last form swap. */
export function computeSiriusOrionEfficiencyCastsRemaining(
  castsSinceSwap: number,
  passive: SiriusOrionPassive = computeSiriusOrionPassive(),
): number {
  return Math.max(0, passive.casts - Math.max(0, Math.floor(castsSinceSwap)));
}

/** wiki Sirius & Orion: swap grants +45% Ability Efficiency for next 2 casts; <50 Energy steals. */
export function computeSiriusOrionPassive(): SiriusOrionPassive {
  return {
    efficiencyBonus: 0.45,
    casts: 2,
    energyStealThreshold: 50,
  };
}

export interface WispAirborneInvisPassive {
  /** Invisible to enemies while airborne. */
  invisibleWhileAirborne: boolean;
}

/** wiki Wisp: invisible to enemies while in the air. */
export function computeWispAirborneInvisPassive(airborne: boolean): WispAirborneInvisPassive {
  return { invisibleWhileAirborne: airborne };
}

export interface FollieInkblotPassive {
  /** Move-speed slow while Inkblot is applied. */
  slowFraction: number;
  /** Inkblot duration (s). */
  durationSec: number;
  /** Chance for ink-coated kills to spawn an ink balloon. */
  balloonChance: number;
  /** Orbs dropped when a balloon pops (mixed Health/Energy). */
  orbsPerBalloon: number;
}

/** Expected balloons (and orbs) from ink-coated kills. */
export function computeFollieInkblotExpected(
  inkKills: number,
  passive: FollieInkblotPassive = computeFollieInkblotPassive(),
): { expectedBalloons: number; expectedOrbs: number } {
  const kills = Math.max(0, inkKills);
  const expectedBalloons = kills * passive.balloonChance;
  return {
    expectedBalloons,
    expectedOrbs: expectedBalloons * passive.orbsPerBalloon,
  };
}

/** wiki Follie Inkblot: 50% slow for 10s; 20% chance on kill for balloon with 3 orbs. */
export function computeFollieInkblotPassive(): FollieInkblotPassive {
  return {
    slowFraction: 0.5,
    durationSec: 10,
    balloonChance: 0.2,
    orbsPerBalloon: 3,
  };
}

export interface SevagothTombstonePassive {
  /** Souls required to revive from Tombstone. */
  soulsRequired: number;
  /** Max range to harvest a soul (m). */
  soulTrackRangeM: number;
}

/** Souls still needed after harvesting N souls. */
export function computeSevagothTombstoneSoulsRemaining(
  soulsHarvested: number,
  passive: SevagothTombstonePassive = computeSevagothTombstonePassive(),
): number {
  return Math.max(0, passive.soulsRequired - Math.max(0, Math.floor(soulsHarvested)));
}

/** wiki Sevagoth: on fatal damage, Tombstone + Shadow; harvest 5 souls within 14m to revive. */
export function computeSevagothTombstonePassive(): SevagothTombstonePassive {
  return { soulsRequired: 5, soulTrackRangeM: 14 };
}

export interface InarosPassive {
  /** Max-Health fraction restored per melee Finisher kill. */
  finisherHealFraction: number;
  /** Sarcophagus sand form activates on fatal damage. */
  sarcophagusOnFatal: boolean;
}

/** Health restored from a Finisher kill given max Health. */
export function computeInarosFinisherHeal(
  maxHealth: number,
  passive: InarosPassive = computeInarosPassive(),
): number {
  return Math.max(0, maxHealth) * passive.finisherHealFraction;
}

/** wiki Inaros: Sarcophagus on fatal; melee Finishers restore 20% max Health. */
export function computeInarosPassive(): InarosPassive {
  return { finisherHealFraction: 0.2, sarcophagusOnFatal: true };
}

export interface NokkoVitalDecayPassive {
  /** Seconds to reach a glowing mushroom while in Sprodling form. */
  timeLimitSec: number;
  /** Requires ≥1 active Stinkbrain/Brightbonnet to trigger. */
  requiresActiveMushroom: boolean;
  /** Post-revive invulnerability after the 3s revive animation (s). */
  postReviveInvulnSec: number;
}

/** Remaining Vital Decay time from elapsed seconds in Sprodling form. */
export function computeNokkoVitalDecayRemaining(
  elapsedSec: number,
  passive: NokkoVitalDecayPassive = computeNokkoVitalDecayPassive(),
): number {
  return Math.max(0, passive.timeLimitSec - Math.max(0, elapsedSec));
}

/**
 * wiki Nokko Vital Decay: with ≥1 mushroom, fatal damage → invulnerable Sprodling for 15s;
 * touch a glowing mushroom to revive (3s anim + 1s invuln).
 */
export function computeNokkoVitalDecayPassive(): NokkoVitalDecayPassive {
  return {
    timeLimitSec: 15,
    requiresActiveMushroom: true,
    postReviveInvulnSec: 1,
  };
}

export type WukongFiveTechniqueId =
  | "primal_forces"
  | "heavenly_cloak"
  | "cosmic_armour"
  | "monkey_luck"
  | "sly_alchemy";

export interface WukongFiveTechnique {
  id: WukongFiveTechniqueId;
  name: string;
  summary: string;
  durationSec: number;
}

export interface WukongFiveTechniquesPassive {
  /** Techniques randomly available per mission. */
  techniquesPerMission: number;
  /** Shared death-gate: invuln + Health restore on each technique proc. */
  deathGateInvulnSec: number;
  deathGateHealFraction: number;
  techniques: WukongFiveTechnique[];
}

/** wiki Wukong: 3 of 5 random death-avoid techniques per mission. */
export function computeWukongFiveTechniquesPassive(): WukongFiveTechniquesPassive {
  return {
    techniquesPerMission: 3,
    deathGateInvulnSec: 2,
    deathGateHealFraction: 0.5,
    techniques: [
      {
        id: "primal_forces",
        name: "Primal Forces",
        summary: "+300% Elemental Damage",
        durationSec: 60,
      },
      {
        id: "heavenly_cloak",
        name: "Heavenly Cloak",
        summary: "Invisibility (attacks do not break)",
        durationSec: 30,
      },
      {
        id: "cosmic_armour",
        name: "Cosmic Armour",
        summary: "Invulnerability",
        durationSec: 30,
      },
      {
        id: "monkey_luck",
        name: "Monkey Luck",
        summary: "Extra loot on kills",
        durationSec: 60,
      },
      {
        id: "sly_alchemy",
        name: "Sly Alchemy",
        summary: "Orbs 4× more effective",
        durationSec: 60,
      },
    ],
  };
}

export type VorunaWolfId = "dynar" | "raksh" | "lycath" | "ulfrun";

export interface VorunaWolfPassive {
  id: VorunaWolfId;
  name: string;
  abilitySlot: 1 | 2 | 3 | 4;
  summary: string;
  /** Ulfrun-only: cooldown after sacrifice or swap-out (s). */
  cooldownSec?: number;
  /** Ulfrun-only: invulnerability on sacrifice (s). */
  invulnSec?: number;
  /** Numeric bonus when applicable (parkour / HAE fractions). */
  bonus?: number;
}

export interface VorunaWolvesPassive {
  wolves: VorunaWolfPassive[];
  /** Game hard-cap on Heavy Attack Efficiency (Lycath grants +100%). */
  heavyAttackEfficiencyCap: number;
}

/** Remaining Ulfrun cooldown from elapsed seconds since sacrifice/swap-out. */
export function computeVorunaUlfrunCooldownRemaining(
  elapsedSec: number,
  wolves: VorunaWolvesPassive = computeVorunaWolvesPassive(),
): number {
  const ulfrun = wolves.wolves.find((w) => w.id === "ulfrun");
  const cd = ulfrun?.cooldownSec ?? 60;
  return Math.max(0, cd - Math.max(0, elapsedSec));
}

/** wiki Voruna: hold 1–4 to invoke Dynar / Raksh / Lycath / Ulfrun wolf passives. */
export function computeVorunaWolvesPassive(): VorunaWolvesPassive {
  return {
    heavyAttackEfficiencyCap: 0.9,
    wolves: [
      {
        id: "dynar",
        name: "Dynar",
        abilitySlot: 1,
        summary: "+50% Parkour Velocity",
        bonus: 0.5,
      },
      {
        id: "raksh",
        name: "Raksh",
        abilitySlot: 2,
        summary: "Status Effect immunity",
      },
      {
        id: "lycath",
        name: "Lycath",
        abilitySlot: 3,
        summary: "+100% Heavy Attack Efficiency",
        bonus: 1,
      },
      {
        id: "ulfrun",
        name: "Ulfrun",
        abilitySlot: 4,
        summary: "Death prevention · full HP/Shield restore",
        cooldownSec: 60,
        invulnSec: 3,
      },
    ],
  };
}

export type UrielDemonId = "catenach" | "gulphagor" | "vythelas";

export interface UrielDemonPassive {
  id: UrielDemonId;
  name: string;
  unlockAbility: string;
  summary: string;
}

export interface UrielLegionPassive {
  /** Seconds until a killed demon auto-resurrects. */
  resurrectSec: number;
  /** Teleport-to-Uriel distance threshold (m). */
  teleportRangeM: number;
  demons: UrielDemonPassive[];
  catenach: {
    maxChained: number;
    durationSec: number;
    damagePerSec: number;
    slowFraction: number;
    slowCap: number;
    damageShare: number;
  };
  gulphagor: {
    latchDurationSec: number;
    damagePerTick: number;
    ticksPerSec: number;
    healthOrbChance: number;
    energyOrbChance: number;
    painRadiusM: number;
    painDurationSec: number;
    painHeatPerSec: number;
  };
  vythelas: {
    ritualIntervalSec: number;
    runeDurationSec: number;
    fireRateBonus: number;
    heatDamageBonus: number;
    maxRunes: number;
  };
}

/** Remaining demon resurrect time from elapsed seconds since death. */
export function computeUrielDemonResurrectRemaining(
  elapsedSec: number,
  passive: UrielLegionPassive = computeUrielLegionPassive(),
): number {
  return Math.max(0, passive.resurrectSec - Math.max(0, elapsedSec));
}

/** wiki Uriel: Catenach / Gulphagor / Vythelas legion; 60s auto-resurrect. */
export function computeUrielLegionPassive(): UrielLegionPassive {
  return {
    resurrectSec: 60,
    teleportRangeM: 30,
    demons: [
      {
        id: "catenach",
        name: "Catenach",
        unlockAbility: "Infernalis",
        summary: "Chains enemies; shared damage + slow",
      },
      {
        id: "gulphagor",
        name: "Gulphagor",
        unlockAbility: "Remedium",
        summary: "Latches foes; death drops orbs + pain circle",
      },
      {
        id: "vythelas",
        name: "Vythelas",
        unlockAbility: "Demonium",
        summary: "Demonium Runes: Fire Rate + Heat Extra Hit",
      },
    ],
    catenach: {
      maxChained: 5,
      durationSec: 10,
      damagePerSec: 100,
      slowFraction: 0.5,
      slowCap: 0.95,
      damageShare: 1,
    },
    gulphagor: {
      latchDurationSec: 10,
      damagePerTick: 750,
      ticksPerSec: 4,
      healthOrbChance: 3,
      energyOrbChance: 1,
      painRadiusM: 4,
      painDurationSec: 10,
      painHeatPerSec: 200,
    },
    vythelas: {
      ritualIntervalSec: 12,
      runeDurationSec: 10,
      fireRateBonus: 0.3,
      heatDamageBonus: 0.3,
      maxRunes: 3,
    },
  };
}

/** Treat stored DR/buff as 0–1 fraction when ≤1, else already a percent value 0–100. */
export function abilityPercentFraction(value: number): number {
  return value <= 1 ? value : value / 100;
}

export function scaledDamageReduction(
  base: number,
  strength: number,
  cap?: number,
): number {
  const fraction = abilityPercentFraction(base) * strength;
  return cap != null ? Math.min(fraction, cap) : fraction;
}

export function scaledDamageBuff(base: number, strength: number): number {
  return abilityPercentFraction(base) * strength;
}

/** Scale top-level DR only when verified for this ability. */
export function scaledAbilityDamageReduction(
  base: number,
  strength: number,
  display: AbilityDisplayContext,
  miscStats?: Record<string, unknown>,
): { value: number; modified: boolean } {
  const rule = getVerifiedFieldScaling(display.warframeId, display.abilityName, "damageReduction");
  if (!rule) {
    return { value: abilityPercentFraction(base), modified: false };
  }
  const cap = rule.useSiblingDrCap && miscStats
    ? resolveCap(rule, miscStats)
    : rule.cap;
  return {
    value: scaledDamageReduction(base, strength, cap),
    modified: strength !== 1,
  };
}

/** Scale top-level damage buff only when verified for this ability. */
export function scaledAbilityDamageBuff(
  base: number,
  strength: number,
  display: AbilityDisplayContext,
): { value: number; modified: boolean } {
  const rule = getVerifiedFieldScaling(display.warframeId, display.abilityName, "damageBuff");
  if (!rule) {
    return { value: abilityPercentFraction(base), modified: false };
  }
  const cap = rule.cap;
  const scaled = abilityPercentFraction(base) * strength;
  return {
    value: cap != null ? Math.min(scaled, cap) : scaled,
    modified: strength !== 1,
  };
}

/** @deprecated Use scaledAbilityDamageReduction — returns cap only when drCap is set on the ability. */
export function getAbilityDrCap(miscStats?: Record<string, unknown>): number | null {
  if (!miscStats || miscStats.drCap == null) return null;
  const cap = miscStats.drCap;
  return typeof cap === "number" ? (cap <= 1 ? cap : cap / 100) : null;
}

export function abilityHasScaledMisc(miscStats?: Record<string, unknown>): boolean {
  if (!miscStats) return false;
  return Object.keys(miscStats).some((k) => !SKIP_KEYS.has(k));
}

export function countAbilityStatLines(ability: Ability): number {
  let n = 0;
  if (ability.damage) n++;
  if (ability.miscStats) n += Object.keys(ability.miscStats).filter((k) => !SKIP_KEYS.has(k)).length;
  return n;
}
