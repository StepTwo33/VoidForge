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
export const DMG_KEYS = [
  "impact", "puncture", "slash", "heat", "cold", "toxin", "electricity",
  "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau",
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
  // ---- Batch 6a: glaive-style throws (pattern G), same shape as Glaive Prime above. Throw and
  // Charged Throw are wiki attacks 2 and 5; their bounce/recall explosions stay on the primary's
  // RADIAL ATTACK list too (melee radials add no DPS there) and are repeated under the matching mode.
  glaive: [
    {
      label: "Throw",
      ...dmg({ impact: 17.4, puncture: 17.4, slash: 81.2 }),
      fireRate: 1, criticalChance: 0.14, criticalMultiplier: 2.1, statusChance: 0.14,
      forcedProcs: [],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Glaive attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 34.65, puncture: 34.65, slash: 161.7 }),
      fireRate: 0.833, criticalChance: 0.16, criticalMultiplier: 2.2, statusChance: 0.16,
      forcedProcs: ["Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Glaive attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  pathocyst: [
    {
      label: "Throw",
      ...dmg({ impact: 49, puncture: 43, slash: 78, viral: 118 }),
      fireRate: 0.667, criticalChance: 0.17, criticalMultiplier: 2.3, statusChance: 0.33,
      forcedProcs: [],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Pathocyst attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 127, puncture: 121, slash: 135, viral: 193 }),
      fireRate: 0.833, criticalChance: 0.21, criticalMultiplier: 2.5, statusChance: 0.35,
      forcedProcs: [],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Pathocyst attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  coda_pathocyst: [
    {
      label: "Throw",
      ...dmg({ impact: 49, puncture: 45, slash: 80, viral: 123 }),
      fireRate: 0.667, criticalChance: 0.22, criticalMultiplier: 2.4, statusChance: 0.36,
      forcedProcs: [],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Coda Pathocyst attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 131, puncture: 125, slash: 137, viral: 201 }),
      fireRate: 0.833, criticalChance: 0.24, criticalMultiplier: 2.5, statusChance: 0.38,
      forcedProcs: [],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Coda Pathocyst attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  orvius: [
    {
      label: "Throw",
      ...dmg({ impact: 43, puncture: 10.75, slash: 161.25 }),
      fireRate: 0.75, criticalChance: 0.2, criticalMultiplier: 2.2, statusChance: 0.2,
      forcedProcs: [],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Orvius attack 2. DPS covers the direct hit only; the explosions are listed below it. A tap throw hangs the first enemy hit in the air for 3 s (Hover Attack below), then explodes.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 85.75, puncture: 21.5, slash: 321.75 }),
      fireRate: 0.833, criticalChance: 0.22, criticalMultiplier: 2.4, statusChance: 0.22,
      forcedProcs: ["Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Orvius attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Hover Attack",
      ...dmg({ cold: 75 }),
      fireRate: 0.75, criticalChance: 0.2, criticalMultiplier: 2.2, statusChance: 0.6,
      forcedProcs: [], showDps: false,
      note: "Wiki Orvius attack 8. Damage to the enemy held in the air by a tap throw: 3 ticks over 3 s, then the disc explodes. No DPS is shown.",
    },
  ],
  cerata: [
    {
      label: "Throw",
      ...dmg({ impact: 33, puncture: 39, slash: 52, toxin: 77 }),
      fireRate: 1, criticalChance: 0.19, criticalMultiplier: 2.1, statusChance: 0.33,
      forcedProcs: [],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Cerata attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 46, puncture: 80, slash: 114, toxin: 162 }),
      fireRate: 0.833, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.34,
      forcedProcs: ["Toxin", "Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Cerata attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  falcor: [
    {
      label: "Throw",
      ...dmg({ impact: 20, puncture: 40, slash: 80, electricity: 110 }),
      fireRate: 0.833, criticalChance: 0.14, criticalMultiplier: 1.8, statusChance: 0.36,
      forcedProcs: ["Impact"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Falcor attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 56, puncture: 20, slash: 230, electricity: 200 }),
      fireRate: 0.833, criticalChance: 0.16, criticalMultiplier: 2, statusChance: 0.38,
      forcedProcs: ["Electricity"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Falcor attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  halikar: [
    {
      label: "Throw",
      ...dmg({ impact: 16.3, puncture: 130.4, slash: 16.3 }),
      fireRate: 1.17, criticalChance: 0.19, criticalMultiplier: 2.1, statusChance: 0.31,
      forcedProcs: ["Impact"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Halikar attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 32.7, puncture: 261.6, slash: 32.7 }),
      fireRate: 0.833, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.33,
      forcedProcs: ["Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Halikar attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  halikar_wraith: [
    {
      label: "Throw",
      ...dmg({ impact: 87.7, puncture: 87.7, slash: 87.7 }),
      fireRate: 1.17, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.39,
      forcedProcs: ["Impact"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Halikar Wraith attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 52.7, puncture: 421.6, slash: 22.7 }),
      fireRate: 0.833, criticalChance: 0.21, criticalMultiplier: 2.5, statusChance: 0.41,
      forcedProcs: ["Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Halikar Wraith attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  kestrel: [
    {
      label: "Throw",
      ...dmg({ impact: 73.6, puncture: 9.2, slash: 9.2 }),
      fireRate: 1.08, criticalChance: 0.12, criticalMultiplier: 2.1, statusChance: 0.12,
      forcedProcs: ["Ragdoll"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Kestrel attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 147.2, puncture: 18.4, slash: 18.4 }),
      fireRate: 0.833, criticalChance: 0.14, criticalMultiplier: 2.2, statusChance: 0.14,
      forcedProcs: ["Ragdoll"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Kestrel attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  kestrel_prime: [
    {
      label: "Throw",
      ...dmg({ impact: 184, puncture: 23, slash: 23 }),
      fireRate: 1, criticalChance: 0.22, criticalMultiplier: 2.1, statusChance: 0.4,
      forcedProcs: ["Ragdoll"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Kestrel Prime attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 368, puncture: 46, slash: 46 }),
      fireRate: 1, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.4,
      forcedProcs: ["Ragdoll"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Kestrel Prime attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  xoris: [
    {
      label: "Throw",
      ...dmg({ impact: 24, puncture: 40.8, slash: 55.2 }),
      fireRate: 1.17, criticalChance: 0.2, criticalMultiplier: 2.4, statusChance: 0.18,
      forcedProcs: ["Impact"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Xoris attack 2. DPS covers the direct hit only; the explosions are listed below it.",
    },
    {
      label: "Charged Throw",
      ...dmg({ impact: 24, puncture: 40.8, slash: 55.2 }),
      fireRate: 0.833, criticalChance: 0.22, criticalMultiplier: 2.4, statusChance: 0.2,
      forcedProcs: ["Impact"],
      radialsKeep: ["Charged Throw Bounce Explosion", "Charged Throw Recall Explosion"],
      note: "Wiki Xoris attack 5. DPS covers the direct hit only; the explosions are listed below it.",
    },
  ],
  wolf_sledge: [
    {
      label: "Throw",
      ...dmg({ impact: 396.27, puncture: 23.31, slash: 357.42 }),
      fireRate: 1, criticalChance: 0.19, criticalMultiplier: 2.1, statusChance: 0.35,
      forcedProcs: ["Impact"],
      radialsKeep: ["Throw Bounce Explosion", "Throw Recall Explosion"],
      note: "Wiki Wolf Sledge attack 2. DPS covers the direct hit only; the explosions are listed below it. The wiki says the explosion also takes Heavy Attack bonuses (True Steel, Killing Blow, combo); not modelled here.",
    },
  ],
  // ---- Batch 6b: the other pattern-G melee modes (Round 38). Melee attacks fired by a combo,
  // heavy attack, slide, aerial or kill gauge have no defined rate, so they show no DPS ("Manual").
  // Falloff isn't modelled: the numbers are at full damage.
  redeemer: [
    {
      label: "Gunblade Shot",
      ...dmg({ blast: 30 }),
      fireRate: 1, criticalChance: 0.1, criticalMultiplier: 1.8, statusChance: 0.066,
      forcedProcs: ["Impact"], multishot: 10, showDps: false,
      note: "Wiki Redeemer attack 2. 10 pellets of 30 Blast, hit-scan, no AoE. Falloff to 16.67% from 10 m to 20 m. Shots come from stance combos and the charged heavy attack; heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  redeemer_prime: [
    {
      label: "Gunblade Shot",
      ...dmg({ blast: 80 }),
      fireRate: 0.917, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.09,
      forcedProcs: ["Impact"], multishot: 10, showDps: false,
      note: "Wiki Redeemer Prime attack 2. 10 pellets of 80 Blast, hit-scan, no AoE. Falloff to 6.25% from 10 m to 30 m. Shots come from stance combos and the charged heavy attack; heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  sarpa: [
    {
      label: "Gunblade Shot",
      ...dmg({ impact: 3.5, puncture: 10.5, slash: 21 }),
      fireRate: 3.33, criticalChance: 0.14, criticalMultiplier: 2, statusChance: 0.28,
      forcedProcs: [], showDps: false,
      note: "Wiki Sarpa attack 2. A 5-round burst of 35 per bullet. Falloff to 14.29% from 20 m to 40 m. The page also lists a 25% bonus to physical damage on shots; it isn't added here. Shots come from stance combos and the charged heavy attack; heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  stropha: [
    {
      label: "Gunblade Shot",
      ...dmg({ impact: 700 }),
      fireRate: 1, criticalChance: 0.3, criticalMultiplier: 2.4, statusChance: 0.14,
      forcedProcs: [], showDps: false,
      note: "Wiki Stropha attack 2. One 700 Impact shockwave, range 17 m, falloff from 6 m to 12 m in the wiki data (the page describes it differently). Shots come from stance combos and the charged heavy attack; heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  vastilok: [
    {
      label: "Gunblade Shot",
      ...dmg({ impact: 8.97, puncture: 10.35, slash: 49.68 }),
      fireRate: 1, criticalChance: 0.19, criticalMultiplier: 1.7, statusChance: 0.1033,
      forcedProcs: [], multishot: 9, showDps: false,
      note: "Wiki Vastilok attack 2. 9 pellets of 69, hit-scan. Falloff to 4.35% from 24 m to 49 m. The page also lists a 25% bonus to physical damage on shots; it isn't added here. Shots come from stance combos and the charged heavy attack; heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  ceramic_dagger: [
    {
      label: "Spectral Dagger",
      ...dmg({ impact: 35, puncture: 116.67, slash: 198.33 }),
      fireRate: 1, criticalChance: 0.1, criticalMultiplier: 1.5, statusChance: 0.2,
      forcedProcs: [], showDps: false,
      radialsKeep: ["Spectral Dagger Explosion"], ignoreBaseDamageMods: true,
      note: "Wiki Ceramic Dagger attack 2. Incarnon Form only. Each heavy attack throws 2 daggers that explode on impact (explosion below). Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  edun: [
    {
      label: "Polearm Throw",
      ...dmg({ impact: 144, puncture: 192, slash: 144 }),
      fireRate: 1, criticalChance: 0.3, criticalMultiplier: 2.6, statusChance: 0.2,
      forcedProcs: ["Impact"], showDps: false,
      radialsKeep: ["Polearm Explosion"],
      note: "Wiki Edun attack 2. Heavy attack: throws a copy of the polearm, which explodes after it sticks (explosion below). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  "ack_&_brunt": [
    {
      label: "Spectral Axe",
      ...dmg({ impact: 29.8, puncture: 14.9, slash: 104.3 }),
      fireRate: 0.833, criticalChance: 0.13, criticalMultiplier: 2, statusChance: 0.33,
      forcedProcs: [], showDps: false,
      radialAttacks: [{ name: "Spectral Axe Explosion", heat: 303, totalDamage: 303, radius: 5, falloffReduction: 0.3 }], ignoreBaseDamageMods: true,
      note: "Wiki Ack & Brunt attack 2. Incarnon Form only. Aerial and slide attacks send a spectral axe that explodes (explosion below); aerial axes deal 2x. Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  "argo_&_vel": [
    {
      label: "Heavy Attack Glaive",
      ...dmg({ impact: 40, slash: 160 }),
      fireRate: 0.8, criticalChance: 0.32, criticalMultiplier: 2.4, statusChance: 0.24,
      forcedProcs: [], showDps: false,
      radialAttacks: [{ name: "Heavy Attack Glaive AoE", impact: 20, slash: 80, totalDamage: 100, radius: 3, falloffReduction: 0.4 }],
      note: "Wiki Argo & Vel attack 2. Heavy attack: an energy glaive that bounces once and returns, with an AoE (below). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  hate: [
    {
      label: "Spectral Blade",
      ...dmg({ impact: 19.5, puncture: 19.5, slash: 91 }),
      fireRate: 0.917, criticalChance: 0.3, criticalMultiplier: 2.5, statusChance: 0.2,
      forcedProcs: [], showDps: false,
      radialsKeep: ["Spectral Blade Explosion"], ignoreBaseDamageMods: true,
      note: "Wiki Hate attack 2. Incarnon Form only. Forward and neutral combos launch a blade that explodes 0.4 s after it sticks (explosion below). Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  okina: [
    {
      label: "Spectral Dagger",
      ...dmg({ impact: 21, puncture: 49, slash: 70 }),
      fireRate: 1.08, criticalChance: 0.16, criticalMultiplier: 2, statusChance: 0.2,
      forcedProcs: [], showDps: false,
      radialsKeep: ["Spectral Dagger Explosion"], ignoreBaseDamageMods: true,
      note: "Wiki Okina attack 2. Incarnon Form only. Kills create a dagger that seeks an enemy within 15 m, applies 10 Cold stacks, then explodes (explosion below). Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  okina_prime: [
    {
      label: "Spectral Dagger",
      ...dmg({ impact: 27.6, puncture: 64.4, slash: 92 }),
      fireRate: 1.17, criticalChance: 0.3, criticalMultiplier: 2.6, statusChance: 0.24,
      forcedProcs: [], showDps: false,
      radialsKeep: ["Spectral Dagger Explosion"], ignoreBaseDamageMods: true,
      note: "Wiki Okina Prime attack 2. Incarnon Form only. Kills create a dagger that seeks an enemy within 15 m, applies 10 Cold stacks, then explodes (explosion below). Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  innodem: [
    {
      label: "Dagger Projectile",
      ...dmg({ radiation: 360 }),
      fireRate: 0.75, criticalChance: 0.22, criticalMultiplier: 2, statusChance: 0.22,
      forcedProcs: ["Impact"], showDps: false,
      note: "Wiki Innodem attack 2. Incarnon Form only. Aim-glide melee attacks launch it: range 21 m, falloff from 12 m to 20 m. No DPS is shown.",
    },
  ],
  nepheri: [
    {
      label: "Fireball",
      ...dmg({ heat: 131 }),
      fireRate: 1, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.33,
      forcedProcs: [], showDps: false,
      note: "Wiki Nepheri attack 2. Each fireball is 50% of base damage; the neutral combo ends with four of them. Range about 20 m. No DPS is shown.",
    },
  ],
  "sigma_&_octantis": [
    {
      label: "Shield Throw",
      ...dmg({ impact: 25.52, puncture: 18.56, slash: 71.92 }),
      fireRate: 1.08, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.16,
      forcedProcs: ["Stun"], showDps: false,
      radialAttacks: [{ name: "Shield Throw Explosion", blast: 50, totalDamage: 50, radius: 4, falloffReduction: 1 }],
      note: "Wiki Sigma & Octantis attack 2. Aerial attacks throw the shield; a heavy attack while it's out makes it explode and return (explosion below). Combo bonuses don't apply to the throw. No DPS is shown.",
    },
  ],
  arum_spinosa: [
    {
      label: "First Heavy Attack",
      ...dmg({ impact: 17.5, puncture: 27.5, slash: 57.5, toxin: 72.5 }),
      fireRate: 2, criticalChance: 0.09, criticalMultiplier: 1.7, statusChance: 0.0616,
      forcedProcs: [], multishot: 18, showDps: false,
      note: "Wiki Arum Spinosa attack 2. 18 spines (70 base x 2.5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
    {
      label: "Second Heavy Attack",
      ...dmg({ impact: 35, puncture: 55, slash: 115, toxin: 145 }),
      fireRate: 2, criticalChance: 0.09, criticalMultiplier: 1.7, statusChance: 0.123,
      forcedProcs: [], multishot: 9, showDps: false,
      note: "Wiki Arum Spinosa attack 3. The next heavy attack in sequence: 9 spines (70 base x 5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  quassus: [
    {
      label: "First Heavy Attack",
      ...dmg({ puncture: 76, slash: 114 }),
      fireRate: 2, criticalChance: 0.3, criticalMultiplier: 2, statusChance: 0.01,
      forcedProcs: ["Slash"], multishot: 12, showDps: false,
      note: "Wiki Quassus attack 2. 12 daggers (76 base x 2.5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
    {
      label: "Second Heavy Attack",
      ...dmg({ puncture: 152, slash: 228 }),
      fireRate: 2, criticalChance: 0.3, criticalMultiplier: 2, statusChance: 0.02,
      forcedProcs: ["Slash"], multishot: 6, showDps: false,
      note: "Wiki Quassus attack 3. The next heavy attack in sequence: 6 daggers (76 base x 5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  quassus_prime: [
    {
      label: "First Heavy Attack",
      ...dmg({ puncture: 76, slash: 114 }),
      fireRate: 2, criticalChance: 0.35, criticalMultiplier: 2.5, statusChance: 0.01,
      forcedProcs: ["Slash"], multishot: 18, showDps: false,
      note: "Wiki Quassus Prime attack 2. 18 daggers (76 base x 2.5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
    {
      label: "Second Heavy Attack",
      ...dmg({ puncture: 152, slash: 228 }),
      fireRate: 2, criticalChance: 0.35, criticalMultiplier: 2.5, statusChance: 0.02,
      forcedProcs: ["Slash"], multishot: 9, showDps: false,
      note: "Wiki Quassus Prime attack 3. The next heavy attack in sequence: 9 daggers (76 base x 5). Heavy-attack and combo bonuses aren't applied, so no DPS is shown.",
    },
  ],
  corufell: [
    {
      label: "Heavy Projectile",
      ...dmg({ heat: 600 }),
      fireRate: 0.833, criticalChance: 0.26, criticalMultiplier: 2.4, statusChance: 0.14,
      forcedProcs: [],
      triggerType: "Charge",
      note: "Wiki Corufell attack 2. Heavy attack fires up to two energy projectiles; falloff to 50% from 15 m to 30 m. Shown the same way as Corufell Prime (DPS at the wiki fire rate, no charge).",
    },
  ],
  tenet_agendus: [
    {
      label: "Energy Disk",
      ...dmg({ electricity: 2880 }),
      fireRate: 1, criticalChance: 0.24, criticalMultiplier: 2, statusChance: 0.28,
      forcedProcs: [], showDps: false,
      note: "Wiki Tenet Agendus attack 2. Heavy attack (1 s wind-up): one disk, up to 40 m, falloff to 5% from 10 m to 20 m. The 2880 already includes the heavy attack's 5x. Combo bonus isn't applied, so no DPS is shown.",
    },
  ],
  tenet_grigori: [
    {
      label: "Energy Disk",
      ...dmg({ impact: 1360, puncture: 1360, slash: 1360 }),
      fireRate: 1, criticalChance: 0.24, criticalMultiplier: 1.6, statusChance: 0.38,
      forcedProcs: [], showDps: false,
      ignoreBaseDamageMods: true,
      note: "Wiki Tenet Grigori attack 2. Heavy slide attack, or the second hit of a heavy combo: a ricocheting disk, up to 10 m. Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  tatsu: [
    {
      label: "Soul Swarm",
      ...dmg({ radiation: 96 }),
      fireRate: 1, criticalChance: 0.11, criticalMultiplier: 1.9, statusChance: 0.23,
      forcedProcs: ["Stun"], showDps: false,
      ignoreBaseDamageMods: true,
      note: "Wiki Tatsu attack 2. Kills store up to 5 charges; a slide attack releases one seeking projectile per charge (30 m) that stuns. Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
    },
  ],
  tatsu_prime: [
    {
      label: "Soul Swarm",
      ...dmg({ radiation: 96 }),
      fireRate: 1.17, criticalChance: 0.11, criticalMultiplier: 1.9, statusChance: 0.23,
      forcedProcs: ["Stun"], showDps: false,
      ignoreBaseDamageMods: true,
      note: "Wiki Tatsu Prime attack 2. Kills store up to 5 charges; a slide attack releases one seeking projectile per charge (30 m) that stuns. Melee damage mods like Pressure Point don't apply to it (wiki); elemental, crit and status mods do. No DPS is shown.",
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
  // ---- Batch 3: fire-mode toggles (pattern B) -------------------------------------------
  // The primary is the wiki's first attack (the mode the weapon starts in); the other mode is the alt.
  // Stats are per shot / pellet from Module:Weapons/data/{primary,secondary}; anything the alt does
  // not set (magazine, reload, ...) is the weapon's own value, as on the wiki.
  kuva_zarr: [
    {
      label: "Barrage Mode",
      ...dmg({ impact: 15, puncture: 25, slash: 10 }),
      fireRate: 2.17, criticalChance: 0.37, criticalMultiplier: 2.5, statusChance: 0.097,
      multishot: 10, ammoCost: 1,
      note: "Wiki Kuva Zarr attack 5. 10 pellets of 50 each; multishot adds pellets. Falloff to 2% from 20 m to 40 m is not modelled.",
    },
  ],
  // Ambassador: switching to Charge mode reloads; the charge is automatic. The 800 explosion
  // (wiki attack 3) belongs to the charged shot, so it lives here and not on the Auto primary.
  ambassador: [
    {
      label: "Charge Mode",
      ...dmg({ electricity: 600 }),
      fireRate: 1, criticalChance: 0.16, criticalMultiplier: 2.8, statusChance: 0.32,
      chargeTime: 1, chargeMode: "standard", triggerType: "Charge", ammoCost: 16,
      radialAttacks: [{ name: "Charged AoE", electricity: 800, totalDamage: 800, radius: 6, falloffReduction: 0.5 }],
      note: "Wiki Ambassador attacks 2 and 3. 1 s automatic charge, 16 ammo a shot (6 shots a magazine); the 6 m explosion is listed below it. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  argonak: [
    {
      label: "Full Auto Mode",
      ...dmg({ impact: 24.51, puncture: 6.27, slash: 26.22 }),
      fireRate: 6, criticalChance: 0.09, criticalMultiplier: 1.5, statusChance: 0.27,
      triggerType: "Auto", ammoCost: 1,
      note: "Wiki Argonak attack 2. Same damage as semi-auto, faster but with lower crit.",
    },
  ],
  fulmin: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ impact: 100, electricity: 400 }),
      fireRate: 2.17, criticalChance: 0.3, criticalMultiplier: 2.2, statusChance: 0.16,
      triggerType: "Semi-Auto", ammoCost: 10, forcedProcs: ["Impact"],
      note: "Wiki Fulmin attack 2. Costs 10 ammo a shot. Forced Impact only up to 9 m, falloff to 33% from 10 m to 20 m and the 1x headshot multiplier are not modelled.",
    },
  ],
  fulmin_prime: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ impact: 110, electricity: 440 }),
      fireRate: 2.17, criticalChance: 0.3, criticalMultiplier: 2.2, statusChance: 0.22,
      triggerType: "Semi-Auto", ammoCost: 10, forcedProcs: ["Impact"],
      note: "Wiki Fulmin Prime attack 2. Costs 10 ammo a shot. Forced Impact only up to 9 m, falloff to 33% from 12 m to 24 m and the 1x headshot multiplier are not modelled.",
    },
  ],
  stradavar: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ impact: 7.5, puncture: 30, slash: 12.5 }),
      fireRate: 5, criticalChance: 0.28, criticalMultiplier: 2, statusChance: 0.16,
      triggerType: "Semi-Auto", ammoCost: 1,
      note: "Wiki Stradavar attack 2.",
    },
  ],
  stradavar_prime: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ impact: 8, puncture: 24, slash: 48 }),
      fireRate: 3.33, criticalChance: 0.3, criticalMultiplier: 2.8, statusChance: 0.22,
      triggerType: "Semi-Auto", ammoCost: 2,
      note: "Wiki Stradavar Prime attack 2. Costs 2 ammo a shot.",
    },
  ],
  zenith: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ impact: 15, puncture: 120, slash: 15 }),
      fireRate: 3, criticalChance: 0.35, criticalMultiplier: 2.5, statusChance: 0.08,
      triggerType: "Semi-Auto", ammoCost: 3, reloadTime: 1.4,
      note: "Wiki Zenith attack 2. Costs 3 ammo a shot; the wiki lists a 1.4 s reload for this mode. Infinite punch through and the head-highlighting disc are not modelled.",
    },
  ],
  fusilai: [
    {
      label: "Semi-Auto Mode",
      ...dmg({ puncture: 30.8, slash: 46.2 }),
      fireRate: 1.5, criticalChance: 0.03, criticalMultiplier: 1.5, statusChance: 0.123,
      multishot: 3, triggerType: "Semi-Auto", ammoCost: 3,
      note: "Wiki Fusilai attack 2. Throws 3 knives of 77 in a wide fan (3 ammo); multishot adds knives.",
    },
  ],
  // Hystrix: alt-fire cycles the quill element; each quill forces its own status (wiki ForcedProcs).
  hystrix: [
    {
      label: "Fire Quill",
      ...dmg({ impact: 2.4, puncture: 34.4, slash: 3.2 }),
      fireRate: 7, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.1,
      ammoCost: 1, forcedProcs: ["Heat"],
      note: "Wiki Hystrix attack 2. Guaranteed Heat status on every hit.",
    },
    {
      label: "Electric Quill",
      ...dmg({ impact: 2.4, puncture: 34.4, slash: 3.2 }),
      fireRate: 7, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.1,
      ammoCost: 1, forcedProcs: ["Electricity"],
      note: "Wiki Hystrix attack 3. Guaranteed Electricity status on every hit.",
    },
    {
      label: "Ice Quill",
      ...dmg({ impact: 2.16, puncture: 30.96, slash: 2.88 }),
      fireRate: 7, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.1,
      ammoCost: 1, forcedProcs: ["Cold"],
      note: "Wiki Hystrix attack 4. Guaranteed Cold status on every hit.",
    },
  ],
  hystrix_prime: [
    {
      label: "Fire Quill",
      ...dmg({ impact: 2.76, puncture: 39.56, slash: 3.68 }),
      fireRate: 7, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.2,
      ammoCost: 1, forcedProcs: ["Heat"],
      note: "Wiki Hystrix Prime attack 2. Guaranteed Heat status on every hit.",
    },
    {
      label: "Electric Quill",
      ...dmg({ impact: 2.76, puncture: 39.56, slash: 3.68 }),
      fireRate: 7, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.2,
      ammoCost: 1, forcedProcs: ["Electricity"],
      note: "Wiki Hystrix Prime attack 3. Guaranteed Electricity status on every hit.",
    },
    {
      label: "Ice Quill",
      ...dmg({ impact: 2.76, puncture: 39.56, slash: 3.68 }),
      fireRate: 7, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.2,
      ammoCost: 1, forcedProcs: ["Cold"],
      note: "Wiki Hystrix Prime attack 4. Guaranteed Cold status on every hit.",
    },
  ],
  // Sepulcrum lock-on uses no ammo but needs a gauge filled by 5 primary-fire kills, so it has no
  // steady DPS: stats are shown with DPS hidden. Its explosion (wiki attack 4) is listed below it.
  sepulcrum: [
    {
      label: "Lock-On Mode",
      ...dmg({ impact: 19.2, puncture: 53.76, slash: 23.04 }),
      fireRate: 1, criticalChance: 0.38, criticalMultiplier: 3, statusChance: 0.26,
      triggerType: "Semi-Auto", burstCount: 1, burstDelay: 0, ammoCost: 0, forcedProcs: ["Impact"],
      showDps: false,
      radialAttacks: [{ name: "Lock-On Radial Attack", heat: 480, totalDamage: 480, radius: 3, falloffReduction: 0.2 }],
      note: "Wiki Sepulcrum attacks 3 and 4. Seeking missiles at up to 5 locked targets; no ammo, but each volley needs 5 primary-fire kills, so no DPS is shown.",
    },
  ],
  tenet_diplos: [
    {
      label: "Lock-on Mode",
      ...dmg({ impact: 11.2, puncture: 9, slash: 7.8 }),
      fireRate: 1, criticalChance: 0.36, criticalMultiplier: 2.2, statusChance: 0.14,
      triggerType: "Burst", burstCount: 2, burstDelay: 0.06, ammoCost: 2,
      note: "Wiki Tenet Diplos attack 2. While aiming: 2 seeking shots per locked target (up to 8), 4 ammo per target. DPS is per target.",
    },
  ],
  haalvu: [
    {
      label: "Alt-Fire (burst mode)",
      ...dmg({ tau: 34 }),
      fireRate: 12, criticalChance: 0.2, criticalMultiplier: 1.8, statusChance: 0.26,
      triggerType: "Burst", burstCount: 2, burstDelay: 0.05, ammoCost: 1.5,
      note: "Wiki Haalvu attack 2. Split barrels fire 2-shot bursts at up to 4 targets within 10 m, 1.5 ammo a shot. DPS is per target.",
    },
  ],
  // ---- Batch 4a: alt-fire shots with their own stats (pattern D) --------------------------
  // The primary is the wiki's first attack; the alt-fire attack (and any AoE whose wiki
  // AttackParentIndex points at it) is shown here. Every mode sets its own trigger, burst,
  // ammo cost and forced procs so the primary's never leak in. Forced Stagger is not a status
  // effect, so the calculator ignores it (as it does Ragdoll / Knockdown).
  alternox: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 5, puncture: 37.5, slash: 7.5 }),
      fireRate: 1.5, criticalChance: 0.02, criticalMultiplier: 2, statusChance: 0.44,
      triggerType: "Active", ammoCost: 4, forcedProcs: [],
      radialAttacks: [
        { name: "Alt-Fire Damage over Time", electricity: 50, totalDamage: 50, radius: 6, falloffReduction: 0.6 },
        { name: "Alt-Fire Explosion", electricity: 100, totalDamage: 100, radius: 6, falloffReduction: 0.6, explosionDelay: 10 },
      ],
      note: "Wiki Alternox attacks 2-4. Costs 4 ammo. The sphere pulses 50 Electricity each second for 10 s, then explodes (or when you fire again). DPS covers the contact hit only; the pulse and explosion are listed below it.",
    },
  ],
  alternox_prime: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 7, puncture: 52.5, slash: 10.5 }),
      fireRate: 1.5, criticalChance: 0.02, criticalMultiplier: 2, statusChance: 0.5,
      triggerType: "Active", ammoCost: 4, forcedProcs: [],
      radialAttacks: [
        { name: "Alt-Fire Damage over Time", electricity: 70, totalDamage: 70, radius: 6, falloffReduction: 0.6 },
        { name: "Alt-Fire Explosion", electricity: 140, totalDamage: 140, radius: 6, falloffReduction: 0.6, explosionDelay: 10 },
      ],
      note: "Wiki Alternox Prime attacks 2-4. Costs 4 ammo. The sphere pulses 70 Electricity each second for 10 s, then explodes (or when you fire again). DPS covers the contact hit only; the pulse and explosion are listed below it.",
    },
  ],
  // Battacor: the beam needs 1-3 charges from primary-fire kills (damage x charges), so no DPS.
  battacor: [
    {
      label: "Secondary Fire",
      ...dmg({ radiation: 208 }),
      fireRate: 5, criticalChance: 0.34, criticalMultiplier: 3, statusChance: 0.08,
      chargeTime: 0.4, chargeMode: "standard", triggerType: "Auto-Charge",
      burstCount: 1, burstDelay: 0, ammoCost: 0, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Secondary Fire AoE", radiation: 208, totalDamage: 208, radius: 3.4, falloffReduction: 0.4 }],
      note: "Wiki Battacor attacks 2 and 3. Uses no ammo but needs 1-3 charges from primary-fire kills; damage is multiplied by the charges used (shown for 1). The explosion is 3.4 m on an enemy, 6 m on a surface. No DPS shown.",
    },
  ],
  efv_5_jupiter: [
    {
      label: "Buckshot",
      ...dmg({ puncture: 57, slash: 35, corrosive: 35 }),
      fireRate: 7.8334, criticalChance: 0.21, criticalMultiplier: 2.1, statusChance: 0.0573,
      multishot: 11, chargeTime: 1, chargeMode: "standard", triggerType: "Auto-Charge",
      ammoCost: 15, forcedProcs: ["Corrosive"],
      note: "Wiki EFV-5 Jupiter attack 2. 11 pellets of 127 for 15 ammo, guaranteed Corrosive. DPS uses 1 / (charge time + 1 / fire rate). Falloff to 0.8% from 5 m to 10 m is not modelled.",
    },
  ],
  efv_8_mars: [
    {
      label: "Alt-Fire",
      ...dmg({ corrosive: 35 }),
      fireRate: 1.5, criticalChance: 0.27, criticalMultiplier: 2.1, statusChance: 0.33,
      triggerType: "Charge", ammoCost: 3, forcedProcs: [],
      radialAttacks: [{ name: "Alt-Fire AoE", corrosive: 313, totalDamage: 313, radius: 3, falloffReduction: 0.8 }],
      note: "Wiki EFV-8 Mars attacks 2 and 3. Costs 3 ammo. The wiki lists no charge time, so DPS uses the 1.5 fire rate. The explosion forces Corrosive and is listed below it.",
    },
  ],
  euphona_prime: [
    {
      label: "Buckshot",
      ...dmg({ impact: 4.4, puncture: 17.6, slash: 66 }),
      fireRate: 1.5, criticalChance: 0.02, criticalMultiplier: 2, statusChance: 0.09,
      multishot: 10, ammoCost: 1, forcedProcs: [],
      note: "Wiki Euphona Prime attack 2. 10 pellets of 88; multishot adds pellets. Falloff to 1.1% from 6 m to 12 m is not modelled.",
    },
  ],
  harpak: [
    {
      label: "Harpoon",
      ...dmg({ impact: 40, puncture: 50, slash: 10 }),
      fireRate: 1.5, criticalChance: 0.25, criticalMultiplier: 2.3, statusChance: 0.13,
      triggerType: "Semi-Auto", burstCount: 1, burstDelay: 0, ammoCost: 1, forcedProcs: ["Puncture"],
      note: "Wiki Harpak attack 2. Tethered harpoon that pulls the enemy in; guaranteed Puncture.",
    },
  ],
  // Higasa: the charged shot needs a full gauge (10% per primary-fire kill), so no DPS.
  higasa: [
    {
      label: "Charged Shot",
      ...dmg({ blast: 390 }),
      fireRate: 1.2, criticalChance: 0.24, criticalMultiplier: 2, statusChance: 0.18,
      chargeTime: 1, chargeMode: "standard", triggerType: "Charge",
      burstCount: 1, burstDelay: 0, ammoCost: 0, forcedProcs: [],
      showDps: false,
      note: "Wiki Higasa attack 2. Hit-scan laser, no ammo, but needs a full gauge (10% per primary-fire kill), so no DPS is shown.",
    },
  ],
  kuva_hek: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 13.05, puncture: 56.55, slash: 17.4 }),
      fireRate: 1.17, criticalChance: 0.23, criticalMultiplier: 2.1, statusChance: 0.0332,
      multishot: 28, ammoCost: 4, forcedProcs: [],
      note: "Wiki Kuva Hek attack 2. Fires all 4 barrels: 28 pellets of 87 for 4 ammo (the whole magazine). Falloff to 1.1% from 15 m to 30 m is not modelled.",
    },
  ],
  panthera: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 10, puncture: 10, slash: 80 }),
      fireRate: 2, criticalChance: 0.25, criticalMultiplier: 2, statusChance: 0.35,
      triggerType: "Held", ammoCost: 1, forcedProcs: [],
      note: "Wiki Panthera attack 2. Held spinning blade, 6 m reach, 2 hits a second; ammo is only used while it hits.",
    },
  ],
  panthera_prime: [
    {
      label: "Alt-Fire",
      ...dmg({ slash: 100 }),
      fireRate: 2, criticalChance: 0.26, criticalMultiplier: 2, statusChance: 0.38,
      triggerType: "Held", ammoCost: 1, forcedProcs: [],
      note: "Wiki Panthera Prime attack 3. Held spinning blade, 2 hits a second; ammo is only used while it hits. The ricochet's Radial Attack belongs to the primary.",
    },
  ],
  stahlta: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 120, puncture: 180, slash: 300 }),
      fireRate: 0.667, criticalChance: 0.4, criticalMultiplier: 3, statusChance: 0.32,
      chargeTime: 1.6, chargeMode: "standard", triggerType: "Charge", ammoCost: 20, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Alt-Fire AoE", radiation: 1200, totalDamage: 1200, radius: 7.2, falloffReduction: 0.7, explosionDelay: 0.36 }],
      note: "Wiki Stahlta attacks 2 and 3. Costs 20 ammo, guaranteed Impact; the 7.2 m explosion (50% status) is listed below it. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // Trumna: the grenade uses no ammo but needs a gauge filled by 5 primary-fire kills, so no DPS.
  trumna: [
    {
      label: "Alt-Fire Grenade",
      ...dmg({ impact: 100 }),
      fireRate: 1.33, criticalChance: 0.38, criticalMultiplier: 2.4, statusChance: 0.5,
      triggerType: "Semi-Auto", ammoCost: 0, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Grenade Bounce AoE", heat: 1000, totalDamage: 1000, radius: 6, falloffReduction: 0.4 }],
      note: "Wiki Trumna attacks 3 and 4. No ammo, but each grenade needs 5 primary-fire kills, so no DPS is shown. It explodes on each bounce (up to 7).",
    },
  ],
  trumna_prime: [
    {
      label: "Alt-Fire Grenade",
      ...dmg({ impact: 100 }),
      fireRate: 1.33, criticalChance: 0.38, criticalMultiplier: 2.4, statusChance: 0.5,
      triggerType: "Semi-Auto", ammoCost: 0, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Grenade Bounce AoE", heat: 1150, totalDamage: 1150, radius: 6, falloffReduction: 0.4 }],
      note: "Wiki Trumna Prime attacks 3 and 4. No ammo, but each grenade needs 5 primary-fire kills, so no DPS is shown. It explodes on each bounce (up to 7).",
    },
  ],

  // ---- Batch 4b: more alt-fire shots (pattern D), same rules as 4a ----------------------------
  // Beam weapons (Enkaus, Quanta family, Phantasma / Prime): the calculator's beam multishot rule
  // is keyed on weapon id, so it is also set on the alt; it only feeds the TTK status-DoT sim,
  // which the ALT FIRE section does not show, so the alt numbers are unaffected.
  tenora: [
    {
      label: "Charged Shot",
      ...dmg({ impact: 48, puncture: 144, slash: 48 }),
      fireRate: 10, criticalChance: 0.34, criticalMultiplier: 3, statusChance: 0.11,
      chargeTime: 0.8, chargeMode: "standard", triggerType: "Charge", ammoCost: 10, forcedProcs: [],
      note: "Wiki Tenora attack 2. One hit-scan shot of 240 for 10 ammo, 1 m punch through; the charge is automatic. DPS uses 1 / (charge time + 1 / fire rate). The wiki lists fire rate 10 here (2 on Tenora Prime).",
    },
  ],
  tenora_prime: [
    {
      label: "Charged Shot",
      ...dmg({ impact: 56, puncture: 168, slash: 56 }),
      fireRate: 2, criticalChance: 0.4, criticalMultiplier: 3, statusChance: 0.2,
      chargeTime: 0.8, chargeMode: "standard", triggerType: "Charge", ammoCost: 10, forcedProcs: [],
      note: "Wiki Tenora Prime attack 2. One hit-scan shot of 280 for 10 ammo, 1 m punch through; the charge is automatic. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  corinth: [
    {
      label: "Air Burst",
      ...dmg({ impact: 100 }),
      fireRate: 1.17, criticalChance: 0.04, criticalMultiplier: 1.6, statusChance: 0.28,
      multishot: 1, triggerType: "Semi-Auto", ammoCost: 1, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Air Burst Explosion", blast: 404, totalDamage: 404, radius: 9.4, falloffReduction: 0.9 }],
      note: "Wiki Corinth attacks 2 and 3. A grenade that bursts in midair after 20 m (not on a surface or enemy); a direct hit is 100 Impact with a guaranteed Impact proc. The 9.4 m explosion is listed below it.",
    },
  ],
  corinth_prime: [
    {
      label: "Air Burst",
      ...dmg({ impact: 100 }),
      fireRate: 0.667, criticalChance: 0.04, criticalMultiplier: 1.6, statusChance: 0.5,
      multishot: 1, triggerType: "Semi-Auto", burstCount: 1, burstDelay: 0, ammoCost: 4, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Air Burst Explosion", blast: 2200, totalDamage: 2200, radius: 9.8, falloffReduction: 0.9 }],
      note: "Wiki Corinth Prime attacks 2 and 3. Costs 4 ammo. Press alt-fire again to burst the grenade in midair; a direct hit is 100 Impact with a guaranteed Impact proc. The 9.8 m explosion is listed below it.",
    },
  ],
  basmu: [
    {
      label: "Twin Beams",
      ...dmg({ electricity: 12 }),
      fireRate: 12, criticalChance: 0.02, criticalMultiplier: 4.8, statusChance: 0.3,
      multishot: 2, triggerType: "Held", ammoCost: 1, forcedProcs: [],
      note: "Wiki Basmu attack 3. Two held 9 m beams, 1 battery ammo per tick. The damage ramp-up and the chaining (up to 5 enemies, half damage each step) are not modelled.",
    },
  ],
  buzlok: [
    {
      label: "Tracking Beacon",
      ...dmg({ puncture: 3 }),
      fireRate: 1.67, criticalChance: 0, criticalMultiplier: 1, statusChance: 0,
      triggerType: "Semi-Auto", ammoCost: 1, forcedProcs: [], ignoreMultishotMods: true,
      note: "Wiki Buzlok attack 2. Tags a target for 20 s: primary shots home on it and you gain +50% critical chance. Multishot mods do not add beacons.",
    },
  ],
  // Cedo / Prime: only one glaive (or one set, with multishot) is out at a time, about 5 s or 11
  // bounces, so the fire rate gives no real DPS.
  cedo: [
    {
      label: "Glaive",
      ...dmg({ slash: 20 }),
      fireRate: 1, criticalChance: 0.02, criticalMultiplier: 1.4, statusChance: 0.5,
      multishot: 1, triggerType: "Semi-Auto", ammoCost: 0, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Glaive Radial Attack", blast: 10, totalDamage: 10, radius: 6, falloffReduction: 0 }],
      note: "Wiki Cedo attacks 2 and 3. No ammo. The glaive bounces up to 11 times, exploding in 6 m on each hit with two guaranteed procs (listed below it). Only one glaive is out at a time, so no DPS is shown.",
    },
  ],
  cedo_prime: [
    {
      label: "Glaive",
      ...dmg({ slash: 20 }),
      fireRate: 1, criticalChance: 0.1, criticalMultiplier: 2, statusChance: 0.5,
      multishot: 1, triggerType: "Semi-Auto", ammoCost: 0, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Glaive Radial Attack", blast: 10, totalDamage: 10, radius: 6, falloffReduction: 0 }],
      note: "Wiki Cedo Prime attacks 2 and 3. No ammo. The glaive bounces up to 11 times, exploding in 6 m on each hit with two guaranteed procs (listed below it). Only one glaive is out at a time, so no DPS is shown.",
    },
  ],
  paracyst: [
    {
      label: "Infested Harpoon",
      ...dmg({ toxin: 15 }),
      fireRate: 5, criticalChance: 0, criticalMultiplier: 1, statusChance: 0.3,
      chargeTime: 0.25, chargeMode: "standard", triggerType: "Charge", burstCount: 1, burstDelay: 0,
      ammoCost: 1, forcedProcs: [],
      note: "Wiki Paracyst attack 2. A 50 m tether that pulls the enemy in, then 15 Toxin a tick for 5 ticks. The wiki lists it as burst fire but the page says it is a charge shot; DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // Azima: the alt-fire throws the whole magazine as a turret, so no DPS.
  azima: [
    {
      label: "Turret",
      ...dmg({ blast: 75 }),
      fireRate: 10, criticalChance: 0.16, criticalMultiplier: 2, statusChance: 0.16,
      triggerType: "Semi-Auto", ammoCost: 75, forcedProcs: [],
      showDps: false,
      note: "Wiki Azima attack 2. Throws the whole magazine as a turret that fires its rounds as primary shots for about 10 s, then deals 75 Blast (shown). No DPS is shown.",
    },
  ],
  scyotid: [
    {
      label: "Snare",
      ...dmg({ toxin: 40 }),
      fireRate: 1.6, criticalChance: 0.08, criticalMultiplier: 2.4, statusChance: 0.32,
      multishot: 1, triggerType: "Semi", ammoCost: 4, forcedProcs: [],
      note: "Wiki Scyotid attack 2. A webbed snare that damages, holds and pulls together up to 8 enemies within 15 m for about 6 s. Costs 4 ammo.",
    },
  ],
  enkaus: [
    {
      label: "Ink Shot",
      ...dmg({ puncture: 4, corrosive: 12 }),
      fireRate: 2, criticalChance: 0.16, criticalMultiplier: 1.8, statusChance: 0.32,
      triggerType: "Semi-Auto", ammoCost: 1, forcedProcs: [],
      radialAttacks: [{ name: "Alt-Fire Radial Attack", puncture: 4, corrosive: 10, totalDamage: 14, radius: 8, falloffReduction: 0.5 }],
      note: "Wiki Enkaus attacks 2 and 3. Inks enemies for 20 s (primary hits on them refill ammo; they dissolve below 35% health). The 8 m explosion is listed below it. The wiki data says 1 ammo, the page says 15.",
    },
  ],
  // Quanta family: a cube explodes for 150 (0.5 m) on contact or 600 (6 m) when shot, never
  // both, so the rows are listed and no DPS is shown.
  quanta: [
    {
      label: "Cube",
      ...dmg({ electricity: 100 }),
      fireRate: 4, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 0.26,
      multishot: 1, triggerType: "Semi", ammoCost: 10, forcedProcs: [],
      showDps: false,
      radialAttacks: [
        { name: "Cube Explosion", blast: 150, totalDamage: 150, radius: 0.5, falloffReduction: 0 },
        { name: "Cube (shot by player)", blast: 600, totalDamage: 600, radius: 6, falloffReduction: 0 },
      ],
      note: "Wiki Quanta attacks 2-4. Costs 10 ammo. The cube stops after about 15 m and explodes on contact (150, 0.5 m), when shot (600, 6 m), or after 8 s. One or the other, so no DPS is shown.",
    },
  ],
  quanta_vandal: [
    {
      label: "Cube",
      ...dmg({ electricity: 100 }),
      fireRate: 4, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 0.26,
      multishot: 1, triggerType: "Semi", ammoCost: 10, forcedProcs: [],
      showDps: false,
      radialAttacks: [
        { name: "Cube Explosion", blast: 150, totalDamage: 150, radius: 0.5, falloffReduction: 0 },
        { name: "Cube (shot by player)", blast: 600, totalDamage: 600, radius: 6, falloffReduction: 0 },
      ],
      note: "Wiki Quanta Vandal attacks 2-4. Costs 10 ammo. The cube stops after about 15 m and explodes on contact (150, 0.5 m), when shot (600, 6 m), or after 8 s. One or the other, so no DPS is shown.",
    },
  ],
  tenet_quanta: [
    {
      label: "Cube",
      ...dmg({ electricity: 180 }),
      fireRate: 4, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 1,
      multishot: 1, triggerType: "Semi", ammoCost: 10, forcedProcs: [],
      showDps: false,
      radialAttacks: [
        { name: "Cube Explosion", blast: 150, totalDamage: 150, radius: 0.5, falloffReduction: 0 },
        { name: "Cube (shot by player)", blast: 600, totalDamage: 600, radius: 6, falloffReduction: 0 },
      ],
      note: "Wiki Tenet Quanta attacks 2-4. Costs 10 ammo. The cube stops after about 15 m and explodes on contact (150, 0.5 m), when shot (600, 6 m), or after 8 s. One or the other, so no DPS is shown.",
    },
  ],
  // Mutalist Quanta: the orb sits for 9 s (up to 3 merge) to buff shots fired through it, so no DPS.
  mutalist_quanta: [
    {
      label: "Infested Orb",
      ...dmg({ radiation: 20 }),
      fireRate: 10, criticalChance: 0, criticalMultiplier: 0, statusChance: 1,
      triggerType: "Semi", ammoCost: 5, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Orb Explosion", toxin: 100, totalDamage: 100, radius: 4.4, falloffReduction: 0.5 }],
      note: "Wiki Mutalist Quanta attacks 2 and 3. Costs 5 ammo. The orb sits for 9 s, then explodes (listed below it); shots fired through it gain Electricity and crit but deal 0.66x. No DPS is shown.",
    },
  ],
  phantasma: [
    {
      label: "Plasma Bomb",
      ...dmg({ impact: 15 }),
      fireRate: 2, criticalChance: 0.03, criticalMultiplier: 1.5, statusChance: 0.37,
      multishot: 1, chargeTime: 1, chargeMode: "standard", triggerType: "Charge", ammoCost: 2, forcedProcs: ["Impact"],
      radialAttacks: [
        { name: "Plasma Bomb Explosion", radiation: 73, totalDamage: 73, radius: 4.8, falloffReduction: 0.5 },
        { name: "Cluster Bombs Explosion", radiation: 18, totalDamage: 18, radius: 2 },
      ],
      note: "Wiki Phantasma attacks 2-5. Costs 2 ammo, guaranteed Impact. The 4.8 m explosion releases 5 homing bomblets (3 Impact each, then the 2 m explosion, listed once). Holding the charge longer adds damage; the wiki's base is shown. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  phantasma_prime: [
    {
      label: "Plasma Bomb",
      ...dmg({ impact: 15 }),
      fireRate: 2, criticalChance: 0.03, criticalMultiplier: 1.5, statusChance: 0.37,
      multishot: 1, chargeTime: 1, chargeMode: "standard", triggerType: "Charge", ammoCost: 2, forcedProcs: ["Impact"],
      radialAttacks: [
        { name: "Plasma Bomb Explosion", radiation: 73, totalDamage: 73, radius: 4.8, falloffReduction: 0.5 },
        { name: "Cluster Bombs Explosion", radiation: 18, totalDamage: 18, radius: 2 },
      ],
      note: "Wiki Phantasma Prime attacks 2-5. Costs 2 ammo (more as the magazine empties), guaranteed Impact. The 4.8 m explosion releases 5 homing bomblets (3 Impact each, then the 2 m explosion, listed once). Holding the charge longer adds damage; the wiki's base is shown. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // ---- Batch 4c: five alt-fire shots that each needed one decision ---------------------------
  // Aeolak: the wiki says the charge time is not affected by fire-rate mods (chargeTimeFixed).
  aeolak: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 58.2, puncture: 9.7, slash: 29.1 }),
      fireRate: 1.5, criticalChance: 0.21, criticalMultiplier: 2.3, statusChance: 0.33,
      multishot: 1, chargeTime: 0.3, chargeMode: "standard", chargeTimeFixed: true,
      triggerType: "Auto-Charge", ammoCost: 10, forcedProcs: ["Impact"],
      radialAttacks: [{ name: "Alt-Fire Explosion", blast: 789, totalDamage: 789, radius: 7, falloffReduction: 0.5 }],
      note: "Wiki Aeolak attacks 2 and 3. Auto-charges, costs 10 ammo, guaranteed Impact. The round explodes in 7 m (listed below it); the hit and the explosion roll status separately. Fire-rate mods speed up the 1.5 fire rate but not the 0.3 s charge. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // Tenet Plinx: the shot uses the whole magazine and deals 100 Impact + 100 Radiation per round
  // in it, so magazine mods scale it (damageTimesMagazine). Values below are per round.
  tenet_plinx: [
    {
      label: "Alt-Fire",
      ...dmg({ impact: 100 }),
      fireRate: 1, criticalChance: 0.4, criticalMultiplier: 3, statusChance: 0.2,
      multishot: 1, chargeTime: 0.8, chargeMode: "standard", triggerType: "Charge",
      ammoCost: 10, reloadTime: 2.5, forcedProcs: ["Impact"], damageTimesMagazine: true,
      radialAttacks: [{ name: "Alt-Fire AoE", radiation: 100, totalDamage: 100, radius: 6, falloffReduction: 0.4, explosionDelay: 0.8 }],
      note: "Wiki Tenet Plinx attacks 2 and 3. Needs a full magazine and uses all of it. Deals 100 Impact on contact and 100 Radiation in a 6 m pull-in explosion 0.8 s later, each multiplied by the magazine size, so magazine mods raise it. Guaranteed Impact. 2 s recharge delay (2.5 s to full at base). Synth Charge does not apply.",
    },
  ],
  // Tenet Tetra: the grenade uses the remaining magazine and scales with the share left; shown full.
  tenet_tetra: [
    {
      label: "Grenade",
      ...dmg({ impact: 200 }),
      fireRate: 1.33, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.3,
      multishot: 1, triggerType: "Semi-Auto", ammoCost: 80, reloadTime: 1.8, forcedProcs: [],
      usesWholeMagazine: true,
      radialAttacks: [{ name: "Grenade AoE", blast: 1000, totalDamage: 1000, radius: 8, falloffReduction: 0.6 }],
      note: "Wiki Tenet Tetra attacks 2 and 3, shown with a full magazine. Uses the rest of the magazine; damage scales with the share of the magazine left, and magazine mods do not raise it. The 8 m explosion (listed below it) falls off to 40% at the edge. Kinetic Ricochet does not affect it.",
    },
  ],
  // Coda Bassocyst: the mite clings and ticks for 10 s, so no DPS.
  coda_bassocyst: [
    {
      label: "Mite",
      ...dmg({ blast: 303 }),
      fireRate: 1.67, criticalChance: 0.18, criticalMultiplier: 2.2, statusChance: 0.4,
      multishot: 6, triggerType: "Semi-Auto", ammoCost: 4, forcedProcs: ["Impact", "Magnetic"],
      showDps: false,
      note: "Wiki Coda Bassocyst attack 2. Costs 4 ammo. Mites latch onto up to 6 enemies, mark their heads for 5 s and deal Impact and Magnetic damage and status every second for 10 s. Galvanized Savvy does not affect it; universal buffs (Xata's Whisper, Nourish, Shock Trooper and the like) do. On-status mods and arcanes do not trigger from it. No DPS is shown.",
    },
  ],
  // Stug: a full 10-stack blob (wiki page; the module has no alt attack). Multishot only adds
  // stacks, and the blob is already at the 10 cap, so multishot mods add nothing.
  stug: [
    {
      label: "Charged Blob",
      ...dmg({ corrosive: 36 }),
      fireRate: 4, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 0.1,
      multishot: 1, chargeTime: 2, chargeMode: "standard", triggerType: "Charge",
      ammoCost: 10, forcedProcs: [], ignoreMultishotMods: true,
      radialAttacks: [{ name: "Blob Explosion", corrosive: 750, totalDamage: 750, radius: 2.8, falloffReduction: 0.7 }],
      note: "Wiki Stug page: charges a full 10-stack blob over 2 s for 10 ammo. It sticks for 36 Corrosive in 2 m, then bursts at once for 750 Corrosive in 2.8 m (listed below it) with 70% falloff. Multishot mods add nothing past 10 stacks. Not available with the Incarnon Adapter. DPS uses 1 / (charge time + 1 / fire rate).",
    },
  ],
  // ---- Batch 5: thrown spears (pattern E). One throw, then the weapon reloads, and only one
  // spear is out at a time, so no DPS is shown. chargeTime 0: the throw is a tap (the primary's
  // charge does not apply).
  afentis: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 240, puncture: 120, slash: 40 }),
      fireRate: 1, criticalChance: 0.3, criticalMultiplier: 3, statusChance: 0.2,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 1, reloadTime: 1.8, forcedProcs: [],
      ignoreMultishotMods: true, showDps: false,
      note: "Wiki Afentis attack 3. Throws a copy of the spear for 1 ammo, then reloads. It impales and knocks down enemies; if it misses, it makes a 5 m Ballistarii Might field (buffs, no damage). One spear at a time; multishot does not add spears. No DPS is shown.",
    },
  ],
  afentis_prime: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 330, puncture: 165, slash: 55 }),
      fireRate: 1, criticalChance: 0.4, criticalMultiplier: 3, statusChance: 0.3,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 1, reloadTime: 1.8, forcedProcs: [],
      ignoreMultishotMods: true, showDps: false,
      note: "Wiki Afentis Prime attack 3. Throws a copy of the spear for 1 ammo, then reloads. It impales and knocks down enemies; if it misses, it makes a 10 m Ballistarii Might field (buffs, no damage). One spear at a time; multishot does not add spears. No DPS is shown.",
    },
  ],
  ferrox: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 35, puncture: 5, slash: 10 }),
      fireRate: 1, criticalChance: 0.04, criticalMultiplier: 2, statusChance: 0.33,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 1, reloadTime: 2, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Attraction Field", electricity: 150, totalDamage: 150, radius: 10 }],
      note: "Wiki Ferrox attacks 3 and 4. Throws the spear for 1 ammo, then reloads. Where it lands, a 10 m field (listed below it) deals 150 Electricity every 2 s and pulls enemies in, for 30 s. The field's 50% status chance is fixed; fire-rate mods make it tick faster. One spear at a time. No DPS is shown.",
    },
  ],
  tenet_ferrox: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 35, puncture: 5, slash: 10 }),
      fireRate: 1, criticalChance: 0.04, criticalMultiplier: 2, statusChance: 0.4,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 0, reloadTime: 2, forcedProcs: [],
      ignoreMultishotMods: true, showDps: false,
      radialAttacks: [{ name: "Attraction Field", electricity: 150, totalDamage: 150, radius: 10 }],
      note: "Wiki Tenet Ferrox attacks 3 and 4. The throw costs no ammo, but a reload must finish before you fire or throw again. Where it lands, a 10 m field (listed below it) deals 150 Electricity every 2 s and pulls enemies in, for 30 s. Multishot does not add spears. No DPS is shown.",
    },
  ],
  // Javlok: the throw uses the whole magazine; each round in it adds 20% to the 300 Heat explosion.
  javlok: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 45, puncture: 75, slash: 30 }),
      fireRate: 1, criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.25,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 6, reloadTime: 0.6, forcedProcs: ["Impact"],
      usesWholeMagazine: true, radialBonusPerRound: 0.2, ignoreMultishotMods: true, showDps: false,
      radialAttacks: [{ name: "Spear Throw Explosion", heat: 300, totalDamage: 300, radius: 6, falloffReduction: 0.6 }],
      note: "Wiki Javlok attacks 3 and 4, shown with a full magazine. Uses the whole magazine, guaranteed Impact. The 6 m explosion (listed below it) is 300 Heat x (1 + 0.2 per round in the magazine), so magazine mods raise it; it falls off to 40% at the edge. Multishot and Ammo Efficiency do not affect it. No DPS is shown.",
    },
  ],
  scourge: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 105, puncture: 22.5, slash: 22.5 }),
      fireRate: 1, criticalChance: 0.04, criticalMultiplier: 2, statusChance: 0.3,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 1, reloadTime: 0.6, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Spear Throw Explosion", corrosive: 55, totalDamage: 55, radius: 7, falloffReduction: 0.6 }],
      note: "Wiki Scourge attacks 3 and 4. Throws the spear, then reloads; needs at least 1 round. It impales, explodes for 55 Corrosive in 7 m (listed below it, 100% to 40% falloff), and puts a 2 m Bullet Attractor on the heads of enemies within 14 m. One field at a time. No DPS is shown.",
    },
  ],
  scourge_prime: [
    {
      label: "Spear Throw",
      ...dmg({ impact: 140, puncture: 30, slash: 30 }),
      fireRate: 1, criticalChance: 0.1, criticalMultiplier: 2, statusChance: 0.3,
      multishot: 1, chargeTime: 0, triggerType: "Semi", ammoCost: 1, reloadTime: 0.6, forcedProcs: [],
      showDps: false,
      radialAttacks: [{ name: "Spear Explosion", corrosive: 55, totalDamage: 55, radius: 7, falloffReduction: 0.6 }],
      note: "Wiki Scourge Prime attacks 3 and 4. Throws the spear for 1 ammo, then reloads. It impales, explodes for 55 Corrosive in 7 m (listed below it, 100% to 40% falloff), and puts a 2 m Bullet Attractor on the heads of enemies within 14 m. One field at a time. No DPS is shown.",
    },
  ],
};
