import { describe, expect, it } from "vitest";
import {
  computeWarframeAuraBonus,
  computeWarframeCapacityUsed,
} from "@/lib/calc/compute-used-capacity";
import {
  getWarframeAuraSlotIndices,
  WARFRAME_AURA_SLOT,
  WARFRAME_SECOND_AURA_SLOT,
  warframeHasSecondAuraSlot,
} from "@/lib/warframes/aura-slots";
import { allMods } from "@/data/mods";
import { warframeAugmentEligibleInBuilder } from "@/lib/mods/warframe-augment-mods";

const modsById = new Map(allMods.map((m) => [m.id, m]));

describe("Jade dual aura slots", () => {
  it("gives Jade two aura slots and others one", () => {
    expect(getWarframeAuraSlotIndices("jade")).toEqual([
      WARFRAME_AURA_SLOT,
      WARFRAME_SECOND_AURA_SLOT,
    ]);
    expect(warframeHasSecondAuraSlot("jade")).toBe(true);
    expect(getWarframeAuraSlotIndices("excalibur")).toEqual([WARFRAME_AURA_SLOT]);
    expect(warframeHasSecondAuraSlot("excalibur")).toBe(false);
  });

  it("sums capacity from both aura slots and excludes them from used capacity", () => {
    const modsMap = new Map<string, { drain: number; polarity: string }>([
      ["aura_a", { drain: -7, polarity: "madurai" }],
      ["aura_b", { drain: -7, polarity: "naramon" }],
      ["flow", { drain: 5, polarity: "naramon" }],
    ]);
    const equipped = [
      { modId: "aura_a", rank: 5, slotIndex: WARFRAME_AURA_SLOT },
      { modId: "aura_b", rank: 5, slotIndex: WARFRAME_SECOND_AURA_SLOT },
      { modId: "flow", rank: 5, slotIndex: 1 },
    ];
    const polarities: Record<number, string> = {};
    const auraSlots = getWarframeAuraSlotIndices("jade");

    const oneSlot = computeWarframeAuraBonus(equipped, modsMap, polarities, WARFRAME_AURA_SLOT);
    const both = computeWarframeAuraBonus(equipped, modsMap, polarities, auraSlots);
    expect(both).toBeGreaterThan(oneSlot);
    expect(both).toBe(oneSlot * 2);

    const used = computeWarframeCapacityUsed(equipped, modsMap, polarities, auraSlots);
    const usedIgnoringAuras = computeWarframeCapacityUsed(
      equipped.filter((m) => m.slotIndex === 1),
      modsMap,
      polarities,
      auraSlots,
    );
    expect(used).toBe(usedIgnoringAuras);
  });
});

describe("Health / Energy Conversion eligibility", () => {
  it("shows on any warframe regular slot (not frame-locked augments)", () => {
    for (const id of [
      "augment_universal_health_conversion",
      "augment_universal_energy_conversion",
    ]) {
      const mod = modsById.get(id)!;
      expect(mod.category).toBe("warframe");
      expect(mod.warframeId).toBeUndefined();
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", "excalibur")).toBe(true);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", "mesa")).toBe(true);
    }
  });
});
