import { describe, expect, it } from "vitest";
import { lotusItemName } from "@/lib/warframe-arsenal/lotus-resolve";
import { findModByName } from "@/lib/warframe-arsenal/catalog-match";

// Arsenal imports resolve mods by Lotus path -> @wfcd/items name -> Voidforge mod.
// These paths were missing or renamed in @wfcd/items 1.1275.7 (Gastroparesis user report).
const CASES: [string, string][] = [
  ["/Lotus/Powersuits/Devourer/DevourerPassiveAugmentCard", "augment_grendel_gastroparesis"],
];
const NAMES: [string, string][] = [
  ["/Lotus/Powersuits/Banshee/EarthQuakeAugmentCard", "Gaseous Quake"],
  ["/Lotus/Powersuits/Banshee/PushAugmentCard", "Sonic Siphon"],
  ["/Lotus/Powersuits/Oraxia/BroodAugmentCard", "Brood's Oversurge"],
];

describe("Lotus path mod resolution", () => {
  it.each(CASES)("%s maps to %s", (path, id) => {
    const name = lotusItemName(path);
    expect(name).toBe("Gastroparesis");
    expect(findModByName(name!)?.id).toBe(id);
  });
  it.each(NAMES)("%s resolves to %s and a Voidforge mod", (path, name) => {
    expect(lotusItemName(path)).toBe(name);
    expect(findModByName(name)).toBeDefined();
  });
});
