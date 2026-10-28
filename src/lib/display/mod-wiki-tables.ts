/**
 * Display-only wiki rank tables and hidden pseudo-stats for the mod cards (Round 21 sweep).
 *
 * Why: many catalog mods store a pseudo-stat as its max-rank value (or a stray key that is not a
 * wiki stat), so the card showed perRank x (rank + 1) = e.g. "+400 Loot Pull", "+6000 Armor Cap".
 * Each table below is the Rank column of the mod's stat table on wiki.warframe.com (index = rank);
 * stats in PANEL_ONLY_MOD_STATS have no wiki stat of that name (duplicates of another row, a
 * different mechanic under the wrong label) and are not shown on cards. Both only affect text:
 * the calculator and the behavior registry never read them (those lines are mod_panel / pending).
 *
 * Generated from the wiki pages (fetched 2026-10-27) by dev-review/gen_tables.py; edit by hand
 * only with a wiki source. A modId+key that is also in MOD_RANK_VALUE_TABLES (mod-display.ts) keeps
 * the older entry.
 */
export type WikiTableUnit = "%" | "s" | "m" | "/s" | "";

export interface WikiRankTable {
  unit: WikiTableUnit;
  /** Value at each rank (index = rank). */
  values: readonly number[];
}

export const MOD_WIKI_RANK_TABLES: Record<string, Record<string, WikiRankTable>> = {
  afterburner: {
    igniteDuration: { unit: "s", values: [6, 8, 10, 12] },
    heatDamage: { unit: "", values: [200, 300, 400, 500] },
  },
  anti_grav_array: {
    gravityReduction: { unit: "%", values: [10, 20, 30, 40] },
  },
  augment_ash_rising_storm: {
    bladeStormCombo: { unit: "", values: [1, 2, 3, 4] },
    duration: { unit: "s", values: [10, 10, 10, 10] },
  },
  augment_ash_safeguard_switch: {
    invulnerabilityDuration: { unit: "s", values: [3, 4, 5, 6] },
    duration: { unit: "s", values: [1.5, 2, 2.5, 3] },
  },
  augment_ash_seeking_shuriken: {
    armorReduction: { unit: "%", values: [35, 45, 55, 70] },
    duration: { unit: "s", values: [2, 4, 6, 8] },
  },
  augment_ash_smoke_shadow: {
    criticalChance: { unit: "%", values: [60, 90, 120, 150] },
    range: { unit: "m", values: [8, 10, 12, 15] },
  },
  augment_atlas_ore_gaze: {
    oreChance: { unit: "%", values: [10, 15, 20, 25] },
  },
  augment_atlas_path_of_statues: {
    petrifyTrail: { unit: "s", values: [7, 8, 10, 12] },
    duration: { unit: "s", values: [4, 5, 5, 6] },
  },
  augment_atlas_tectonic_fracture: {
    extraWalls: { unit: "", values: [2, 2, 3, 3] },
    health: { unit: "%", values: [70, 80, 90, 100] },
  },
  augment_banshee_resonance: {
    markDuration: { unit: "%", values: [50, 65, 80, 100] },
  },
  augment_banshee_silence_savage: {
    finisherDamage: { unit: "%", values: [150, 200, 250, 300] },
  },
  augment_banshee_sonic_fracture: {
    armorDuration: { unit: "s", values: [12, 15, 18, 20] },
    armorCap: { unit: "", values: [1500, 1500, 1500, 1500] },
  },
  augment_baruuk_elusive_retribution: {
    duration: { unit: "s", values: [6, 6, 6, 6] },
  },
  augment_baruuk_reactive_storm: {
    statusChance: { unit: "%", values: [100, 150, 200, 250] },
  },
  augment_chroma_afterburn: {
    totalDamageCap: { unit: "", values: [200, 300, 400, 500] },
  },
  augment_chroma_everlasting_ward: {
    allyDuration: { unit: "%", values: [50, 65, 80, 100] },
  },
  augment_chroma_vexing_retaliation: {
    range: { unit: "m", values: [4, 5, 7, 9] },
  },
  augment_ember_exothermic: {
    energyOrbChance: { unit: "%", values: [5, 7.5, 10, 15] },
  },
  augment_ember_fireball_frenzy: {
    allyCast: { unit: "%", values: [50, 65, 80, 100] },
    range: { unit: "m", values: [15, 15, 15, 15] },
    duration: { unit: "s", values: [28, 32, 36, 40] },
  },
  augment_equinox_duality: {
    specterDuration: { unit: "s", values: [7, 8, 9, 10] },
    damage: { unit: "%", values: [100, 150, 200, 300] },
  },
  augment_equinox_energy_transfer: {
    energyOnBurst: { unit: "%", values: [50, 65, 80, 100] },
  },
  augment_excalibur_chromatic_blade: {
    statusChance: { unit: "%", values: [100, 200, 250, 300] },
  },
  augment_excalibur_furious_javelin: {
    meleeDamagePerEnemy: { unit: "%", values: [8, 10, 12, 15] },
    duration: { unit: "s", values: [9, 11, 13, 16] },
  },
  augment_frost_chilling_globe: {
    freezeChance: { unit: "%", values: [30, 35, 40, 50] },
    duration: { unit: "s", values: [10, 10, 10, 10] },
  },
  augment_frost_cold_front: {
    globeHealthPerKill: { unit: "%", values: [1, 2, 3, 4] },
  },
  augment_frost_freeze_force: {
    allyColdDamage: { unit: "%", values: [50, 65, 80, 100] },
    range: { unit: "m", values: [15, 15, 15, 15] },
    duration: { unit: "s", values: [28, 32, 36, 40] },
  },
  augment_frost_ice_wave_impedance: {
    duration: { unit: "s", values: [6, 8, 10, 12] },
  },
  augment_frost_icy_avalanche: {
    allyOverguard: { unit: "", values: [40, 45, 50, 60] },
  },
  augment_gara_mending_splinters: {
    healthRegen: { unit: "/s", values: [10, 11, 12.5, 15] },
  },
  augment_garuda_blending_talons: {
    range: { unit: "m", values: [6, 7, 8, 9] },
  },
  augment_gauss_mach_crash: {
    range: { unit: "m", values: [5, 6, 7, 8] },
  },
  augment_gauss_thermal_transfer: {
    damage: { unit: "%", values: [40, 50, 60, 75] },
    duration: { unit: "s", values: [18, 22, 26, 30] },
  },
  augment_grendel_gastroparesis: {
    gasDamagePerEnemy: { unit: "%", values: [6, 9, 12, 15] },
  },
  augment_grendel_gourmand: {
    armorPerHit: { unit: "", values: [75, 100, 125, 150] },
  },
  augment_grendel_hearty_nourishment: {
    duration: { unit: "s", values: [2, 3, 4, 5] },
  },
  augment_hildryn_pillage_aug: {
    heatDamage: { unit: "", values: [50, 100, 150, 200] },
  },
  augment_hydroid_curative_undertow: {
    healOnDrown: { unit: "%", values: [15, 20, 25, 30] },
  },
  augment_hydroid_pilfering_swarm: {
    lootChance: { unit: "%", values: [25, 50, 75, 100] },
  },
  augment_hydroid_tidal_impunity: {
    duration: { unit: "s", values: [8, 9, 10, 12] },
  },
  augment_ivar_concentrated_arrow: {
    criticalChance: { unit: "%", values: [25, 25, 25, 25] },
    range: { unit: "m", values: [7, 7, 7, 7] },
  },
  augment_ivar_empowered_quiver: {
    critDamage: { unit: "%", values: [75, 80, 90, 100] },
  },
  augment_khora_accumulating_whipclaw: {
    damage: { unit: "%", values: [10, 15, 20, 35] },
    duration: { unit: "s", values: [10, 10, 10, 10] },
  },
  augment_khora_pilfering_strangledome: {
    lootChance: { unit: "%", values: [30, 35, 50, 65] },
  },
  augment_limbo_cataclysmic_continuum: {
    durationPerKill: { unit: "s", values: [0.25, 0.5, 0.7, 1] },
  },
  augment_limbo_rift_haven: {
    healInRift: { unit: "%", values: [10, 15, 20, 25] },
  },
  augment_limbo_rift_torrent: {
    damagePerEnemy: { unit: "%", values: [15, 20, 25, 30] },
  },
  augment_loki_hushed_invisibility: {
    silenceMelee: { unit: "%", values: [50, 65, 80, 100] },
  },
  augment_loki_irradiating_disarm: {
    duration: { unit: "s", values: [4, 5, 7, 9] },
  },
  augment_mag_counter_pulse: {
    duration: { unit: "s", values: [2, 2.5, 3, 4] },
  },
  augment_mag_fracturing_crush: {
    armorReduction: { unit: "%", values: [30, 45, 60, 75] },
    duration: { unit: "s", values: [4, 5, 6, 7] },
  },
  augment_mag_magnetized_discharge: {
    range: { unit: "%", values: [20, 25, 35, 45] },
  },
  augment_mag_sgreedy_pull: {
    lootPull: { unit: "%", values: [40, 60, 80, 100] },
  },
  augment_mesa_ballistic_bullseye: {
    criticalChance: { unit: "%", values: [20, 30, 40, 50] },
  },
  augment_mesa_mess_waltz: {
    moveSpeed: { unit: "%", values: [35, 40, 45, 50] },
  },
  augment_mesa_staggering_shield: {
    reflectStagger: { unit: "%", values: [30, 35, 40, 50] },
  },
  augment_mirage_explosive_legerdemain: {
    explosionDamage: { unit: "", values: [500, 600, 800, 1000] },
    statusChance: { unit: "%", values: [50, 65, 80, 100] },
  },
  augment_mirage_hall_of_malevolence: {
    damagePerKill: { unit: "%", values: [2, 3, 4, 5] },
  },
  augment_mirage_total_eclipse: {
    range: { unit: "m", values: [8, 10, 12, 15] },
  },
  augment_nekros_creeping_terrify: {
    slowAfterFlee: { unit: "%", values: [30, 40, 50, 60] },
  },
  augment_nekros_despoil: {
    healthCost: { unit: "", values: [16, 14, 12, 10] },
  },
  augment_nekros_soul_survivor: {
    health: { unit: "%", values: [15, 20, 25, 30] },
  },
  augment_nezha_pyroclastic_flow: {
    damage: { unit: "%", values: [100, 150, 200, 250] },
    duration: { unit: "s", values: [6, 7, 8, 10] },
  },
  augment_nezha_reaping_chakram: {
    healthOrbChance: { unit: "%", values: [10, 15, 20, 25] },
  },
  augment_nezha_safeguard: {
    allyWard: { unit: "%", values: [20, 30, 40, 50] },
  },
  augment_nova_antimatter_absorb: {
    range: { unit: "m", values: [2, 3, 4, 5] },
  },
  augment_nova_escape_velocity: {
    speedOnTeleport: { unit: "%", values: [30, 35, 40, 50] },
    duration: { unit: "s", values: [4, 5, 6, 7] },
  },
  augment_nova_neutron_star: {
    starExplosion: { unit: "", values: [120, 160, 200, 240] },
    range: { unit: "m", values: [4, 5, 6, 8] },
  },
  augment_nyx_chaos_sphere: {
    sphereDuration: { unit: "%", values: [25, 30, 40, 50] },
  },
  augment_nyx_mind_freak: {
    controlledDamage: { unit: "%", values: [400, 600, 800, 1000] },
  },
  augment_nyx_pacifying_bolts: {
    duration: { unit: "s", values: [4, 6, 8, 10] },
  },
  augment_octavia_conductor: {
    spectraFollow: { unit: "%", values: [100, 115, 135, 150] },
  },
  augment_octavia_partition_mallet: {
    range: { unit: "%", values: [-65, -50, -35, -20] },
  },
  augment_oraxia_broods_oversurge: {
    electricityDamage: { unit: "", values: [1250, 1500, 1750, 2000] },
  },
  augment_rhino_iron_shrapnel: {
    damage: { unit: "%", values: [40, 60, 80, 100] },
  },
  augment_rhino_ironclad_charge: {
    ironSkinPerHit: { unit: "%", values: [12, 25, 37, 50] },
    duration: { unit: "s", values: [4, 6, 8, 10] },
  },
  augment_rhino_piercing_roar: {
    range: { unit: "m", values: [10, 15, 20, 25] },
  },
  augment_saryn_contagion_cloud: {
    toxinDamagePerSecond: { unit: "", values: [150, 175, 250, 300] },
    range: { unit: "m", values: [5, 5, 5, 5] },
    duration: { unit: "s", values: [8, 9, 10, 12] },
  },
  augment_saryn_regenerative_molt: {
    healthRegen: { unit: "/s", values: [20, 30, 40, 50] },
    duration: { unit: "s", values: [10, 10, 10, 10] },
  },
  augment_saryn_revealing_spores: {
    enemyRadar: { unit: "m", values: [10, 20, 30, 40] },
    range: { unit: "m", values: [10, 20, 30, 40] },
  },
  augment_saryn_venom_dose: {
    allyCorrosiveDamage: { unit: "%", values: [50, 65, 80, 100] },
    range: { unit: "m", values: [15, 15, 15, 15] },
    duration: { unit: "s", values: [28, 32, 36, 40] },
  },
  augment_titania_beguiling_lantern: {
    damage: { unit: "%", values: [25, 50, 75, 100] },
  },
  augment_titania_razorwing_blitz: {
    fireRate: { unit: "%", values: [25, 25, 25, 25] },
    flightSpeed: { unit: "%", values: [25, 25, 25, 25] },
  },
  augment_trinity_vampire_leech: {
    overshieldConversion: { unit: "%", values: [150, 175, 200, 225] },
  },
  augment_universal_energy_conversion: {
    strengthOnOrb: { unit: "%", values: [9, 18, 26, 34, 42, 50] },
  },
  augment_universal_health_conversion: {
    armorOnOrb: { unit: "", values: [75, 150, 225, 300, 375, 450] },
  },
  augment_universal_shattering_impact: {
    armorReduction: { unit: "", values: [1, 2, 3, 4, 5, 6] },
  },
  augment_uriel_infernum: {
    heatDamage: { unit: "", values: [1000, 1250, 1350, 1500] },
  },
  augment_vauban_repelling_bastille: {
    vortexDuration: { unit: "%", values: [50, 55, 60, 70] },
  },
  augment_volt_shock_trooper: {
    allyShockDamage: { unit: "%", values: [50, 65, 80, 100] },
    range: { unit: "m", values: [15, 15, 15, 15] },
    duration: { unit: "s", values: [28, 32, 36, 40] },
  },
  augment_volt_shocking_speed: {
    dischargeDamage: { unit: "", values: [75, 150, 225, 300] },
    range: { unit: "m", values: [3, 3, 3, 3] },
  },
  augment_volt_transistor_shield: {
    damage: { unit: "%", values: [150, 200, 250, 300] },
  },
  augment_wisp_critical_surge: {
    breachCritChance: { unit: "%", values: [2.5, 5, 7.5, 10] },
    duration: { unit: "s", values: [9, 9, 9, 9] },
  },
  augment_wukong_enveloping_cloud: {
    range: { unit: "m", values: [2.5, 3, 3.5, 4] },
    duration: { unit: "s", values: [8, 10, 12, 14] },
  },
  augment_yareli_merulina_guardian: {
    damageAbsorption: { unit: "%", values: [5, 10, 15, 25] },
    fireRate: { unit: "%", values: [50, 100, 150, 200] },
    duration: { unit: "s", values: [8, 12, 16, 20] },
  },
  augment_yareli_surging_blades: {
    bladeDamage: { unit: "%", values: [5, 6, 8, 10] },
  },
  axios_javelineers: {
    vortexDuration: { unit: "s", values: [2, 3, 4, 5] },
    vortexBonusOnHit: { unit: "s", values: [5, 5, 5, 5] },
  },
  blast_shield: {
    cooldown: { unit: "s", values: [15, 13.4, 11.8, 10.2, 8.6, 7] },
    range: { unit: "m", values: [5, 6, 7, 8, 9, 10] },
    knockdownRadius: { unit: "m", values: [2.5, 3, 3.5, 4, 4.5, 5] },
  },
  cats_eye: {
    duration: { unit: "s", values: [4, 6, 8, 10] },
    range: { unit: "m", values: [15, 20, 22, 25] },
  },
  contagious_bond: {
    statusSpread: { unit: "%", values: [8, 17, 25, 33, 42, 50] },
  },
  detect_vulnerability: {
    weakspotDamage: { unit: "%", values: [150, 175, 200, 225, 250, 275] },
  },
  draining_bite: {
    lifeSteal: { unit: "%", values: [2.5, 5, 7.5, 10] },
  },
  fetch: {
    range: { unit: "m", values: [8.5, 9.5, 10.5, 11.5, 12.5, 13.5] },
  },
  gladiator_rush: {
    comboDuration: { unit: "s", values: [1, 2, 3, 4, 5, 6] },
  },
  guardian: {
    shieldRestore: { unit: "%", values: [58, 67, 75, 83, 92, 100] },
  },
  hallowed_reckoning: {
    reckoningRange: { unit: "%", values: [40, 40, 40, 40] },
    reckoningRadiationDps: { unit: "", values: [150, 200, 250, 300] },
    reckoningArmor: { unit: "", values: [150, 180, 210, 250] },
    armorBonusRadius: { unit: "m", values: [1.5, 2, 2.5, 3] },
    reckoningDuration: { unit: "s", values: [7, 8, 9, 10] },
    reckoningArmorGrace: { unit: "s", values: [3, 3, 3, 3] },
  },
  howl: {
    duration: { unit: "s", values: [6, 8, 10, 12, 14, 16] },
  },
  hunter_synergy: {
    critLink: { unit: "%", values: [5, 10, 15, 20, 25, 30] },
  },
  intrepid_stand: {
    overguardSelf: { unit: "", values: [30, 40, 50, 60] },
    overguardAlly: { unit: "", values: [15, 20, 25, 30] },
    overguardCap: { unit: "", values: [15000, 15000, 15000, 15000] },
  },
  medi_ray: {
    healthRestore: { unit: "%", values: [2, 4, 6, 8, 10, 12] },
    duration: { unit: "s", values: [4, 4, 4, 4, 4, 4] },
  },
  melee_prowess_sentinel: {
    range: { unit: "m", values: [17.5, 20, 22.5, 25, 27.5, 30] },
  },
  odomedic: {
    healthRestoreMove: { unit: "/s", values: [10, 20, 30, 40] },
  },
  pack_leader: {
    healOnMelee: { unit: "", values: [17, 33, 50, 67, 83, 100] },
  },
  primed_pack_leader: {
    healOnMelee: { unit: "", values: [17, 33, 50, 67, 83, 100, 117, 133, 150, 167, 183] },
  },
  primed_regen: {
    duration: { unit: "s", values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] },
  },
  protect: {
    shieldRestore: { unit: "%", values: [5, 10, 15, 20, 25, 30] },
  },
  reawaken: {
    duration: { unit: "s", values: [6, 6, 6, 6, 6, 6] },
  },
  regen: {
    duration: { unit: "s", values: [10, 10, 10, 10, 10, 10] },
  },
  restorative_bond: {
    healthOnKill: { unit: "", values: [10, 20, 30, 40, 50, 60] },
  },
  retrieve: {
    lootFetch: { unit: "%", values: [7.5, 15, 22.5, 30, 37.5, 45] },
  },
  sacrifice: {
    revive: { unit: "%", values: [25, 50, 75, 100] },
  },
  savagery: {
    range: { unit: "m", values: [5, 6, 7, 8, 9, 10] },
  },
  security_override: {
    duration: { unit: "s", values: [4, 6, 8, 10, 12, 14] },
  },
  seismic_bond: {
    range: { unit: "m", values: [4, 4, 4, 4, 4, 4] },
  },
  set_bonus_augur: {
    energyToShields: { unit: "%", values: [40, 40, 40, 40, 40, 40, 40] },
  },
  set_bonus_gladiator: {
    critPerCombo: { unit: "%", values: [15, 15, 15, 15, 15, 15, 15] },
  },
  set_bonus_hunter: {
    companionDamageToStatus: { unit: "%", values: [150, 150, 150, 150, 150, 150, 150] },
  },
  set_bonus_mecha: {
    markExplosion: { unit: "%", values: [150, 150, 150, 150, 150] },
  },
  set_bonus_synth: {
    pistolReloadSpeed: { unit: "%", values: [15, 15, 15, 15, 15] },
  },
  set_bonus_tek: {
    markDuration: { unit: "s", values: [10, 10, 10, 10, 10] },
  },
  set_bonus_vigilante: {
    critEnhanceChance: { unit: "%", values: [30, 30, 30, 30, 30, 30, 30] },
  },
  shield_charger: {
    overshields: { unit: "%", values: [10, 20, 30, 40, 50, 60] },
    duration: { unit: "s", values: [5, 6, 7, 8, 9, 10] },
  },
  spare_parts: {
    lootChance: { unit: "%", values: [33.33, 66.67, 99.99, 133.3, 166.7, 200] },
  },
  stalk: {
    range: { unit: "m", values: [14, 16, 18, 20, 22, 24] },
  },
  synth_deconstruct: {
    healthOrbChance: { unit: "%", values: [2, 5, 10, 15, 20, 25] },
  },
  synth_fiber: {
    healthPickupBonus: { unit: "%", values: [25, 50, 75, 100] },
  },
  targeting_receptor: {
    range: { unit: "m", values: [10, 10, 10, 10] },
  },
  transfusion: {
    cooldown: { unit: "s", values: [120, 120, 120, 120] },
  },
  tribunal: {
    allyEffectPercent: { unit: "%", values: [40, 60, 80, 100] },
  },
  unleashed: {
    damage: { unit: "%", values: [300, 300, 300, 300, 300, 300] },
    range: { unit: "m", values: [35, 40, 45, 50, 55, 60] },
  },
  vacuum: {
    range: { unit: "m", values: [8.5, 9.5, 10.5, 11.5, 12.5, 13.5] },
  },
};

/** Stat keys that cards must not show (wiki has no stat by that name). */
export const PANEL_ONLY_MOD_STATS: Record<string, readonly string[]> = {
  afterburner: ["duration"],
  augment_ash_smoke_shadow: ["allyStealth"],
  augment_banshee_resonating_quake: ["channeled"],
  augment_baruuk_elusive_retribution: ["evasionToDamage"],
  augment_chroma_afterburn: ["explosionDamage"],
  augment_chroma_guided_effigy: ["moveEffigy"],
  augment_chroma_vexing_retaliation: ["retaliationChance"],
  augment_ember_exothermic: ["energy"],
  augment_ember_fireball_frenzy: ["damage"],
  augment_ember_healing_flame: ["healthOnImmolation"],
  augment_equinox_duality: ["duration"],
  augment_frost_freeze_force: ["damage"],
  augment_frost_ice_wave_impedance: ["slowDuration"],
  augment_gara_spectrosiphon: ["energyOnKill", "energy"],
  augment_garuda_blending_talons: ["comboPerHit", "slash"],
  augment_garuda_blood_forge: ["reloadSpeed"],
  augment_gauss_mach_crash: ["shockwaveOnStop"],
  augment_gauss_thermal_transfer: ["coldToAlly"],
  augment_grendel_catapult: ["launchSpeed"],
  augment_grendel_hearty_nourishment: ["immunityDuration"],
  augment_hildryn_balefire_surge: ["explosionOnHit"],
  augment_hydroid_curative_undertow: ["health"],
  augment_hydroid_tidal_impunity: ["statusCure"],
  augment_inaros_negation_swarm: ["statusProtection", "armor"],
  augment_ivar_concentrated_arrow: ["headshotExplosion"],
  augment_ivar_empowered_quiver: ["criticalMultiplier"],
  augment_ivar_infiltrate: ["hackSpeed"],
  augment_ivar_piercing_navigator: ["punchThroughPerHit"],
  augment_khora_accumulating_whipclaw: ["comboOnHit"],
  augment_khora_venari_bodyguard: ["deathPrevention"],
  augment_limbo_cataclysmic_continuum: ["duration"],
  augment_limbo_rift_haven: ["health"],
  augment_limbo_rift_torrent: ["damage"],
  augment_loki_irradiating_disarm: ["radiationChance"],
  augment_loki_savior_decoy: ["deathPrevention"],
  augment_mag_counter_pulse: ["disarmDuration"],
  augment_mag_fracturing_crush: ["armor"],
  augment_mag_magnetized_discharge: ["explosionDamage"],
  augment_mirage_total_eclipse: ["allyShare"],
  augment_nekros_soul_survivor: ["allyRevive"],
  augment_nezha_pyroclastic_flow: ["fireballExplosion"],
  augment_nova_antimatter_absorb: ["absorbRadius"],
  augment_nova_molecular_fission: ["slowWithoutSpeed"],
  augment_nyx_assimilate: ["moveSpeed"],
  augment_nyx_chaos_sphere: ["abilityDuration"],
  augment_nyx_mind_freak: ["attackSpeed", "damage"],
  augment_nyx_pacifying_bolts: ["stunDuration"],
  augment_octavia_partition_mallet: ["maxMallets"],
  augment_rhino_iron_shrapnel: ["recastExplosion"],
  augment_rhino_piercing_roar: ["armorReduction"],
  augment_rhino_reinforcing_stomp: ["armorPerEnemy"],
  augment_saryn_venom_dose: ["damage"],
  augment_titania_beguiling_lantern: ["attractionRange", "weaponDamageBonus"],
  augment_titania_razorwing_blitz: ["speedPerCast"],
  augment_titania_spellbound_harvest: ["tributeEfficiency"],
  augment_universal_energy_conversion: ["abilityStrength"],
  augment_vauban_photon_repeater: ["extraCast"],
  augment_volt_shock_trooper: ["damage"],
  augment_volt_transistor_shield: ["critChancePerShield"],
  augment_wisp_critical_surge: ["criticalChance"],
  augment_wisp_fused_reservoir: ["combinedMote", "energy"],
  augment_wukong_enveloping_cloud: ["allyInvisibility"],
  augment_yareli_surging_blades: ["damage"],
  axios_javelineers: ["duration"],
  blast_shield: ["damage"],
  cats_eye: ["critBuff"],
  claw_bite: ["criticalDamage"],
  coolant_leak: ["coldDamage", "slow", "cooldown"],
  dig: ["digCooldown"],
  energy_generator: ["energyOnAssist"],
  evolution_incarnon_melee: ["evolutionBonus"],
  evolution_incarnon_pistol: ["evolutionBonus"],
  evolution_incarnon_rifle: ["evolutionBonus"],
  ferocity: ["attackSpeed"],
  fetch: ["pickupRange"],
  guardian: ["cooldown"],
  howl: ["fearDuration"],
  hunt: ["finisherChance"],
  hunter_command: ["commandOnStatus"],
  hunter_synergy: ["criticalChance"],
  hunter_track: ["radarOnBleed"],
  manifold_bond: ["abilityDuration"],
  mecha_empowered: ["armorOnMarkKill"],
  medi_ray: ["range", "health"],
  melee_prowess_sentinel: ["attackRange"],
  mystic_bond: ["energyLeech"],
  negate: ["statusImmunity", "duration"],
  neutralize: ["disarmChance"],
  odomedic: ["range"],
  primed_regen: ["regenCharges", "healthPercent"],
  protect: ["cooldown", "shield"],
  reawaken: ["autoRevive"],
  regen: ["regenCharges", "healthPercent"],
  repo_audit: ["damage"],
  restorative_bond: ["restoreNearby"],
  sacrifice: ["health"],
  savagery: ["finisherDamage"],
  scavenge: ["ammoChance"],
  security_override: ["hackSpeed"],
  seismic_bond: ["knockdownDuration"],
  shield_charger: ["range"],
  stalk: ["stealthDuration", "cooldown"],
  synth_deconstruct: ["health"],
  targeting_receptor: ["targetRange"],
  transfusion: ["reviveChance", "health"],
  unleashed: ["vipCapture"],
  vacuum: ["pickupRange"],
  vigilante_supplies: ["ammoPickup"],
};

export function isPanelOnlyModStat(modId: string, statKey: string): boolean {
  return PANEL_ONLY_MOD_STATS[modId]?.includes(statKey) === true;
}
