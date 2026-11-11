/**
 * Report (Terkeon, Nov 2026): editing a kitgun / zaw / amp part used to wipe every mod and
 * arcane. A part edit now keeps the build and drops only what the new weapon can't hold:
 * mods the mod picker would no longer offer for that slot (e.g. rifle mods after a kitgun
 * grip turns it into a secondary), slots past the new slot count, arcanes outside the new
 * slot's pool, and the Riven when the chamber / strike (the Riven's weapon) changes.
 */
import type { Mod, Weapon } from "@/lib/types";
import { filterPickerMods } from "@/components/mod-picker-filter";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { arcanesForSlot, getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";

/** Secondary kitguns get a 9th (Exilus) slot at this index. */
export const MODULAR_SECONDARY_EXILUS_SLOT_INDEX = 8;

export interface ModularModEntry {
  modId: string;
  slotIndex: number;
}

export interface ModularPartEditInput<T extends ModularModEntry> {
  /** The weapon after the part edit. */
  weapon: Weapon;
  modularType: "kitgun" | "zaw" | "amp";
  mods: readonly T[];
  rivenStats: Readonly<Record<number, Record<string, number>>>;
  arcanes: readonly (Mod | null)[];
  arcaneRanks: readonly number[];
  slotPolarities: Readonly<Record<number, string>>;
  modsMap: ReadonlyMap<string, Mod>;
  /** True when the chamber (kitgun) or strike (zaw) changed: the Riven belongs to that part. */
  rivenWeaponChanged: boolean;
}

export interface ModularPartEditResult<T extends ModularModEntry> {
  mods: T[];
  rivenStats: Record<number, Record<string, number>>;
  arcanes: (Mod | null)[];
  arcaneRanks: number[];
  slotPolarities: Record<number, string>;
  /** Names of removed mods / arcanes, for the toast. */
  dropped: string[];
}

export function isModularRivenModId(modId: string): boolean {
  return (
    modId.startsWith("riven_") ||
    modId === "zaw_riven_mod" ||
    modId === "kitgun_riven_mod" ||
    modId === "companion_weapon_riven_mod"
  );
}

/** Same slot count as the builder shows (secondary kitguns add the Exilus slot). */
export function modularModSlotCount(weapon: Weapon, modularType: "kitgun" | "zaw" | "amp"): number {
  if (!(weapon.modSlots > 0)) return 0;
  const secondaryKitgun = modularType === "kitgun" && weapon.category === "secondary";
  return weapon.modSlots + (secondaryKitgun ? 1 : 0);
}

function pickerCategory(weapon: Weapon): "primary" | "secondary" | "melee" {
  if (weapon.category === "melee") return "melee";
  if (weapon.category === "secondary") return "secondary";
  return "primary";
}

/** Would the mod picker offer this mod in this slot of this weapon? */
export function modularModFitsSlot(mod: Mod, weapon: Weapon, modularType: "kitgun" | "zaw" | "amp", slotIndex: number): boolean {
  const secondaryKitgun = modularType === "kitgun" && weapon.category === "secondary";
  const slotType = secondaryKitgun && slotIndex === MODULAR_SECONDARY_EXILUS_SLOT_INDEX ? "weapon_exilus_secondary" : "regular";
  const offered = filterPickerMods({
    mods: [mod],
    category: pickerCategory(weapon),
    slotType,
    search: "",
    weaponCategory: weapon.category,
    weaponModProfile: getWeaponModProfile(weapon),
    weapon,
  });
  return offered.length > 0;
}

export function keepLegalModularBuild<T extends ModularModEntry>(input: ModularPartEditInput<T>): ModularPartEditResult<T> {
  const { weapon, modularType, modsMap } = input;
  const slotCount = modularModSlotCount(weapon, modularType);
  const dropped: string[] = [];
  const mods: T[] = [];
  const rivenStats: Record<number, Record<string, number>> = {};
  for (const m of input.mods) {
    const mod = modsMap.get(m.modId);
    const name = mod?.name ?? m.modId;
    const isRiven = isModularRivenModId(m.modId);
    const legal =
      m.slotIndex < slotCount &&
      !!mod &&
      !(isRiven && input.rivenWeaponChanged) &&
      modularModFitsSlot(mod, weapon, modularType, m.slotIndex);
    if (!legal) {
      dropped.push(isRiven ? "Riven" : name);
      continue;
    }
    mods.push(m);
    if (input.rivenStats[m.slotIndex]) rivenStats[m.slotIndex] = input.rivenStats[m.slotIndex];
  }

  const config = getWeaponArcanes(weapon);
  const arcanes: (Mod | null)[] = [];
  const arcaneRanks: number[] = [];
  const width = Math.max(input.arcanes.length, 2);
  for (let i = 0; i < width; i++) {
    const a = input.arcanes[i] ?? null;
    const rank = input.arcaneRanks[i] ?? 5;
    if (a && (i >= config.slots || !arcanesForSlot(config, i).some((x) => x.id === a.id))) {
      dropped.push(a.name);
      arcanes.push(null);
      arcaneRanks.push(5);
      continue;
    }
    arcanes.push(a);
    arcaneRanks.push(rank);
  }

  const slotPolarities: Record<number, string> = {};
  for (const [k, v] of Object.entries(input.slotPolarities)) {
    if (Number(k) < slotCount) slotPolarities[Number(k)] = v;
  }
  return { mods, rivenStats, arcanes, arcaneRanks, slotPolarities, dropped };
}
