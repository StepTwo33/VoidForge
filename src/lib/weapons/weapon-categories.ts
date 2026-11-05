/** Display labels for weapon picker category filters. */
export const WEAPON_CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  primary: "Primary",
  rifle: "Rifles",
  shotgun: "Shotguns",
  bow: "Bows",
  secondary: "Secondary",
  pistol: "Pistols",
  melee: "Melee",
  launcher: "Launchers",
  archgun: "Archguns",
  archmelee: "Archmelee",
  tektolyst: "Tektolyst",
};

/** Map a weapon's data category onto the mod pool category used by ModPicker. */
export function getModCategory(weaponCategory: string): string {
  if (["rifle", "shotgun", "bow", "primary", "launcher"].includes(weaponCategory)) return "primary";
  if (weaponCategory === "archgun") return "archgun";
  if (["pistol", "secondary", "dual_pistols"].includes(weaponCategory)) return "secondary";
  if (weaponCategory === "archmelee") return "archmelee";
  // Round 54b: Zaw strikes are melee weapons (Blood Rush etc. were missing on ?weapon=zaw_*);
  // the lone "sniper" entry is a primary.
  if (weaponCategory === "melee" || weaponCategory === "zaw_strike") return "melee";
  if (weaponCategory === "sniper") return "primary";
  if (weaponCategory === "tektolyst") return "tektolyst";
  return weaponCategory;
}
