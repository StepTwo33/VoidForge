/**
 * Live Player Sync captures (production importer output, pre-fix) used as evidence for the
 * Helminth index convention and as regression fixtures for "nothing subsumed" imports.
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { resolveHelminthOverride } from "@/lib/warframe-arsenal/lotus-resolve";
import { resolveAbilitiesWithHelminth } from "@/lib/weapons/weapon-external-buffs";
import gyre from "./__fixtures__/live-prod-mapped-gyre-prime.json";
import sevagoth from "./__fixtures__/live-prod-mapped-sevagoth-prime-roar.json";

/** The pre-fix normalizeAbilitySlot (treated 1–4 as 1-based). */
function legacySlot(index: number): number {
  if (index >= 1 && index <= 4) return index - 1;
  if (index >= 0 && index <= 3) return index;
  return Math.max(0, Math.min(3, index));
}

const names = (id: string, helminthId?: string | null, slot?: number | null) =>
  resolveAbilitiesWithHelminth(allWarframes.find((w) => w.id === id)!.abilities, helminthId, slot).map((a) => a.name);

describe("live capture: Gyre Prime, nothing subsumed", () => {
  it("has no Helminth override and keeps all four native abilities in order", () => {
    const wb = gyre.loadout.warframeBuild as Record<string, unknown>;
    expect(wb.warframeId).toBe("gyre_prime");
    expect(wb.helminthSlot).toBeUndefined();
    expect(wb.helminthAbilityId).toBeUndefined();
    expect(names("gyre_prime").slice(0, 4)).toEqual(["Arcsphere", "Coil Horizon", "Cathode Grace", "Rotorswell"]);
  });
});

describe("live capture: Sevagoth Prime with Roar over the 4th ability (in game)", () => {
  const wb = sevagoth.loadout.warframeBuild as { warframeId: string; helminthSlot: number; helminthAbilityId: string };

  it("the old importer's slot 2 can only come from raw index 3 → raw index is 0-based", () => {
    expect(wb.warframeId).toBe("sevagoth_prime");
    expect(wb.helminthAbilityId).toBe("subsume_rhino");
    const rawCandidates = [0, 1, 2, 3, 4].filter((i) => legacySlot(i) === wb.helminthSlot);
    expect(rawCandidates).toEqual([3]);
  });

  it("the fixed importer puts Roar in the 4th slot: Reap, Sow, Gloom, Roar (no duplicate)", () => {
    const fixed = resolveHelminthOverride({ ability: "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility", index: 3 })!;
    expect(fixed).toEqual({ helminthAbilityId: "subsume_rhino", helminthSlot: 3 });
    const list = names("sevagoth_prime", fixed.helminthAbilityId, fixed.helminthSlot);
    expect(list.slice(0, 4)).toEqual(["Reap", "Sow", "Gloom", "Roar"]);
    expect(list.filter((n) => n === "Roar")).toHaveLength(1);
    expect(list).not.toContain("Exalted Shadow");
    // Pre-fix result for comparison: Roar landed over Gloom.
    expect(names("sevagoth_prime", wb.helminthAbilityId, wb.helminthSlot).slice(0, 4)).toEqual(["Reap", "Sow", "Roar", "Exalted Shadow"]);
  });
});
