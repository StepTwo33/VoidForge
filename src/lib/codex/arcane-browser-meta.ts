import { ARCANE_EFFECTS, ArcaneEffectDef, ArcaneTrigger } from "@/data/arcane-effects";
import { WARFRAME_CUSTOM_ARCANE_IDS, WEAPON_CUSTOM_ARCANE_IDS } from "@/lib/calc/arcane-handlers";
import { Mod } from "@/lib/types";

export type ArcaneSlotCategory =
  | "warframe"
  | "primary"
  | "secondary"
  | "melee"
  | "operator"
  | "kitgun"
  | "amp"
  | "zaw"
  | "tektolyst"
  | "other";

export interface ArcaneCoverageInfo {
  hasEffectDef: boolean;
  effectCount: number;
  trigger?: ArcaneTrigger;
  stackCap?: number | null;
  hasLegacyStats: boolean;
  legacyStatCount: number;
  customHandler: "weapon" | "warframe" | null;
  issues: string[];
}

const SLOT_LABELS: Record<ArcaneSlotCategory, string> = {
  warframe: "Warframe",
  primary: "Primary",
  secondary: "Secondary",
  melee: "Melee",
  operator: "Operator (Magus)",
  kitgun: "Kitgun",
  amp: "Amp",
  zaw: "Zaw / Exodia",
  tektolyst: "Tektolyst",
  other: "Other",
};

export function getArcaneSlotCategory(arcane: Mod): ArcaneSlotCategory {
  const sub = arcane.subCategory;
  if (sub === "warframe" || (!sub && arcane.category === "arcane")) return "warframe";
  if (sub === "primary" || sub === "bow" || sub === "shotgun") return "primary";
  if (sub === "secondary") return "secondary";
  if (sub === "melee") return "melee";
  if (sub === "operator") return "operator";
  if (sub === "kitgun" || sub === "residual") return "kitgun";
  if (sub === "amp") return "amp";
  if (sub === "zaw") return "zaw";
  if (sub === "tektolyst") return "tektolyst";
  return "other";
}

export function getArcaneSlotLabel(arcane: Mod): string {
  return SLOT_LABELS[getArcaneSlotCategory(arcane)];
}

export function getArcaneWikiUrl(name: string): string {
  return `https://wiki.warframe.com/w/${encodeURIComponent(name.replace(/ /g, "_"))}`;
}

function detectCustomHandler(arcaneId: string): "weapon" | "warframe" | null {
  if (WEAPON_CUSTOM_ARCANE_IDS.has(arcaneId)) return "weapon";
  if (WARFRAME_CUSTOM_ARCANE_IDS.has(arcaneId)) return "warframe";
  return null;
}

export function getArcaneCoverageInfo(
  arcane: Mod,
  effectsMap: Record<string, ArcaneEffectDef> = ARCANE_EFFECTS,
): ArcaneCoverageInfo {
  const def = effectsMap[arcane.id];
  const legacyStats = arcane.stats ?? {};
  const legacyStatCount = Object.keys(legacyStats).length;
  const issues: string[] = [];

  if (!def) {
    issues.push("Missing effect definition");
  } else {
    if (def.effects.length === 0) issues.push("Empty effects array");
    if (def.effects.length > 0 && def.effects.every((e) => e.stat === "utilityEffect")) {
      issues.push("utilityEffect placeholder only");
    }
    if (def.maxRank !== arcane.maxRank) {
      issues.push(`maxRank mismatch (effects ${def.maxRank} vs mod ${arcane.maxRank})`);
    }
  }

  if (legacyStatCount > 0 && def && def.effects.length > 0) {
    for (const [key, val] of Object.entries(legacyStats)) {
      const line = def.effects.find((e) => e.stat === key);
      if (!line) continue;
      // Legacy stats use mixed conventions: some store max-rank totals (Energize),
      // others store per-rank increments like mod stats (Deflection, Warmth, …).
      const asMaxTotal = val;
      const asPerRankTotal = val * (arcane.maxRank + 1);
      const matchesLegacy =
        Math.abs(line.maxValue - asMaxTotal) <= 0.05 ||
        Math.abs(line.maxValue - asPerRankTotal) <= 0.05;
      if (!matchesLegacy) {
        issues.push(
          `Legacy stat "${key}" differs from effect def (legacy ${val}, effect ${line.maxValue})`,
        );
        break;
      }
    }
  }

  if (legacyStatCount === 0 && (!def || def.effects.length === 0)) {
    issues.push("No structured effect data");
  }

  return {
    hasEffectDef: !!def,
    effectCount: def?.effects.length ?? 0,
    trigger: def?.trigger,
    stackCap: def?.stackCap,
    hasLegacyStats: legacyStatCount > 0,
    legacyStatCount,
    customHandler: detectCustomHandler(arcane.id),
    issues,
  };
}

export const ARCANE_SLOT_FILTERS: { id: ArcaneSlotCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "warframe", label: "Warframe" },
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "melee", label: "Melee" },
  { id: "operator", label: "Operator (Magus)" },
  { id: "kitgun", label: "Kitgun" },
  { id: "amp", label: "Amp" },
  { id: "zaw", label: "Zaw / Exodia" },
  { id: "tektolyst", label: "Tektolyst" },
];

export const ARCANE_TRIGGER_FILTERS: { id: ArcaneTrigger | "all"; label: string }[] = [
  { id: "all", label: "All triggers" },
  { id: "passive", label: "Passive" },
  { id: "stacks", label: "Stacks" },
  { id: "onKill", label: "On kill" },
  { id: "onHeadshot", label: "On headshot" },
  { id: "onWeakPoint", label: "On weak point" },
  { id: "onDamaged", label: "When damaged" },
  { id: "onReload", label: "On reload" },
  { id: "onAbilityCast", label: "On ability cast" },
  { id: "onMeleeKill", label: "On melee kill" },
  { id: "onFinisher", label: "On finisher" },
  { id: "onStatus", label: "On status" },
  { id: "onPickup", label: "On pickup" },
  { id: "onVoidSling", label: "On Void Sling" },
  { id: "onMovement", label: "On movement" },
  { id: "onHit", label: "On hit" },
  { id: "onFreeze", label: "On freeze" },
  { id: "conditional", label: "Conditional" },
];
