import {
  BookOpen,
  Crosshair,
  Flame,
  GraduationCap,
  Gem,
  Hexagon,
  PawPrint,
  Plane,
  Rocket,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type HowToModSectionId =
  | "overview"
  | "basics"
  | "elements"
  | "weapons"
  | "modular"
  | "rivens"
  | "arcanes"
  | "warframes"
  | "companions"
  | "archwing"
  | "railjack";

export interface HowToModSectionDef {
  id: HowToModSectionId;
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const HOW_TO_MOD_BASE = "/guides/how-to-mod";

export const HOW_TO_MOD_SECTIONS: HowToModSectionDef[] = [
  {
    id: "overview",
    href: HOW_TO_MOD_BASE,
    label: "Overview",
    icon: GraduationCap,
    description: "Core habits before you open a builder",
  },
  {
    id: "basics",
    href: `${HOW_TO_MOD_BASE}/basics`,
    label: "Basics",
    icon: Sparkles,
    description: "Capacity, Forma, stacking, and elements",
  },
  {
    id: "elements",
    href: `${HOW_TO_MOD_BASE}/elements`,
    label: "Elements",
    icon: Flame,
    description: "Combo table, placement order, and mission picks",
  },
  {
    id: "weapons",
    href: `${HOW_TO_MOD_BASE}/weapons`,
    label: "Weapons",
    icon: Crosshair,
    description: "Crit, status, and hybrid build paths",
  },
  {
    id: "modular",
    href: `${HOW_TO_MOD_BASE}/modular`,
    label: "Modular",
    icon: Wrench,
    description: "Kitguns, Zaws, and Amps: parts first, then mods",
  },
  {
    id: "rivens",
    href: `${HOW_TO_MOD_BASE}/rivens`,
    label: "Rivens",
    icon: Gem,
    description: "Disposition, rolls, and when a riven earns a slot",
  },
  {
    id: "arcanes",
    href: `${HOW_TO_MOD_BASE}/arcanes`,
    label: "Arcanes",
    icon: Hexagon,
    description: "Parallel power slots for frames, guns, and amps",
  },
  {
    id: "warframes",
    href: `${HOW_TO_MOD_BASE}/warframes`,
    label: "Warframes",
    icon: User,
    description: "Ability stats, Aura, Exilus, and shards",
  },
  {
    id: "companions",
    href: `${HOW_TO_MOD_BASE}/companions`,
    label: "Companions",
    icon: PawPrint,
    description: "Precepts, survival, and companion weapons",
  },
  {
    id: "archwing",
    href: `${HOW_TO_MOD_BASE}/archwing`,
    label: "Archwing & Mech",
    icon: Plane,
    description: "Archwing and Necramech modding essentials",
  },
  {
    id: "railjack",
    href: `${HOW_TO_MOD_BASE}/railjack`,
    label: "Railjack",
    icon: Rocket,
    description: "Plexus grids and ship-modding habits",
  },
];

export const HOW_TO_MOD_SLOGAN =
  "With these tips, tricks, & hints you too can mod with the best of them.";

export function resolveHowToModSection(pathname: string): HowToModSectionId {
  const normalized = pathname.replace(/\/$/, "") || HOW_TO_MOD_BASE;
  if (normalized === HOW_TO_MOD_BASE) return "overview";
  const match = HOW_TO_MOD_SECTIONS.find(
    (s) => s.id !== "overview" && normalized === s.href,
  );
  return match?.id ?? "overview";
}

/** Hero icon for the guide shell (distinct from section tabs). */
export const HOW_TO_MOD_HERO_ICON = BookOpen;
