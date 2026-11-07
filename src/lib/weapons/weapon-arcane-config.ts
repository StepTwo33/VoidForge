import type { Mod, Weapon } from "@/lib/types";
import { primaryArcanes, secondaryArcanes, meleeArcanes, kitgunArcanes, ampArcanes, exodiaArcanes, tektolystArcanes } from "@/data/arcanes";
import { WIKI_WEAPON_CLASS } from "@/data/arcane-weapon-classes";

/** One arcane slot's options (Archgun / Kitgun / Zaw slots each take a different pool). */
export interface ArcaneSlotPool {
  label: string;
  arcanes: Mod[];
}

export interface WeaponArcaneConfig {
  /** Every arcane any slot accepts (union of `slotPools`). */
  arcanes: Mod[];
  slots: number;
  label: string;
  /** Per-slot pools; slot i only accepts `slotPools[i].arcanes`. */
  slotPools?: ArcaneSlotPool[];
}

/** wiki Shotgun Vendetta 40.0.3: "can now be equipped on the Corvas (Prime) and Mandonel Archguns". */
const VENDETTA_ARCHGUNS = new Set(["corvas", "corvas_prime", "mandonel"]);
/** wiki Akimbo Slip Shot 40.0.3: "can now be equipped on the (Prisma) Dual Decurions Archguns". */
const SLIP_SHOT_ARCHGUNS = new Set(["dual_decurion", "prisma_dual_decurions"]);

/**
 * Class-restricted arcanes (wiki Arcane Enhancement): Longbow Sharpshot is Bow-only (not
 * crossbows), Shotgun Vendetta Shotgun-only (+ Corvas/Mandonel), Akimbo Slip Shot for
 * Dual Pistols / Dual Shotguns (+ Dual Decurions). Weapons without a wiki class (kitguns,
 * new items) fall back to our category / name.
 */
export function arcaneFitsWeapon(arcaneId: string, weapon: Weapon): boolean {
  const cls = WIKI_WEAPON_CLASS[weapon.id];
  switch (arcaneId) {
    case "longbow_sharpshot":
      // Exalted Artemis Bow is a bow in game (wiki class "Exalted Weapon").
      if (/^artemis_bow/.test(weapon.id)) return true;
      return cls ? cls === "Bow" : weapon.category === "bow";
    case "shotgun_vendetta":
      if (VENDETTA_ARCHGUNS.has(weapon.id)) return true;
      return cls ? cls === "Shotgun" : weapon.category === "shotgun";
    case "akimbo_slip_shot":
      if (SLIP_SHOT_ARCHGUNS.has(weapon.id)) return true;
      if (cls) return cls === "Dual Pistols" || cls === "Dual Shotguns";
      return /^(ak|twin |dual )/i.test(weapon.name);
    default:
      return true;
  }
}

const fit = (pool: Mod[], weapon: Weapon) => pool.filter((a) => arcaneFitsWeapon(a.id, weapon));

const PRIMARY_CATEGORIES = new Set(["rifle", "shotgun", "bow", "primary", "launcher", "sniper"]);

function single(arcanes: Mod[], label: string, slots = 1): WeaponArcaneConfig {
  return { arcanes, slots, label };
}

function pooled(label: string, pools: ArcaneSlotPool[]): WeaponArcaneConfig {
  const seen = new Set<string>();
  const arcanes: Mod[] = [];
  for (const p of pools) for (const a of p.arcanes) if (!seen.has(a.id)) { seen.add(a.id); arcanes.push(a); }
  return { arcanes, slots: pools.length, label, slotPools: pools };
}

/** Arcane picker options for a weapon (standalone or modular-built). */
export function getWeaponArcanes(weapon: Weapon): WeaponArcaneConfig {
  const cat = weapon.category;
  if (cat === "kitgun_chamber" || weapon.arcaneType === "kitgun") {
    // wiki: "Zaw and Kitgun arcanes occupy a unique slot separate from Primary/Secondary/Melee
    // arcanes". A primary-grip kitgun (any chamber, incl. shotgun → category "shotgun") is a primary.
    const isPrimary = PRIMARY_CATEGORIES.has(cat);
    return pooled("Kitgun Arcane", [
      isPrimary
        ? { label: "Primary Arcane", arcanes: fit(primaryArcanes, weapon) }
        : { label: "Secondary Arcane", arcanes: fit(secondaryArcanes, weapon) },
      { label: "Kitgun Arcane", arcanes: kitgunArcanes },
    ]);
  }
  if (cat === "zaw_strike" || weapon.arcaneType === "exodia") {
    return pooled("Zaw Arcane", [
      { label: "Melee Arcane", arcanes: meleeArcanes },
      { label: "Exodia Arcane", arcanes: exodiaArcanes },
    ]);
  }
  if (cat === "amp_prism" || weapon.arcaneType === "amp" || weapon.id === "sirocco") {
    return single(ampArcanes, "Amp Arcane", 2);
  }
  if (cat === "archgun") {
    // wiki Archgun Arcane Adapter: "two arcane slots, one for Primary Arcanes and one for Secondary Arcanes".
    return pooled("Archgun Arcane", [
      { label: "Primary Arcane", arcanes: fit(primaryArcanes, weapon) },
      { label: "Secondary Arcane", arcanes: fit(secondaryArcanes, weapon) },
    ]);
  }
  if (weapon.isExalted) {
    if (weapon.triggerType === "Melee" || cat === "melee" || cat === "archmelee") {
      return single(meleeArcanes, "Melee Arcane");
    }
    if (["pistol", "secondary", "dual_pistols"].includes(cat)) {
      return single(fit(secondaryArcanes, weapon), "Secondary Arcane");
    }
    return single(fit(primaryArcanes, weapon), "Primary Arcane");
  }
  if (PRIMARY_CATEGORIES.has(cat)) return single(fit(primaryArcanes, weapon), "Primary Arcane");
  if (["pistol", "secondary"].includes(cat)) return single(fit(secondaryArcanes, weapon), "Secondary Arcane");
  if (cat === "melee") return single(meleeArcanes, "Melee Arcane");
  if (cat === "tektolyst") return single(tektolystArcanes, "Tektolyst Arcane");
  return { arcanes: [], slots: 0, label: "" };
}

/** Options for one slot (falls back to the full list for single-pool weapons). */
export function arcanesForSlot(config: WeaponArcaneConfig, slot: number): Mod[] {
  return config.slotPools?.[slot]?.arcanes ?? config.arcanes;
}

/** Card / picker label for one slot. */
export function arcaneSlotLabel(config: WeaponArcaneConfig, slot: number): string {
  const pool = config.slotPools?.[slot];
  if (pool) return pool.label;
  return `${config.label}${config.slots > 1 ? ` ${slot + 1}` : ""}`;
}
