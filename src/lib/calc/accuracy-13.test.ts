import { describe, it, expect } from "vitest";
import { helminthAbilitiesMap } from "@/data/helminth";
import { scaleAbilityMiscStats } from "@/lib/codex/ability-misc-stats";

const ctx = { strength: 2, duration: 1, range: 1 };
function lines(id: string, warframeId: string, name: string, c = ctx) {
  const a = helminthAbilitiesMap.get(id)!;
  return scaleAbilityMiscStats(a.miscStats as Record<string, unknown>, c, {
    warframeId,
    abilityName: name,
    helminth: true,
  });
}
const find = (ls: ReturnType<typeof lines>, label: string) => ls.find((l) => l.label === label)!;

describe("accuracy-13 — Helminth subsume data", () => {
  it("Pull: subsumed target range is 12.5 m at max (wiki 7.5/10/11/12.5)", () => {
    expect(helminthAbilitiesMap.get("subsume_mag")!.range).toBe(12.5);
  });
  it("Shuriken: 60 m targeting range is Misc-fixed, not Ability Range", () => {
    const a = helminthAbilitiesMap.get("subsume_ash")!;
    expect(a.range).toBeUndefined();
    const l = find(lines("subsume_ash", "ash", "Shuriken", { strength: 1, duration: 1, range: 2 }), "Targeting Range");
    expect(l.modified).toBe(false);
  });
  it("Pyrotechnics: 20 m reticle radius fixed; no Backbeat wail bonus on Helminth", () => {
    const a = helminthAbilitiesMap.get("subsume_temple")!;
    expect(a.radius).toBeUndefined();
    expect((a.miscStats as Record<string, unknown>).wailDurationBonus).toBeUndefined();
    expect(find(lines("subsume_temple", "temple", "Pyrotechnics", { strength: 1, duration: 1, range: 2 }), "Reticle Radius").modified).toBe(false);
  });
  it("Pyrotechnics: 5 pillars × 200% STR = 10", () => {
    const l = lines("subsume_temple", "temple", "Pyrotechnics").find((x) => x.scaleAttr === "strength")!;
    expect(parseFloat(l.scaled)).toBe(10);
  });
  it("Desiccation: 8 True/s × 200% STR = 16", () => {
    const l = lines("subsume_inaros", "inaros", "Desiccation").find((x) => x.scaleAttr === "strength")!;
    expect(parseFloat(l.scaled)).toBe(16);
  });
  it("Larva: 50% mutation chance × 300% STR caps at 100%", () => {
    const l = lines("subsume_nidus", "nidus", "Larva", { strength: 3, duration: 1, range: 1 }).find((x) => x.scaleAttr === "strength")!;
    expect(parseFloat(l.scaled)).toBe(100);
  });
});
