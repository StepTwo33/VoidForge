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
      chargeTime: 0, chargeMode: "standard", ammoCost: 1,
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
};
