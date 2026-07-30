import { describe, expect, it } from "vitest";
import type { ModUnion } from "@wfcd/items";
import {
  mapWarframeUpgradeMods,
  WARFRAME_IMPORT_AURA_SLOT,
  WARFRAME_IMPORT_EXILUS_SLOT,
} from "@/lib/warframe-arsenal/map-import";
import type { ArsenalImportWarning } from "@/lib/warframe-arsenal/map-import";

function named(name: string, rank = 5): ModUnion {
  return { name, rank } as unknown as ModUnion;
}

describe("mapWarframeUpgradeMods slot placement", () => {
  it("puts Growing Power in aura and Power Drift in exilus regardless of list order", () => {
    const warnings: ArsenalImportWarning[] = [];
    const { mods } = mapWarframeUpgradeMods(
      [
        named("Power Drift"),
        named("Growing Power"),
        named("Precision Intensify"),
        named("Amar's Hatred"),
        named("Primed Flow", 10),
      ],
      warnings,
    );

    const bySlot = new Map(mods.map((m) => [m.slotIndex, m.modId]));
    expect(bySlot.get(WARFRAME_IMPORT_AURA_SLOT)).toBe("growing_power");
    expect(bySlot.get(WARFRAME_IMPORT_EXILUS_SLOT)).toBe("power_drift");
    expect(bySlot.get(1)).toBe("precision_intensify");
    expect(bySlot.get(2)).toBe("amars_hatred");
    expect(bySlot.get(3)).toBe("primed_flow");
    expect(bySlot.has(9) && bySlot.get(9) !== "primed_flow").toBe(true);
  });

  it("does not place Primed Flow in the exilus slot", () => {
    const warnings: ArsenalImportWarning[] = [];
    const { mods } = mapWarframeUpgradeMods(
      [named("Primed Flow", 10), named("Power Drift"), named("Streamline")],
      warnings,
    );
    expect(mods.find((m) => m.modId === "primed_flow")?.slotIndex).not.toBe(
      WARFRAME_IMPORT_EXILUS_SLOT,
    );
    expect(mods.find((m) => m.modId === "power_drift")?.slotIndex).toBe(WARFRAME_IMPORT_EXILUS_SLOT);
  });
});
