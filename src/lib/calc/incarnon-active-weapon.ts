/**
 * Resolve whether Incarnon Form is active and build the weapon used for calc.
 * Form stats replace base attack when tier-1 "Incarnon Form" evolution is selected.
 */

import type { IncarnonForm, IncarnonWeaponData } from "@/data/incarnon";
import { WEAPON_RADIAL_ATTACKS } from "@/data/weapon-radial-attacks";
import type { Weapon, WeaponRadialAttack } from "@/lib/types";

export function isIncarnonFormActive(
  selectedEvolutions: Record<number, number> | undefined,
  incarnonData: IncarnonWeaponData | undefined,
): boolean {
  if (!incarnonData || !selectedEvolutions) return false;
  const slot = selectedEvolutions[1];
  if (slot == null) return false;
  const evo = incarnonData.evolutions.find((e) => e.tier === 1 && e.slot === slot);
  if (!evo) return false;
  return /incarnon\s*form/i.test(evo.name);
}

/** Pick the Incarnon Form entry from forms[] (prefer name match). */
export function getIncarnonFormAttack(data: IncarnonWeaponData): IncarnonForm | undefined {
  return data.forms.find((f) => /incarnon/i.test(f.name)) ?? data.forms[1];
}

/**
 * Per-variant form attack overrides (wiki Incarnon Form tooltips differ by variant).
 * Prefer keyed lookups over rewriting shared forms[] rows.
 */
const VARIANT_FORM_OVERRIDES: Record<string, Partial<IncarnonForm>> = {
  // wiki Synoid Gammacor Incarnon Form: Impact 100, 20%/2x/28% (base Gammacor is 80 / 14%/1.8x/22%)
  synoid_gammacor: {
    damage: 100,
    impact: 100,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.28,
  },
  // wiki Boltor Prime Incarnon Form: IPS 2.4/7.2/14.4, FR 11.33, 24%/3x/20%, MS 3, mag 160
  boltor_prime: {
    damage: 24,
    impact: 2.4,
    puncture: 7.2,
    slash: 14.4,
    fireRate: 11.33,
    criticalChance: 0.24,
    criticalMultiplier: 3,
    statusChance: 0.2,
  },
  // wiki Telos Boltor Incarnon Form: IPS 2/6/12, FR 10.33, 36%/3.2x/10.67%, MS 3, mag 160
  telos_boltor: {
    damage: 20,
    impact: 2,
    puncture: 6,
    slash: 12,
    fireRate: 10.33,
    criticalChance: 0.36,
    criticalMultiplier: 3.2,
    statusChance: 0.1067,
  },
  // wiki Latron Prime Incarnon Form: Impact 50, FR 3.33, 44%/3.4x/30%
  latron_prime: {
    criticalChance: 0.44,
    criticalMultiplier: 3.4,
    statusChance: 0.3,
  },
  // wiki Latron Wraith Incarnon Form: Impact 50, FR 3.67, 48%/3.4x/28%
  latron_wraith: {
    fireRate: 3.67,
    criticalChance: 0.48,
    criticalMultiplier: 3.4,
    statusChance: 0.28,
  },
  // wiki Lex Prime Incarnon Form: Rad 800 + Impact 400, FR 0.67, 35%/3x/44%
  lex_prime: {
    damage: 1200,
    impact: 400,
    radiation: 800,
    criticalChance: 0.35,
    criticalMultiplier: 3,
    statusChance: 0.44,
  },
  // wiki Strun Prime Incarnon Form: Impact 100, FR 2.5, 48%/3.4x/46%
  strun_prime: {
    fireRate: 2.5,
    criticalChance: 0.48,
    criticalMultiplier: 3.4,
    statusChance: 0.46,
  },
  // wiki Strun Wraith Incarnon Form: Impact 100, FR 2, 56%/3.4x/44%
  strun_wraith: {
    criticalChance: 0.56,
    criticalMultiplier: 3.4,
    statusChance: 0.44,
  },
  // wiki Gorgon Wraith Incarnon Form: IPS 25/75/25, FR 1, 19%/2.1x/27%
  gorgon_wraith: {
    damage: 125,
    impact: 25,
    puncture: 75,
    slash: 25,
    fireRate: 1,
    criticalChance: 0.19,
    criticalMultiplier: 2.1,
    statusChance: 0.27,
  },
  // wiki Prisma Gorgon Incarnon Form: IPS 15/45/15, FR 1.167, 27%/2.3x/21%
  prisma_gorgon: {
    damage: 75,
    impact: 15,
    puncture: 45,
    slash: 15,
    fireRate: 1.167,
    criticalChance: 0.27,
    criticalMultiplier: 2.3,
    statusChance: 0.21,
  },
  // wiki Soma Prime Incarnon Form: IPS 1.08/5.04/11.88 ×8, FR 7, 10%/3.4x/3%
  soma_prime: {
    damage: 18,
    impact: 1.08,
    puncture: 5.04,
    slash: 11.88,
    criticalMultiplier: 3.4,
    statusChance: 0.03,
  },
  // wiki Braton Prime Incarnon Form: IPS 28/2.8/39.2, FR 5.67, 30%/3x/30%
  braton_prime: {
    damage: 70,
    impact: 28,
    puncture: 2.8,
    slash: 39.2,
    fireRate: 5.67,
    statusChance: 0.3,
  },
  // wiki Braton Vandal Incarnon Form: IPS 26/2.6/36.4, FR 4.67, 38%/3.2x/22%
  braton_vandal: {
    damage: 65,
    impact: 26,
    puncture: 2.6,
    slash: 36.4,
    fireRate: 4.67,
    criticalChance: 0.38,
    criticalMultiplier: 3.2,
    statusChance: 0.22,
  },
  // wiki Lato Prime Incarnon Form: IPS 19.5/19.5/39 ×2, FR 4, 36%/3.2x/15%
  lato_prime: {
    damage: 78,
    impact: 19.5,
    puncture: 19.5,
    slash: 39,
    fireRate: 4,
    criticalChance: 0.36,
    criticalMultiplier: 3.2,
    statusChance: 0.15,
  },
  // wiki Sybaris Prime Incarnon Form: IPS 36.3/36.3/37.4, 25%/3x/30%
  sybaris_prime: {
    damage: 110,
    impact: 36.3,
    puncture: 36.3,
    slash: 37.4,
    criticalChance: 0.25,
    statusChance: 0.3,
  },
  // wiki Paris Prime Incarnon Form Charged: Impact 100 + Heat 420, 50%/3.4x/20%
  paris_prime: {
    damage: 520,
    impact: 100,
    heat: 420,
    criticalChance: 0.5,
    criticalMultiplier: 3.4,
  },
  // wiki Dera Vandal Incarnon Form: IPS+Mag 50/140/90+90, FR 2, 30%/3x/22%
  dera_vandal: {
    damage: 370,
    impact: 50,
    puncture: 140,
    slash: 90,
    magnetic: 90,
    criticalChance: 0.3,
    statusChance: 0.22,
  },
  // wiki Lato Vandal Incarnon Form: IPS 19/19/38 ×2, FR 4, 34%/3x/10%
  lato_vandal: {
    damage: 76,
    impact: 19,
    puncture: 19,
    slash: 38,
    fireRate: 4,
    criticalChance: 0.34,
    criticalMultiplier: 3,
    statusChance: 0.1,
  },
  // wiki Dex Sybaris Incarnon Form: IPS 28.8/24/43.2, 30%/3x/20%
  dex_sybaris: {
    damage: 96,
    impact: 28.8,
    puncture: 24,
    slash: 43.2,
    criticalChance: 0.3,
  },
  // wiki Mk1-Braton Incarnon Form: IPS 20/2/28, FR 5, 20%/2.4x/10%
  mk1_braton: {
    criticalChance: 0.2,
    criticalMultiplier: 2.4,
    statusChance: 0.1,
  },
  // wiki Burston Prime Incarnon Form: Heat 13 (radial sync), 28%/3x/30%
  burston_prime: {
    criticalChance: 0.28,
  },
  // wiki Sicarus Prime Incarnon Form: IPS 24/18/18, FR 5, 30%/3x/20%, mag 120
  sicarus_prime: {
    damage: 60,
    impact: 24,
    puncture: 18,
    slash: 18,
    fireRate: 5,
    criticalChance: 0.3,
    criticalMultiplier: 3,
    statusChance: 0.2,
  },
  // wiki Prisma Angstrum Incarnon Form: Heat 50 Auto, FR 6, 26%/2.2x/20%
  prisma_angstrum: {
    damage: 50,
    heat: 50,
    criticalChance: 0.26,
    criticalMultiplier: 2.2,
    statusChance: 0.2,
  },
  // wiki Mk1-Strun Incarnon Form: Impact 100, FR 1.5, 44%/3x/40% (+ Blast 45 AoE)
  mk1_strun: {
    fireRate: 1.5,
    criticalMultiplier: 3,
  },
  // wiki Boar Prime Incarnon Form: Heat 30 Held, FR 8, 20%/2.2x/24%, MS 1
  boar_prime: {
    damage: 30,
    heat: 30,
    fireRate: 8,
    criticalChance: 0.2,
    criticalMultiplier: 2.2,
    statusChance: 0.24,
    multishot: 1,
  },
  // wiki Zylok Prime Incarnon Form: Impact 200 + Puncture 300, 26%/2.4x/40% (+ Heat 700 radial)
  zylok_prime: {
    damage: 500,
    impact: 200,
    puncture: 300,
    criticalChance: 0.26,
    criticalMultiplier: 2.4,
  },
  // wiki Ballistica Prime Incarnon Form: Slash 830, 30%/2.5x/30%, MS 1
  ballistica_prime: {
    damage: 830,
    slash: 830,
    criticalChance: 0.3,
    criticalMultiplier: 2.5,
    statusChance: 0.3,
    multishot: 1,
  },
  // wiki Bronco Prime Incarnon Form: IPS 27.2/3.4/3.4 ×7, FR 3, 24%/3.2x/25.71%
  bronco_prime: {
    damage: 34,
    impact: 27.2,
    puncture: 3.4,
    slash: 3.4,
    fireRate: 3,
    criticalChance: 0.24,
    criticalMultiplier: 3.2,
    statusChance: 0.2571,
  },
  // wiki Vasto Prime Incarnon Form: IPS 10.5/10.5/49 ×6 Burst, 30%/3.2x/6.67%
  vasto_prime: {
    damage: 70,
    impact: 10.5,
    puncture: 10.5,
    slash: 49,
    criticalMultiplier: 3.2,
    statusChance: 0.0667,
  },
  // wiki Mk1-Paris Incarnon Form Charged: Impact 50 + Heat 250, 40%/3x/20%
  mk1_paris: {
    damage: 300,
    impact: 50,
    heat: 250,
  },
  // wiki Vectis Prime Incarnon Form: Cold 150, 35%/3x/30% (+ Cold 150 headshot AoE)
  vectis_prime: {
    damage: 150,
    cold: 150,
    criticalChance: 0.35,
    criticalMultiplier: 3,
  },
  // wiki Rakta Ballistica Incarnon Form: Slash 734, 25%/2.2x/25%, MS 1
  rakta_ballistica: {
    damage: 734,
    slash: 734,
    criticalChance: 0.25,
    criticalMultiplier: 2.2,
    statusChance: 0.25,
    multishot: 1,
  },
  // wiki Mk1-Furis Incarnon Form: Heat 60 Held, FR 12, 20%/3x/8%
  mk1_furis: {
    damage: 60,
    heat: 60,
    criticalChance: 0.2,
    criticalMultiplier: 3,
    statusChance: 0.08,
  },
  // wiki Mk1-Kunai Incarnon Form: IPS 4.8/8.4/10.8 ×2, 14%/2x/5%
  mk1_kunai: {
    damage: 24,
    impact: 4.8,
    puncture: 8.4,
    slash: 10.8,
    criticalChance: 0.14,
    statusChance: 0.05,
  },
};

/**
 * Wiki Onos Incarnon full-charge Heat blast (primary attack). Held Radiation beam is the
 * forms[] default; select via resolve options / simParams.onosIncarnonMode.
 */
const ONOS_CHARGE_FORM_OVERLAY: IncarnonForm = {
  name: "Onos Incarnon Charge",
  damage: 2200,
  heat: 2200,
  fireRate: 0.25,
  criticalChance: 0.38,
  criticalMultiplier: 3.2,
  statusChance: 0.26,
  triggerType: "Charge",
  magazine: 350,
  reloadTime: 2.0,
};

export type IncarnonResolveOptions = {
  /** Onos only: held Radiation beam (default) vs full-charge Heat blast. */
  onosIncarnonMode?: "held" | "charge";
};

function formAttackForWeapon(
  base: Weapon,
  data: IncarnonWeaponData,
  options?: IncarnonResolveOptions,
): IncarnonForm | undefined {
  const form = getIncarnonFormAttack(data);
  if (!form) return undefined;
  const override = VARIANT_FORM_OVERRIDES[base.id];
  let next = override ? { ...form, ...override } : form;
  if (base.id === "onos" && options?.onosIncarnonMode === "charge") {
    next = { ...next, ...ONOS_CHARGE_FORM_OVERLAY };
    delete next.radiation;
  }
  return next;
}

const ELEM_KEYS = [
  "heat",
  "cold",
  "toxin",
  "electricity",
  "radiation",
  "viral",
  "corrosive",
  "blast",
  "gas",
  "magnetic",
  "tau",
] as const;

function formOnlyRadials(weaponId: string): WeaponRadialAttack[] {
  const all = WEAPON_RADIAL_ATTACKS[weaponId] ?? [];
  return all.filter((a) => /incarnon form/i.test(a.name));
}

/**
 * Melee Incarnon Form usually buffs via evolutions, but some natives rewrite IPS.
 * Keyed by weapon id (wiki-verified one at a time).
 */
const MELEE_FORM_WEAPON_TRANSFORMS: Record<string, (w: Weapon) => Weapon> = {
  // wiki Ruvox: +100% of Impact Damage converted to Puncture while transformed
  ruvox: (w) => {
    const impact = w.impact ?? 0;
    if (impact <= 0) return w;
    return {
      ...w,
      impact: 0,
      puncture: (w.puncture ?? 0) + impact,
    };
  },
};

/**
 * Overlay Incarnon Form attack stats onto the arsenal weapon.
 * Clears IPS/elements then applies form damage (typed element / IPS when provided).
 * Keeps only Incarnon Form radials for this weapon id (drops Poison Cloud etc.).
 * Melee forms are not swapped — Incarnon melee is buff-driven, not a new arsenal attack.
 */
export function applyIncarnonFormToWeapon(base: Weapon, form: IncarnonForm): Weapon {
  if (
    form.triggerType === "Melee" ||
    base.category === "melee" ||
    base.triggerType === "Melee"
  ) {
    const transform = MELEE_FORM_WEAPON_TRANSFORMS[base.id];
    return transform ? transform(base) : base;
  }

  const formRadials = formOnlyRadials(base.id);

  const next: Weapon = {
    ...base,
    damage: form.damage,
    impact: form.impact ?? 0,
    puncture: form.puncture ?? 0,
    slash: form.slash ?? 0,
    fireRate: form.fireRate,
    criticalChance: form.criticalChance,
    criticalMultiplier: form.criticalMultiplier,
    statusChance: form.statusChance,
    triggerType: form.triggerType,
    magazine: form.magazine ?? base.magazine,
    reloadTime: form.reloadTime ?? base.reloadTime,
    multishot: form.multishot ?? base.multishot,
    radialAttacks: formRadials,
  };

  for (const k of ELEM_KEYS) {
    delete (next as unknown as Record<string, unknown>)[k];
  }

  let appliedElem = false;
  for (const k of ELEM_KEYS) {
    const v = form[k];
    if (v != null && v > 0) {
      (next as unknown as Record<string, number>)[k] = v;
      appliedElem = true;
    }
  }
  if (!appliedElem && form.damageType) {
    const key = form.damageType.toLowerCase();
    (next as unknown as Record<string, unknown>)[key] = form.damage;
  }

  // Variant-aware pure-element forms (e.g. Burston Prime): when the form row
  // understates Heat and the sole form radial is pure Heat, sync direct from radial.
  // Skip when form Heat already exceeds the radial (Onos charge: 2200 direct + 1100 AoE).
  if (form.heat != null && formRadials.length === 1) {
    const r = formRadials[0];
    if (
      r.heat != null &&
      r.heat > 0 &&
      r.totalDamage === r.heat &&
      (form.heat <= 0 || form.heat < r.heat)
    ) {
      next.heat = r.heat;
      next.damage = r.heat;
      next.impact = 0;
      next.puncture = 0;
      next.slash = 0;
    }
  }

  // Dual-type forms (e.g. Phenmor Slash + Radiation): damage = sum of parts
  const ips = (next.impact ?? 0) + (next.puncture ?? 0) + (next.slash ?? 0);
  let eleSum = 0;
  for (const k of ELEM_KEYS) {
    eleSum += (next as unknown as Record<string, number | undefined>)[k] ?? 0;
  }
  if (ips + eleSum > 0) {
    next.damage = ips + eleSum;
  }

  return next;
}

/**
 * Weapon instance for calculator: form attack when Incarnon Form evo is selected, else base.
 */
export function resolveIncarnonActiveWeapon(
  base: Weapon,
  incarnonData: IncarnonWeaponData | undefined,
  selectedEvolutions: Record<number, number> | undefined,
  options?: IncarnonResolveOptions,
): Weapon {
  if (!isIncarnonFormActive(selectedEvolutions, incarnonData)) return base;
  const form = formAttackForWeapon(base, incarnonData!, options);
  if (!form) return base;
  return applyIncarnonFormToWeapon(base, form);
}
