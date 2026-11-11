/**
 * Operator builder Focus school cards. Every perk is a current Focus 3.0 node; values are the max-rank
 * numbers from the node descriptions on wiki.warframe.com/w/Focus/<School> (page body wins; Fandom's
 * Focus pages match but were last edited 2024-25).
 */
export interface FocusSchoolDef {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  icon: string;
  accent: string;
  perks: { title: string; desc: string; badge?: string }[];
}

export const FOCUS_SCHOOLS: FocusSchoolDef[] = [
  {
    id: "Madurai",
    name: "Madurai",
    domain: "Offense & Speed",
    tagline: "Unleash devastating damage multipliers, speed, and Void energy.",
    icon: "madurai",
    accent: "from-red-500/15 via-red-500/5 to-transparent border-red-500/30 text-red-700 dark:text-red-400",
    perks: [
      {
        title: "Void Strike",
        desc: "First Ability at full energy: +1000% damage for 8s (40s cooldown). On Warframe weapons it is additive with Serration-type mods; it does not work on Archguns.",
        badge: "+1000% DMG",
      },
      {
        title: "Sling Strength",
        desc: "Switching to Warframe after a Chained Sling grants +40% Ability Strength for 20s (additive with Intensify).",
        badge: "+40% STR",
      },
      {
        title: "Phoenix Talons",
        desc: "Passive: +30% Physical damage on Warframe weapons (Exalted weapons too, not abilities) and +30% Operator damage. It no longer boosts elemental damage.",
        badge: "+30% DMG",
      },
      {
        title: "Contamination Wave",
        desc: "Second Ability emits a Void wave that makes enemies take +50% Operator damage for 20s.",
        badge: "+50% Operator Vuln",
      },
    ],
  },
  {
    id: "Unairu",
    name: "Unairu",
    domain: "Defense & Armor Strip",
    tagline: "Shred enemy defenses completely, bolster armor, and become immune to knockdowns.",
    icon: "unairu",
    accent: "from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    perks: [
      {
        title: "Caustic Strike",
        desc: "Second Ability launches an energy bomb that explodes in an 8m radius, stripping 100% of enemy armor.",
        badge: "100% Armor Strip",
      },
      {
        title: "Magnetic Flare",
        desc: "First Ability creates an 8m field for 30s that disables the shields of any enemy inside it (not Bosses). Void Slinging out of it (Magnetic Boost) refreshes it and grows it by 100%.",
        badge: "Shields Disabled",
      },
      {
        title: "Poise",
        desc: "Immunity to slow, stagger and knockdown for 40s after transferring between Operator and Warframe.",
        badge: "Knockdown Immune",
      },
      {
        title: "Last Gasp",
        desc: "Way-bound: Transference during Bleedout summons the Operator; kill 3 enemies before 15s elapse and the revive meter drains to revive your Warframe.",
        badge: "Self-Revive",
      },
    ],
  },
  {
    id: "Zenurik",
    name: "Zenurik",
    domain: "Energy & Casting Support",
    tagline: "Channel infinite energy regeneration, slow enemy hordes, and amplify Ability Strength.",
    icon: "zenurik",
    accent: "from-blue-500/15 via-blue-500/5 to-transparent border-blue-500/30 text-blue-700 dark:text-blue-400",
    perks: [
      {
        title: "Wellspring",
        desc: "First Ability creates a well for 8s; allies passing through gain 5 Energy/s for 30s.",
        badge: "5 Energy/s",
      },
      {
        title: "Hardened Wellspring",
        desc: "Using First Ability inside a Wellspring makes it bigger, adds 20s to its duration and grants +20% Ability Strength to those inside.",
        badge: "+20% STR",
      },
      {
        title: "Temporal Drag",
        desc: "Second Ability emits a 20m radial burst that slows enemies by 80% for 10s.",
        badge: "80% Slow",
      },
      {
        title: "Inner Might",
        desc: "Lets an Ability be cast without Energy or Shields; recharges in 60s.",
        badge: "Free Cast",
      },
    ],
  },
  {
    id: "Naramon",
    name: "Naramon",
    domain: "Melee Combat & Tactics",
    tagline: "Amplify melee combat, maintain permanent combo multipliers, and execute lethal strikes.",
    icon: "naramon",
    accent: "from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30 text-amber-700 dark:text-amber-400",
    perks: [
      {
        title: "Lethal Levitation",
        desc: "Each Lifted enemy the Operator attacks grants +50% weapon damage for 60s, stacking up to 4 times (+200%, additive with Serration). Applies to Archguns and Exalted weapons too.",
        badge: "+200% DMG",
      },
      {
        title: "Power Spike",
        desc: "Out of combat, the Melee Combo Counter decays by 5 every few seconds instead of depleting completely.",
        badge: "Decaying Combo",
      },
      {
        title: "Killer's Rush",
        desc: "Starting a finisher as Operator switches to Warframe and grants +50% melee Critical Chance for 40s.",
        badge: "+50% Melee Crit",
      },
      {
        title: "Opening Slam",
        desc: "Performing a Slam as Operator switches to Warframe and doubles base Combo gain for 20s.",
        badge: "2× Combo Gain",
      },
    ],
  },
  {
    id: "Vazarin",
    name: "Vazarin",
    domain: "Healing & Support",
    tagline: "Provide invulnerability shields, instant health regeneration, and pull enemies into vortexes.",
    icon: "vazarin",
    accent: "from-cyan-500/15 via-cyan-500/5 to-transparent border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    perks: [
      {
        title: "Protective Sling",
        desc: "Allies and Warframes slung through become completely invulnerable for 5s and regenerate 60% health over 5s.",
        badge: "5s Immunity",
      },
      {
        title: "Void Snare",
        desc: "Launches a snare that groups all nearby enemies together in a tight vortex.",
        badge: "Enemy Vortex",
      },
      {
        title: "Guardian Break",
        desc: "When the Guardian Shell breaks, Warframe shield regeneration is +150% and regeneration delay -80% for 12s.",
        badge: "+150% Shield Regen",
      },
      {
        title: "Squad Regen",
        desc: "When Void Regen reaches its maximum (50 health/s), it is applied to squad members within Affinity Range, your Warframe included, for 60s.",
        badge: "Squad 50 HP/s",
      },
    ],
  },
];
