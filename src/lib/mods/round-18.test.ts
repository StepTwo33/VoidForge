/**
 * Round 18: stray damage stats removed from mods that don't add weapon or ability damage, the
 * Zoom / Recoil / Noise Reduction (and other) % stats and Finishing Touch's single Finisher Damage
 * line. Expected card text is worked by hand from the wiki.warframe.com stat table quoted in each
 * case (fandom as a cross-check).
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { getModStatFilterTags } from "@/lib/mods/mod-stat-filters";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";
import { calculateArchwingBuild } from "@/lib/calc/archwing-calculator";
import { archwings } from "@/data/archwing";
import { resolveWeaponExternalBuffs } from "@/lib/weapons/weapon-external-buffs";
import { allWeapons } from "@/data/weapons";

const mod = (id: string) => modsMap.get(id)!;
const lines = (id: string, rank?: number) => getModStatDisplayLines(mod(id), rank ?? mod(id).maxRank).map((l) => l.atRank);
const tags = (id: string) => getModStatFilterTags(mod(id));

/** A card line that names a damage stat the mod deals or adds (not damage taken / blocked / reflected). */
const DAMAGE_LABEL = /\bdamage\b/i;
const NOT_DEALT_LABEL = /Resist|Reduction|Redirect|Reflect|Block|Absor|To Shield|On Health|Vulnerab/;
const damageLines = (id: string) =>
  getModStatDisplayLines(mod(id), mod(id).maxRank).filter((l) => DAMAGE_LABEL.test(l.label) && !NOT_DEALT_LABEL.test(l.label));

// [id, card at R0, card at max rank] — wiki.warframe.com stat table, index = rank.
const STRAY: [string, string[], string[]][] = [
  // Auto Omni: Effect 17/34/51/68/85/100% (repair hull breaches, extinguish fires).
  ["auto_omni", ["+17% Repair Chance", "+3.3s Cooldown"], ["+100% Repair Chance", "+3.3s Cooldown"]],
  // Mischief: Decoy Evasion Chance 0/5/10/15%, Duration 6–9s.
  ["mischief", ["0% Decoy Evasion Chance", "+6s Duration"], ["+15% Decoy Evasion Chance", "+9s Duration"]],
  // Reflect: Reflect Chance 10–40%, Damage Amplification 15–60%.
  ["reflect", ["+15% Reflected Damage Amplification", "+10% Reflect Chance"], ["+60% Reflected Damage Amplification", "+40% Reflect Chance"]],
  // Reflex Denial: Damage Reflection 15–90%, Duration 5–10s, Range 2–12m.
  ["reflex_denial", ["+15% Damage Reflected", "+5s Duration", "+2m Range"], ["+90% Damage Reflected", "+10s Duration", "+12m Range"]],
  // Tek Assault: Chance 15–60% to ignore lethal damage, Duration 1–4s.
  ["tek_assault_r3", ["+15% Lethal Immunity Chance", "+1s Duration"], ["+60% Lethal Immunity Chance", "+4s Duration"]],
  // Vicious Bond: Armor Reduction 2.5–15%, Radius 1.5–9m (no melee damage / attack speed).
  ["vicious_bond", ["+2.5% Armor Reduction", "+1.5m Range"], ["+15% Armor Reduction", "+9m Range"]],
  // Hunter Recovery: Life Steal +5…+30%.
  ["hunter_recovery", ["+5% Life Steal"], ["+30% Life Steal"]],
  // Rumbled: % max health absorbed 200/225/250/300.
  ["augment_atlas_rumbled", ["+5 Rumble Duration", "+200% Max Health Absorbed"], ["+20 Rumble Duration", "+300% Max Health Absorbed"]],
  // Elemental Sandstorm: Ability Range +20/30/40/50%, Status Chance 25–100%.
  ["augment_inaros_elemental_sandstorm", ["+25% Elemental Chance", "+20% Sandstorm Range"], ["+100% Elemental Chance", "+50% Sandstorm Range"]],
  // Capacitance: Damage to Shield Conversion 1.5/2/2.5/3%.
  ["augment_volt_capacitance", ["+25 Shield Per Target", "+1.5% Damage To Shield Conversion"], ["+100 Shield Per Target", "+3% Damage To Shield Conversion"]],
  // Deceptive Bond: Damage Redirected 20/30/45/50%.
  ["deceptive_bond", ["+20% Damage Redirected"], ["+50% Damage Redirected"]],
  // Hallowed Reckoning: Ability Range +40% at every rank, radius 1.5–3m.
  ["hallowed_reckoning", ["+1.5m Range", "+40% Reckoning Range"], ["+3m Range", "+40% Reckoning Range"]],
  // Peaceful Provocation: Pacify Slow 20/30/35/40%, Provoke Ability Strength +6/9/12/15%.
  ["peaceful_provocation", ["+20% Pacify Slow", "+6% Provoke Strength"], ["+40% Pacify Slow", "+15% Provoke Strength"]],
  // Reverse Rotorswell: 20/25/30/35% of damage received redirected.
  ["reverse_rotorswell", ["+20% Damage Redirected"], ["+35% Damage Redirected"]],
  // Rage (infobox Max Rank 5): +40% of health damage to energy, 6.67%/rank.
  ["rage", ["+6.7% Energy On Health Damage"], ["+40% Energy On Health Damage"]],
  // Hunter Adrenaline: Efficiency 7.5…45% (the duplicate damage line is gone).
  ["hunter_adrenaline", ["+7.5% Energy On Health Damage"], ["+45% Energy On Health Damage"]],
  // Kinetic Diversion: +10…40%; Necramech Rage: 2.5…15%.
  ["kinetic_diversion", ["+10% Energy On Health Damage"], ["+40% Energy On Health Damage"]],
  ["necramech_rage", ["+2.5% Energy On Health Damage"], ["+15% Energy On Health Damage"]],
  // Retribution: Effect 15/30/45/60% chance.
  ["retribution", ["+15% Retaliation Chance"], ["+60% Retaliation Chance"]],
  // Heartseeker: % Damage Blocked -12.5…-50%, targeting radius 0.25–1m.
  ["heartseeker", ["-12.5% Damage Block", "+0.3m Range"], ["-50% Damage Block", "+1m Range"]],
  // Relentless Combination: +25…100% combo count chance.
  ["relentless_combination_r3", ["+25% Combo Count Chance"], ["+100% Combo Count Chance"]],
  // Flux Overdrive: Status Chance +25…+150% (the stray Heat key; not Heat damage).
  ["flux_overdrive", ["+25% Status chance", "+0.8s Duration"], ["+150% Status chance", "+0.8s Duration"]],
  // Gleaming Blight: Status chance 25–100% and +1 Blight only.
  ["stance_gleaming_talent", ["+25% Status chance", "+1 syndicate power"], ["+100% Status chance", "+1 syndicate power"]],
];

describe("stray damage stats: wiki stat and label, no Damage", () => {
  for (const [id, r0, max] of STRAY) {
    it(`${mod(id).name}: R0 ${r0.join(", ")} → R${mod(id).maxRank} ${max.join(", ")}`, () => {
      expect(lines(id, 0)).toEqual(r0);
      expect(lines(id)).toEqual(max);
      expect(mod(id).stats).not.toHaveProperty("damage");
      expect(damageLines(id)).toEqual([]);
      expect(tags(id).has("damage"), id).toBe(false);
      // Behavior lines follow the catalog keys.
      expect(getVerifiedModBehavior(id)!.stats.map((s) => s.statKey).sort()).toEqual(Object.keys(mod(id).stats).sort());
    });
  }

  it("finisher mods keep one Finisher Damage line (they add finisher damage)", () => {
    // Finishing Touch: +10%/rank → +60% Finisher Damage at R5 (no duplicate "+60% Damage").
    expect([0, 2, 5].map((r) => lines("finishing_touch_r10", r))).toEqual([["+10% Finisher Damage"], ["+30% Finisher Damage"], ["+60% Finisher Damage"]]);
    // Covert Lethality: +4 Initial Combo/rank (+16), Finisher Damage 25…100%.
    expect(lines("covert_lethality", 0)).toEqual(["+4 Initial Combo", "+25% Finisher Damage"]);
    expect(lines("covert_lethality")).toEqual(["+16 Initial Combo", "+100% Finisher Damage"]);
    // Radiant Finish: blinded enemies take +150/200/250/300% Finisher Damage.
    expect([0, 1, 2, 3].map((r) => lines("augment_excalibur_radiant_finish", r))).toEqual(
      [150, 200, 250, 300].map((v) => [`+${v}% Finisher Damage`]),
    );
    for (const id of ["finishing_touch_r10", "covert_lethality", "augment_excalibur_radiant_finish"]) {
      expect(mod(id).stats, id).not.toHaveProperty("damage");
      expect(tags(id).has("damage"), id).toBe(true);
    }
  });

  it("bond mods and stances lose the damage stats the wiki doesn't list", () => {
    // Aerial / Covert / Duplex / Manifold Bond stat tables: recovery timer, cold chance, radius,
    // duration, orb chance, cooldown — no damage. Momentous Bond keeps its +120% bonus damage.
    expect(mod("aerial_bond").stats).not.toHaveProperty("airborneDamage");
    expect(mod("covert_bond").stats).not.toHaveProperty("stealthDamage");
    expect(mod("duplex_bond").stats).not.toHaveProperty("companionDamage");
    expect(mod("manifold_bond").stats).not.toHaveProperty("abilityDamage");
    expect(mod("momentous_bond").stats).not.toHaveProperty("heavyAttackDamage");
    expect(lines("momentous_bond")).toContain("+120% Damage");
    // Reactive Storm: Status Chance 100–250% only.
    expect(mod("augment_volt_reactive_storm").stats).not.toHaveProperty("damageIncrease");
    // Stances have no stat table on the wiki (Iron Phoenix: combos only).
    for (const m of allMods.filter((x) => x.category === "stance")) expect(m.stats, m.id).not.toHaveProperty("damageBonus");
    expect(lines("stance_iron_phoenix")).toEqual([]);
  });
});

/**
 * Hand-verified (wiki.warframe.com) non-weapon mods whose `damage` stat is real weapon / ability /
 * companion damage. Anything else outside the weapon categories with a `damage` key fails.
 */
const REAL_DAMAGE = new Set([
  // Warframe: Ambush (+240% weapon damage), Gale Kick, Holster Amp, Mecha Empowered, Provoked, Summoner's
  // Wrath, Vigorous Swap, Dead Eye and the amplification / Steel Charge auras.
  "ambush", "aura_pistol_amplification", "aura_rifle_amplification", "aura_shotgun_amplification", "aura_steel_charge",
  "dead_eye", "gale_kick", "holster_amp", "mecha_empowered", "provoked", "summoners_wrath", "vigorous_swap",
  // Companion: precepts / claws that deal or add damage.
  "anti_grav_grenade", "assassin_posture", "astral_bond", "blast_shield", "brute_conditioning", "disabling_conditioning",
  "diversified_denial", "draining_bite", "equilibrium_audit", "fear_sense", "fired_up", "hunt", "infectious_bite", "maul",
  "momentous_bond", "persistent_posture", "pounce", "repo_audit", "seismic_bond", "sharpened_claws", "strain_eruption",
  "strain_fever", "trample", "unleashed", "volatile_parasite",
  // Augments that add weapon / ability damage.
  "aegis_gale", "augment_ember_fireball_frenzy", "augment_equinox_duality", "augment_frost_freeze_force",
  "augment_gauss_thermal_transfer", "augment_khora_accumulating_whipclaw", "augment_limbo_rift_torrent",
  "augment_nezha_pyroclastic_flow", "augment_nyx_mind_freak", "augment_rhino_iron_shrapnel", "augment_saryn_venom_dose",
  "augment_titania_beguiling_lantern", "augment_volt_shock_trooper", "augment_volt_transistor_shield",
  "augment_yareli_surging_blades", "avenging_truth", "blade_of_truth", "bright_purity", "bursting_mass", "cathode_current",
  "conductive_sphere", "damage_decoy", "entropy_detonation", "fatal_teleport", "iron_vault", "justice_blades",
  "lasting_purity", "meticulous_aim", "nightwatch_napalm", "rousing_plunder", "smite_infusion", "static_discharge",
  "target_fixation", "thrall_pact", "titanic_rumbler",
  // Conclave weapon damage mods.
  "comet_rounds", "crash_shot", "feathered_arrows", "final_tap", "flak_shot", "impaler_munitions", "impenetrable_offense",
  "measured_burst", "meteor_munitions", "razor_munitions", "ripper_rounds", "serrated_edges", "serrated_rounds",
  "sharpened_blade", "shred_shot", "triple_tap",
  // Stance damage mods (Amar's / Boreal's / Nira's Contempt: +90% Melee Damage).
  "amars_contempt", "boreals_contempt", "niras_contempt",
  // Railjack turret / ordnance damage, necramech damage mods, K-Drive Thrash Landing.
  "crimson_fugue", "forward_artillery", "hyperstrike", "onslaught_matrix", "protective_shots", "raider_matrix", "warhead",
  "necramech_blitz", "necramech_pressure_point", "necramech_seismic_wave", "thrash_landing",
]);
const WEAPON_CATEGORIES = new Set([
  "rifle", "pistol", "shotgun", "melee", "primary", "secondary", "companion_weapon", "archgun", "archmelee",
]);
/** Description says damage is taken, blocked, reflected or converted — not dealt. */
const NOT_DEALT_TEXT =
  /damage on health|damage taken|damage received|damage \w+ takes|lethal damage|reflect|redirect|transferr|repair|hull damage|damage block/i;
/** Damage-stat cards whose description doesn't say "damage" outright; each checked on wiki.warframe.com. */
const DESCRIPTION_EXCEPTIONS = new Set([
  "coolant_leak", // 10m Cold blast (Cold damage).
  "augment_mag_magnetized_discharge", // detonation damage.
  "damage_decoy", // reflected damage increased by 350% (Decoy deals it to enemies).
  "anti_grav_grenade", // Impact damage equal to 80% of the damage taken while levitated.
  "detect_vulnerability", // Damage Multiplier +150…275% on scanned weak points.
  "onslaught_matrix", // +15% Turret Damage (the Reflect line is a separate effect).
  "impenetrable_offense", // -10% Melee Damage (a real damage penalty next to +30% Damage Block).
]);

describe("catalog-wide: no mod shows a damage stat it doesn't have", () => {
  it("every non-weapon mod with a `damage` key is a verified damage mod", () => {
    const offenders = allMods
      .filter((m) => m.stats && "damage" in m.stats && !WEAPON_CATEGORIES.has(m.category) && !REAL_DAMAGE.has(m.id))
      .map((m) => `${m.id} (${m.category})`);
    expect(offenders).toEqual([]);
  });

  it("every card that names a damage stat describes damage dealt or added", () => {
    const offenders: string[] = [];
    for (const m of allMods) {
      if (!damageLines(m.id).length || DESCRIPTION_EXCEPTIONS.has(m.id)) continue;
      const d = cleanModDescription(m.description ?? "");
      // Elemental / physical mods name the damage type ("+15% Cold per rank") instead of "damage".
      const typed = damageLines(m.id).every((l) => new RegExp(`\\b${l.label.split(" ")[0]}\\b`, "i").test(d));
      if ((!/damage/i.test(d) && !typed) || NOT_DEALT_TEXT.test(d)) offenders.push(`${m.id}: ${damageLines(m.id).map((l) => l.atRank).join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });

  it("companion and augment mods under the Damage filter are verified damage mods", () => {
    const offenders = allMods
      .filter((m) => (m.category === "companion" || m.category === "augment") && getModStatFilterTags(m).has("damage"))
      .filter((m) => !REAL_DAMAGE.has(m.id) && damageLines(m.id).length === 0)
      .map((m) => m.id);
    expect(offenders).toEqual([]);
  });
});

describe("calculator: stray keys that fed a stat", () => {
  it("Kinetic Diversion still converts 40% at R3 (now read from energyOnHealthDamage)", () => {
    const aw = archwings[0];
    const mm = new Map(allMods.map((m) => [m.id, m]));
    const stats = calculateArchwingBuild(aw, [{ modId: "kinetic_diversion", rank: 3, slotIndex: 0 }], mm);
    expect(stats.kineticDiversionPercent).toBeCloseTo(40, 6); // 10% × 4
  });

  it("Covert Bond no longer adds a weapon damage buff (wiki: companion stealth only)", () => {
    const mm = new Map(allMods.map((m) => [m.id, m]));
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const buffs = resolveWeaponExternalBuffs(braton, { companionModSlots: [{ modId: "covert_bond", rank: 5, slotIndex: 0 }], allMods: mm }, {} as never);
    expect(buffs.map((b) => b.id)).not.toContain("companion:covert_bond");
  });
});

describe("% on Zoom / Recoil / Noise Reduction and other % stats", () => {
  it.each([
    // wiki.warframe.com stat tables.
    ["eagle_eye", "+40% Zoom"],
    ["hawk_eye", "+80% Zoom"],
    ["stabilizer", "-60% Recoil"],
    ["steady_hands", "-60% Recoil"],
    ["suppress_r3", "+100% Noise Reduction"],
    ["hush_r3", "+100% Noise Reduction"],
    ["silent_battery", "+100% Noise Reduction"],
    ["primed_stabilizer", "-85% Recoil"],
    ["hunter_recovery", "+30% Life Steal"],
    ["magnum_force", "-55% Accuracy"],
  ])("%s shows %s", (id, text) => {
    expect(lines(id)).toContain(text);
  });
  it("elemental and physical mods carry %", () => {
    expect(lines("hellfire_r3")).toContain("+90% Heat damage");
    expect(lines("piercing_caliber")).toContain("+120% Puncture damage");
  });
  it("per-mod % exceptions", () => {
    // Corrupt Charge / True Punishment: -50% Combo Duration; Endurance Drift: +10% Energy Max.
    expect(lines("corrupt_charge")).toContain("-50% Combo Duration");
    expect(lines("true_punishment")).toContain("-50% Combo Duration");
    expect(lines("endurance_drift")).toContain("+10% Energy Max");
    expect(lines("body_count")).not.toContain("+12% Combo Duration");
  });
  it("flat stats stay flat", () => {
    // Stinging Truth: "+40 Magazine Capacity"; Shattering Impact: Impact reduces armor by 6 (flat).
    expect(lines("stinging_truth")).toContain("+40 Magazine size");
    expect(lines("augment_universal_shattering_impact").some((l) => l.includes("%"))).toBe(false);
  });
  it("no card shows a bare number for a stat whose max-rank description gives the same number as a %", () => {
    const offenders: string[] = [];
    for (const m of allMods) {
      const desc = cleanModDescription(m.description ?? "").replace(/\n/g, " ");
      for (const l of getModStatDisplayLines(m, m.maxRank)) {
        const mm = l.atRank.match(/^([+-]?\d+(?:\.\d+)?) /);
        if (!mm || l.atRank.includes("%")) continue;
        const n = String(Math.abs(Number(mm[1]))).replace(".", "\\.");
        if (new RegExp(`(?<![\\d.])${n}%`).test(desc)) offenders.push(`${m.id}: ${l.atRank}`);
      }
    }
    // Amp school / status / crit damage and energy regen are flat on purpose (Round 15b FLAT keys).
    expect(offenders.filter((o) => !/^(omn_evi|ubri_kaneph|sil_tabol|vik_anam):/.test(o))).toEqual([]);
  });
});
