import {
  WEAPON_FIRE_TIMING,
  WEAPON_INNATE_ELEMENT_FILLS,
  type InnateElementKey,
} from "@/data/weapon-innate-elements";
import { WEAPON_PASSIVES } from "@/data/weapon-passives";
import { WEAPON_RADIAL_ATTACKS } from "@/data/weapon-radial-attacks";
import type { Weapon } from "@/lib/types";

const IPS_KEYS = ["impact", "puncture", "slash"] as const;
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
  "void",
] as const;

function ipsSum(w: Weapon): number {
  return (w.impact || 0) + (w.puncture || 0) + (w.slash || 0);
}

function elemSum(w: Weapon): number {
  let s = 0;
  for (const k of ELEM_KEYS) s += (w[k] as number | undefined) || 0;
  return s;
}

function applyInnateElementFill(w: Weapon): Weapon {
  if ((w.damage || 0) <= 0) return w;
  if (ipsSum(w) > 0.01 || elemSum(w) > 0.01) return w;

  const fill = WEAPON_INNATE_ELEMENT_FILLS[w.id];
  if (!fill) return w;

  const next: Weapon = { ...w };
  const amount = w.damage;
  if ((IPS_KEYS as readonly string[]).includes(fill)) {
    next[fill as "impact" | "puncture" | "slash"] = amount;
  } else {
    (next as unknown as Record<string, unknown>)[fill] = amount;
  }
  return next;
}

function applyFireTiming(w: Weapon): Weapon {
  const timing = WEAPON_FIRE_TIMING[w.id];
  if (!timing) {
    // Infer bow mode from trigger when no explicit entry
    if (w.triggerType === "Bow" && w.chargeTime == null) {
      return { ...w, chargeTime: w.chargeTime ?? 0.5, chargeMode: "bow" };
    }
    if (w.id === "lanka" && w.chargeTime == null) {
      return { ...w, chargeTime: 1, chargeMode: "lanka" };
    }
    return w;
  }
  return {
    ...w,
    ...(timing.chargeTime != null ? { chargeTime: w.chargeTime ?? timing.chargeTime } : {}),
    ...(timing.chargeMode ? { chargeMode: w.chargeMode ?? timing.chargeMode } : {}),
    ...(timing.chargeTimingAlways ? { chargeTimingAlways: true } : {}),
    ...(timing.burstCount != null ? { burstCount: w.burstCount ?? timing.burstCount } : {}),
    ...(timing.burstDelay != null ? { burstDelay: w.burstDelay ?? timing.burstDelay } : {}),
  };
}

/** Attach wiki passives, radials, pure-element fills, and fire timing. */
export function enrichWeapon(w: Weapon): Weapon {
  let out = w;
  out = applyInnateElementFill(out);
  out = applyFireTiming(out);

  const passive = out.passive ?? WEAPON_PASSIVES[out.id];
  const radialAttacks = out.radialAttacks ?? WEAPON_RADIAL_ATTACKS[out.id];
  if (!passive && !radialAttacks) return out;
  return {
    ...out,
    ...(passive ? { passive } : {}),
    ...(radialAttacks ? { radialAttacks } : {}),
  };
}

/** For tests / audits: element key that would be filled for a zero-breakdown weapon. */
export function innateElementFillFor(weaponId: string): InnateElementKey | undefined {
  return WEAPON_INNATE_ELEMENT_FILLS[weaponId];
}
