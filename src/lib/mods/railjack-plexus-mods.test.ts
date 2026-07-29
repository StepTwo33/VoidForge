import { describe, expect, it } from "vitest";
import {
  filterRailjackModsForSlot,
  getPlexusModTab,
  isRailjackAuraMod,
  migratePlexusModsToSlots,
  plexusModAllowedInAbilitySlot,
  plexusModAllowedInIntegratedSlot,
  RAILJACK_AURA_MOD_IDS,
  RAILJACK_INTEGRATED_MOD_IDS,
} from "@/lib/mods/railjack-plexus-mods";
import type { Mod } from "@/lib/types";

function stub(id: string): Mod {
  return {
    id,
    name: id,
    polarity: "madurai",
    drain: 4,
    maxRank: 5,
    category: "general",
    subCategory: "",
    stats: {},
    description: "",
    rarity: "common",
  };
}

describe("railjack plexus mod slots", () => {
  it("Matrix mods are aura-only", () => {
    for (const id of RAILJACK_AURA_MOD_IDS) {
      expect(isRailjackAuraMod({ id })).toBe(true);
      expect(plexusModAllowedInIntegratedSlot({ id }, 0)).toBe(true);
      expect(plexusModAllowedInIntegratedSlot({ id }, 1)).toBe(false);
    }
  });

  it("Integrated non-aura mods cannot fill the aura slot", () => {
    for (const id of ["hyperstrike", "conic_nozzle", "forward_artillery"]) {
      expect(RAILJACK_INTEGRATED_MOD_IDS.has(id)).toBe(true);
      expect(plexusModAllowedInIntegratedSlot({ id }, 0)).toBe(false);
      expect(plexusModAllowedInIntegratedSlot({ id }, 3)).toBe(true);
    }
  });

  it("Battle/Tactical enforce Defensive / Offensive / Super", () => {
    expect(plexusModAllowedInAbilitySlot({ id: "munitions_vortex" }, "battle", 0)).toBe(true);
    expect(plexusModAllowedInAbilitySlot({ id: "munitions_vortex" }, "battle", 1)).toBe(false);
    expect(plexusModAllowedInAbilitySlot({ id: "particle_ram" }, "battle", 1)).toBe(true);
    expect(plexusModAllowedInAbilitySlot({ id: "phoenix_blaze" }, "battle", 2)).toBe(true);
    expect(plexusModAllowedInAbilitySlot({ id: "void_cloak" }, "tactical", 2)).toBe(true);
    expect(plexusModAllowedInAbilitySlot({ id: "battle_stations" }, "tactical", 1)).toBe(true);
    expect(getPlexusModTab({ id: "forward_artillery" })).toBe("integrated");
  });

  it("filterRailjackModsForSlot returns only eligible mods", () => {
    const mods = [
      stub("ironclad_matrix"),
      stub("hyperstrike"),
      stub("munitions_vortex"),
      stub("particle_ram"),
    ];
    expect(filterRailjackModsForSlot(mods, "integrated", 0).map((m) => m.id)).toEqual([
      "ironclad_matrix",
    ]);
    expect(filterRailjackModsForSlot(mods, "integrated", 1).map((m) => m.id)).toEqual([
      "hyperstrike",
    ]);
    expect(filterRailjackModsForSlot(mods, "battle", 0).map((m) => m.id)).toEqual([
      "munitions_vortex",
    ]);
  });

  it("migratePlexusModsToSlots places Matrix in aura and abilities by category", () => {
    const integrated = migratePlexusModsToSlots(
      [
        { modId: "hyperstrike", rank: 5, slotIndex: 0 },
        { modId: "ironclad_matrix", rank: 5, slotIndex: 3 },
      ],
      "integrated",
    );
    expect(integrated.find((m) => m.modId === "ironclad_matrix")?.slotIndex).toBe(0);
    expect(integrated.find((m) => m.modId === "hyperstrike")?.slotIndex).toBeGreaterThan(0);

    const battle = migratePlexusModsToSlots(
      [
        { modId: "phoenix_blaze", rank: 5, slotIndex: 0 },
        { modId: "munitions_vortex", rank: 3, slotIndex: 2 },
        { modId: "tether", rank: 5, slotIndex: 1 },
      ],
      "battle",
    );
    expect(battle.find((m) => m.modId === "munitions_vortex")?.slotIndex).toBe(0);
    expect(battle.find((m) => m.modId === "tether")?.slotIndex).toBe(1);
    expect(battle.find((m) => m.modId === "phoenix_blaze")?.slotIndex).toBe(2);
  });
});
