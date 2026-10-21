/**
 * R11-F3: reactor / catalyst from the DE `features` bitfield (bit 1 = DOUBLE_CAPACITY) reach the
 * builders' capacity on import, survive local storage, and a re-import fixes older imports that
 * were mapped before features were read (reactor/catalyst false, polarities {}).
 */
import { beforeEach, describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { EQUIPMENT_FEATURES } from "@/lib/warframe-arsenal/lotus-resolve";
import { warframeBaseCapacity } from "@/lib/calc/compute-used-capacity";
import { weaponModCapacity } from "@/lib/weapons/weapon-progenitor";
import { applyImportToLoadout, getLoadouts, loadoutToBuildData, saveLoadout } from "@/lib/builds/loadouts";
import type { Loadout } from "@/lib/types";
import raw from "./__fixtures__/wfcd-example7-wisp-prime.json";

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = globalThis;
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
});

const fresh = mapArsenalToImportPayload(buildArsenalData(raw as never), { loadOuts: raw.loadOuts as never }).loadout;
const weaponById = (id?: string) => allWeapons.find((w) => w.id === id) ?? null;

describe("import capacity from the features bitfield", () => {
  it("fixture bits: frame 3 (reactor+exilus), secondary/melee 35 (catalyst+exilus+arcane), companion 1", () => {
    const n = raw.loadOuts.NORMAL as Record<string, { features?: number }>;
    expect((n.warframe.features! & EQUIPMENT_FEATURES.DOUBLE_CAPACITY) !== 0).toBe(true);
    expect((n.secondary.features! & EQUIPMENT_FEATURES.DOUBLE_CAPACITY) !== 0).toBe(true);
    expect((n.melee.features! & EQUIPMENT_FEATURES.DOUBLE_CAPACITY) !== 0).toBe(true);
  });

  it("reactor → 60 base warframe capacity; catalyst → 60 weapon capacity", () => {
    expect(fresh.warframeBuild?.hasOrokinReactor).toBe(true);
    expect(warframeBaseCapacity(fresh.warframeBuild!.hasOrokinReactor)).toBe(60);
    for (const b of [fresh.secondaryBuild, fresh.meleeBuild]) {
      expect(b?.hasOrokinCatalyst).toBe(true);
      expect(weaponModCapacity(weaponById(b?.weaponId), 0, b!.hasOrokinCatalyst)).toBe(60);
    }
  });

  it("companion reactor and weapon catalyst both map", () => {
    expect(fresh.companionBuild?.hasReactor).toBe(true);
    expect(fresh.companionBuild?.hasCatalyst).toBe(true);
  });

  it("flags survive local save and the account payload", () => {
    const l: Loadout = { ...fresh, id: "1", createdAt: 1, updatedAt: 1 };
    saveLoadout(l);
    const back = getLoadouts()[0];
    expect(back.warframeBuild?.hasOrokinReactor).toBe(true);
    expect(back.meleeBuild?.hasOrokinCatalyst).toBe(true);
    const data = loadoutToBuildData(back);
    expect(data.warframeBuild?.hasOrokinReactor).toBe(true);
    expect(data.secondaryBuild?.hasOrokinCatalyst).toBe(true);
  });

  it("an older import (no features read) gets reactor/catalyst on Update re-import", () => {
    const older: Loadout = {
      id: "old",
      name: "StepBro — Imported Loadout",
      createdAt: 1,
      updatedAt: 1,
      importSource: { platform: "pc", account: "StepBro" },
      warframeBuild: { ...fresh.warframeBuild!, hasOrokinReactor: false, slotPolarities: {} },
      meleeBuild: { ...fresh.meleeBuild!, hasOrokinCatalyst: false, slotPolarities: {} },
    };
    expect(warframeBaseCapacity(older.warframeBuild!.hasOrokinReactor)).toBe(30);
    const updated = applyImportToLoadout(older, fresh);
    expect(updated.id).toBe("old");
    expect(updated.name).toBe("StepBro — Imported Loadout");
    expect(warframeBaseCapacity(updated.warframeBuild!.hasOrokinReactor)).toBe(60);
    expect(updated.meleeBuild?.hasOrokinCatalyst).toBe(true);
  });
});
