import type { AltFireMode } from "@/lib/weapons/alt-fire";
import type { WeaponAlternateModeStats } from "@/lib/types";

/**
 * ALT FIRE data, keyed by weapon id. Source: wiki.warframe.com Module:Weapons/data/* (attack
 * index cited in each note). Weapons that already had a builder-toggle alt mode (weapons.ts,
 * custom-items.ts, Kitgun chambers) are NOT repeated here: alt-fire.ts reads those overlays too.
 *
 * Wiki "Damage" is per projectile / pellet, which is how the calculator stores it (with
 * `multishot` for the pellet count). Every mode lists every damage type explicitly (0 when
 * absent) so the primary mode's elements never leak into it.
 */
const DMG_KEYS = [
  "impact", "puncture", "slash", "heat", "cold", "toxin", "electricity",
  "radiation", "viral", "corrosive", "blast", "gas", "magnetic",
] as const;

function dmg(parts: Partial<Record<(typeof DMG_KEYS)[number], number>>): Partial<WeaponAlternateModeStats> {
  const out: Record<string, number> = {};
  let total = 0;
  for (const k of DMG_KEYS) {
    out[k] = parts[k] ?? 0;
    total += out[k]!;
  }
  out.damage = total;
  return out as Partial<WeaponAlternateModeStats>;
}

const MAG_DUMP =
  "Fires the whole magazine as one burst, then you reload. Fire rate is the wiki's listed figure; the shots inside the burst are actually closer together.";

export const WEAPON_ALT_FIRE: Record<string, AltFireMode[]> = {
  // ---- Batch 0: one weapon per pattern -------------------------------------------------
  // Tap vs hold. The calculator's primary mode is the charged shot; the quick tap is the alt.
  cernos: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 171, puncture: 9.5, slash: 9.5 }),
      fireRate: 1, criticalChance: 0.36, criticalMultiplier: 2, statusChance: 0.18,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1,
      note: "Wiki Cernos attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  // Mode toggle (Cannon <-> Barrage). The calculator's primary mode is Cannon.
  zarr: [
    {
      label: "Barrage Mode",
      ...dmg({ impact: 24, puncture: 40, slash: 16 }),
      fireRate: 3, criticalChance: 0.17, criticalMultiplier: 2.5, statusChance: 0.087,
      multishot: 10, ammoCost: 1,
      note: "Wiki Zarr attack 5. 10 pellets of 80 each; multishot adds pellets. Falloff and 10 m range are not modelled.",
    },
  ],
  // Own charged shot with its own ammo cost.
  quellor: [
    {
      label: "Alt-Fire (charged beam)",
      ...dmg({ impact: 600, cold: 800 }),
      fireRate: 1, criticalChance: 0.4, criticalMultiplier: 2.2, statusChance: 0.1,
      chargeTime: 1.2, chargeMode: "standard", triggerType: "Auto-Charge", ammoCost: 50,
      forcedProcs: ["Impact"],
      note: "Wiki Quellor attack 2. 1,400 up to 9 m, falling to 33% by 18 m (not modelled). Costs 50 ammo; DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // Melee throws: the direct hit and its explosions are separate rows.
  glaive_prime: [
    {
      label: "Throw",
      ...dmg({ impact: 27, puncture: 27, slash: 126 }),
      fireRate: 1.25, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.32,
      forcedProcs: ["Impact", "Slash"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Glaive Prime attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 54, puncture: 54, slash: 252 }),
      fireRate: 0.833, criticalChance: 0.26, criticalMultiplier: 2.4, statusChance: 0.34,
      forcedProcs: ["Impact", "Slash"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Glaive Prime attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],

  // ---- Batch 1: magazine dump ("Mag Burst") --------------------------------------------
  // radialAttacks: [] on the Panderos drops the old "Alt-Fire" stand-in radial row (the wiki's
  // Pandero alt-fire is a hit-scan shot, not an explosion); the real stats are this mode.
  pandero: [
    {
      label: "Alt-Fire (magazine dump)",
      ...dmg({ impact: 18, puncture: 18, slash: 36 }),
      fireRate: 4.17, criticalChance: 0.3, criticalMultiplier: 2.8, statusChance: 0.1, ammoCost: 1,
      radialAttacks: [],
      note: `Wiki Pandero attack 2. ${MAG_DUMP}`,
    },
  ],
  pandero_prime: [
    {
      label: "Alt-Fire (magazine dump)",
      ...dmg({ impact: 26, puncture: 26, slash: 52 }),
      fireRate: 4.17, criticalChance: 0.3, criticalMultiplier: 2.8, statusChance: 0.24, ammoCost: 1,
      radialAttacks: [],
      note: `Wiki Pandero Prime attack 2. ${MAG_DUMP}`,
    },
  ],
  // Nagantaka: the wiki lists no charge time, so the calculator's bow-style charge timing is switched off for this mode.
  nagantaka: [
    {
      label: "Burst Shot (magazine dump)",
      ...dmg({ impact: 1.6, puncture: 14.3, slash: 143.1 }),
      fireRate: 5, criticalChance: 0.15, criticalMultiplier: 2.3, statusChance: 0.39,
      chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: ["Impact"],
      note: `Wiki Nagantaka attack 2. ${MAG_DUMP}`,
    },
  ],
  nagantaka_prime: [
    {
      label: "Burst Shot (magazine dump)",
      ...dmg({ impact: 1.7, puncture: 15.6, slash: 155.7 }),
      fireRate: 5, criticalChance: 0.25, criticalMultiplier: 2.3, statusChance: 0.39,
      chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: ["Impact"],
      note: `Wiki Nagantaka Prime attack 2. ${MAG_DUMP}`,
    },
  ],
  // Athodai's alt-fire is a different shot: pure Heat, short range (13 m / 16 m) with 2 m punch-through.
  athodai: [
    {
      label: "Alt-Fire (magazine dump)",
      ...dmg({ heat: 88 }),
      fireRate: 12, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.24, ammoCost: 1,
      note: `Wiki Athodai attack 2. Pure Heat, 13 m range (not modelled), 2 m punch-through. ${MAG_DUMP}`,
    },
  ],
  athodai_prime: [
    {
      label: "Alt-Fire (magazine dump)",
      ...dmg({ heat: 100 }),
      fireRate: 12, criticalChance: 0.2, criticalMultiplier: 2.5, statusChance: 0.35, ammoCost: 1,
      note: `Wiki Athodai Prime attack 2. Pure Heat, 16 m range (not modelled), 2 m punch-through. ${MAG_DUMP}`,
    },
  ],
  // Cyanex: the primary shot has a real explosion (stays in the Radial Attack panel). Burst Mode has none.
  cyanex: [
    {
      label: "Burst Mode (magazine dump)",
      ...dmg({ impact: 2.88, puncture: 30.24, slash: 38.88 }),
      fireRate: 4.67, criticalChance: 0.08, criticalMultiplier: 1.4, statusChance: 0.32, ammoCost: 1,
      radialAttacks: [],
      note: `Wiki Cyanex attack 3. 72 per shot, no explosion. ${MAG_DUMP}`,
    },
  ],
  // Kuva Kraken: the primary is a 3-round burst; the alt dumps the whole magazine instead.
  kuva_kraken: [
    {
      label: "Alt-Fire (magazine dump)",
      ...dmg({ impact: 32.25, puncture: 5.375, slash: 5.375 }),
      fireRate: 4.17, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.29, ammoCost: 1,
      burstCount: 1,
      note: `Wiki Kuva Kraken attack 2. ${MAG_DUMP}`,
    },
  ],
  // Tenet Detron: 10 pellets of 26. The wiki lists no ammo cost for the burst, so 1 per shot is assumed.
  tenet_detron: [
    {
      label: "Burst Shot (magazine dump)",
      ...dmg({ radiation: 26 }),
      fireRate: 2, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.1,
      multishot: 10, ammoCost: 1,
      note: `Wiki Tenet Detron attack 2. 10 pellets of 26; the wiki lists no ammo cost for this mode (1 per shot assumed). ${MAG_DUMP}`,
    },
  ],
  // ---- Batch 2: tap vs hold ------------------------------------------------------------
  // Where the calculator's primary mode is the charged shot, the quick tap is the alt
  // (chargeTime 0, as for Cernos). Where the primary is the normal / burst shot (Ballistica
  // family), the charged shot is the alt, timed with the Fire Rate page rule 1 / (charge + 1 / FR).
  // Bow modes that still need a partial charge (Perfect Shot, Daikyu quick shot, Lanka partial)
  // keep the primary's own charge timing so the rows stay comparable. Bow quick shots stay bows
  // (chargeMode "bow", chargeTime 0): fire-rate mods get the "x2 for Bows" bonus, and each shot is
  // followed by the reload. Epitaph (a pistol) uses the wiki's "Semi-Auto" trigger.
  ballistica: [
    {
      label: "Charged Shot",
      ...dmg({ impact: 10, puncture: 80, slash: 10 }),
      fireRate: 3.33, criticalChance: 0.15, criticalMultiplier: 1.5, statusChance: 0.1,
      chargeTime: 1, chargeMode: "standard", triggerType: "Charge", burstCount: 1, ammoCost: 1, forcedProcs: [],
      note: "Wiki Ballistica attack 2. One bolt instead of the 4-round burst. DPS uses 1 / (1 s charge + 1 / fire rate).",
    },
  ],
  ballistica_prime: [
    {
      label: "Charged Shot",
      ...dmg({ impact: 3.8, puncture: 41.8, slash: 30.4 }),
      fireRate: 3.33, criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.15,
      multishot: 4, chargeTime: 0.8, chargeMode: "standard", triggerType: "Charge", ammoCost: 4, forcedProcs: [],
      note: "Wiki Ballistica Prime attack 2. 4 bolts of 76, 1 m punch-through. DPS uses 1 / (0.8 s charge + 1 / fire rate).",
    },
  ],
  rakta_ballistica: [
    {
      label: "Charged Shot",
      ...dmg({ impact: 15, puncture: 270, slash: 15 }),
      fireRate: 3.33, criticalChance: 0.2, criticalMultiplier: 1.5, statusChance: 0.1,
      chargeTime: 1, chargeMode: "standard", triggerType: "Charge", burstCount: 1, ammoCost: 1, forcedProcs: [],
      note: "Wiki Rakta Ballistica attack 2. One bolt instead of the 4-round burst. DPS uses 1 / (1 s charge + 1 / fire rate).",
    },
  ],
  cinta: [
    {
      label: "Quick Shot",
      ...dmg({ puncture: 360, slash: 90 }),
      fireRate: 0.667, criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.3,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Cinta attack 1. Quick tap, no charge wait. The wiki lists no ammo cost (1 arrow assumed).",
    },
    {
      label: "Perfect Shot",
      ...dmg({ heat: 600 }),
      fireRate: 0.667, criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.34,
      chargeTime: 1.05, ammoCost: 1, forcedProcs: [],
      note: "Wiki Cinta attack 3. Release at 70-90% charge: pure Heat, knockdown, infinite body punch-through. Uses the same bow charge timing as the charged shot.",
    },
  ],
  daikyu_prime: [
    {
      label: "Quick Shot",
      ...dmg({ impact: 112.5, puncture: 150, slash: 112.5 }),
      fireRate: 1, criticalChance: 0.4, criticalMultiplier: 2.4, statusChance: 0.5,
      chargeTime: 0.25, ammoCost: 1, forcedProcs: ["Impact"],
      note: "Wiki Daikyu Prime attack 1. Fired at 25% charge for half damage. Uses the same bow charge timing as the charged shot.",
    },
  ],
  drakgoon: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 8, puncture: 8, slash: 24 }),
      fireRate: 3.33, criticalChance: 0.05, criticalMultiplier: 2, statusChance: 0.063,
      multishot: 10, chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: [],
      note: "Wiki Drakgoon attack 1. 10 pellets of 40, no charge wait, 1.5 m punch-through.",
    },
  ],
  kuva_drakgoon: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 4.6, puncture: 4.6, slash: 13.8 }),
      fireRate: 3.33, criticalChance: 0.19, criticalMultiplier: 2.1, statusChance: 0.09,
      multishot: 10, chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: [],
      note: "Wiki Kuva Drakgoon attack 1. 10 pellets of 23, no charge wait. Progenitor bonus not included.",
    },
  ],
  dread: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 16.8, puncture: 16.8, slash: 134.4 }),
      fireRate: 1, criticalChance: 0.5, criticalMultiplier: 2, statusChance: 0.2,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Dread attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  // Epitaph: the primary is the charged shot; the "Uncharged AoE" (a real wiki explosion, attack 3,
  // child of attack 2) belongs to this mode only, so it lives here and not on the primary.
  epitaph: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 40, puncture: 30, slash: 30 }),
      fireRate: 1.5, criticalChance: 0.02, criticalMultiplier: 1.2, statusChance: 0.5,
      chargeTime: 0, chargeMode: "standard", triggerType: "Semi-Auto", ammoCost: 1, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Uncharged AoE", blast: 20, totalDamage: 20, radius: 8, falloffReduction: 0.8 }],
      note: "Wiki Epitaph attack 2. DPS covers the direct hit only; its Blast explosion (attack 3) is listed below it.",
    },
  ],
  epitaph_prime: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 40, puncture: 30, slash: 30 }),
      fireRate: 1.75, criticalChance: 0.04, criticalMultiplier: 1.8, statusChance: 0.5,
      chargeTime: 0, chargeMode: "standard", triggerType: "Semi-Auto", ammoCost: 1, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Uncharged AoE", blast: 30, totalDamage: 30, radius: 10, falloffReduction: 0.8 }],
      note: "Wiki Epitaph Prime attack 2. DPS covers the direct hit only; its Blast explosion (attack 3) is listed below it.",
    },
  ],
  // Evensong: the 4 m explosion only happens on a full charge, so it stays with the primary.
  evensong: [
    {
      label: "Quick Shot",
      ...dmg({ puncture: 97.5, slash: 227.5 }),
      fireRate: 1, criticalChance: 0.25, criticalMultiplier: 2.2, statusChance: 0.38,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Evensong attack 1. Quick tap, no charge wait and no explosion (that needs a full charge).",
    },
  ],
  // Lanka: the wiki's fire rate is a 1,000,000,000 placeholder, so timing comes from the charge alone (same rule as its charged shot).
  lanka: [
    {
      label: "Partially Charged Shot",
      ...dmg({ electricity: 200 }),
      criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.25,
      chargeTime: 0.33, ammoCost: 1, forcedProcs: [],
      note: "Wiki Lanka attack 1. Released at 33% charge, 1.5 m punch-through. DPS uses the charge time alone, like the full charge (the wiki has no real fire rate for Lanka).",
    },
  ],
  miter: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 20, puncture: 10, slash: 70 }),
      fireRate: 2.5, criticalChance: 0.05, criticalMultiplier: 2, statusChance: 0.2,
      chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: [],
      note: "Wiki Miter attack 1. Quick tap: 100 per blade, no charge wait.",
    },
  ],
  mk1_paris: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 5.75, puncture: 86.25, slash: 23 }),
      fireRate: 1, criticalChance: 0.3, criticalMultiplier: 2, statusChance: 0.15,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Mk1-Paris attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  // Mutalist Cernos: the wiki attaches the Toxin Cloud to the charged shot (attack 3, parent 2), so it stays with the primary.
  mutalist_cernos: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 184.5, puncture: 10.25, slash: 10.25 }),
      fireRate: 1, criticalChance: 0.15, criticalMultiplier: 2, statusChance: 0.49,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Mutalist Cernos attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  nataruk: [
    {
      label: "Quick Shot",
      ...dmg({ puncture: 405, slash: 45 }),
      fireRate: 0.667, criticalChance: 0.2, criticalMultiplier: 1.8, statusChance: 0.3,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: ["Impact"],
      note: "Wiki Nataruk attack 1. Quick tap with a forced Impact proc, no charge wait.",
    },
    {
      label: "Perfect Shot",
      ...dmg({ puncture: 648, slash: 252 }),
      fireRate: 0.667, criticalChance: 0.6, criticalMultiplier: 2.4, statusChance: 0.5,
      chargeTime: 0.7, ammoCost: 1, forcedProcs: [],
      note: "Wiki Nataruk attack 3. Release just after 70% charge: same damage as a full charge, higher crit. Uses the same bow charge timing as the charged shot.",
    },
  ],
  // Opticor: both explosions are real wiki AoE attacks; the primary keeps the charged one, the quick shot its own.
  // The wiki's Quick Shot attack has no charge time (the 40% minimum is page text only), so none is modelled.
  opticor: [
    {
      label: "Quick Shot",
      ...dmg({ impact: 50, puncture: 425, slash: 25 }),
      fireRate: 1, criticalChance: 0.2, criticalMultiplier: 2.5, statusChance: 0.2,
      chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: [],
      radialAttacks: [{ name: "Quick Shot AoE", magnetic: 200, totalDamage: 200, radius: 6, falloffReduction: 0.6 }],
      note: "Wiki Opticor attack 3. Half-damage shot fired from 40% charge (that wait is not modelled, as for the charged shot here). DPS covers the direct hit only; its explosion (attack 4) is listed below it.",
    },
  ],
  opticor_vandal: [
    {
      label: "Quick Shot",
      ...dmg({ impact: 20, puncture: 140, slash: 40 }),
      fireRate: 2, criticalChance: 0.24, criticalMultiplier: 2.6, statusChance: 0.3,
      chargeTime: 0, chargeMode: "standard", ammoCost: 1, forcedProcs: [],
      radialAttacks: [{ name: "Quick Shot AoE", magnetic: 100, totalDamage: 100, radius: 4.6, falloffReduction: 0.6 }],
      note: "Wiki Opticor Vandal attack 3. Half-damage shot fired from 40% charge (that wait is not modelled, as for the charged shot here). DPS covers the direct hit only; its explosion (attack 4) is listed below it.",
    },
  ],
  paris: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 8, puncture: 120, slash: 32 }),
      fireRate: 1, criticalChance: 0.3, criticalMultiplier: 2, statusChance: 0.1,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Paris attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  paris_prime: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 9, puncture: 153, slash: 18 }),
      fireRate: 1, criticalChance: 0.45, criticalMultiplier: 2, statusChance: 0.2,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Paris Prime attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
  rakta_cernos: [
    {
      label: "Uncharged Shot",
      ...dmg({ impact: 211.5, puncture: 11.75, slash: 11.75 }),
      fireRate: 1, criticalChance: 0.35, criticalMultiplier: 2, statusChance: 0.15,
      chargeTime: 0, chargeMode: "bow", ammoCost: 1, forcedProcs: [],
      note: "Wiki Rakta Cernos attack 1. Quick tap: half the damage of the charged shot, no charge wait.",
    },
  ],
};
