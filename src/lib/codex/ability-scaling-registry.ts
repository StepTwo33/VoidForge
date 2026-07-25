/**
 * Verified ability stat scaling rules.
 *
 * Each entry is confirmed against https://wiki.warframe.com ability pages
 * (see `scripts/verify-ability-scaling.py` to re-fetch wikitext).
 *
 * Only stats listed here are scaled with the build. Everything else shows
 * base values until verified for that specific ability.
 *
 * Keys use `warframeFamily::Ability Name` where warframeFamily strips `_prime` / `_umbra`.
 */

export type AbilityScaleAttribute = "strength" | "duration" | "range" | "efficiency";

/** Non-linear misc formulas (wiki-verified per ability). */
export type VerifiedStatFormula =
  /** Pacify: 1 − (baseDR ÷ AbilityStrengthMultiplier). */
  | "one_minus_base_over_attr"
  /** Channeled drain: base × max((2 − EFF) ÷ DUR, 0.25). */
  | "channeled_drain"
  /** Cast/activation cost: base × max(2 − min(EFF, 1.75), 0.25). */
  | "cast_cost"
  /**
   * Nourish energy: 1 + ((storedMultiplier − 1) × attr).
   * Catalog stores full multiplier (native 2× / Helminth 1.6×); only the bonus portion scales.
   */
  | "one_plus_bonus_times_attr";

export interface VerifiedStatScaling {
  scale: AbilityScaleAttribute;
  /**
   * When true, divide by the scale attribute instead of multiplying
   * (e.g. pulse interval ÷ Ability Duration).
   */
  inverse?: boolean;
  /** Optional non-linear formula; when set, replaces ×/÷ scaling. */
  formula?: VerifiedStatFormula;
  /** Hard cap after scaling, as a fraction (1 = 100%) or absolute for non-percents. */
  cap?: number;
  /** Hard floor after scaling (e.g. Energy Vampire pulse interval 0.5s). */
  floor?: number;
  /** Read `drCap` from the ability's miscStats for this stat. */
  useSiblingDrCap?: boolean;
  /** Read `slowCap` from miscStats (percent or fraction). */
  useSiblingSlowCap?: boolean;
}

export type VerifiedAbilityFields = Partial<
  Record<"damageReduction" | "damageBuff", VerifiedStatScaling>
>;

type MiscScalingTable = Record<string, VerifiedStatScaling>;

function familyId(warframeId: string): string {
  return warframeId.replace(/_prime$/, "").replace(/_umbra$/, "");
}

function abilityKey(warframeId: string, abilityName: string): string {
  return `${familyId(warframeId)}::${abilityName}`;
}

/**
 * Misc stat scaling keyed by `warframeFamily::Ability Name` → stat key.
 *
 * Wiki sources (verified 2026-07-01):
 * - Sirius & Orion: wiki.warframe.com/w/Sirius_&_Orion/Abilities
 * - Other frames: individual ability pages on wiki.warframe.com
 */
const VERIFIED_MISC_SCALING: Record<string, MiscScalingTable> = {
  // wiki: Gravitic Slash — strip scales STR (cap 100%); arc is fixed 67.5°
  "sirius_orion::Gravitic Slash": {
    shieldStrip: { scale: "strength", cap: 1 },
    armorStrip: { scale: "strength", cap: 1 },
  },
  // wiki: Astral Shell — decoy duration/damage/radius scale DUR/STR/RNG
  "sirius_orion::Astral Shell": {
    decoyDuration: { scale: "duration" },
    decoyDamage: { scale: "strength" },
    decoyRadius: { scale: "range" },
  },
  // wiki: Light's Sanctuary — heal/radius × STR/RNG; max DR via field (cap 75%)
  "sirius_orion::Light's Sanctuary": {
    minRadius: { scale: "range" },
    maxRadius: { scale: "range" },
    minHealthRegen: { scale: "strength" },
    maxHealthRegen: { scale: "strength" },
    minDamageReduction: { scale: "strength" },
  },
  // wiki: Event Horizon — explosion radius scales RNG
  "sirius_orion::Event Horizon": {
    explosionRadius: { scale: "range" },
  },

  // wiki: Plein Air — defense reduction STR; splash radius RNG
  "follie::Plein Air": {
    defenseReduction: { scale: "strength", cap: 1 },
    splashRadius: { scale: "range" },
  },

  // wiki: Hall of Mirrors — clone damage fractions × STR; hologram count Misc-fixed
  "mirage::Hall Of Mirrors": {
    cloneMeleeDamage: { scale: "strength" },
    cloneRangedDamage: { scale: "strength" },
  },
  // wiki: Sleight of Hand — charm/explosion/blind radii × RNG; jewel duration Misc-fixed
  "mirage::Sleight Of Hand": {
    jewelCharmRadius: { scale: "range" },
    explosionRadius: { scale: "range" },
    blindRadius: { scale: "range" },
    blindDuration: { scale: "duration" },
  },
  // wiki: Prism — laser count Misc-fixed; blind duration × DUR; seeking via ability.range;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "mirage::Prism": {
    blindDuration: { scale: "duration" },
    damageBonusPerHit: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Ballistic Battery — store % / caps × STR
  "mesa::Ballistic Battery": {
    damagePercentage: { scale: "strength" },
    maxDamagePerInstance: { scale: "strength" },
    maxStoredDamage: { scale: "strength" },
  },
  // wiki: Peacemaker — innate damage bonus scales STR; FoV/max distance Misc;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "mesa::Peacemaker": {
    damageBonus: { scale: "strength" },
    rampUpDamageBonus: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Virulence — length scales RNG; width Misc-fixed 4 m;
  // energy refund/hit = 25% of cast cost → scales with EFF via cast_cost (base 10);
  // panel: impact/field DPS = floor(base×STR×(1+Mutation stacks))
  "nidus::Virulence": {
    energyRefundPerHit: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Larva — Mutation stack chance × STR (100% at 200% STR)
  "nidus::Larva": {
    mutationStackChance: { scale: "strength", cap: 1 },
  },
  // wiki: Parasitic Link
  "nidus::Parasitic Link": {
    strengthBonus: { scale: "strength" },
    enemyLinkRange: { scale: "range" },
  },
  // wiki: Ravenous — regen STR, explosion RNG; maggot count fixed at 9
  "nidus::Ravenous": {
    healthRegen: { scale: "strength" },
    explosionRadius: { scale: "range" },
  },

  // wiki: Psychic Bolts — 80% defense strip × STR (cap 100% @125% STR); Infested slow × STR
  // bolt count / targeting range / steal amounts Misc-fixed; strip duration via ability.duration
  "nyx::Psychic Bolts": {
    defenseStrip: { scale: "strength", cap: 1 },
    infestedSlow: { scale: "strength" },
  },
  // wiki: Absorb — min Magnetic via ability.damage × STR; min radius via ability.range;
  // absorbDuration × DUR; weaponDamageConvert (0.025%) × STR; buff √(convert×STR×absorbed) via sim absorbAbsorbedDamage
  "nyx::Absorb": {
    absorbDuration: { scale: "duration" },
    weaponDamageConvert: { scale: "strength" },
  },

  // wiki: Iron Skin — armorMultiplier Misc-fixed (2.5×); outer STR on
  // (base OG + mult × totalArmor); invuln Misc-fixed; absorbed via cast invuln (not panel)
  // wiki: Rhino Charge — charge range/impact radius via ability; dash speed Misc-fixed
  // wiki: Rhino Stomp — Blast via ability.damage; slow Misc-fixed (97.5%)

  // wiki: Warcry — AS/armor × STR; Affinity Range Misc-fixed (not ability.range)
  "valkyr::Warcry": {
    attackSpeedBuff: { scale: "strength" },
    armorBuff: { scale: "strength" },
  },
  "helminth::Warcry": {
    attackSpeedBuff: { scale: "strength" },
    armorBuff: { scale: "strength" },
  },
  // wiki: Paralysis — slow × STR (cap 75%); melee vuln × STR
  "valkyr::Paralysis": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
    meleeDamageVulnerability: { scale: "strength" },
  },
  // wiki: Hysteria — claw damage via ability.damage; heal/hit × STR;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "valkyr::Hysteria": {
    healthPerHit: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Molt — decoy health/explosion via ability; speed buff × STR (cap 100%); Helminth unaltered
  "saryn::Molt": {
    speedBuff: { scale: "strength", cap: 1 },
  },
  "helminth::Molt": {
    speedBuff: { scale: "strength", cap: 1 },
  },
  // wiki: Spores — damage growth per infected enemy scales STR; spreadRadius×RNG via misc
  "saryn::Spores": {
    damageGrowth: { scale: "strength" },
    spreadRadius: { scale: "range" },
  },
  // wiki: Toxic Lash — Extra Hit % scales STR (cap 100%)
  // Contagion Cloud augment (max-rank base): DPS×STR, range×RNG, duration×DUR;
  // kill-uptime cloud DPS is not folded into weapon sustained.
  "saryn::Toxic Lash": {
    gunDamage: { scale: "strength", cap: 1 },
    meleeDamage: { scale: "strength", cap: 1 },
    contagionCloudDps: { scale: "strength" },
    contagionCloudRange: { scale: "range" },
    contagionCloudDuration: { scale: "duration" },
  },
  // wiki: Miasma — Viral DPS via ability.damagePerSecond; Spores ×4 Misc-fixed
  // wiki: Nourish — Viral weapon bonus/heal/retaliation × STR (Helminth base 45%/no heal);
  // energy: 1+((mult−1)×STR) — native bonus 1.0 / Helminth 0.6
  "grendel::Nourish": {
    viralDamageBonus: { scale: "strength" },
    selfHeal: { scale: "strength" },
    viralDamage: { scale: "strength" },
    digestionDamage: { scale: "strength" },
    energyMultiplier: { scale: "strength", formula: "one_plus_bonus_times_attr" },
  },
  "helminth::Nourish": {
    viralDamageBonus: { scale: "strength" },
    viralDamage: { scale: "strength" },
    energyMultiplier: { scale: "strength", formula: "one_plus_bonus_times_attr" },
  },
  // wiki: Pulverize — heal/toxin DPS/strip × STR; collision enemy-count formula unmodeled;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "grendel::Pulverize": {
    healPerSecond: { scale: "strength" },
    armorStrip: { scale: "strength", cap: 1 },
    toxinDamagePerSecond: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Regurgitate — armor strip × STR; slow Misc-fixed 80%/6s
  "grendel::Regurgitate": {
    armorStrip: { scale: "strength", cap: 1 },
  },
  // wiki: Haven — ally shields × STR; Rad DPS via ability.damagePerSecond;
  // shield recharge × DUR; shieldCost cast × EFF; drains × max((2−EFF)÷DUR, 0.25)
  "hildryn::Haven": {
    allyShieldBonus: { scale: "strength" },
    shieldRechargeRate: { scale: "duration" },
    shieldCost: { scale: "efficiency", formula: "cast_cost" },
    shieldDrainPerAlly: { scale: "efficiency", formula: "channeled_drain" },
    shieldDrainPerEnemy: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Aegis Storm — deactivation Impact × STR; Rad DPS via ability.damagePerSecond;
  // shieldCost cast × EFF; dodgeShieldCost 50/dodge × EFF; drains × max((2−EFF)÷DUR, 0.25)
  "hildryn::Aegis Storm": {
    deactivationDamage: { scale: "strength" },
    shieldCost: { scale: "efficiency", formula: "cast_cost" },
    dodgeShieldCost: { scale: "efficiency", formula: "cast_cost" },
    shieldDrain: { scale: "efficiency", formula: "channeled_drain" },
    shieldDrainPerEnemy: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Balefire — charge damage via ability.damage; explosion radius Misc-fixed 3m;
  // shieldCost per charge × EFF (cast_cost)
  "hildryn::Balefire": {
    shieldCost: { scale: "efficiency", formula: "cast_cost" },
  },
  // wiki: Spellbind — range/duration/radius top-level; Helminth→Spellbind (not Tribute)
  // wiki: Tribute — Impact via ability.damage; aura duration/radius Misc-fixed
  // wiki: Lantern — DPS/explode via ability; attract radius via ability.radius
  // wiki: Razorwing — Dex Pixia via ability.damage; Diwata/drone Misc;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "titania::Razorwing": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Xata's Whisper — Void Extra Hit % scales STR
  "xaku::Xata's Whisper": {
    voidDamageBonus: { scale: "strength" },
  },
  "helminth::Xata's Whisper": {
    voidDamageBonus: { scale: "strength" },
  },
  // wiki: Elemental Ward — element bonuses × STR; toxin reload × DUR; aura × RNG
  // Heat burn / toxin poison radii are Misc-fixed 5 m (not registered).
  "chroma::Elemental Ward": {
    auraRadius: { scale: "range" },
    heatHealthBonus: { scale: "strength" },
    heatDps: { scale: "strength" },
    electricShieldBonus: { scale: "strength" },
    electricReflectMult: { scale: "strength" },
    toxinReloadBonus: { scale: "duration" },
    toxinHolsterDamage: { scale: "strength" },
    toxinProcChance: { scale: "strength" },
    coldArmorBonus: { scale: "strength" },
    coldReflectMult: { scale: "strength" },
  },
  "helminth::Elemental Ward": {
    auraRadius: { scale: "range" },
    heatHealthBonus: { scale: "strength" },
    heatDps: { scale: "strength" },
    electricShieldBonus: { scale: "strength" },
    electricReflectMult: { scale: "strength" },
    toxinReloadBonus: { scale: "duration" },
    toxinHolsterDamage: { scale: "strength" },
    toxinProcChance: { scale: "strength" },
    coldArmorBonus: { scale: "strength" },
    coldReflectMult: { scale: "strength" },
  },
  // wiki: Spectral Scream — elemental DPS via ability.damagePerSecond;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "chroma::Spectral Scream": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Vex Armor — aura × RNG; Scorn/Fury max × STR; kill rates Misc-fixed
  "chroma::Vex Armor": {
    auraRadius: { scale: "range" },
    scornMax: { scale: "strength" },
    furyMax: { scale: "strength" },
  },
  // wiki: Effigy — sentry damage/HP via ability; stun/credits Misc-fixed;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "chroma::Effigy": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Tesla Nervos — discharge via ability.damage; DPS × STR; shock radius × RNG; charges × DUR
  "vauban::Tesla Nervos": {
    charges: { scale: "duration" },
  },
  "helminth::Tesla Nervos": {
    charges: { scale: "duration" },
  },
  // wiki: Minelayer — tether/flechette/vector; weaponDamageBonus × STR
  "vauban::Minelayer": {
    weaponDamageBonus: { scale: "strength" },
    moveSpeedBuff: { scale: "strength" },
    flechetteDamage: { scale: "strength" },
  },
  // wiki: Photon Strike — Blast via ability.damage; radius × RNG; Overguard ×2 Misc-fixed
  // wiki: Bastille — capture radius via ability.range; strip/vortex DPS × STR; armorCap Misc-fixed 1500
  "vauban::Bastille": {
    armorStripPerSecond: { scale: "strength" },
    armorBuffRate: { scale: "strength" },
    vortexDamagePerSecond: { scale: "strength" },
  },

  // wiki: Tharros Strike — Impact via damage; 50% defense strip × STR (full at 200%); heal × STR
  "styanax::Tharros Strike": {
    shieldStrip: { scale: "strength", cap: 1 },
    armorStrip: { scale: "strength", cap: 1 },
    healthPerHit: { scale: "strength" },
  },
  "helminth::Tharros Strike": {
    shieldStrip: { scale: "strength", cap: 1 },
    armorStrip: { scale: "strength", cap: 1 },
    healthPerHit: { scale: "strength" },
  },
  // wiki: Pillage — 25% shield/armor drain scales STR (full strip at 400% STR);
  // activation shieldCost × EFF (cast_cost); Helminth uses energyCost top-level
  "hildryn::Pillage": {
    shieldStrip: { scale: "strength", cap: 1 },
    armorStrip: { scale: "strength", cap: 1 },
    shieldCost: { scale: "efficiency", formula: "cast_cost" },
  },
  "helminth::Pillage": {
    shieldStrip: { scale: "strength", cap: 1 },
    armorStrip: { scale: "strength", cap: 1 },
  },
  // wiki: Terrify — 60% armor strip + enemy count scale STR (full strip ~167% STR)
  "nekros::Terrify": {
    armorStrip: { scale: "strength", cap: 1 },
    affectedEnemies: { scale: "strength" },
  },
  "helminth::Terrify": {
    armorStrip: { scale: "strength", cap: 1 },
    affectedEnemies: { scale: "strength" },
  },
  // wiki: Rally Point — energy regen and shields/kill scale STR
  "styanax::Rally Point": {
    energyRegen: { scale: "strength" },
    shieldsPerKill: { scale: "strength" },
  },
  // wiki: Final Stand — javelin count scales DUR (not STR)
  "styanax::Final Stand": {
    javelins: { scale: "duration" },
  },
  // wiki: Axios Javelin — Puncture/Blast via directDamage/aoeDamage; ranges via ability

  // wiki: Seek — weak point bonus × STR; seek range via ability.range
  "cyte_09::Seek": {
    weakPointDamageBonus: { scale: "strength" },
  },
  // wiki: Resupply — weapon/sniper damage bonuses × STR
  "cyte_09::Resupply": {
    weaponDamageBonus: { scale: "strength" },
    sniperDamageBonus: { scale: "strength" },
  },
  // wiki: Evade — health restore × STR; Helminth durationCap 25
  "cyte_09::Evade": {
    healthRestore: { scale: "strength" },
  },
  "helminth::Evade": {
    healthRestore: { scale: "strength" },
  },
  // wiki: Neutralize — exalted Neutralizer; damageMultiplier × STR; energy/shot + alt-fire × EFF; ricochet Misc-fixed
  "cyte_09::Neutralize": {
    damageMultiplier: { scale: "strength" },
    energyPerShot: { scale: "efficiency", formula: "cast_cost" },
    altFireEnergy: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Pyrotechnics — IPS via damage; pillars Misc-fixed; Helminth unaltered damage
  // wiki: Overdrive — Heat via damage; crit vuln × STR
  "temple::Overdrive": {
    criticalChanceVulnerability: { scale: "strength" },
  },
  // wiki: Ripper's Wail — Heat weapon bonus × STR (cap 750%); heal%/invuln Misc-fixed
  "temple::Ripper's Wail": {
    heatDamageBonus: { scale: "strength", cap: 7.5 },
  },
  // wiki: Exalted Solo — Lizzie multiplier × STR; weapon stats on Lizzie

  // wiki: Kumihimo — bounce/thread contact = damage × dice (dice unmodeled); threads × RNG
  "koumei::Kumihimo": {
    threads: { scale: "range" },
  },
  // wiki: Omamori — heal multiplier × STR; block chance Misc-fixed; Helminth 10–20 charms
  "koumei::Omamori": {
    healMultiplier: { scale: "strength" },
  },
  "helminth::Omamori": {
    healMultiplier: { scale: "strength" },
  },
  // wiki: Bunraku — Puncture via damage; status stacks from dice unmodeled

  // wiki: Mercy's Kiss — Toxin via damage; orb chances × STR
  "oraxia::Mercy's Kiss": {
    healthOrbChance: { scale: "strength" },
    energyOrbChance: { scale: "strength" },
  },
  // wiki: Webbed Embrace — Toxin via damage; vuln × STR; Helminth radius 6.67m
  "oraxia::Webbed Embrace": {
    damageVulnerability: { scale: "strength" },
  },
  "helminth::Webbed Embrace": {
    damageVulnerability: { scale: "strength" },
  },
  // wiki: Widow's Brood — Toxin via damage; mark/scuttler durations × DUR
  "oraxia::Widow's Brood": {
    scuttlerDuration: { scale: "duration" },
  },
  // wiki: Silken Stride — health mult / toxin weapon / explosion × STR;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "oraxia::Silken Stride": {
    healthMultiplier: { scale: "strength" },
    toxinWeaponDamage: { scale: "strength" },
    wallLatchToxinWeaponDamage: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Infernalis — cast Heat via damage; aura DPS via damagePerSecond; Catenach slow × STR (cap 95%)
  "uriel::Infernalis": {
    catenachSlow: { scale: "strength", cap: 0.95 },
  },
  // wiki: Remedium — health restore × STR; Helminth 35% (no demons)
  "uriel::Remedium": {
    healthRestore: { scale: "strength" },
  },
  "helminth::Remedium": {
    healthRestore: { scale: "strength" },
  },
  // wiki: Demonium — Heat via damage; vuln × STR
  "uriel::Demonium": {
    damageVulnerability: { scale: "strength" },
  },
  // wiki: Brimstone — Heat via damage; growth/cap Misc-fixed

  // wiki: Forced Perspective — Corrosive via damage; invuln Misc-fixed 3.5s
  // wiki: Self Portrait — max DR field × STR (cap via misc drCap 90% / Helminth 75%)
  // wiki: Plein Air — see earlier entry (defenseReduction + splashRadius)

  // wiki: Sirius & Orion — see earlier entries (Gravitic / Astral / Sanctuary / Event Horizon)
  // wiki: Jade Stars — Heat via damage; motes Misc-fixed 7
  // wiki: Celestial Clash — Blast via damage; match bonuses Misc-fixed

  // wiki: Stinkbrain — Viral via damage; pulse radius via ability.radius; sleep/finisher Misc-fixed
  // wiki: Brightbonnet — energy restore + STR bonus × STR (cap 150% / Helminth 100%); Helminth energy 10
  "nokko::Brightbonnet": {
    energyRestore: { scale: "strength" },
    strengthBonus: { scale: "strength", cap: 1.5 },
  },
  "helminth::Brightbonnet": {
    energyRestore: { scale: "strength" },
    strengthBonus: { scale: "strength", cap: 1 },
  },
  // wiki: Reroot — HPS + pickup heal × STR; spore count/speed Misc-fixed
  "nokko::Reroot": {
    healthShieldPerSecond: { scale: "strength" },
    pickupHeal: { scale: "strength" },
  },
  // wiki: Sporespring — Toxin via damage; bounce distance via misc; bounce mult Misc-fixed

  // wiki: Necraweb — Blast via damage; slow Misc-fixed 50%
  // wiki: Storm Shroud — absorb Mult × STR; shroudHealth Misc-fixed base;
  // Initial Health = (base + absorbed × absorbMult) × STR (no armor); reflect Misc-fixed
  "voidrig::Storm Shroud": {
    absorptionMultiplier: { scale: "strength" },
  },
  // wiki: Gravemines — Heat via damage; charges × DUR; scatter × RNG
  "voidrig::Gravemines": {
    charges: { scale: "duration" },
  },
  // wiki: Guard Mode — Blast/Heat via damage; Arquebex exalted;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "voidrig::Guard Mode": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Meathook — % max HP drain/lifesteal/explosion × STR
  "bonewidow::Meathook": {
    healthDrainPerSecond: { scale: "strength" },
    lifesteal: { scale: "strength" },
    explosionHealthPercent: { scale: "strength" },
  },
  // wiki: Shield Maiden — reflect × STR; shieldHealth / armorMult Misc-fixed;
  // Initial Health = (base + mult × totalArmor) × STR; Maiden's Kiss × EFF
  "bonewidow::Shield Maiden": {
    reflectMultiplier: { scale: "strength" },
    kissEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },
  // wiki: Firing Line — Lifted vulnerability Misc-fixed 1.5×; range via ability
  // wiki: Exalted Ironbride — Blast/Heat via damage; Ironbride weapon;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "bonewidow::Exalted Ironbride": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Infested Mobility — sprint/parkour × STR
  "helminth::Infested Mobility": {
    sprintSpeedBonus: { scale: "strength" },
    parkourVelocityBonus: { scale: "strength" },
  },
  // wiki: Energized Munitions — 75% ammo efficiency Misc-fixed; duration × DUR
  // wiki: Empower — +50% next-cast STR Misc-fixed (Strength N/A)

  // wiki: Excalibur — Slash Dash Strength N/A (Exalted Blade weapon); chainRange×RNG via Ability.chainRange
  // Radial Blind/Howl — range/duration top-level; Radial Javelin damage×STR; Exalted Blade
  // damage×STR, slide blind via duration/range; channeled energyDrain × max((2−EFF)÷DUR, 0.25);
  // Judged Severance slideEnergyCost × EFF (cast_cost)
  "excalibur::Exalted Blade": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    slideEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Speed — reload buff scales STR; movement buff scales STR (ally move cap 150%)
  "volt::Speed": {
    speedBuff: { scale: "strength", cap: 1.5 },
    reloadBuff: { scale: "strength" },
  },
  // wiki: Electric Shield — +50% Electricity / +100% crit damage are FIXED
  // (Strength N/A). Intentionally omitted from VERIFIED_MISC_SCALING so the
  // panel shows base values; weapon DPS applies them via weapon-external-buffs.

  // wiki: Shock — Electricity via damage; chain links Misc-fixed (rank); chain range via ability.range
  // wiki: Discharge — Electricity DPS via damage; stun via ability.duration; arc via ability.radius

  // wiki: Cloud Walker
  "wukong::Cloud Walker": {
    stunRadius: { scale: "range" },
    healPerMeter: { scale: "strength" },
  },
  // wiki: Celestial Twin — health mult scales STR; 0.5× / 3× damage mults are FIXED
  "wukong::Celestial Twin": {
    healthMultiplier: { scale: "strength" },
  },
  // wiki: Defy — damage/armor multipliers × STR; armor duration × DUR; Helminth armorCap 750
  "wukong::Defy": {
    armorDuration: { scale: "duration" },
    damageMultiplier: { scale: "strength" },
    armorMultiplier: { scale: "strength" },
  },
  "helminth::Defy": {
    armorDuration: { scale: "duration" },
    damageMultiplier: { scale: "strength" },
    armorMultiplier: { scale: "strength" },
  },
  // wiki: Primal Fury — staff damage via ability.damage / Iron Staff;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "wukong::Primal Fury": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Grasp of Lohk — Void scaling dmg × STR; maxTargets × STR; targetRange × RNG
  "xaku::Grasp Of Lohk": {
    maxTargets: { scale: "strength" },
    targetRange: { scale: "range" },
  },
  // wiki: The Lost — Accuse targets × STR; Gaze strip × STR (cap 100%); Deny via ability.damage
  "xaku::The Lost": {
    accuseMaxTargets: { scale: "strength" },
    gazeDefenseStrip: { scale: "strength", cap: 1 },
    gazeAuraRadius: { scale: "range" },
    accuseRange: { scale: "range" },
  },
  // wiki: The Vast Untime — slow × STR (cap 95%); void vuln Misc-fixed 50%
  "xaku::The Vast Untime": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
  },

  // wiki: Sea Snares — Cold DPS/growth/vuln × STR; seek range via ability.range
  "yareli::Sea Snares": {
    damageGrowthPerSecond: { scale: "strength" },
    damageVulnerability: { scale: "strength" },
  },
  // wiki: Merulina — health pool × STR; 90% redirection Misc-fixed
  "yareli::Merulina": {
    merulinaHealth: { scale: "strength" },
  },
  // wiki: Aquablades — Slash via ability.damage; blade radius Misc-fixed 5m; Helminth unaltered
  // wiki: Riptide — tick/burst × STR; extra/enemy Misc-fixed 50%
  "yareli::Riptide": {
    burstDamage: { scale: "strength" },
  },

  // wiki: Whipclaw — damage via ability.damage (+ weapon mods unmodeled); Ensare ×2 Misc-fixed
  // wiki: Ensnare — spreadRadius × RNG; Helminth cast range 30m
  "khora::Ensnare": {
    spreadRadius: { scale: "range" },
  },
  "helminth::Ensnare": {
    spreadRadius: { scale: "range" },
  },
  // wiki: Venari — move speed/snare/heal × STR
  "khora::Venari": {
    moveSpeedMultiplier: { scale: "strength" },
    snareDamage: { scale: "strength" },
    healthRegen: { scale: "strength" },
  },
  // wiki: Strangledome — Slash via ability.damage; grabRadius × RNG; 200% vuln Misc-fixed
  "khora::Strangledome": {
    grabRadius: { scale: "range" },
  },

  // wiki: Desiccation — True dmg/DPS via ability fields; 25% lifesteal Misc-fixed
  // wiki: Sandstorm — Slash DPS via ability; heal/enemy × STR
  "inaros::Sandstorm": {
    healthPerEnemy: { scale: "strength" },
  },
  // wiki: Scarab Shell — armor bonus × STR; health cost Misc-fixed
  "inaros::Scarab Shell": {
    armorBonus: { scale: "strength" },
  },
  // wiki: Scarab Swarm — % health as Corrosive Misc-fixed (scales with Inaros health, not STR)

  // wiki: Gloom — slow/lifesteal × STR (slow cap 95%); radii × RNG; range growth × DUR;
  // energyDrainPerEnemy × max((2−EFF)÷DUR, 0.25) (channeled; enemy cap Misc-fixed 10)
  "sevagoth::Gloom": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
    lifeStealPercent: { scale: "strength" },
    minRadius: { scale: "range" },
    maxRadius: { scale: "range" },
    rangeGrowthPerSecond: { scale: "duration" },
    energyDrainPerEnemy: { scale: "efficiency", formula: "channeled_drain" },
  },
  "helminth::Gloom": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
    lifeStealPercent: { scale: "strength" },
    minRadius: { scale: "range" },
    maxRadius: { scale: "range" },
    rangeGrowthPerSecond: { scale: "duration" },
    energyDrainPerEnemy: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Reservoirs — Vitality/Haste/Shock STR buffs; Shock range × RNG; mote lifespan via duration
  "wisp::Reservoirs": {
    vitalityHealth: { scale: "strength" },
    vitalityHealPerSecond: { scale: "strength" },
    hasteMoveSpeed: { scale: "strength" },
    hasteAttackSpeed: { scale: "strength" },
    hasteFireRate: { scale: "strength" },
    shockDamage: { scale: "strength" },
    shockRange: { scale: "range" },
  },
  // wiki: Breach Surge — spark damage multiplier scales STR; Rad SC × STR; seek range Misc-fixed
  "wisp::Breach Surge": {
    sparkDamageMultiplier: { scale: "strength" },
    radiationStatusChance: { scale: "strength" },
  },
  "helminth::Breach Surge": {
    sparkDamageMultiplier: { scale: "strength" },
    radiationStatusChance: { scale: "strength" },
  },
  // wiki: Sol Gate — beam DPS via damagePerSecond × STR; drain × max((2−EFF)÷DUR, 0.25); ramp/boost Misc
  "wisp::Sol Gate": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    boostedEnergyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Tail Wind — dash damage via ability.damage × STR; dive bomb × STR; contact/explosion radii × RNG;
  // hold-channel energyDrain × max((2−EFF)÷DUR, 0.25); airborne cast × EFF (cast_cost)
  "zephyr::Tail Wind": {
    diveBombDamage: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    airborneEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },
  // wiki: Airburst — +35% damage growth per enemy is Misc-fixed (not STR); explosion via ability.range;
  // airborne cast × EFF (cast_cost)
  "zephyr::Airburst": {
    airborneEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Tornado — tick damage × STR (DPS via damagePerSecond); count/height/pull Misc-fixed
  "zephyr::Tornado": {
    tickDamage: { scale: "strength" },
  },

  // wiki: Voruna — Shroud of Dynar
  // Strength → flat melee CD only; Duration → buff extension.
  // Move speed / status / +100% CC are Misc (ability-rank), not STR-scaled.
  "voruna::Shroud Of Dynar": {
    durationExtension: { scale: "duration" },
    critDamageBonus: { scale: "strength" },
  },
  // wiki: Voruna — Lycath's Hunt; Helminth orb chances reduced to 50%
  "voruna::Lycath's Hunt": {
    durationExtension: { scale: "duration" },
  },
  "helminth::Lycath's Hunt": {
    durationExtension: { scale: "duration" },
  },
  // Ulfrun's Descent: move speed / kill bonuses Misc — Slash dmg via ability.damage / DPS

  // wiki: Citrine — Fractured Blast (orb drop chances scale STR); Helminth 250/25%/10%
  "citrine::Fractured Blast": {
    healthOrbChance: { scale: "strength" },
    energyOrbChance: { scale: "strength" },
  },
  "helminth::Fractured Blast": {
    healthOrbChance: { scale: "strength" },
    energyOrbChance: { scale: "strength" },
  },
  // wiki: Citrine — Preserving Shell (per-kill/assist DR scales STR)
  "citrine::Preserving Shell": {
    drPerKill: { scale: "strength" },
    drPerAssist: { scale: "strength" },
    minDamageReduction: { scale: "strength" },
  },
  // wiki: Citrine — Prismatic Gem (status buffs scale STR/DUR; aurora is ability.radius × RNG;
  // placementDistance 5 m is Misc-fixed — intentionally omitted)
  "citrine::Prismatic Gem": {
    statusChanceBonus: { scale: "strength" },
    statusDurationBonus: { scale: "duration" },
  },

  // wiki: Immolation — initial DR × STR (cap 50%); panel heat slider lerps to max-heat DR
  "ember::Immolation": {
    initialDamageReduction: { scale: "strength", cap: 0.5 },
  },

  // wiki: Fire Blast — strip × STR with Immolation heat lerp (panel); energy 75→25 × EFF at heat
  "ember::Fire Blast": {
    armorStrip: { scale: "strength", cap: 1 },
    maxHeatEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },
  "helminth::Fire Blast": {
    armorStrip: { scale: "strength", cap: 1 },
  },
  // wiki: Fireball — impact/area via ability; Inferno meteor/ring via ability.damage / DPS
  // wiki: Inferno — 10 energy/enemy × EFF (cast_cost), capped at maxEnergyTargets (Misc-fixed)
  "ember::Inferno": {
    energyPerEnemy: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Ophanim Eyes — Heat/strip × STR; slow %/s is Misc (ability-rank); cone/ticks fixed
  "jade::Ophanim Eyes": {
    armorStripPerSecond: { scale: "strength" },
    shieldStripPerSecond: { scale: "strength" },
  },
  "helminth::Ophanim Eyes": {
    armorStripPerSecond: { scale: "strength" },
    shieldStripPerSecond: { scale: "strength" },
  },

  // wiki: Symphony of Mercy — Power of The Seven STR bonus × STR (cap 150%); shield regen × STR
  "jade::Symphony Of Mercy": {
    strengthBonus: { scale: "strength", cap: 1.5 },
    shieldRegen: { scale: "strength" },
    shieldRechargeDelayReduction: { scale: "strength", cap: 0.8 },
  },

  // wiki: Light's Judgment — heal %/s × STR; well count / Judgment vuln / tick are Misc-fixed
  "jade::Light's Judgment": {
    healthRegen: { scale: "strength" },
  },

  // wiki: Glory on High — alt explosion × RNG; Judgment chance / +100% move Misc-fixed;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25); alt-fire cast × EFF (cast_cost)
  "jade::Glory On High": {
    altFireExplosion: { scale: "range" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    altFireEnergy: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Thermal Sunder — radii × RNG; Cold/Heat damage use ability.damage / aoeDamage (× STR)
  "gauss::Thermal Sunder": {
    minRadius: { scale: "range" },
    maxRadius: { scale: "range" },
  },
  "helminth::Thermal Sunder": {
    minRadius: { scale: "range" },
    maxRadius: { scale: "range" },
    heatDamage: { scale: "strength" },
  },

  // wiki: Kinetic Plating — empty-battery DR floor × STR (cap 50%); full-battery DR is field
  "gauss::Kinetic Plating": {
    minDamageReduction: { scale: "strength", cap: 0.5 },
  },

  // wiki: Mach Rush — hold-channel energyDrain × max((2−EFF)÷DUR, 0.25)
  "gauss::Mach Rush": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },
  // wiki: Redline — speed buffs scale with Duration (battery-max values); projectile dmg × STR via damage
  "gauss::Redline": {
    fireRateBuff: { scale: "duration" },
    attackSpeedBuff: { scale: "duration" },
    reloadBuff: { scale: "duration" },
    castSpeedBuff: { scale: "duration" },
  },

  // wiki: Arcsphere — field DPS × STR; field radius × RNG; sphere cap / multi-hit mult Misc-fixed
  "gyre::Arcsphere": {
    fieldDamagePerSecond: { scale: "strength" },
    fieldRadius: { scale: "range" },
  },

  // wiki: Coil Horizon — contact DPS × STR; lifetimes Misc-fixed (implosion damage via ability.damage)
  "gyre::Coil Horizon": {
    contactDamagePerSecond: { scale: "strength" },
  },
  "helminth::Coil Horizon": {
    contactDamagePerSecond: { scale: "strength" },
  },

  // wiki: Cathode Grace — weapon/ability CC + energy regen × STR; kill extend / caps Misc-fixed
  "gyre::Cathode Grace": {
    criticalChanceBonus: { scale: "strength" },
    abilityCritChance: { scale: "strength" },
    energyRegen: { scale: "strength" },
  },

  // wiki: Rotorswell — discharge dmg × STR; discharge range × RNG; move mult / limits Misc-fixed
  "gyre::Rotorswell": {
    dischargeDamage: { scale: "strength" },
    dischargeRange: { scale: "range" },
  },

  // wiki: Grenade Fan — shield restore / SPS × STR; grenade counts / gate ext Misc-fixed (Slash DPS via damage)
  "protea::Grenade Fan": {
    shieldRestore: { scale: "strength" },
    shieldsPerSecond: { scale: "strength" },
  },

  // wiki: Blaze Artillery — splash × RNG; shots/arc/turret cap / +100% per hit Misc-fixed (shot dmg via damage)
  "protea::Blaze Artillery": {
    splashRadius: { scale: "range" },
  },

  // wiki: Dispensary — extra pickup chance × STR; spawn interval / orb HP / cache cap Misc-fixed
  "protea::Dispensary": {
    extraPickupChance: { scale: "strength" },
  },
  "helminth::Dispensary": {
    extraPickupChance: { scale: "strength" },
  },

  // wiki: Temporal Anchor — recorded damage conversion × STR; invuln / rewind / lethal heal Misc-fixed
  "protea::Temporal Anchor": {
    damageConversion: { scale: "strength" },
  },

  // wiki: Noctua — alt-fire dmg × STR; fragment seek distance × RNG; energy/shot × EFF; fragment count / angle Misc-fixed
  "dante::Noctua": {
    altFireDamage: { scale: "strength" },
    seekDistance: { scale: "range" },
    energyPerShot: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Light Verse — Overguard gain/cap + heal% × STR; invuln Misc-fixed
  "dante::Light Verse": {
    overguardGain: { scale: "strength" },
    overguardCap: { scale: "strength" },
    healthHealPercent: { scale: "strength" },
  },

  // wiki: Final Verse — Triumph OG / Tragedy detonate / Pageflight dmg+vuln × STR; Wordwarden copy% × STR; vuln dur × DUR
  "dante::Final Verse": {
    overguardGain: { scale: "strength" },
    overguardCap: { scale: "strength" },
    overguardRegenPerSecond: { scale: "strength" },
    statusDetonationMultiplier: { scale: "strength" },
    damageCopied: { scale: "strength" },
    pageflightDamage: { scale: "strength" },
    statusChanceVulnerability: { scale: "strength" },
    statusDamageIncrease: { scale: "strength" },
    statusVulnerabilityDuration: { scale: "duration" },
    paragrimmAttackRange: { scale: "range" },
  },

  // wiki: Chyrinka Pillar — pulse dmg via ability.damage; slow / intervals / pillar caps Misc-fixed
  "qorvex::Chyrinka Pillar": {
    empoweredDuration: { scale: "duration" },
  },
  "helminth::Chyrinka Pillar": {
    empoweredDuration: { scale: "duration" },
  },

  // wiki: Containment Wall — tick Radiation + vulnerability × STR; assembly Misc-fixed (smash via damage)
  "qorvex::Containment Wall": {
    radiationDamagePerTick: { scale: "strength" },
    damageVulnerability: { scale: "strength" },
  },

  // wiki: Disometric Guard — cast explosion via damage; initial/max stacks × STR; cast radius / chance Misc-fixed
  "qorvex::Disometric Guard": {
    initialStatusStacks: { scale: "strength" },
    maxStatusStacks: { scale: "strength" },
  },

  // wiki: Crucible Blast — beam DPS via damage; explosion base/per-status × STR; beam cylinder Misc-fixed
  "qorvex::Crucible Blast": {
    explosionDamage: { scale: "strength" },
    explosionDamagePerStatus: { scale: "strength" },
  },

  // wiki: Ophidian Bite — heal conversion × STR; cone Misc-fixed (Toxin dmg via damage)
  "lavos::Ophidian Bite": {
    healthConversion: { scale: "strength" },
  },

  // wiki: Vial Rush — vial count × RNG; residue radius / charge speed Misc-fixed (DPS via damage, residue via duration)
  "lavos::Vial Rush": {
    vialCharges: { scale: "range" },
  },
  "helminth::Vial Rush": {
    vialCharges: { scale: "range" },
  },

  // wiki: Transmutation Probe — CDR per enemy × EFF; probe lifetime / speed / halt Misc-fixed
  "lavos::Transmutation Probe": {
    cooldownReduction: { scale: "efficiency" },
  },

  // wiki: Catalyze — probe speed × RNG; gel mist / probe count / +100% per status Misc-fixed
  "lavos::Catalyze": {
    probeSpeed: { scale: "range" },
  },

  // wiki: Wrathful Advance — flat final melee CC × STR; 1s CD Misc-fixed
  "kullervo::Wrathful Advance": {
    criticalChanceBonus: { scale: "strength" },
  },
  "helminth::Wrathful Advance": {
    criticalChanceBonus: { scale: "strength" },
  },

  // wiki: Recompense — heal/OG per hit + miss drain × STR; dagger counts / airtime Misc-fixed (dmg via damage)
  "kullervo::Recompense": {
    healthPerHit: { scale: "strength" },
    missDrain: { scale: "strength" },
    overguardCap: { scale: "strength" },
  },

  // wiki: Collective Curse — damage redirection × STR (cap 100%); cone Misc-fixed
  "kullervo::Collective Curse": {
    damageRedirection: { scale: "strength", cap: 1 },
  },

  // wiki: Storm of Ukko — Slash DPS via ability.damage; storm limit / tick rate Misc-fixed

  // wiki: Reap — damage vulnerability × STR; debuff duration × DUR; Death Well / radial Misc-fixed
  "sevagoth::Reap": {
    damageVulnerability: { scale: "strength" },
    debuffDuration: { scale: "duration" },
  },

  // wiki: Sow — True DPS via damage; Death Well / radial Misc-fixed
  // wiki: Exalted Shadow — Death Well threshold/drain / invuln Misc-fixed (claw dmg via damage)

  // wiki: Wyrd Scythes — slow × STR (cap 95%); throw dmg × STR; sickle counts Misc-fixed
  "dagath::Wyrd Scythes": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
    throwDamage: { scale: "strength" },
  },
  "helminth::Wyrd Scythes": {
    slowPercent: { scale: "strength", useSiblingSlowCap: true },
    throwDamage: { scale: "strength" },
  },

  // wiki: Doom — Viral via damage; Phantom Wrath 35% / cone Misc-fixed

  // wiki: Grave Spirit — CD bonus × STR (Doom doubled); invuln time via duration; CD Misc-fixed
  "dagath::Grave Spirit": {
    critDamageBonus: { scale: "strength" },
    doomCritDamageBonus: { scale: "strength" },
  },

  // wiki: Rakhali's Cavalry — Viral via damage; Doom strip × STR; Kaithe counts Misc-fixed
  "dagath::Rakhali's Cavalry": {
    defenseReduction: { scale: "strength" },
  },

  // wiki: Razor Gyre — Tau DPS via damage; Wrath-raised DPS + heal × STR; dash Misc-fixed
  "caliban::Razor Gyre": {
    wrathDamagePerSecond: { scale: "strength" },
    healthPerHit: { scale: "strength" },
  },

  // wiki: Sentient Wrath — Tau via damage; vulnerability × STR
  "caliban::Sentient Wrath": {
    damageVulnerability: { scale: "strength" },
  },
  "helminth::Sentient Wrath": {
    damageVulnerability: { scale: "strength" },
  },

  // wiki: Lethal Progeny — shield restore / dmg & health mult × STR; summon caps Misc-fixed
  "caliban::Lethal Progeny": {
    shieldRestorePerSecond: { scale: "strength" },
    damageMultiplier: { scale: "strength" },
    healthMultiplier: { scale: "strength" },
  },

  // wiki: Fusion Strike — laser via damage; detonation/explosion × STR; strip × STR (cap 100%)
  "caliban::Fusion Strike": {
    detonationDamage: { scale: "strength" },
    explosionDamage: { scale: "strength" },
    armorStrip: { scale: "strength", cap: 1 },
    shieldStrip: { scale: "strength", cap: 1 },
  },

  // wiki: Elude — evasion angle × RNG; restraint Misc-fixed;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "baruuk::Elude": {
    evasionAngle: { scale: "range" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Lull — sleep via duration; wave duration × DUR; range via ability.range
  "baruuk::Lull": {
    waveDuration: { scale: "duration" },
  },
  "helminth::Lull": {
    waveDuration: { scale: "duration" },
  },

  // wiki: Desolate Hands — Blast via damage; dagger charges × STR; DR/dagger Misc-fixed
  "baruuk::Desolate Hands": {
    daggerCharges: { scale: "strength" },
  },

  // wiki: Condemn — shields per enemy × STR; wave width Misc-fixed
  "harrow::Condemn": {
    shieldsPerEnemy: { scale: "strength" },
  },
  "helminth::Condemn": {
    shieldsPerEnemy: { scale: "strength" },
  },

  // wiki: Penance — heal / lifesteal / FR / reload × STR; shield duration Misc-fixed
  "harrow::Penance": {
    initialHealPercent: { scale: "strength" },
    lifeStealPercent: { scale: "strength" },
    fireRateBuff: { scale: "strength" },
    reloadBuff: { scale: "strength" },
  },

  // wiki: Thurible — energyConvert shown × STR; EPK panel uses
  // 1+[channel×convert÷(2−EFF)]×STR (HS × headshotMultiplier Misc-fixed)
  "harrow::Thurible": {
    energyConvert: { scale: "strength" },
  },

  // wiki: Covenant — base CC + CC/100 dmg × STR; Retaliation panel:
  // CC=(base+(absorbed÷100)×per100)×STR; body min 50%, HS min 200% (×4); crit window × DUR
  "harrow::Covenant": {
    baseCriticalChance: { scale: "strength" },
    critChancePer100Damage: { scale: "strength" },
    critChanceDuration: { scale: "duration" },
  },

  // wiki: Dread Mirror — damage capture mult × STR; thresholds / contact Misc-fixed
  "garuda::Dread Mirror": {
    damageCaptureMultiplier: { scale: "strength" },
  },

  // wiki: Blood Altar — heal%/s × STR; DPS / altar cap Misc-fixed
  "garuda::Blood Altar": {
    healthPerSecond: { scale: "strength" },
  },
  "helminth::Blood Altar": {
    healthPerSecond: { scale: "strength" },
  },

  // wiki: Bloodletting — energy gain % × EFF; health deduct / min HP Misc-fixed
  "garuda::Bloodletting": {
    energyGainPercent: { scale: "efficiency" },
  },

  // wiki: Seeking Talons — Slash via damage; mark Slash SC × STR (cap 100%); charge Misc-fixed
  "garuda::Seeking Talons": {
    slashStatusChance: { scale: "strength", cap: 1 },
  },

  // wiki: Fire Walker — Heat DPS via damage; explosion × STR; flame duration × DUR; speed/SC Misc-fixed
  "nezha::Fire Walker": {
    explosionDamage: { scale: "strength" },
    flameDuration: { scale: "duration" },
  },
  "helminth::Fire Walker": {
    explosionDamage: { scale: "strength" },
    flameDuration: { scale: "duration" },
  },

  // wiki: Blazing Chakram — Heat via damage; boosted dmg + vulnerability × STR; orb chances Misc-fixed
  "nezha::Blazing Chakram": {
    boostedDamage: { scale: "strength" },
    damageVulnerability: { scale: "strength" },
  },

  // wiki: Warding Halo — Slash DPS via damage; haloHealth / armor / absorb mults Misc-fixed;
  // Initial Health = (base + armorMult × totalArmor) × STR (+ absorbed×absorbMult×STR via cast invuln)
  // wiki: invuln Misc-fixed

  // wiki: Divine Spears — Puncture via damage; slam Impact × STR
  "nezha::Divine Spears": {
    slamDamage: { scale: "strength" },
  },

  // wiki: Soul Punch — Impact via damage; mark / projectile / explosion Misc-fixed

  // wiki: Desecrate — drop chances Misc-fixed (rank); range via ability.range;
  // energy per corpse × EFF (cast_cost)
  "nekros::Desecrate": {
    energyPerCorpse: { scale: "efficiency", formula: "cast_cost" },
  },
  // wiki: Shadows of the Dead — damage/shield/health bonuses × STR; health decay ÷ DUR
  "nekros::Shadows Of The Dead": {
    damageBonus: { scale: "strength" },
    shieldBonus: { scale: "strength" },
    healthBonus: { scale: "strength" },
    healthDecayPerSecond: { scale: "duration", inverse: true },
  },

  // wiki: Tempest Barrage — Corrosive via damage; barrage radius / salvos Misc-fixed

  // wiki: Plunder — armor / Corrosive bonus per enemy × STR (caps Misc)
  "hydroid::Plunder": {
    armorPerEnemy: { scale: "strength" },
    armorPerCorrosiveStatus: { scale: "strength" },
    corrosiveBonusPerEnemy: { scale: "strength" },
    corrosiveBonusPerStatus: { scale: "strength" },
  },

  // wiki: Tentacle Swarm — Corrosive DPS via damage; tentacle count Misc-fixed; spawn radius Misc-fixed
  "hydroid::Tentacle Swarm": {
    overguardContactDamage: { scale: "strength" },
  },

  // wiki: Banish — Impact via damage; transitional / Rift regen Misc-fixed
  // wiki: Stasis — duration via ability.duration; gunfire limit Misc-fixed

  // wiki: Rift Surge — banish duration × DUR (surge duration via ability.duration)
  "limbo::Rift Surge": {
    banishDuration: { scale: "duration" },
  },

  // wiki: Cataclysm — Blast via damage; final radius × RNG (initial via ability.range)
  "limbo::Cataclysm": {
    finalRadius: { scale: "range" },
  },

  // wiki: Decoy — health/shield absorb × STR; base decoy HP/SP Misc-fixed
  "loki::Decoy": {
    healthShieldAbsorb: { scale: "strength" },
  },
  "helminth::Decoy": {
    healthShieldAbsorb: { scale: "strength" },
  },

  // wiki: Switch Teleport — move speed buff × STR
  "loki::Switch Teleport": {
    speedBuff: { scale: "strength" },
  },

  // wiki: Radial Disarm — Impact via damage; disarm Misc-fixed
  // wiki: Invisibility — duration via ability.duration

  // wiki: Magnetize — Blast via damage; dmg mult / magnetic pull / absorption × STR
  "mag::Magnetize": {
    damageMultiplier: { scale: "strength" },
    magneticPull: { scale: "strength" },
    damageAbsorption: { scale: "strength" },
  },

  // wiki: Polarize — True/shield via damage; explosion mult × STR; shard dmg Misc-fixed
  "mag::Polarize": {
    explosionDamageMultiplier: { scale: "strength" },
  },

  // wiki: Crush — Magnetic via damage; Magnetize extra + shields/hit × STR (cap Misc)
  "mag::Crush": {
    magnetizeExtraDamage: { scale: "strength" },
    shieldsPerHit: { scale: "strength" },
  },

  // wiki: Freeze — Cold via damage; area Cold × STR; freeze via ability.duration
  "frost::Freeze": {
    areaDamage: { scale: "strength" },
  },

  // wiki: Ice Wave — Cold via damage; angle × RNG (cap 60°); initial width × RNG; length via ability.range
  "frost::Ice Wave": {
    waveAngle: { scale: "range", cap: 60 },
    initialWidth: { scale: "range" },
  },
  "helminth::Ice Wave": {
    waveAngle: { scale: "range", cap: 60 },
    initialWidth: { scale: "range" },
  },

  // wiki: Snow Globe — base HP via ability.health×STR; break dmg × STR; armor mult Misc-fixed (outer STR in formula)
  "frost::Snow Globe": {
    breakDamage: { scale: "strength" },
  },

  // wiki: Avalanche — Cold via damage; shatter dmg × STR; shatter radius × RNG; armor strip × STR
  "frost::Avalanche": {
    shatterDamage: { scale: "strength" },
    shatterRadius: { scale: "range" },
    armorStrip: { scale: "strength", cap: 1 },
  },

  // wiki: Shattered Lash — Puncture/Slash via damage; sweep arc / blade radius Misc-fixed

  // wiki: Splinter Storm — DPS via damage; vulnerability × STR; absorbed % Misc-fixed; DR via field
  "gara::Splinter Storm": {
    damageVulnerability: { scale: "strength" },
  },

  // wiki: Spectrorage — mirror dmg via damage; collapse × STR; mirrors/threshold/charm × RNG
  "gara::Spectrorage": {
    collapseDamage: { scale: "strength" },
    mirrorCount: { scale: "range" },
    collapseThreshold: { scale: "range" },
    charmRadius: { scale: "range" },
  },
  "helminth::Spectrorage": {
    collapseDamage: { scale: "strength" },
    mirrorCount: { scale: "range" },
    collapseThreshold: { scale: "range" },
    charmRadius: { scale: "range" },
  },

  // wiki: Mass Vitrify — explosion via damage; vuln × STR; segmentHealth / armorMult Misc-fixed;
  // Initial = (base + mult × totalArmor) × STR; +enemies × max((320+5×armor)×STR, enemyEHP/10);
  // expansion × DUR; explosion range × RNG; channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "gara::Mass Vitrify": {
    damageVulnerability: { scale: "strength" },
    expansionTime: { scale: "duration" },
    explosionRange: { scale: "range" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Metamorphosis — Night armor/shields + Day dmg/speed × STR;
  // panel: linear decay to 0 over duration×DUR (computeMetamorphosisBonusAtTime)
  "equinox::Metamorphosis": {
    nightArmor: { scale: "strength" },
    nightShields: { scale: "strength" },
    dayDamageBonus: { scale: "strength" },
    daySpeedBonus: { scale: "strength" },
  },

  // wiki: Rest & Rage — Rage vuln/speed × STR; Rest wakeup threshold Misc-fixed; sleep via duration
  "equinox::Rest & Rage": {
    damageVulnerability: { scale: "strength" },
    enemySpeedBonus: { scale: "strength" },
  },
  "helminth::Rest & Rage": {
    damageVulnerability: { scale: "strength" },
    enemySpeedBonus: { scale: "strength" },
  },

  // wiki: Pacify & Provoke — Provoke STR bonus × STR (cap 50%); Pacify DR = 1−(base÷STR);
  // Pacify energyDrainPerEnemy × max((2−EFF)÷DUR, 0.25); Provoke energyPerAbility × EFF
  "equinox::Pacify & Provoke": {
    abilityStrengthBonus: { scale: "strength", cap: 0.5 },
    pacifyDamageReduction: { scale: "strength", formula: "one_minus_base_over_attr" },
    energyDrainPerEnemy: { scale: "efficiency", formula: "channeled_drain" },
    energyPerAbility: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Mend & Maim — Slash aura via damage; shields/kill × STR; conversion % Misc-fixed;
  // channeled energyDrain 3.5/s × max((2−EFF)÷DUR, 0.25)
  "equinox::Mend & Maim": {
    shieldsPerKill: { scale: "strength" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Quiver — Cloak/Sleep durations via ability/misc; radii × RNG; Helminth Cloak+Noise only
  "ivara::Quiver": {
    noiseRadius: { scale: "range" },
    sleepRadius: { scale: "range" },
    sleepDuration: { scale: "duration" },
  },
  "helminth::Quiver": {
    noiseRadius: { scale: "range" },
  },

  // wiki: Navigator — max dmg mult × STR; multiplier growth ÷ DUR;
  // channeled energyDrain / energyDrainGrowth × max((2−EFF)÷DUR, 0.25)
  "ivara::Navigator": {
    maxDamageMultiplier: { scale: "strength" },
    multiplierGrowth: { scale: "duration", inverse: true },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    energyDrainGrowth: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Prowl — headshot bonus / loot chance × STR; steal time ÷ DUR;
  // channeled energyDrain / energyDrainMoving × max((2−EFF)÷DUR, 0.25);
  // melee / damage energy costs × EFF (cast_cost)
  "ivara::Prowl": {
    headshotBonus: { scale: "strength" },
    lootChance: { scale: "strength", cap: 1 },
    stealTime: { scale: "duration", inverse: true },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    energyDrainMoving: { scale: "efficiency", formula: "channeled_drain" },
    meleeEnergyCost: { scale: "efficiency", formula: "cast_cost" },
    damageEnergyCost: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Artemis Bow — Puncture-heavy via damage; energy/shot × EFF (cast_cost); arrow count Misc-fixed
  "ivara::Artemis Bow": {
    energyPerShot: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Shuriken — Slash via damage; count / auto-target / angle Misc-fixed
  // wiki: Smoke Screen — duration via ability.duration; stagger radius via ability.range

  // wiki: Teleport — finisher damage bonus × STR; energy refund Misc-fixed
  "ash::Teleport": {
    finisherDamageBonus: { scale: "strength" },
  },

  // wiki: Blade Storm — True via damage; clones Misc-fixed; energyPerMark × EFF (cast_cost)
  "ash::Blade Storm": {
    energyPerMark: { scale: "efficiency", formula: "cast_cost" },
  },

  // wiki: Landslide — Impact via damage; hit radii × RNG; combo window Misc-fixed
  "atlas::Landslide": {
    hit2Radius: { scale: "range" },
    hit3Radius: { scale: "range" },
  },

  // wiki: Tectonics — Puncture explosion via damage; roll Impact × STR; armor mult Misc-fixed (outer STR on health)
  "atlas::Tectonics": {
    rollDamage: { scale: "strength" },
  },

  // wiki: Petrify — vuln Misc-fixed (+50%); Rumbler heal × STR; FOV Misc-fixed
  "atlas::Petrify": {
    rumblerHeal: { scale: "strength" },
  },
  "helminth::Petrify": {
    rumblerHeal: { scale: "strength" },
  },

  // wiki: Rumblers — melee Impact via damage; rock/blast × STR; speed mult × RNG (0.5–1.5); stone duration Misc
  "atlas::Rumblers": {
    rockDamage: { scale: "strength" },
    blastDamage: { scale: "strength" },
    speedMultiplier: { scale: "range", cap: 1.5 },
  },

  // wiki: Sonic Boom — Impact via damage; 180° cone Misc-fixed
  // wiki: Sonar — weak-spot mult × STR; propagation Misc-fixed
  "banshee::Sonar": {
    damageMultiplier: { scale: "strength" },
  },

  // wiki: Silence — stun Misc-fixed; aura via ability.range/duration
  // wiki: Sound Quake — Blast DPS via damage; channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "banshee::Sound Quake": {
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Enthrall — pillar DPS via damage; projectile / pillar radius × STR/RNG; thrall duration via ability.duration
  "revenant::Enthrall": {
    projectileDamage: { scale: "strength" },
    pillarRadius: { scale: "range" },
    pillarDuration: { scale: "duration" },
  },

  // wiki: Mesmer Skin — charges × STR; stun × DUR
  "revenant::Mesmer Skin": {
    charges: { scale: "strength" },
    stunDuration: { scale: "duration" },
  },

  // wiki: Reave — drain % × STR; thrall drain × STR; width via ability.range; duration via ability.duration
  "revenant::Reave": {
    hitpointsDrain: { scale: "strength" },
    thrallHitpointsDrain: { scale: "strength" },
  },
  "helminth::Reave": {
    hitpointsDrain: { scale: "strength" },
  },

  // wiki: Danse Macabre — DPS via damage; boosted DPS × STR; beam radii × RNG;
  // channeled energyDrain / boostedEnergyDrain × max((2−EFF)÷DUR, 0.25)
  "revenant::Danse Macabre": {
    boostedDamage: { scale: "strength" },
    beamRadius: { scale: "range" },
    boostedBeamRadius: { scale: "range" },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
    boostedEnergyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Smite — Radiation via damage; % current HP × STR (cap 75% native / 50% Helminth)
  "oberon::Smite": {
    percentageDamage: { scale: "strength", cap: 0.75 },
    aoePercentageDamage: { scale: "strength", cap: 0.3 },
  },
  "helminth::Smite": {
    percentageDamage: { scale: "strength", cap: 0.5 },
    aoePercentageDamage: { scale: "strength", cap: 0.2 },
  },

  // wiki: Hallowed Ground — Radiation tick via damage; tick interval / ground cap Misc-fixed

  // wiki: Renewal — armor / heal / HPS × STR; bleedout slow × DUR;
  // channeled energyDrain × max((2−EFF)÷DUR, 0.25)
  "oberon::Renewal": {
    armorBuff: { scale: "strength", cap: 1 },
    initialHeal: { scale: "strength" },
    healthPerSecond: { scale: "strength" },
    bleedoutSlow: { scale: "duration", cap: 0.9 },
    energyDrain: { scale: "efficiency", formula: "channeled_drain" },
  },

  // wiki: Reckoning — Radiation via damage; armor strip / Rad bonus / armor per enemy × STR; orb chance Misc
  "oberon::Reckoning": {
    armorStrip: { scale: "strength", cap: 1 },
    radiationBonusDamage: { scale: "strength" },
    bonusArmorPerEnemy: { scale: "strength" },
    bonusArmorPerRadiation: { scale: "strength" },
  },

  // wiki: Mallet — absorbed-damage mult × STR
  "octavia::Mallet": {
    damageMultiplier: { scale: "strength" },
  },

  // wiki: Resonator — Blast loop total via damage; max charm radius × RNG
  "octavia::Resonator": {
    maxCharmRadius: { scale: "range" },
  },
  "helminth::Resonator": {
    maxCharmRadius: { scale: "range" },
  },

  // wiki: Metronome — armor/speed/MS/melee buffs × STR; sync buff duration × DUR
  "octavia::Metronome": {
    armorBonus: { scale: "strength" },
    speedBonus: { scale: "strength" },
    multishotBonus: { scale: "strength" },
    meleeDamageBonus: { scale: "strength" },
    buffDuration: { scale: "duration" },
  },

  // wiki: Amp — max damage buff × STR; mallet range bonus Misc-fixed (min via field)
  "octavia::Amp": {
    maxDamageBuff: { scale: "strength" },
  },

  // wiki: Well of Life — HPS / lifesteal × STR; healing radius × RNG; revive CD Misc (Helminth 120s)
  "trinity::Well Of Life": {
    healthPerSecond: { scale: "strength" },
    lifesteal: { scale: "strength" },
    healingRadius: { scale: "range" },
  },
  "helminth::Well of Life": {
    healthPerSecond: { scale: "strength" },
    lifesteal: { scale: "strength" },
    healingRadius: { scale: "range" },
  },

  // wiki: Energy Vampire — energy/pulse × STR; pulse radius × RNG; interval ÷ DUR (floor 0.5s)
  "trinity::Energy Vampire": {
    energyPerPulse: { scale: "strength" },
    pulseRadius: { scale: "range" },
    pulseInterval: { scale: "duration", inverse: true, floor: 0.5 },
  },

  // wiki: Link — affected enemies × STR; damage redirection Misc-fixed (rank)
  "trinity::Link": {
    affectedEnemies: { scale: "strength" },
  },

  // wiki: Blessing — restore % × STR; DR via field (cap 75%)
  "trinity::Blessing": {
    healthShieldRestore: { scale: "strength" },
  },

  // wiki: Null Star — Blast via damage (in-game base 200); particles × DUR; DR/particle × STR
  "nova::Null Star": {
    particles: { scale: "duration" },
    damageReductionPerParticle: { scale: "strength" },
  },
  "helminth::Null Star": {
    particles: { scale: "duration" },
    damageReductionPerParticle: { scale: "strength" },
  },

  // wiki: Antimatter Drop — Blast base via damage; absorb mult × STR
  "nova::Antimatter Drop": {
    absorbMultiplier: { scale: "strength" },
  },

  // wiki: Wormhole — max portals Misc-fixed (rank); range via ability.range

  // wiki: Molecular Prime — Blast via damage; slow/speed × STR (cap 75%); wave duration × DUR; vuln Misc
  "nova::Molecular Prime": {
    slow: { scale: "strength", cap: 0.75 },
    waveDuration: { scale: "duration" },
  },
};

/** Top-level ability field scaling (damageReduction, damageBuff on the Ability object). */
const VERIFIED_FIELD_SCALING: Record<string, VerifiedAbilityFields> = {
  // wiki: Self Portrait — DR grows with kills; max 50%×STR, hard cap 90% (Helminth 75%)
  "follie::Self Portrait": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  "helminth::Self Portrait": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Light's Sanctuary — max DR 45%×STR, hard cap 75%
  "sirius_orion::Light's Sanctuary": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Eclipse — DR cap 90% (native Mirage); weapon buff scales STR
  "mirage::Eclipse": {
    damageReduction: { scale: "strength", cap: 0.9 },
    damageBuff: { scale: "strength" },
  },
  // wiki: Subsumed Eclipse — DR cap 75%, reduced damage bonus; still scales STR
  "helminth::Eclipse": {
    damageReduction: { scale: "strength", cap: 0.75 },
    damageBuff: { scale: "strength" },
  },
  // Legacy key: Helminth Eclipse placed on Gara (pre-helminth:: namespace)
  "gara::Eclipse": {
    damageReduction: { scale: "strength", cap: 0.75 },
    damageBuff: { scale: "strength" },
  },
  // wiki: Splinter Storm — DR 70%×STR, hard cap 90%
  "gara::Splinter Storm": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Roar — weapon damage bonus scales STR
  "rhino::Roar": {
    damageBuff: { scale: "strength" },
  },
  "helminth::Roar": {
    damageBuff: { scale: "strength" },
  },
  // wiki: Amp — min damage buff × STR (max via misc)
  "octavia::Amp": {
    damageBuff: { scale: "strength" },
  },
  // wiki: Blessing — DR 50%×STR, hard cap 75%
  "trinity::Blessing": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Shooting Gallery — ally weapon damage scales STR (additive with Serration)
  "mesa::Shooting Gallery": {
    damageBuff: { scale: "strength" },
  },
  "helminth::Shooting Gallery": {
    damageBuff: { scale: "strength" },
  },
  // wiki: Shatter Shield — DR cap 95%
  "mesa::Shatter Shield": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Parasitic Link — weapon buff and enemy damage redirection scale STR
  "nidus::Parasitic Link": {
    damageBuff: { scale: "strength" },
    damageReduction: { scale: "strength", cap: 1 },
  },
  // wiki: Preserving Shell — initial DR scales STR; cap 90%
  "citrine::Preserving Shell": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Immolation — max-heat DR base 85% × STR, hard cap 90% (initial DR is miscStats)
  "ember::Immolation": {
    damageReduction: { scale: "strength", cap: 0.9 },
  },
  // wiki: Symphony of Mercy — Deathbringer weapon damage × STR (additive with Serration)
  "jade::Symphony Of Mercy": {
    damageBuff: { scale: "strength" },
  },
  // wiki: Glory on High — flight DR base 35% × STR, hard cap 50%
  "jade::Glory On High": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Kinetic Plating — full-battery DR base 100% × STR, hard cap 100%
  "gauss::Kinetic Plating": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
  // wiki: Serene Storm — DR base 25% × STR, hard cap 40%
  "baruuk::Serene Storm": {
    damageReduction: { scale: "strength", useSiblingDrCap: true },
  },
};

export function resolveAbilityScalingKey(
  warframeId: string | undefined,
  abilityName: string,
  helminth?: boolean,
): string | null {
  if (helminth) return `helminth::${abilityName}`;
  if (!warframeId) return null;
  return abilityKey(warframeId, abilityName);
}

export function getVerifiedMiscScaling(
  warframeId: string | undefined,
  abilityName: string,
  statKey: string,
  helminth?: boolean,
): VerifiedStatScaling | null {
  const key = resolveAbilityScalingKey(warframeId, abilityName, helminth);
  if (!key) return null;
  return VERIFIED_MISC_SCALING[key]?.[statKey] ?? null;
}

export function getVerifiedFieldScaling(
  warframeId: string | undefined,
  abilityName: string,
  field: keyof VerifiedAbilityFields,
): VerifiedStatScaling | null {
  if (!warframeId) return null;
  const key = abilityKey(warframeId, abilityName);
  return VERIFIED_FIELD_SCALING[key]?.[field] ?? null;
}

/** Whether this ability has any verified misc-stat scaling entries. */
export function abilityHasVerifiedMiscScaling(
  warframeId: string | undefined,
  abilityName: string,
  helminth?: boolean,
): boolean {
  const key = resolveAbilityScalingKey(warframeId, abilityName, helminth);
  if (!key) return false;
  const table = VERIFIED_MISC_SCALING[key];
  return table != null && Object.keys(table).length > 0;
}
