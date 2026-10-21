/** Player Sync: catalyst / reactor come from the DE `features` bitfield (bit 1 = DOUBLE_CAPACITY). */
import { describe, expect, it } from "vitest";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { EQUIPMENT_FEATURES, rawHasDoubleCapacity } from "@/lib/warframe-arsenal/lotus-resolve";

function importWith(features: { warframe?: number; primary?: number; melee?: number }) {
  const p = {
    accountInfo: { playerName: "Tester", masteryRank: 30, lastUpdated: 1_760_806_000, glyph: "", focus: "" },
    loadOuts: {
      NORMAL: {
        warframe: { uniqueName: "/Lotus/Powersuits/Devourer/Devourer", xp: 2_000_000, upgrades: [], features: features.warframe },
        primary: { uniqueName: "/Lotus/Weapons/Grineer/KuvaLich/LongGuns/Sobek/KuvaSobek", xp: 1, upgrades: [], features: features.primary },
        melee: { uniqueName: "/Lotus/Weapons/Tenno/Melee/Polearms/PrimePolearmWeapon", xp: 1, upgrades: [], features: features.melee },
      },
    },
  };
  return mapArsenalToImportPayload(buildArsenalData(p as never), { loadOuts: p.loadOuts as never }).loadout;
}

describe("features bitfield → catalyst / reactor", () => {
  it("bit 1 set means installed; other bits (exilus 2, arcane 32) don't count", () => {
    expect(EQUIPMENT_FEATURES.DOUBLE_CAPACITY).toBe(1);
    expect(rawHasDoubleCapacity({ features: 1 })).toBe(true);
    expect(rawHasDoubleCapacity({ features: 3 })).toBe(true);
    expect(rawHasDoubleCapacity({ features: 2 })).toBe(false);
    expect(rawHasDoubleCapacity({ features: 32 | 64 })).toBe(false);
    expect(rawHasDoubleCapacity({})).toBe(false);
  });

  it("maps per item: reactor on the frame, catalyst on each weapon independently", () => {
    const l = importWith({ warframe: 3, primary: 2, melee: 1 });
    expect(l.warframeBuild?.hasOrokinReactor).toBe(true);
    expect(l.primaryBuild?.hasOrokinCatalyst).toBe(false);
    expect(l.meleeBuild?.hasOrokinCatalyst).toBe(true);
    const none = importWith({});
    expect(none.warframeBuild?.hasOrokinReactor).toBe(false);
  });
});
