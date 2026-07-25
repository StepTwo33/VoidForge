/**
 * Per-item stat behavior — no blanket stat-key rules.
 * Each mod, arcane, and ability line gets its own verified entry.
 */

/** Where a verified stat line is applied in build math. */
export type ItemApplyTarget =
  | "weapon_dps"
  | "warframe_totals"
  | "companion_totals"
  | "railjack_totals"
  | "arcane_panel"
  | "mod_panel"
  | "pending";

/** How to fold a ranked mod/arcane value into the build. */
export type ItemApplyMode =
  | "multiplicative_percent"
  | "additive_percent"
  | "flat"
  | "elemental_from_base_damage"
  | "conditional_combo_crit"
  | "conditional_combo_status"
  | "conditional_damage_per_status"
  | "conditional_multishot_on_kill"
  | "conditional_crit_on_headshot"
  | "conditional_damage_per_status_on_kill"
  | "conditional_attack_speed_on_kill"
  /** Non-stacking buff active while sim kill stacks > 0 (Bladed Rounds, Gorgon Frenzy, …). */
  | "conditional_stat_on_kill"
  /** Per-kill-stack buff (Galvanized Steel CD / Elementalist SC); capped via GALV_STACK_CAPS. */
  | "conditional_stat_per_kill_stack"
  /** Buff from an aim/reload/cast/latch trigger, gated by the sim trigger-buffs toggle. */
  | "conditional_stat_on_trigger"
  /** Hunter Munitions-style chance to force a Slash proc on critical hits. */
  | "slash_on_crit"
  /** Internal Bleeding-style chance for Impact procs to add a Slash proc (×2 under 2.5 fire rate). */
  | "slash_on_impact_proc"
  /** Charged/Primed Chamber: bonus damage on the first shot of each magazine (averaged over mag for DPS). */
  | "first_shot_damage"
  | "custom";

export interface VerifiedItemStatLine {
  statKey: string;
  target: ItemApplyTarget;
  mode: ItemApplyMode;
  /** Wiki page or note for staff audit trail. */
  source?: string;
}

export interface VerifiedModBehavior {
  modId: string;
  /** When set, entire mod dispatches to a named custom handler (still per-mod, not by stat key). */
  customHandler?: string;
  stats: VerifiedItemStatLine[];
  /** Mod exists in catalog but stats live in ability logic / description only (mods.ts stats: {}). */
  descriptionOnly?: string;
}

export interface VerifiedArcaneEffectLine {
  statKey: string;
  target: ItemApplyTarget;
  mode: ItemApplyMode;
  source?: string;
}

export interface VerifiedArcaneBehavior {
  arcaneId: string;
  customHandler?: string;
  effects: VerifiedArcaneEffectLine[];
}

export function itemApplyTargetLabel(target: ItemApplyTarget): string {
  switch (target) {
    case "weapon_dps":
      return "Weapon DPS";
    case "warframe_totals":
      return "Warframe totals";
    case "companion_totals":
      return "Companion totals";
    case "railjack_totals":
      return "Railjack totals";
    case "arcane_panel":
      return "Arcane panel only";
    case "mod_panel":
      return "Mod panel only";
    case "pending":
      return "Pending verification";
  }
}
