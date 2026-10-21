import { describe, expect, it } from "vitest";
import { archwings } from "@/data/archwing";
import { calculateArchwingBuild } from "@/lib/calc/archwing-calculator";

// wiki infobox (rank 0): Health / Shield / Armor / Energy / Sprint
const WIKI: Record<string, [number, number, number, number, number]> = {
  odonata: [425, 430, 100, 85, 1],
  odonata_prime: [650, 640, 100, 85, 1.05],
  elytron: [765, 745, 145, 120, 0.9],
  itzal: [200, 220, 50, 220, 1.2],
  amesha: [650, 220, 195, 220, 1.1],
};

describe("Archwing base stats match wiki", () => {
  for (const [id, exp] of Object.entries(WIKI)) {
    it(id, () => {
      const a = archwings.find((x) => x.id === id)!;
      expect([a.health, a.shield, a.armor, a.energy, a.speed]).toEqual(exp);
    });
  }
  it("unmodded Odonata Prime build (rank 30): EHP = 900 / (1 − 100/400) + 840 × 2 (shields take 50% damage)", () => {
    const s = calculateArchwingBuild(archwings.find((x) => x.id === "odonata_prime")!, [], new Map());
    expect(s.totalHealth).toBe(900);
    expect(s.effectiveHealth).toBeCloseTo(900 / 0.75 + 840 * 2, 6);
  });
});
