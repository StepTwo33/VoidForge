import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { warframesMap } from "@/data/warframes";
import {
  calculateWarframeBuild,
  getWarframeHealthModBase,
  getWarframeShieldModBase,
} from "@/lib/calc/calculator";

// Since Update 34, Vitality / Redirection scale the rank-30 value (wiki Health / Shield pages).
// Hand-worked values use wiki Module:Warframes/data rank-30 numbers.
const mm = new Map(allMods.map((m) => [m.id, m]));
const build = (wfId: string, ids: string[]) =>
  calculateWarframeBuild(
    warframesMap.get(wfId)!,
    ids.map((id, i) => ({ modId: id, rank: mm.get(id)!.maxRank, slotIndex: i })),
    mm,
  );

describe("warframe health/shield use rank-30 base", () => {
  it("Excalibur + Redirection = 740 shields (wiki example)", () => {
    expect(build("excalibur", ["redirection_r3"]).totalShield).toBeCloseTo(740, 3);
  });
  it("Excalibur + Vitality = 370 x 2 = 740 health (Vitality +100%)", () => {
    expect(build("excalibur", ["vitality_r3"]).totalHealth).toBeCloseTo(740, 3);
  });
  it("unmodded totals are the rank-30 values", () => {
    const s = build("excalibur", []);
    expect(s.baseHealth).toBe(370);
    expect(s.baseShield).toBe(370);
    expect(s.totalHealth).toBe(370);
  });
  it("Inaros: health +200 at rank 30 (2310), no shields", () => {
    const s = build("inaros", ["vitality_r3", "redirection_r3"]);
    expect(s.totalHealth).toBeCloseTo(2310 * 2, 3);
    expect(s.totalShield).toBe(0);
  });
  it("Hildryn: shields +500 at rank 30 (1780)", () => {
    expect(build("hildryn", ["redirection_r3"]).totalShield).toBeCloseTo(1780 * 2, 3);
  });
  it("Grendel: shields do not grow with rank (95)", () => {
    expect(getWarframeShieldModBase(warframesMap.get("grendel")!)).toBe(95);
    expect(getWarframeHealthModBase(warframesMap.get("grendel")!)).toBe(1295);
  });
  it("Nezha / Valkyr shields only +50 at rank 30", () => {
    expect(getWarframeShieldModBase(warframesMap.get("nezha")!)).toBe(185);
    expect(getWarframeShieldModBase(warframesMap.get("valkyr")!)).toBe(185);
  });
  it("frames missing from the table fall back to their listed value", () => {
    const helminth = warframesMap.get("helminth");
    if (helminth) expect(getWarframeHealthModBase(helminth)).toBe(helminth.health);
  });
});
