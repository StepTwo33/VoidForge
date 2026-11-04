import {
  ARCANE_INTENTION_ELIGIBLE,
  ARCANE_INTENTION_MAX_STACKS,
} from "@/data/arcane-intention-eligible";
import type { Ability } from "@/lib/types";

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Arcane Intention stacks = channeled abilities the frame can actually keep active
 * (wiki "Eligible Abilities" table), capped at 4. `abilities` should already have the
 * Helminth slot substituted. Augment gates use equipped mod names (Tectonic Fracture
 * excludes Tectonics; Gaseous Quake / Hallowed Eruption / Iron Shrapnel enable theirs).
 */
export function countIntentionAbilities(
  abilities: readonly Pick<Ability, "name">[] | undefined,
  equippedModNames: readonly string[] = [],
): number {
  if (!abilities?.length) return 0;
  const mods = new Set(equippedModNames.map(norm));
  const seen = new Set<string>();
  for (const a of abilities) {
    const name = norm(a.name);
    if (seen.has(name)) continue;
    const row = ARCANE_INTENTION_ELIGIBLE.find((r) => norm(r.ability) === name);
    if (!row) continue;
    if (row.requiresMod && !mods.has(norm(row.requiresMod))) continue;
    if (row.excludedByMod && mods.has(norm(row.excludedByMod))) continue;
    seen.add(name);
  }
  return Math.min(seen.size, ARCANE_INTENTION_MAX_STACKS);
}
