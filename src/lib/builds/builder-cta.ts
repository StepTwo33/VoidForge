import { BUILDER_PATHS } from "@/lib/builds/build-url";

const BUILDER_LABELS: Record<string, string> = {
  weapon: "Open Weapon Builder",
  warframe: "Open Warframe Builder",
  companion: "Open Companion Builder",
  modular: "Open Modular Builder",
  archwing: "Open Vehicle Builder",
  railjack: "Open Railjack Builder",
  operator: "Open Operator Builder",
  loadout: "Open Loadouts",
};

/**
 * Primary "start a build" CTA on /builds for the active type filter (Round 54b): each type chip
 * sends you to its own builder instead of every empty state pointing at the Weapon Builder.
 */
export function builderCtaForFilter(typeFilter: string): { href: string; label: string } {
  const key = BUILDER_PATHS[typeFilter] ? typeFilter : "weapon";
  return { href: BUILDER_PATHS[key], label: BUILDER_LABELS[key] };
}
