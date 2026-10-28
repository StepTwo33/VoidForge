import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";

// R29: wiki.warframe.com mod pages (rank 0-5 tables) are the source.
const byId = (id: string) => {
  const m = allMods.find((x) => x.id === id);
  if (!m) throw new Error(`missing mod ${id}`);
  return m;
};
const maxTotal = (id: string, stat: string) => {
  const m = byId(id);
  return Math.round((m.stats as Record<string, number>)[stat] * (m.maxRank + 1) * 10) / 10;
};

describe("R29 mod label and value fixes", () => {
  it("Reflection is +40% Stagger / +10% Stun on Block at rank 5", () => {
    expect(maxTotal("reflection", "blockStaggerChance")).toBeCloseTo(40, 1);
    expect(maxTotal("reflection", "blockStunChance")).toBeCloseTo(10, 1);
    expect(byId("reflection").description).toContain("+40% chance to Stagger");
  });
  it("Critical Deceleration and Creeping Bullseye labels match +200% crit / -20% fire rate", () => {
    for (const id of ["critical_deceleration", "creeping_bullseye"]) {
      expect(maxTotal(id, "criticalChance")).toBeCloseTo(200, 0);
      expect(maxTotal(id, "fireRate")).toBeCloseTo(-20, 0);
      expect(byId(id).description).toBe("+33.3% Crit Chance, -3.3% Fire Rate per rank");
    }
  });
  it("Corrosive Projection label is -3% per rank (-18% at max)", () => {
    expect(maxTotal("aura_corrosive_projection", "armor")).toBe(-18);
    expect(byId("aura_corrosive_projection").description).toBe("-3% Enemy Armor per rank");
  });
  it("Maglev label is +5% Slide / -5% Friction per rank (30% at max)", () => {
    expect(maxTotal("maglev", "slideSpeed")).toBe(30);
    expect(byId("maglev").description).toBe("+5% Slide, -5% Friction per rank");
  });
});
