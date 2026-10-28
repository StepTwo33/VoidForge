/**
 * Glossary for the weapon stats panel. `source: "wiki"` entries paraphrase the in-game
 * descriptions / formulas on wiki.warframe.com (page in `ref`); `source: "site"` entries are how
 * Voidforge's own DPS model defines the number (the wiki has no equivalent stat).
 */
export type GlossaryEntry = {
  term: string;
  /** Short name as shown in the panel / lists (e.g. CD). */
  abbr?: string;
  definition: string;
  source: "wiki" | "site";
  /** wiki.warframe.com page the definition was checked against. */
  ref?: string;
};

export const WEAPON_STAT_GLOSSARY: GlossaryEntry[] = [
  {
    term: "Direct Burst DPS",
    definition:
      "Damage per second from the projectile / hit itself while firing continuously (no reload): damage × multishot × fire rate × average crit multiplier. Radial explosions and other area effects are listed separately.",
    source: "site",
  },
  {
    term: "Direct Sustained DPS",
    definition:
      "Direct Burst DPS averaged over a full magazine plus reload, so reload time and magazine size lower it. Melee has no reload, so it equals burst.",
    source: "site",
  },
  {
    term: "Radial Burst / Sustained DPS",
    definition:
      "The same two numbers for the weapon's own explosion or area attack (shown only when the weapon has one). Totals add direct and radial together.",
    source: "site",
  },
  {
    term: "Total Burst / Sustained DPS",
    definition: "Direct + radial damage per second added together (the same as Direct when the weapon has no radial part).",
    source: "site",
  },
  {
    term: "Procs / Sec",
    definition:
      "Average status procs per second: multishot × status chance per projectile × fire rate (wiki: average procs per shot = multishot × (forced procs + status chance per projectile), times fire rate for per second).",
    source: "wiki",
    ref: "Status_Effect (Multishot → Average Procs)",
  },
  {
    term: "Status DPS",
    definition: "Estimated damage per second from damage-over-time procs (Slash, Heat, Toxin, Electricity, Gas) at the proc rate above.",
    source: "site",
  },
  {
    term: "Critical Chance",
    abbr: "CC",
    definition:
      "Chance that a hit is a critical hit. Above 100% every hit crits and has a chance at a higher tier (orange above 100%, red above 200%).",
    source: "wiki",
    ref: "Critical_Hit",
  },
  {
    term: "Critical Damage (critical multiplier)",
    abbr: "CD",
    definition:
      "The multiplier applied to a hit's damage when it crits. Orange crits add double the bonus, red crits triple. (This is the stat the panel labels Critical Multiplier.)",
    source: "wiki",
    ref: "Critical_Hit",
  },
  {
    term: "Status Chance",
    abbr: "SC",
    definition:
      "Chance that each hit (each pellet or projectile, rolled separately) applies a status effect. Above 100% a hit can apply more than one.",
    source: "wiki",
    ref: "Status_Effect",
  },
  {
    term: "Multishot",
    definition:
      "Damage instances fired per shot without using extra ammo. The decimal part is the chance of one more (2.4 = two, with a 40% chance of a third). Each instance rolls its own crit and status.",
    source: "wiki",
    ref: "Multishot",
  },
  {
    term: "Fire Rate",
    definition:
      "Maximum shots (attacks) per second. The panel shows the effective rate after charge, burst or bow timing when that differs from the Arsenal value.",
    source: "wiki",
    ref: "Fire_Rate",
  },
  {
    term: "Non-crit / Yellow / Orange / Red hit",
    definition:
      "Damage of a single hit at each crit tier: tier damage = 1 + tier × (critical multiplier − 1), so yellow is tier 1, orange tier 2, red tier 3+. Per pellet or swing, before multishot and fire rate.",
    source: "wiki",
    ref: "Critical_Hit (Critical Tiers)",
  },
  {
    term: "Avg hit",
    definition:
      "Expected damage of one hit given your crit chance: base hit × (1 + CC × (CD − 1)); with CC over 100% the higher tiers are blended in.",
    source: "wiki",
    ref: "Critical_Hit (Average Damage)",
  },
  {
    term: "Punch Through",
    definition:
      "How many meters of material (enemies, objects, cover) a projectile can pass through before it stops; each target pierced uses some of it.",
    source: "wiki",
    ref: "Punch_Through",
  },
];
