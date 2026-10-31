import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { dropRetiredMods, dropRetiredModsDeep, retiredModReason } from "@/lib/mods/known-mods";
import { loadoutFromSavedBuild } from "@/lib/builds/loadouts";
import type { SavedBuild } from "@/lib/types";

// Jason (Round 25): Necramech Stamina ("-60% Sprint Efficiency") is not in the game; removed.
describe("Round 25: Necramech Stamina removed", () => {
  it("is gone from the catalog and behaviors; 27 Necramech mods remain", () => {
    expect(modsMap.has("necramech_stamina")).toBe(false);
    expect(allMods.some((m) => m.name === "Necramech Stamina")).toBe(false);
    expect(VERIFIED_MOD_BEHAVIORS["necramech_stamina"]).toBeUndefined();
    expect(allMods.filter((m) => m.category === "necramech")).toHaveLength(27);
    expect(allMods).toHaveLength(1512);
  });

  it("is a retired mod, so saved builds and share links drop it on load", () => {
    expect(retiredModReason("necramech_stamina", modsMap)).toEqual({ name: "Necramech Stamina", reason: "no_source" });
    const mods = [
      { modId: "necramech_vitality", rank: 5, slotIndex: 0 },
      { modId: "necramech_stamina", rank: 5, slotIndex: 1 },
    ];
    const res = dropRetiredMods(mods, modsMap);
    expect(res.mods.map((m) => m.modId)).toEqual(["necramech_vitality"]);
    expect(res.dropped).toEqual([{ modId: "necramech_stamina", name: "Necramech Stamina", reason: "no_source" }]);

    // Archwing / Necramech builder payload shape (frameMods)
    const data = { mode: "necramech", frameId: "Voidrig", frameMods: mods, weaponMods: [] };
    const deep = dropRetiredModsDeep(data, modsMap);
    expect(deep.data.frameMods.map((m) => m.modId)).toEqual(["necramech_vitality"]);
    expect(deep.dropped).toHaveLength(1);
  });

  it("a saved loadout that still holds the id is cleaned on read", () => {
    const build = {
      id: "b1",
      name: "Old",
      isPublic: false,
      type: "loadout",
      createdAt: 1,
      updatedAt: 2,
      data: {
        warframeBuild: {
          warframeId: "excalibur",
          mods: [{ modId: "necramech_stamina", rank: 5, slotIndex: 0 }, { modId: "vitality_r3", rank: 10, slotIndex: 1 }],
          shards: [null, null, null, null, null],
          hasOrokinReactor: true,
        },
      },
    } as unknown as SavedBuild;
    const loadout = loadoutFromSavedBuild(build);
    expect(loadout.warframeBuild?.mods.map((m) => m.modId)).toEqual(["vitality_r3"]);
  });
});
