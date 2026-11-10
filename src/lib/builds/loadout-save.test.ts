import { describe, expect, it } from "vitest";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import {
  loadoutFromSavedBuild,
  loadoutToBuildData,
  normalizeLoadoutBuildData,
  mergeCloudLoadoutPreservingSlots,
} from "@/lib/builds/loadouts";
import type { Loadout } from "@/lib/types";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";

/** Minimal imported Player Sync shape (Pharaoh Predasite + slots). */
function importedLoadoutFixture(): Loadout {
  return {
    id: "local_1",
    name: "Step-Bro_Prime — Imported Loadout",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    warframeBuild: {
      warframeId: "gara",
      mods: [
        { modId: "steel_fiber", rank: 10, slotIndex: 0 },
        { modId: "vitality", rank: 10, slotIndex: 1 },
      ],
      shards: [null, null, null, null, null],
      arcaneIds: [null, null],
      hasOrokinReactor: false,
      isMR30: true,
      slotPolarities: {},
    },
    primaryBuild: {
      weaponId: "braton_prime",
      mods: [{ modId: "serration", rank: 10, slotIndex: 0 }],
      arcaneIds: [null, null],
      hasOrokinCatalyst: false,
      isMR30: true,
      slotPolarities: {},
    },
    companionBuild: {
      companionId: "pharaoh_predasite",
      customName: "King of Covid",
      mods: [{ modId: "link_health", rank: 10, slotIndex: 0 }],
      weaponId: "pharaoh_claws",
      weaponMods: [{ modId: "claws_ferocity", rank: 10, slotIndex: 0 }],
      hasReactor: false,
      hasCatalyst: false,
      isMR30: true,
    },
  };
}

describe("loadout cloud save round-trip", () => {
  it("normalizes imported slot payloads for JSON POST", () => {
    const data = loadoutToBuildData(importedLoadoutFixture());
    expect(data.companionBuild?.weaponMods).toHaveLength(1);
    expect(data.companionBuild?.hasReactor).toBe(false);
    expect(data.companionBuild?.weaponSlotPolarities).toEqual({});
    expect(() => JSON.stringify(data)).not.toThrow();
  });

  it("survives saved-build round-trip and damage calc", () => {
    const local = importedLoadoutFixture();
    const build: SavedBuild = {
      id: "cloud_1",
      name: local.name,
      type: "loadout",
      createdAt: local.createdAt,
      updatedAt: local.updatedAt,
      data: normalizeLoadoutBuildData(loadoutToBuildData(local)),
    };

    const restored = loadoutFromSavedBuild(build);
    expect(restored.companionBuild?.weaponId).toBe("pharaoh_claws");

    const stats = calcLoadoutStats(
      { ...restored, id: local.id },
      { allWeapons: getEffectiveWeapons() },
    );
    expect(stats.warframe).not.toBeNull();
    expect(stats.companion?.weapon).not.toBeNull();
  });

  it("mergeCloudLoadoutPreservingSlots keeps local slots when cloud payload is empty", () => {
    const local = importedLoadoutFixture();
    const cloud = {
      id: "cloud_1",
      name: "Cloud name",
      type: "loadout" as const,
      createdAt: 1,
      updatedAt: 2,
      data: {},
    };
    const merged = mergeCloudLoadoutPreservingSlots(local, cloud);
    expect(merged.id).toBe(local.id);
    expect(merged.cloudId).toBe("cloud_1");
    expect(merged.warframeBuild?.warframeId).toBe("gara");
    expect(merged.companionBuild?.weaponId).toBe("pharaoh_claws");
  });

  it("handles a full imported-style loadout after cloud save metadata", () => {
    const local: Loadout = {
      id: "local_2",
      name: "Step-Bro_Prime — Imported Loadout",
      cloudId: "cloud_cuid_abc",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      warframeBuild: {
        warframeId: "revenant_prime",
        mods: Array.from({ length: 10 }, (_, i) => ({ modId: "steel_fiber", rank: 10, slotIndex: i })),
        shards: [null, null, null, null, null],
        arcaneIds: [null, null],
        hasOrokinReactor: false,
        isMR30: true,
        slotPolarities: {},
      },
      primaryBuild: {
        weaponId: "haalvu",
        mods: Array.from({ length: 7 }, (_, i) => ({ modId: "serration", rank: 10, slotIndex: i })),
        arcaneIds: [null, null],
        hasOrokinCatalyst: false,
        isMR30: true,
        slotPolarities: {},
      },
      secondaryBuild: {
        weaponId: "dual_toxocyst",
        mods: Array.from({ length: 8 }, (_, i) => ({ modId: "hornet_strike", rank: 10, slotIndex: i })),
        arcaneIds: [null, null],
        hasOrokinCatalyst: false,
        isMR30: true,
        slotPolarities: {},
      },
      meleeBuild: {
        weaponId: "coda_mire",
        mods: Array.from({ length: 9 }, (_, i) => ({ modId: "pressure_point", rank: 10, slotIndex: i })),
        arcaneIds: [null, null],
        hasOrokinCatalyst: false,
        isMR30: true,
        slotPolarities: {},
      },
      companionBuild: {
        companionId: "pharaoh_predasite",
        customName: "King of Covid",
        mods: Array.from({ length: 10 }, (_, i) => ({ modId: "link_health", rank: 10, slotIndex: i })),
        weaponId: "pharaoh_claws",
        weaponMods: Array.from({ length: 8 }, (_, i) => ({ modId: "claws_ferocity", rank: 10, slotIndex: i })),
        arcaneIds: [null, null],
        hasReactor: false,
        hasCatalyst: false,
        isMR30: true,
      },
    };

    const payload = normalizeLoadoutBuildData(loadoutToBuildData(local));
    const stats = calcLoadoutStats(local, { allWeapons: getEffectiveWeapons() });
    expect(payload.primaryBuild?.weaponId).toBe("haalvu");
    expect(stats.companion?.weapon?.name).toBeTruthy();
    expect(() => JSON.stringify({ ...local, data: payload })).not.toThrow();
  });

  it("preserves description across loadoutToBuildData and loadoutFromSavedBuild", () => {
    const local = importedLoadoutFixture();
    local.description = "Steel Path endurance setup with slash procs";
    const data = loadoutToBuildData(local);
    const restored = loadoutFromSavedBuild({
      id: "cloud_desc_1",
      name: local.name,
      description: local.description,
      type: "loadout",
      createdAt: local.createdAt,
      updatedAt: local.updatedAt,
      data,
    });
    expect(restored.description).toBe("Steel Path endurance setup with slash procs");
    expect(restored.cloudId).toBe("cloud_desc_1");
  });
});
