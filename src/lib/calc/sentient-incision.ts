/**
 * Wiki Sentient Incision (Venato / Venato Prime):
 * +N% uncombinable elemental matching the target's weakness.
 * Faction → element table from the mod page (Hotfix 42.0.6).
 */
import { normalizeFactionName } from "@/lib/calc/combat-multipliers";

/** Element type added as a parallel (non-combining) damage line. */
export type SentientIncisionElement =
  | "heat"
  | "electricity"
  | "toxin"
  | "corrosive"
  | "magnetic"
  | "viral"
  | "radiation"
  | "gas";

/**
 * Resolve the adaptive element for a sim / enemy faction label.
 * Returns null when no faction is selected (paper DPS without a target).
 */
export function sentientIncisionElementForFaction(
  faction: string | undefined | null,
): SentientIncisionElement | null {
  if (!faction) return null;
  const raw = faction.toLowerCase().trim();

  // More specific labels before normalize (Deimos Infested ≠ generic Infested).
  if (raw.includes("deimos")) return "gas";
  if (raw.includes("anarch")) return "electricity";
  if (raw.includes("scaldra") || raw.includes("zariman") || raw.includes("overguard")) {
    return "corrosive";
  }
  if (raw.includes("techrot") || raw.includes("amalgam")) return "magnetic";

  const id = normalizeFactionName(faction);
  switch (id) {
    case "infested":
      return "heat";
    case "narmer":
      return "toxin";
    case "grineer":
      return "corrosive";
    case "corpus":
      return "magnetic";
    case "orokin":
      return "viral";
    case "sentient":
    case "murmur":
      return "radiation";
    default:
      return null;
  }
}
